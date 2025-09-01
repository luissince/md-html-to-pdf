# Ejemplos de Implementación para Mejoras del Sistema

## 1. Manejo de Errores Estructurado

### FastAPI - Manejo de Errores Mejorado

```python
# apps/fastapi-service/src/core/exceptions.py
from fastapi import HTTPException
from typing import Dict, Any, Optional

class BaseAPIException(HTTPException):
    def __init__(
        self,
        status_code: int,
        message: str,
        error_code: str = None,
        details: Dict[str, Any] = None
    ):
        super().__init__(status_code=status_code, detail={
            "error_code": error_code,
            "message": message,
            "details": details or {}
        })

class PDFGenerationException(BaseAPIException):
    def __init__(self, message: str = "Error generating PDF", details: Dict[str, Any] = None):
        super().__init__(
            status_code=500,
            message=message,
            error_code="PDF_GENERATION_ERROR",
            details=details
        )

class ValidationException(BaseAPIException):
    def __init__(self, message: str = "Validation error", details: Dict[str, Any] = None):
        super().__init__(
            status_code=400,
            message=message,
            error_code="VALIDATION_ERROR",
            details=details
        )

class ServiceUnavailableException(BaseAPIException):
    def __init__(self, message: str = "Service temporarily unavailable", details: Dict[str, Any] = None):
        super().__init__(
            status_code=503,
            message=message,
            error_code="SERVICE_UNAVAILABLE",
            details=details
        )
```

### NestJS - Manejo de Errores Mejorado

```typescript
// apps/nestapi-service/src/common/exceptions/api.exception.ts
import { HttpException, HttpStatus } from '@nestjs/common';

export interface ApiErrorResponse {
  errorCode: string;
  message: string;
  details?: Record<string, any>;
  timestamp: string;
  path: string;
}

export class ApiException extends HttpException {
  constructor(
    statusCode: HttpStatus,
    errorCode: string,
    message: string,
    details?: Record<string, any>
  ) {
    const response: ApiErrorResponse = {
      errorCode,
      message,
      details,
      timestamp: new Date().toISOString(),
      path: '', // Se establecerá en el interceptor
    };
    
    super(response, statusCode);
  }
}

export class PDFGenerationException extends ApiException {
  constructor(message: string = 'Error generating PDF', details?: Record<string, any>) {
    super(
      HttpStatus.INTERNAL_SERVER_ERROR,
      'PDF_GENERATION_ERROR',
      message,
      details
    );
  }
}

export class ValidationException extends ApiException {
  constructor(message: string = 'Validation error', details?: Record<string, any>) {
    super(
      HttpStatus.BAD_REQUEST,
      'VALIDATION_ERROR',
      message,
      details
    );
  }
}
```

## 2. Logging Estructurado

### FastAPI - Logging Estructurado

```python
# apps/fastapi-service/src/core/logging.py
import logging
import json
from datetime import datetime
from typing import Dict, Any
from fastapi import Request
import structlog

class StructuredLogger:
    def __init__(self):
        structlog.configure(
            processors=[
                structlog.stdlib.filter_by_level,
                structlog.stdlib.add_logger_name,
                structlog.stdlib.add_log_level,
                structlog.stdlib.PositionalArgumentsFormatter(),
                structlog.processors.TimeStamper(fmt="iso"),
                structlog.processors.StackInfoRenderer(),
                structlog.processors.format_exc_info,
                structlog.processors.UnicodeDecoder(),
                structlog.processors.JSONRenderer()
            ],
            context_class=dict,
            logger_factory=structlog.stdlib.LoggerFactory(),
            wrapper_class=structlog.stdlib.BoundLogger,
            cache_logger_on_first_use=True,
        )
        
        self.logger = structlog.get_logger()

    def log_request(self, request: Request, **kwargs):
        log_data = {
            "method": request.method,
            "url": str(request.url),
            "client_ip": request.client.host,
            "user_agent": request.headers.get("user-agent"),
            **kwargs
        }
        self.logger.info("HTTP Request", **log_data)

    def log_response(self, status_code: int, response_time: float, **kwargs):
        log_data = {
            "status_code": status_code,
            "response_time_ms": round(response_time * 1000, 2),
            **kwargs
        }
        self.logger.info("HTTP Response", **log_data)

    def log_error(self, error: Exception, **kwargs):
        log_data = {
            "error_type": type(error).__name__,
            "error_message": str(error),
            **kwargs
        }
        self.logger.error("Application Error", **log_data)

# Instancia global
logger = StructuredLogger()
```

