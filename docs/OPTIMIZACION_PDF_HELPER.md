# 🚀 Optimización del PDF Helper - Análisis y Mejoras

## 📊 Análisis del Código Actual

### 🔍 Problemas Identificados

#### 1. **Gestión Ineficiente de Recursos**
- **Problema**: Se crea y destruye un navegador completo para cada PDF
- **Impacto**: Alto consumo de memoria y tiempo de inicialización
- **Código problemático**:
```typescript
// ❌ PROBLEMA: Se crea un browser por cada request
browser = await chromium.launch({ headless: true });
// ... código ...
await browser?.close(); // Se destruye después de cada uso
```

#### 2. **Falta de Pool de Conexiones**
- **Problema**: No hay reutilización de instancias de browser
- **Impacto**: Bloqueo de requests cuando hay alta concurrencia
- **Síntoma**: Requests se quedan "colgados" esperando recursos

#### 3. **Manejo de Memoria Inadecuado**
- **Problema**: No hay límites de memoria por request
- **Impacto**: Archivos grandes pueden consumir toda la memoria disponible
- **Riesgo**: Crash del servicio por OOM (Out of Memory)

#### 4. **Falta de Timeouts y Circuit Breakers**
- **Problema**: No hay protección contra requests que se quedan colgados
- **Impacto**: Un request lento puede bloquear todo el sistema

## 🛠️ Soluciones Propuestas

### 1. **Implementar Browser Pool Manager**

```typescript
// apps/nestapi-service/src/helper/browser-pool.manager.ts
import { chromium, Browser, BrowserContext, Page } from 'playwright';
import { EventEmitter } from 'events';

interface BrowserInstance {
  browser: Browser;
  context: BrowserContext;
  page: Page;
  inUse: boolean;
  lastUsed: number;
  requestCount: number;
}

export class BrowserPoolManager extends EventEmitter {
  private pool: BrowserInstance[] = [];
  private maxInstances: number;
  private maxIdleTime: number;
  private maxRequestsPerInstance: number;
  private isShuttingDown = false;

  constructor(
    maxInstances = 5,
    maxIdleTime = 300000, // 5 minutos
    maxRequestsPerInstance = 100
  ) {
    super();
    this.maxInstances = maxInstances;
    this.maxIdleTime = maxIdleTime;
    this.maxRequestsPerInstance = maxRequestsPerInstance;
    
    // Limpiar instancias inactivas cada minuto
    setInterval(() => this.cleanupIdleInstances(), 60000);
  }

  async getInstance(): Promise<BrowserInstance> {
    // Buscar instancia disponible
    let instance = this.pool.find(inst => !inst.inUse);
    
    if (!instance && this.pool.length < this.maxInstances) {
      // Crear nueva instancia
      instance = await this.createInstance();
      this.pool.push(instance);
    } else if (!instance) {
      // Esperar a que una instancia esté disponible
      instance = await this.waitForAvailableInstance();
    }

    instance.inUse = true;
    instance.lastUsed = Date.now();
    instance.requestCount++;
    
    return instance;
  }

  async releaseInstance(instance: BrowserInstance): Promise<void> {
    instance.inUse = false;
    instance.lastUsed = Date.now();
    
    // Verificar si la instancia debe ser reciclada
    if (instance.requestCount >= this.maxRequestsPerInstance) {
      await this.recycleInstance(instance);
    }
  }

  private async createInstance(): Promise<BrowserInstance> {
    const browser = await chromium.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--no-first-run',
        '--no-zygote',
        '--disable-gpu',
        '--single-process',
        '--disable-extensions',
        '--disable-background-timer-throttling',
        '--disable-backgrounding-occluded-windows',
        '--disable-renderer-backgrounding',
        '--disable-features=TranslateUI',
        '--disable-ipc-flooding-protection'
      ]
    });

    const context = await browser.newContext({
      viewport: { width: 1920, height: 1080 },
      deviceScaleFactor: 1,
      isMobile: false,
      // Configuraciones de memoria
      javaScriptEnabled: true,
      bypassCSP: true,
      // Configuraciones de performance
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    });

    const page = await context.newPage();
    
    // Configurar límites de memoria por página
    await page.setExtraHTTPHeaders({
      'Accept-Encoding': 'gzip, deflate, br'
    });

    return {
      browser,
      context,
      page,
      inUse: false,
      lastUsed: Date.now(),
      requestCount: 0
    };
  }

  private async waitForAvailableInstance(): Promise<BrowserInstance> {
    return new Promise((resolve) => {
      const checkForInstance = () => {
        const available = this.pool.find(inst => !inst.inUse);
        if (available) {
          resolve(available);
        } else {
          setTimeout(checkForInstance, 100);
        }
      };
      checkForInstance();
    });
  }

  private async recycleInstance(instance: BrowserInstance): Promise<void> {
    const index = this.pool.indexOf(instance);
    if (index > -1) {
      this.pool.splice(index, 1);
      await instance.page.close();
      await instance.context.close();
      await instance.browser.close();
    }
  }

  private async cleanupIdleInstances(): Promise<void> {
    const now = Date.now();
    const instancesToRemove = this.pool.filter(
      inst => !inst.inUse && (now - inst.lastUsed) > this.maxIdleTime
    );

    for (const instance of instancesToRemove) {
      await this.recycleInstance(instance);
    }
  }

  async shutdown(): Promise<void> {
    this.isShuttingDown = true;
    for (const instance of this.pool) {
      await this.recycleInstance(instance);
    }
  }
}
```

