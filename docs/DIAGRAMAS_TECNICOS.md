# Diagramas Técnicos del Sistema

Este documento contiene diagramas técnicos adicionales para entender mejor la arquitectura y funcionamiento del sistema MD/HTML to PDF.

## 📊 Arquitectura de Microservicios

### Vista General de la Arquitectura

```mermaid
graph TB
    subgraph "Cliente"
        A[Usuario] --> B[Navegador Web]
    end

    subgraph "Frontend Layer"
        B --> C[Next.js App]
        C --> D[Monaco Editor]
        C --> E[Preview Component]
        C --> F[Form Controls]
    end

    subgraph "API Gateway Layer"
        G[Load Balancer]
        H[Rate Limiting]
        I[Authentication]
    end

    subgraph "Service Layer"
        J[FastAPI Service<br/>Port 8000]
        K[NestJS Service<br/>Port 3000]
    end

    subgraph "Infrastructure Layer"
        L[Redis Cache]
        M[PostgreSQL/MySQL]
        N[File Storage]
    end

    subgraph "External Services"
        O[Puppeteer Engine]
        P[Markdown Parser]
    end

    %% Connections
    A --> G
    G --> H
    H --> I
    I --> J
    I --> K
    
    J --> L
    K --> L
    J --> M
    K --> M
    
    J --> O
    K --> P
```

## 🔄 Flujos de Procesamiento

### Flujo Completo de Conversión Markdown → PDF

```mermaid
flowchart TD
    A[Usuario ingresa Markdown] --> B[Validación Frontend]
    B --> C{Validación Exitosa?}
    C -->|No| D[Mostrar Error]
    C -->|Sí| E[Enviar a FastAPI]
    
    E --> F[FastAPI recibe request]
    F --> G[Validar datos con Pydantic]
    G --> H{Validación Exitosa?}
    H -->|No| I[Retornar Error 400]
    H -->|Sí| J[Procesar Markdown]
    
    J --> K[Convertir MD a HTML]
    K --> L[Agregar CSS personalizado]
    L --> M[Enviar a NestJS]
    
    M --> N[NestJS recibe HTML]
    N --> O[Configurar Puppeteer]
    O --> P[Generar PDF]
    P --> Q[Retornar PDF a FastAPI]
    
    Q --> R[FastAPI recibe PDF]
    R --> S[Configurar headers de respuesta]
    S --> T[Retornar PDF al Frontend]
    
    T --> U[Frontend recibe PDF]
    U --> V[Crear blob URL]
    V --> W[Descargar archivo]
    
    D --> X[Usuario corrige error]
    I --> X
    X --> A
```

### Flujo de Manejo de Errores

```mermaid
flowchart TD
    A[Request llega] --> B{Validación Exitosa?}
    B -->|No| C[ValidationException]
    B -->|Sí| D{Procesamiento Exitoso?}
    
    C --> E[Error 400 Bad Request]
    E --> F[Log Error]
    F --> G[Retornar Error al Cliente]
    
    D -->|No| H{Error de Servicio?}
    D -->|Sí| I[Success Response]
    
    H -->|Sí| J[ServiceUnavailableException]
    H -->|No| K[PDFGenerationException]
    
    J --> L[Error 503 Service Unavailable]
    K --> M[Error 500 Internal Server Error]
    
    L --> F
    M --> F
    
    I --> N[Log Success]
    N --> O[Retornar PDF]
```

## 🏗️ Estructura de Datos

### Modelo de Datos del Sistema

```mermaid
classDiagram
    class PdfRequest {
        +string title
        +string? content
        +string? url
        +string? css
        +PaperSize? size
        +string? width
        +string? height
        +Margin margin
        +validate()
    }
    
    class Margin {
        +number top
        +number right
        +number bottom
        +number left
        +validate()
    }
    
    class PaperSize {
        <<enumeration>>
        A4
        MM80
        MM58
    }
    
    class PdfResponse {
        +Uint8Array content
        +string filename
        +string contentType
        +number contentLength
    }
    
    class ErrorResponse {
        +string errorCode
        +string message
        +object? details
        +string timestamp
        +string path
    }
    
    PdfRequest --> Margin
    PdfRequest --> PaperSize
    PdfRequest --> PdfResponse
    PdfRequest --> ErrorResponse
```

## 🔐 Arquitectura de Seguridad

### Capas de Seguridad Implementadas y Propuestas

```mermaid
graph TB
    subgraph "Cliente"
        A[Usuario]
    end

    subgraph "Frontend Security"
        B[Input Validation]
        C[XSS Protection]
        D[CSRF Protection]
    end

    subgraph "Network Security"
        E[HTTPS/TLS]
        F[Rate Limiting]
        G[IP Whitelisting]
    end

    subgraph "API Security"
        H[Authentication]
        I[Authorization]
        J[Input Sanitization]
    end

    subgraph "Service Security"
        K[Service-to-Service Auth]
        L[Encrypted Communication]
        M[Audit Logging]
    end

    subgraph "Data Security"
        N[Data Encryption]
        O[Secure File Storage]
        P[Access Control]
    end

    A --> B
    B --> C
    C --> D
    D --> E
    E --> F
    F --> G
    G --> H
    H --> I
    I --> J
    J --> K
    K --> L
    L --> M
    M --> N
    N --> O
    O --> P
```

## 📈 Monitoreo y Observabilidad

### Stack de Monitoreo Propuesto