### NestJS - Logging Estructurado

```typescript
// apps/nestapi-service/src/common/interceptors/logging.interceptor.ts
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { Request, Response } from 'express';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest<Request>();
    const response = context.switchToHttp().getResponse<Response>();
    const { method, url, ip, headers } = request;
    const userAgent = headers['user-agent'] || '';

    const startTime = Date.now();

    this.logger.log({
      message: 'Incoming Request',
      method,
      url,
      ip,
      userAgent,
      timestamp: new Date().toISOString(),
    });

    return next.handle().pipe(
      tap(() => {
        const responseTime = Date.now() - startTime;
        const statusCode = response.statusCode;

        this.logger.log({
          message: 'Outgoing Response',
          method,
          url,
          statusCode,
          responseTime: `${responseTime}ms`,
          timestamp: new Date().toISOString(),
        });
      }),
      catchError((error) => {
        const responseTime = Date.now() - startTime;
        const statusCode = error.status || 500;

        this.logger.error({
          message: 'Request Error',
          method,
          url,
          statusCode,
          responseTime: `${responseTime}ms`,
          error: error.message,
          stack: error.stack,
          timestamp: new Date().toISOString(),
        });

        throw error;
      }),
    );
  }
}
```

## 3. Health Checks

### FastAPI - Health Check

```python
# apps/fastapi-service/src/core/health.py
from fastapi import APIRouter, Depends
from typing import Dict, Any
import psutil
import os
import requests
from datetime import datetime

router = APIRouter()

class HealthChecker:
    def __init__(self):
        self.nestjs_url = os.getenv("API_HTML_TO_PDF")
    
    async def check_system_health(self) -> Dict[str, Any]:
        return {
            "status": "healthy",
            "timestamp": datetime.utcnow().isoformat(),
            "system": {
                "cpu_percent": psutil.cpu_percent(interval=1),
                "memory_percent": psutil.virtual_memory().percent,
                "disk_percent": psutil.disk_usage('/').percent
            }
        }
    
    async def check_nestjs_service(self) -> Dict[str, Any]:
        try:
            if not self.nestjs_url:
                return {
                    "status": "unknown",
                    "message": "API_HTML_TO_PDF not configured"
                }
            
            response = requests.get(f"{self.nestjs_url}/health", timeout=5)
            if response.status_code == 200:
                return {"status": "healthy", "response_time": response.elapsed.total_seconds()}
            else:
                return {"status": "unhealthy", "status_code": response.status_code}
        except Exception as e:
            return {"status": "unhealthy", "error": str(e)}
    
    async def get_health_status(self) -> Dict[str, Any]:
        system_health = await self.check_system_health()
        nestjs_health = await self.check_nestjs_service()
        
        overall_status = "healthy"
        if nestjs_health["status"] == "unhealthy":
            overall_status = "degraded"
        
        return {
            "status": overall_status,
            "timestamp": datetime.utcnow().isoformat(),
            "services": {
                "fastapi": system_health,
                "nestjs": nestjs_health
            }
        }

health_checker = HealthChecker()

@router.get("/health")
async def health_check():
    return await health_checker.get_health_status()

@router.get("/health/ready")
async def readiness_check():
    health_status = await health_checker.get_health_status()
    if health_status["status"] in ["healthy", "degraded"]:
        return {"status": "ready"}
    else:
        return {"status": "not_ready"}
```

### NestJS - Health Check

```typescript
// apps/nestapi-service/src/health/health.controller.ts
import { Controller, Get } from '@nestjs/common';
import { HealthCheck, HealthCheckService, HttpHealthIndicator } from '@nestjs/terminus';

@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private http: HttpHealthIndicator,
  ) {}

  @Get()
  @HealthCheck()
  check() {
    return this.health.check([
      () => this.http.pingCheck('nestjs', 'http://localhost:3000'),
      () => this.http.pingCheck('fastapi', 'http://localhost:8000'),
    ]);
  }

  @Get('ready')
  @HealthCheck()
  readiness() {
    return this.health.check([
      () => this.http.pingCheck('nestjs', 'http://localhost:3000'),
    ]);
  }

  @Get('live')
  @HealthCheck()
  liveness() {
    return this.health.check([
      () => this.http.pingCheck('nestjs', 'http://localhost:3000'),
    ]);
  }
}
```