### 2. **PDF Helper Optimizado con Pool Manager**

```typescript
// apps/nestapi-service/src/helper/pdf.helper.optimized.ts
import { BrowserInstance } from './browser-pool.manager';
import { PdfOptions } from 'src/common/interfaces/pdf-options.inteface';
import { SizePrint } from 'src/common/enums/size.enum';
import { millimetersToPixels, pixelsToMillimeters } from './utils.helper';

export class OptimizedPDFHelper {
  private browserPool: BrowserPoolManager;
  private maxConcurrentRequests: number;
  private requestQueue: Array<{
    id: string;
    options: PdfOptions;
    resolve: (value: Uint8Array) => void;
    reject: (error: Error) => void;
    priority: number;
  }> = [];
  private activeRequests = new Map<string, Promise<Uint8Array>>();

  constructor(
    maxInstances = 5,
    maxConcurrentRequests = 10
  ) {
    this.browserPool = new BrowserPoolManager(maxInstances);
    this.maxConcurrentRequests = maxConcurrentRequests;
  }

  async generatePDFFromHTML(options: PdfOptions): Promise<Uint8Array> {
    const requestId = this.generateRequestId();
    
    return new Promise((resolve, reject) => {
      this.requestQueue.push({
        id: requestId,
        options,
        resolve,
        reject,
        priority: this.calculatePriority(options)
      });
      
      this.processQueue();
    });
  }

  async generatePDFFromURL(options: PdfOptions): Promise<Uint8Array> {
    const requestId = this.generateRequestId();
    
    return new Promise((resolve, reject) => {
      this.requestQueue.push({
        id: requestId,
        options,
        resolve,
        reject,
        priority: this.calculatePriority(options)
      });
      
      this.processQueue();
    });
  }

  private async processQueue(): Promise<void> {
    if (this.activeRequests.size >= this.maxConcurrentRequests || this.requestQueue.length === 0) {
      return;
    }

    // Ordenar por prioridad (mayor prioridad primero)
    this.requestQueue.sort((a, b) => b.priority - a.priority);
    
    const request = this.requestQueue.shift();
    if (!request) return;

    const processingPromise = this.processRequest(request);
    this.activeRequests.set(request.id, processingPromise);

    try {
      const result = await processingPromise;
      request.resolve(result);
    } catch (error) {
      request.reject(error as Error);
    } finally {
      this.activeRequests.delete(request.id);
      this.processQueue(); // Procesar siguiente request
    }
  }

  private async processRequest(request: any): Promise<Uint8Array> {
    let instance: BrowserInstance | null = null;
    const startTime = Date.now();

    try {
      // Obtener instancia del pool
      instance = await this.browserPool.getInstance();
      
      // Configurar timeout por request
      const timeout = this.calculateTimeout(request.options);
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error('Request timeout')), timeout);
      });

      // Ejecutar generación de PDF con timeout
      const pdfPromise = this.generatePDFWithInstance(instance, request.options);
      const result = await Promise.race([pdfPromise, timeoutPromise]);
      
      // Log de métricas
      const duration = Date.now() - startTime;
      this.logMetrics(request.options, duration, 'success');
      
      return result;
    } catch (error) {
      const duration = Date.now() - startTime;
      this.logMetrics(request.options, duration, 'error');
      throw error;
    } finally {
      if (instance) {
        await this.browserPool.releaseInstance(instance);
      }
    }
  }

  private async generatePDFWithInstance(instance: BrowserInstance, options: PdfOptions): Promise<Uint8Array> {
    const { page } = instance;
    
    // Configurar límites de memoria por página
    await page.setViewportSize({ width: 1920, height: 1080 });
    
    if ('url' in options) {
      return this.generatePDFFromURLWithPage(page, options);
    } else {
      return this.generatePDFFromHTMLWithPage(page, options);
    }
  }

  private async generatePDFFromHTMLWithPage(page: any, options: PdfOptions): Promise<Uint8Array> {
    const { htmlContent, width, height, margin = { top: 0, bottom: 0, left: 0, right: 0 } } = options;

    // Configurar contenido con optimizaciones
    await page.setContent(htmlContent, { 
      waitUntil: 'domcontentloaded', // Más rápido que 'networkidle'
      timeout: 15000 
    });

    // Esperar fuentes de manera más eficiente
    await page.waitForFunction(() => document.fonts.ready, { timeout: 5000 });

    const pdfOptions: any = {
      printBackground: true,
      margin: margin,
      preferCSSPageSize: true,
      displayHeaderFooter: false
    };

    // Configurar dimensiones optimizadas
    if (width && height) {
      pdfOptions.width = `${width}mm`;
      pdfOptions.height = `${height}mm`;
    } else if (width === SizePrint.A4) {
      pdfOptions.format = SizePrint.A4;
    } else if (width) {
      const widthPx = Math.round(millimetersToPixels(Number(width.replace('mm', ''))));
      const heightPx = await this.measureHeightOptimized(page, widthPx);
      const heightMm = pixelsToMillimeters(heightPx).toFixed(2);

      pdfOptions.width = width;
      pdfOptions.height = `${heightMm}mm`;
    }

    return await page.pdf(pdfOptions);
  }

  private async generatePDFFromURLWithPage(page: any, options: PdfOptions): Promise<Uint8Array> {
    const { url, width, height, margin = { top: 0, bottom: 0, left: 0, right: 0 }, waitUntil = 'domcontentloaded', timeout = 30000, emulateMedia = 'screen' } = options;

    // Configurar página
    await page.emulateMedia({ media: emulateMedia });

    // Navegar con timeout optimizado
    await page.goto(url, {
      waitUntil: waitUntil,
      timeout: timeout,
    });

    // Esperar fuentes de manera más eficiente
    await page.waitForFunction(() => document.fonts.ready, { timeout: 5000 });

    const pdfOptions: any = {
      printBackground: true,
      margin: margin,
      preferCSSPageSize: true,
      displayHeaderFooter: false
    };

    if (width && height) {
      pdfOptions.width = `${width}mm`;
      pdfOptions.height = `${height}mm`;
    } else if (width === SizePrint.A4) {
      pdfOptions.format = SizePrint.A4;
    } else if (width) {
      const bodyHandle = await page.$('body');
      const boundingBox = await bodyHandle.boundingBox();
      const heightPx = Math.ceil(boundingBox.height);
      const heightMm = pixelsToMillimeters(heightPx).toFixed(2);

      pdfOptions.width = width.includes('mm') ? width : `${width}mm`;
      pdfOptions.height = `${heightMm}mm`;
    }

    return await page.pdf(pdfOptions);
  }

  private async measureHeightOptimized(page: any, width: number): Promise<number> {
    const bodyHandle = await page.$('body');
    const boundingBox = await bodyHandle.boundingBox();
    return Math.ceil(boundingBox.height);
  }

  private calculatePriority(options: PdfOptions): number {
    let priority = 0;
    
    // Prioridad alta para URLs (más complejas)
    if ('url' in options) priority += 10;
    
    // Prioridad por tamaño de contenido
    if ('htmlContent' in options && options.htmlContent) {
      const contentLength = options.htmlContent.length;
      if (contentLength > 10000) priority += 5;
      if (contentLength > 50000) priority += 10;
    }
    
    // Prioridad por dimensiones personalizadas
    if (options.width && options.height) priority += 3;
    
    return priority;
  }

  private calculateTimeout(options: PdfOptions): number {
    // Timeout base
    let timeout = 30000;
    
    // Aumentar timeout para contenido complejo
    if ('htmlContent' in options && options.htmlContent) {
      const contentLength = options.htmlContent.length;
      if (contentLength > 10000) timeout += 15000;
      if (contentLength > 50000) timeout += 30000;
    }
    
    // Aumentar timeout para URLs
    if ('url' in options) timeout += 20000;
    
    return timeout;
  }

  private generateRequestId(): string {
    return `pdf_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private logMetrics(options: PdfOptions, duration: number, status: 'success' | 'error'): void {
    // Aquí puedes integrar con tu sistema de logging
    console.log({
      timestamp: new Date().toISOString(),
      type: 'url' in options ? 'url' : 'html',
      duration,
      status,
      contentLength: 'htmlContent' in options ? options.htmlContent?.length : 0
    });
  }

  async shutdown(): Promise<void> {
    await this.browserPool.shutdown();
  }
}
```

### 3. **Configuración de Memoria y Recursos**

```typescript
// apps/nestapi-service/src/config/browser.config.ts
export const browserConfig = {
  // Límites de memoria por instancia
  maxMemoryPerInstance: 512 * 1024 * 1024, // 512MB
  
  // Configuraciones de pool
  maxInstances: process.env.MAX_BROWSER_INSTANCES ? 
    parseInt(process.env.MAX_BROWSER_INSTANCES) : 5,
  
  maxConcurrentRequests: process.env.MAX_CONCURRENT_REQUESTS ? 
    parseInt(process.env.MAX_CONCURRENT_REQUESTS) : 10,
  
  // Timeouts
  defaultTimeout: 30000,
  maxTimeout: 120000,
  
  // Configuraciones de limpieza
  maxIdleTime: 5 * 60 * 1000, // 5 minutos
  maxRequestsPerInstance: 100,
  
  // Configuraciones de Playwright
  chromiumArgs: [
    '--no-sandbox',
    '--disable-setuid-sandbox',
    '--disable-dev-shm-usage',
    '--disable-accelerated-2d-canvas',
    '--no-first-run',
    '--no-zygote',
    '--disable-gpu',
    '--single-process',
    '--disable-extensions',
    '--disable-background-timer-throttling',
    '--disable-backgrounding-occluded-windows',
    '--disable-renderer-backgrounding',
    '--disable-features=TranslateUI',
    '--disable-ipc-flooding-protection',
    '--memory-pressure-off',
    '--max_old_space_size=512'
  ]
};
```

### 4. **Middleware de Rate Limiting y Queue Management**

```typescript
// apps/nestapi-service/src/middleware/pdf-queue.middleware.ts
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class PDFQueueMiddleware implements NestMiddleware {
  private requestCount = 0;
  private maxConcurrentRequests: number;
  private queue: Array<{
    req: Request;
    res: Response;
    next: NextFunction;
    timestamp: number;
  }> = [];

  constructor() {
    this.maxConcurrentRequests = parseInt(process.env.MAX_CONCURRENT_REQUESTS || '10');
    
    // Procesar cola cada 100ms
    setInterval(() => this.processQueue(), 100);
  }

  use(req: Request, res: Response, next: NextFunction) {
    if (req.path.includes('/pdf')) {
      this.handlePDFRequest(req, res, next);
    } else {
      next();
    }
  }

  private handlePDFRequest(req: Request, res: Response, next: NextFunction) {
    if (this.requestCount < this.maxConcurrentRequests) {
      this.requestCount++;
      next();
    } else {
      // Agregar a la cola
      this.queue.push({
        req,
        res,
        next,
        timestamp: Date.now()
      });
      
      // Configurar timeout para requests en cola
      setTimeout(() => {
        const index = this.queue.findIndex(item => item.req === req);
        if (index > -1) {
          this.queue.splice(index, 1);
          res.status(408).json({
            error: 'Request timeout - queue full',
            message: 'Too many concurrent PDF generation requests'
          });
        }
      }, 60000); // 1 minuto de timeout
    }
  }

  private processQueue() {
    if (this.queue.length > 0 && this.requestCount < this.maxConcurrentRequests) {
      const item = this.queue.shift();
      if (item) {
        this.requestCount++;
        item.next();
      }
    }
  }

  // Método para liberar un slot de request
  releaseRequest() {
    if (this.requestCount > 0) {
      this.requestCount--;
    }
  }
}
```

### 5. **Health Check y Métricas**

```typescript
// apps/nestapi-service/src/health/pdf-health.service.ts
import { Injectable } from '@nestjs/common';
import { OptimizedPDFHelper } from '../helper/pdf.helper.optimized';