```mermaid
graph TB
    subgraph "Application Layer"
        A[FastAPI Service]
        B[NestJS Service]
        C[Next.js App]
    end

    subgraph "Metrics Collection"
        D[Prometheus Client]
        E[Custom Metrics]
        F[Business Metrics]
    end

    subgraph "Logging"
        G[Structured Logs]
        H[Log Aggregation]
        I[Log Analysis]
    end

    subgraph "Tracing"
        J[Distributed Tracing]
        K[Request Correlation]
        L[Performance Analysis]
    end

    subgraph "Monitoring Stack"
        M[Prometheus]
        N[Grafana]
        O[AlertManager]
    end

    subgraph "Observability Tools"
        P[Health Checks]
        Q[Error Tracking]
        R[Performance Monitoring]
    end

    A --> D
    B --> D
    C --> D
    
    D --> E
    E --> F
    
    A --> G
    B --> G
    C --> G
    
    G --> H
    H --> I
    
    A --> J
    B --> J
    C --> J
    
    J --> K
    K --> L
    
    D --> M
    M --> N
    M --> O
    
    N --> P
    N --> Q
    N --> R
```

## 🚀 Escalabilidad y Performance

### Arquitectura de Escalabilidad Horizontal

```mermaid
graph TB
    subgraph "Load Balancer"
        A[NGINX/HAProxy]
    end

    subgraph "FastAPI Instances"
        B[FastAPI Instance 1]
        C[FastAPI Instance 2]
        D[FastAPI Instance N]
    end

    subgraph "NestJS Instances"
        E[NestJS Instance 1]
        F[NestJS Instance 2]
        G[NestJS Instance N]
    end

    subgraph "Shared Resources"
        H[Redis Cluster]
        I[Database Cluster]
        J[File Storage]
    end

    subgraph "Auto Scaling"
        K[Kubernetes HPA]
        L[CPU/Memory Metrics]
        M[Custom Metrics]
    end

    A --> B
    A --> C
    A --> D
    
    B --> E
    C --> F
    D --> G
    
    E --> H
    F --> H
    G --> H
    
    E --> I
    F --> I
    G --> I
    
    E --> J
    F --> J
    G --> J
    
    L --> K
    M --> K
    K --> B
    K --> C
    K --> D
    K --> E
    K --> F
    K --> G
```

## 🔄 Circuit Breaker Pattern

### Implementación del Circuit Breaker

```mermaid
stateDiagram-v2
    [*] --> Closed
    
    state Closed {
        [*] --> Normal
        Normal --> HighErrorRate : Error Rate > Threshold
        HighErrorRate --> Normal : Error Rate < Threshold
    }
    
    state Open {
        [*] --> Blocking
        Blocking --> HalfOpen : Timeout Reached
    }
    
    state HalfOpen {
        [*] --> Testing
        Testing --> Closed : Success
        Testing --> Open : Failure
    }
    
    Closed --> Open : Failure Threshold Reached
    Open --> HalfOpen : Recovery Timeout
    HalfOpen --> Closed : Success Threshold Reached
    HalfOpen --> Open : Failure Threshold Reached
```

## 🗄️ Patrones de Caché

### Estrategia de Caché Multi-Nivel

```mermaid
graph TB
    subgraph "Client Side"
        A[Browser Cache]
        B[Service Worker]
    end

    subgraph "CDN Layer"
        C[CloudFront/Cloudflare]
        D[Edge Locations]
    end

    subgraph "Application Layer"
        E[In-Memory Cache]
        F[Redis Cache]
    end

    subgraph "Database Layer"
        G[Query Cache]
        H[Result Cache]
    end

    subgraph "Cache Strategy"
        I[Cache-Aside]
        J[Write-Through]
        K[Write-Behind]
    end

    A --> C
    B --> C
    C --> D
    D --> E
    E --> F
    F --> G
    G --> H
    
    I --> E
    J --> F
    K --> F
```

## 🧪 Testing Strategy

### Pirámide de Testing

```mermaid
graph TB
    subgraph "Testing Pyramid"
        A[E2E Tests<br/>10%]
        B[Integration Tests<br/>20%]
        C[Unit Tests<br/>70%]
    end

    subgraph "Test Types"
        D[Manual Testing]
        E[Automated Testing]
        F[Performance Testing]
        G[Security Testing]
    end

    subgraph "Tools"
        H[Jest]
        I[Pytest]
        J[Cypress]
        K[Postman]
    end

    A --> D
    B --> E
    C --> E
    
    D --> J
    E --> H
    E --> I
    E --> K
    
    F --> H
    F --> I
    G --> K
```

## 📊 Métricas de Negocio

### KPIs del Sistema

```mermaid
graph TB
    subgraph "Performance Metrics"
        A[Response Time]
        B[Throughput]
        C[Error Rate]
        D[Availability]
    end

    subgraph "Business Metrics"
        E[PDFs Generated]
        F[User Satisfaction]
        G[Conversion Rate]
        H[Cost per PDF]
    end

    subgraph "Technical Metrics"
        I[CPU Usage]
        J[Memory Usage]
        K[Disk I/O]
        L[Network I/O]
    end

    subgraph "User Experience"
        M[Page Load Time]
        N[Time to PDF]
        O[Success Rate]
        P[User Retention]
    end

    A --> E
    B --> F
    C --> G
    D --> H
    
    I --> M
    J --> N
    K --> O
    L --> P
```

---

Estos diagramas proporcionan una visión técnica completa del sistema y pueden ser utilizados para:

1. **Documentación técnica** para desarrolladores
2. **Presentaciones** para stakeholders
3. **Planificación** de mejoras y nuevas features
4. **Onboarding** de nuevos miembros del equipo
5. **Arquitectura** y decisiones de diseño

Los diagramas están en formato Mermaid, lo que permite:
- **Edición fácil** en GitHub y otras plataformas
- **Versionado** junto con el código
- **Exportación** a diferentes formatos
- **Integración** en documentación automática