## 4. Validación de Datos Robusta

### FastAPI - Validación con Pydantic

```python
# apps/fastapi-service/src/model/validators.py
from pydantic import BaseModel, validator, Field
from typing import Optional, Union
from enum import Enum

class PaperSize(str, Enum):
    A4 = "A4"
    MM80 = "mm80"
    MM58 = "mm58"

class Margin(BaseModel):
    top: float = Field(ge=0, le=50, description="Top margin in mm")
    right: float = Field(ge=0, le=50, description="Right margin in mm")
    bottom: float = Field(ge=0, le=50, description="Bottom margin in mm")
    left: float = Field(ge=0, le=50, description="Left margin in mm")

class PdfRequest(BaseModel):
    title: str = Field(..., min_length=1, max_length=255, description="Document title")
    content: Optional[str] = Field(None, description="Markdown or HTML content")
    url: Optional[str] = Field(None, description="URL to convert")
    css: Optional[str] = Field(None, description="Custom CSS styles")
    size: Optional[PaperSize] = Field(None, description="Paper size")
    width: Optional[float] = Field(None, ge=10, le=1000, description="Custom width in mm")
    height: Optional[float] = Field(None, ge=10, le=1000, description="Custom height in mm")
    margin: Margin = Field(default_factory=lambda: Margin())

    @validator('content', 'url')
    def validate_content_or_url(cls, v, values):
        if not values.get('content') and not values.get('url'):
            raise ValueError('Either content or url must be provided')
        return v

    @validator('width', 'height')
    def validate_custom_dimensions(cls, v, values):
        if values.get('size') and v:
            raise ValueError('Cannot specify custom dimensions when using predefined size')
        return v

    @validator('css')
    def validate_css(cls, v):
        if v and len(v) > 10000:
            raise ValueError('CSS content too long (max 10KB)')
        return v
```

### NestJS - Validación con Class Validator

```typescript
// apps/nestapi-service/src/common/class/dto/pdf.class.dto.ts
import { IsString, IsOptional, IsEnum, IsNumber, Min, Max, ValidateIf, IsUrl } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum PaperSize {
  A4 = 'A4',
  MM80 = 'mm80',
  MM58 = 'mm58',
}

export class MarginDto {
  @ApiProperty({ minimum: 0, maximum: 50, description: 'Top margin in mm' })
  @IsNumber()
  @Min(0)
  @Max(50)
  top: number;

  @ApiProperty({ minimum: 0, maximum: 50, description: 'Right margin in mm' })
  @IsNumber()
  @Min(0)
  @Max(50)
  right: number;

  @ApiProperty({ minimum: 0, maximum: 50, description: 'Bottom margin in mm' })
  @IsNumber()
  @Min(0)
  @Max(50)
  bottom: number;

  @ApiProperty({ minimum: 0, maximum: 50, description: 'Left margin in mm' })
  @IsNumber()
  @Min(0)
  @Max(50)
  left: number;
}

export class PdfDto {
  @ApiProperty({ minLength: 1, maxLength: 255, description: 'Document title' })
  @IsString()
  title: string;

  @ApiProperty({ required: false, description: 'Markdown or HTML content' })
  @IsOptional()
  @IsString()
  @ValidateIf(o => !o.url)
  content?: string;

  @ApiProperty({ required: false, description: 'URL to convert' })
  @IsOptional()
  @IsUrl()
  @ValidateIf(o => !o.content)
  url?: string;

  @ApiProperty({ required: false, description: 'Custom CSS styles' })
  @IsOptional()
  @IsString()
  css?: string;

  @ApiProperty({ enum: PaperSize, required: false, description: 'Paper size' })
  @IsOptional()
  @IsEnum(PaperSize)
  size?: PaperSize;

  @ApiProperty({ required: false, minimum: 10, maximum: 1000, description: 'Custom width in mm' })
  @IsOptional()
  @IsNumber()
  @Min(10)
  @Max(1000)
  @ValidateIf(o => !o.size)
  width?: number;

  @ApiProperty({ required: false, minimum: 10, maximum: 1000, description: 'Custom height in mm' })
  @IsOptional()
  @IsNumber()
  @Min(10)
  @Max(1000)
  @ValidateIf(o => !o.size)
  height?: number;

  @ApiProperty({ type: MarginDto })
  margin: MarginDto;
}
```