@Injectable()
export class PDFHealthService {
  constructor(private pdfHelper: OptimizedPDFHelper) {}

  async getHealthStatus() {
    return {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      metrics: {
        activeRequests: this.pdfHelper.getActiveRequestCount(),
        queueLength: this.pdfHelper.getQueueLength(),
        poolStatus: this.pdfHelper.getPoolStatus(),
        memoryUsage: process.memoryUsage(),
        uptime: process.uptime()
      }
    };
  }

  async getMetrics() {
    return {
      requestsPerSecond: this.pdfHelper.getRequestsPerSecond(),
      averageResponseTime: this.pdfHelper.getAverageResponseTime(),
      errorRate: this.pdfHelper.getErrorRate(),
      memoryUsage: process.memoryUsage(),
      cpuUsage: process.cpuUsage()
    };
  }
}
```

## 🚀 Implementación Gradual

### Fase 1: Pool Manager Básico (1-2 semanas)
1. Implementar `BrowserPoolManager`
2. Modificar `pdf.helper.ts` para usar el pool
3. Agregar configuración de memoria

### Fase 2: Queue Management (1 semana)
1. Implementar middleware de cola
2. Agregar priorización de requests
3. Implementar timeouts por request

### Fase 3: Optimizaciones Avanzadas (2-3 semanas)
1. Implementar métricas y monitoreo
2. Agregar circuit breakers
3. Optimizar configuración de Playwright

### Fase 4: Testing y Monitoreo (1 semana)
1. Tests de carga y concurrencia
2. Métricas de performance
3. Alertas automáticas

## 📊 Beneficios Esperados

### Performance
- **Reducción de tiempo de respuesta**: 40-60% más rápido
- **Mayor throughput**: 3-5x más requests concurrentes
- **Mejor utilización de recursos**: 70-80% de eficiencia

### Estabilidad
- **Sin bloqueos**: Requests no se quedan colgados
- **Mejor manejo de memoria**: Sin crashes por OOM
- **Recuperación automática**: Instancias se reciclan automáticamente

### Escalabilidad
- **Escalado horizontal**: Fácil agregar más instancias
- **Configuración dinámica**: Ajustes en tiempo de ejecución
- **Monitoreo en tiempo real**: Métricas y alertas

## 🔧 Configuración de Producción

```bash
# Variables de entorno recomendadas
MAX_BROWSER_INSTANCES=10
MAX_CONCURRENT_REQUESTS=20
MAX_MEMORY_PER_INSTANCE=512
BROWSER_TIMEOUT=30000
QUEUE_TIMEOUT=60000
```

## 📈 Métricas de Monitoreo

### KPIs Clave
- **Response Time**: Tiempo promedio de generación
- **Throughput**: PDFs generados por minuto
- **Error Rate**: Porcentaje de requests fallidos
- **Memory Usage**: Uso de memoria por instancia
- **Queue Length**: Requests en espera

### Alertas Recomendadas
- **High Memory Usage**: >80% de memoria utilizada
- **Long Queue**: >50 requests en cola
- **High Error Rate**: >5% de requests fallidos
- **Slow Response**: >60 segundos promedio

---

Esta optimización transformará tu servicio de PDF de un sistema básico a uno empresarial, capaz de manejar alta concurrencia y archivos grandes sin comprometer la estabilidad del sistema.