## 5. Rate Limiting

### FastAPI - Rate Limiting con SlowAPI

```python
# apps/fastapi-service/src/core/rate_limiting.py
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from fastapi import Request, Response
import time

limiter = Limiter(key_func=get_remote_address)

def setup_rate_limiting(app):
    app.state.limiter = limiter
    app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# Decoradores para diferentes endpoints
def rate_limit_by_ip(requests: int, window: int):
    """Rate limit decorator based on IP address"""
    return limiter.limit(f"{requests}/{window}s")(lambda: None)

def rate_limit_by_user(requests: int, window: int):
    """Rate limit decorator based on user ID (when auth is implemented)"""
    def get_user_key(request: Request):
        # TODO: Implement when authentication is added
        return get_remote_address(request)
    
    return limiter.limit(f"{requests}/{window}s", key_func=get_user_key)(lambda: None)

# Uso en controladores
@router.post("/pdf")
@rate_limit_by_ip(10, 60)  # 10 requests per minute per IP
async def pdf(body: Body):
    # ... existing code ...
```

### NestJS - Rate Limiting con @nestjs/throttler

```typescript
// apps/nestapi-service/src/common/guards/throttler.guard.ts
import { Injectable } from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';

@Injectable()
export class CustomThrottlerGuard extends ThrottlerGuard {
  protected getTracker(req: Record<string, any>): string {
    // Use IP address as tracker
    return req.ips.length ? req.ips[0] : req.ip;
  }
}

// apps/nestapi-service/src/app.controller.ts
import { Throttle, ThrottlerGuard } from '@nestjs/throttler';
import { UseGuards } from '@nestjs/common';

@Controller()
export class AppController {
  // ... existing code ...

  @Post('/html-to-pdf')
  @Throttle(10, 60) // 10 requests per minute
  @UseGuards(ThrottlerGuard)
  async htmlToPdf(@Res() res: Response, @Body() body: PdfDto) {
    // ... existing code ...
  }

  @Post('/url-to-pdf')
  @Throttle(5, 60) // 5 requests per minute (more restrictive for URL processing)
  @UseGuards(ThrottlerGuard)
  async urlToPdf(@Res() res: Response, @Body() body: PdfDto) {
    // ... existing code ...
  }
}
```

## 6. Circuit Breaker

### FastAPI - Circuit Breaker Simple

```python
# apps/fastapi-service/src/core/circuit_breaker.py
import time
from typing import Callable, Any
from enum import Enum
import asyncio

class CircuitState(Enum):
    CLOSED = "CLOSED"
    OPEN = "OPEN"
    HALF_OPEN = "HALF_OPEN"

class CircuitBreaker:
    def __init__(
        self,
        failure_threshold: int = 5,
        recovery_timeout: int = 60,
        expected_exception: type = Exception
    ):
        self.failure_threshold = failure_threshold
        self.recovery_timeout = recovery_timeout
        self.expected_exception = expected_exception
        
        self.failure_count = 0
        self.last_failure_time = None
        self.state = CircuitState.CLOSED
    
    async def call(self, func: Callable, *args, **kwargs) -> Any:
        if self.state == CircuitState.OPEN:
            if time.time() - self.last_failure_time > self.recovery_timeout:
                self.state = CircuitState.HALF_OPEN
            else:
                raise Exception("Circuit breaker is OPEN")
        
        try:
            result = await func(*args, **kwargs)
            self.on_success()
            return result
        except self.expected_exception as e:
            self.on_failure()
            raise e
    
    def on_success(self):
        self.failure_count = 0
        self.state = CircuitState.CLOSED
    
    def on_failure(self):
        self.failure_count += 1
        self.last_failure_time = time.time()
        
        if self.failure_count >= self.failure_threshold:
            self.state = CircuitState.OPEN

# Instancia global para el servicio NestJS
nestjs_circuit_breaker = CircuitBreaker(
    failure_threshold=3,
    recovery_timeout=30,
    expected_exception=requests.RequestException
)

# Uso en servicios
async def call_nestjs_service(payload: dict) -> Response:
    async def _make_request():
        response = requests.post(
            url=os.getenv("API_HTML_TO_PDF") + "/html-to-pdf",
            headers={"Content-Type": "application/json"},
            json=payload,
            timeout=10
        )
        response.raise_for_status()
        return response
    
    try:
        return await nestjs_circuit_breaker.call(_make_request)
    except Exception as e:
        logger.error(f"Circuit breaker error: {e}")
        raise ServiceUnavailableException("PDF service temporarily unavailable")
```

## 7. Caché con Redis

### FastAPI - Integración Redis

```python
# apps/fastapi-service/src/core/cache.py
import redis
import hashlib
import json
import pickle
from typing import Any, Optional
import os

class RedisCache:
    def __init__(self):
        self.redis_client = redis.Redis(
            host=os.getenv("REDIS_HOST", "localhost"),
            port=int(os.getenv("REDIS_PORT", 6379)),
            db=int(os.getenv("REDIS_DB", 0)),
            decode_responses=False  # Para datos binarios como PDFs
        )
    
    def _generate_key(self, prefix: str, data: dict) -> str:
        """Generate cache key from data"""
        data_str = json.dumps(data, sort_keys=True)
        hash_obj = hashlib.md5(data_str.encode())
        return f"{prefix}:{hash_obj.hexdigest()}"
    
    async def get(self, key: str) -> Optional[Any]:
        """Get value from cache"""
        try:
            value = self.redis_client.get(key)
            if value:
                return pickle.loads(value)
            return None
        except Exception as e:
            logger.error(f"Cache get error: {e}")
            return None
    
    async def set(self, key: str, value: Any, expire: int = 3600) -> bool:
        """Set value in cache with expiration"""
        try:
            serialized_value = pickle.dumps(value)
            return self.redis_client.setex(key, expire, serialized_value)
        except Exception as e:
            logger.error(f"Cache set error: {e}")
            return False
    
    async def delete(self, key: str) -> bool:
        """Delete key from cache"""
        try:
            return bool(self.redis_client.delete(key))
        except Exception as e:
            logger.error(f"Cache delete error: {e}")
            return False

# Instancia global
cache = RedisCache()

# Uso en servicios
async def get_cached_pdf(pdf_request: dict) -> Optional[bytes]:
    cache_key = cache._generate_key("pdf", pdf_request)
    return await cache.get(cache_key)

async def cache_pdf(pdf_request: dict, pdf_content: bytes) -> bool:
    cache_key = cache._generate_key("pdf", pdf_request)
    # Cache por 1 hora
    return await cache.set(cache_key, pdf_content, expire=3600)
```

## 8. Métricas y Monitoreo

### FastAPI - Métricas con Prometheus

```python
# apps/fastapi-service/src/core/metrics.py
from prometheus_client import Counter, Histogram, Gauge, generate_latest
from fastapi import Request
import time

# Métricas
REQUEST_COUNT = Counter(
    'http_requests_total',
    'Total HTTP requests',
    ['method', 'endpoint', 'status']
)

REQUEST_DURATION = Histogram(
    'http_request_duration_seconds',
    'HTTP request duration in seconds',
    ['method', 'endpoint']
)

PDF_GENERATION_DURATION = Histogram(
    'pdf_generation_duration_seconds',
    'PDF generation duration in seconds',
    ['type']
)

ACTIVE_REQUESTS = Gauge(
    'http_active_requests',
    'Number of active HTTP requests',
    ['method', 'endpoint']
)

class MetricsMiddleware:
    async def __call__(self, request: Request, call_next):
        start_time = time.time()
        
        # Incrementar requests activos
        ACTIVE_REQUESTS.labels(
            method=request.method,
            endpoint=request.url.path
        ).inc()
        
        try:
            response = await call_next(request)
            
            # Registrar métricas de respuesta
            REQUEST_COUNT.labels(
                method=request.method,
                endpoint=request.url.path,
                status=response.status_code
            ).inc()
            
            return response
        finally:
            # Decrementar requests activos
            ACTIVE_REQUESTS.labels(
                method=request.method,
                endpoint=request.url.path
            ).dec()
            
            # Registrar duración de request
            duration = time.time() - start_time
            REQUEST_DURATION.labels(
                method=request.method,
                endpoint=request.url.path
            ).observe(duration)

# Endpoint para métricas
@router.get("/metrics")
async def metrics():
    return Response(
        content=generate_latest(),
        media_type="text/plain"
    )
```

## 9. Testing

### FastAPI - Tests Unitarios

```python
# apps/fastapi-service/tests/test_markdown_service.py
import pytest
from unittest.mock import Mock, patch
from src.services.markdown_service import MarkdownService
from src.model.base.body import Body
from src.model.enum.size import Size

class TestMarkdownService:
    def test_generate_html_basic(self):
        """Test basic markdown to HTML conversion"""
        title = "Test Document"
        content = "# Hello World\n\nThis is a **test**."
        css = "body { font-family: Arial; }"
        
        html = MarkdownService.generate_html(title, content, css)
        
        assert "<h1>Hello World</h1>" in html
        assert "This is a <strong>test</strong>." in html
        assert f"<title>{title}</title>" in html
        assert css in html
    
    def test_generate_html_empty_content(self):
        """Test markdown to HTML with empty content"""
        title = "Empty Document"
        content = ""
        css = ""
        
        html = MarkdownService.generate_html(title, content, css)
        
        assert f"<title>{title}</title>" in html
        assert "<body>" in html
        assert "</body>" in html

# apps/fastapi-service/tests/test_markdown_controller.py
import pytest
from fastapi.testclient import TestClient
from unittest.mock import patch, Mock
from main import app

client = TestClient(app)

class TestMarkdownController:
    @patch('src.controller.markdown_controller.requests.post')
    def test_pdf_conversion_success(self, mock_post):
        """Test successful PDF conversion"""
        # Mock successful response from NestJS
        mock_response = Mock()
        mock_response.status_code = 200
        mock_response.content = b"fake_pdf_content"
        mock_response.headers = {
            "Content-Type": "application/pdf",
            "Content-Disposition": 'filename="test.pdf"'
        }
        mock_post.return_value = mock_response
        
        # Test request
        response = client.post("/markdown/pdf", json={
            "title": "Test Document",
            "content": "# Hello World",
            "css": "body { color: black; }",
            "size": "A4",
            "margin": {"top": 10, "right": 10, "bottom": 10, "left": 10}
        })
        
        assert response.status_code == 200
        assert response.headers["content-type"] == "application/pdf"
        assert response.content == b"fake_pdf_content"
    
    @patch('src.controller.markdown_controller.requests.post')
    def test_pdf_conversion_service_unavailable(self, mock_post):
        """Test PDF conversion when NestJS service is unavailable"""
        # Mock connection error
        mock_post.side_effect = requests.exceptions.ConnectionError("Connection failed")
        
        response = client.post("/markdown/pdf", json={
            "title": "Test Document",
            "content": "# Hello World",
            "size": "A4",
            "margin": {"top": 10, "right": 10, "bottom": 10, "left": 10}
        })
        
        assert response.status_code == 500
        assert "Connection Error" in response.json()["message"]
```

### NestJS - Tests Unitarios

```typescript
// apps/nestapi-service/src/app.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { AppService } from './app.service';
import { HttpException, HttpStatus } from '@nestjs/common';
import { SizePaper, SizePrint } from './common/enums/size.enum';

describe('AppService', () => {
  let service: AppService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AppService],
    }).compile();

    service = module.get<AppService>(AppService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('htmlToPdf', () => {
    it('should generate PDF with A4 size', async () => {
      const mockPdfDto = {
        title: 'Test Document',
        html: '<h1>Hello World</h1>',
        size: SizePaper.A4,
        margin: { top: 10, right: 10, bottom: 10, left: 10 },
      };

      const result = await service.htmlToPdf(mockPdfDto);
      expect(result).toBeDefined();
      expect(result).toBeInstanceOf(Uint8Array);
    });

    it('should generate PDF with custom dimensions', async () => {
      const mockPdfDto = {
        title: 'Test Document',
        html: '<h1>Hello World</h1>',
        width: 200,
        height: 300,
        margin: { top: 10, right: 10, bottom: 10, left: 10 },
      };

      const result = await service.htmlToPdf(mockPdfDto);
      expect(result).toBeDefined();
      expect(result).toBeInstanceOf(Uint8Array);
    });

    it('should throw error for invalid input', async () => {
      const mockPdfDto = {
        title: '',
        html: '',
        margin: { top: 10, right: 10, bottom: 10, left: 10 },
      };

      await expect(service.htmlToPdf(mockPdfDto)).rejects.toThrow(HttpException);
    });
  });

  describe('urlToPdf', () => {
    it('should generate PDF from URL', async () => {
      const mockPdfDto = {
        title: 'Test Document',
        url: 'https://example.com',
        size: SizePaper.A4,
        margin: { top: 10, right: 10, bottom: 10, left: 10 },
      };

      const result = await service.urlToPdf(mockPdfDto);
      expect(result).toBeDefined();
      expect(result).toBeInstanceOf(Uint8Array);
    });

    it('should throw error for missing URL', async () => {
      const mockPdfDto = {
        title: 'Test Document',
        margin: { top: 10, right: 10, bottom: 10, left: 10 },
      };

      await expect(service.urlToPdf(mockPdfDto)).rejects.toThrow(HttpException);
    });
  });
});
```

## 10. Docker Compose Mejorado

```yaml
# docker-compose.dev.yml
version: '3.8'

services:
  # Redis para caché
  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    command: redis-server --appendonly yes
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 30s
      timeout: 10s
      retries: 3

  # FastAPI Service
  fastapi-service:
    build:
      context: ./apps/fastapi-service
      dockerfile: Dockerfile
    ports:
      - "8000:8000"
    environment:
      - REDIS_HOST=redis
      - REDIS_PORT=6379
      - REDIS_DB=0
      - API_HTML_TO_PDF=http://nestapi-service:3000
      - LOG_LEVEL=INFO
    depends_on:
      redis:
        condition: service_healthy
      nestapi-service:
        condition: service_healthy
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8000/health"]
      interval: 30s
      timeout: 10s
      retries: 3
    restart: unless-stopped

  # NestJS Service
  nestapi-service:
    build:
      context: ./apps/nestapi-service
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    environment:
      - PORT=3000
      - LOG_LEVEL=info
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/health"]
      interval: 30s
      timeout: 10s
      retries: 3
    restart: unless-stopped

  # Frontend
  next-app:
    build:
      context: ./apps/next-app
      dockerfile: Dockerfile
    ports:
      - "3001:3000"
    environment:
      - NEXT_PUBLIC_APP_BACK_END=http://localhost:8000
    depends_on:
      fastapi-service:
        condition: service_healthy
    restart: unless-stopped

  # Prometheus para métricas
  prometheus:
    image: prom/prometheus:latest
    ports:
      - "9090:9090"
    volumes:
      - ./monitoring/prometheus.yml:/etc/prometheus/prometheus.yml
      - prometheus_data:/prometheus
    command:
      - '--config.file=/etc/prometheus/prometheus.yml'
      - '--storage.tsdb.path=/prometheus'
      - '--web.console.libraries=/etc/prometheus/console_libraries'
      - '--web.console.templates=/etc/prometheus/consoles'
      - '--storage.tsdb.retention.time=200h'
      - '--web.enable-lifecycle'
    restart: unless-stopped

  # Grafana para visualización
  grafana:
    image: grafana/grafana:latest
    ports:
      - "3002:3000"
    environment:
      - GF_SECURITY_ADMIN_PASSWORD=admin
    volumes:
      - grafana_data:/var/lib/grafana
    depends_on:
      - prometheus
    restart: unless-stopped

volumes:
  redis_data:
  prometheus_data:
  grafana_data:
```

## Conclusión

Estos ejemplos de implementación proporcionan una base sólida para mejorar significativamente la arquitectura del sistema. La implementación debe realizarse de manera gradual, comenzando con las mejoras de estabilidad y progresando hacia características más avanzadas de escalabilidad y monitoreo.

Cada mejora debe ser probada exhaustivamente antes de implementar la siguiente, asegurando que el sistema mantenga su funcionalidad mientras se mejora su robustez y mantenibilidad.
