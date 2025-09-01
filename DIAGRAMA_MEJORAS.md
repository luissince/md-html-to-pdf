# Diagrama de Arquitectura Actual vs Propuesta

## Arquitectura Actual

```mermaid
graph TB
    subgraph "Frontend (Next.js)"
        A[Usuario] --> B[Formulario de Conversión]
        B --> C[Validación Frontend]
    end

    subgraph "FastAPI Service (Puerto 8000)"
        D[Router Markdown] --> E[Markdown Service]
        F[Router HTML] --> G[HTML Service]
        H[Router URL] --> I[URL Service]
        
        E --> J[Markdown → HTML]
        G --> K[Procesamiento HTML]
        I --> L[Envío a NestJS]
    end

    subgraph "NestJS Service (Puerto 3000)"
        M[HTML to PDF Controller] --> N[PDF Helper]
        O[URL to PDF Controller] --> P[URL Processing]
        
        N --> Q[Generación PDF]
        P --> R[Fetch URL + PDF]
    end

    subgraph "Comunicación Actual"
        S[Variable de Entorno<br/>API_HTML_TO_PDF]
        T[HTTP Requests<br/>Sin Fallback]
    end

    %% Flujos actuales
    C --> D
    C --> F
    C --> H
    
    J --> M
    K --> M
    L --> O
    
    S --> T
    T --> M
    T --> O
```

## Arquitectura Propuesta con Mejoras

```mermaid
graph TB
    subgraph "Frontend (Next.js)"
        A2[Usuario] --> B2[Formulario de Conversión]
        B2 --> C2[Validación Frontend]
        C2 --> D2[Error Handling UI]
    end

    subgraph "API Gateway / Load Balancer"
        E2[Rate Limiting]
        F2[Authentication]
        G2[Request Routing]
    end

    subgraph "FastAPI Service (Puerto 8000)"
        H2[Router Markdown] --> I2[Markdown Service]
        J2[Router HTML] --> K2[HTML Service]
        L2[Router URL] --> M2[URL Service]
        
        I2 --> N2[Markdown → HTML]
        K2 --> O2[Procesamiento HTML]
        L2 --> P2[Envío a NestJS]
        
        Q2[Health Check]
        R2[Structured Logging]
        S2[Input Validation]
    end

    subgraph "NestJS Service (Puerto 3000)"
        T2[HTML to PDF Controller] --> U2[PDF Helper]
        V2[URL to PDF Controller] --> W2[URL Processing]
        
        U2 --> X2[Generación PDF]
        W2 --> Y2[Fetch URL + PDF]
        
        Z2[Health Check]
        AA2[Structured Logging]
        BB2[Input Validation]
    end

    subgraph "Servicios de Infraestructura"
        CC2[Redis Cache]
        DD2[Service Discovery]
        EE2[Circuit Breaker]
        FF2[Monitoring & Metrics]
    end

    subgraph "Comunicación Mejorada"
        GG2[Service Discovery]
        HH2[Circuit Breaker]
        II2[Retry Logic]
        JJ2[Fallback Mechanisms]
    end

    %% Flujos mejorados
    C2 --> E2
    E2 --> F2
    F2 --> G2
    G2 --> H2
    G2 --> J2
    G2 --> L2
    
    N2 --> T2
    O2 --> T2
    P2 --> V2
    
    GG2 --> HH2
    HH2 --> II2
    II2 --> T2
    II2 --> V2
    
    CC2 --> X2
    CC2 --> Y2
    
    DD2 --> GG2
    EE2 --> HH2
    FF2 --> Q2
    FF2 --> Z2
```

## Comparación de Características

| Aspecto | Arquitectura Actual | Arquitectura Propuesta |
|---------|-------------------|----------------------|
| **Comunicación** | HTTP directo con variables de entorno | Service discovery + circuit breakers |
| **Manejo de Errores** | Básico, no estandarizado | Estructurado con códigos HTTP consistentes |
| **Logging** | Solo en FastAPI | Estructurado en ambos servicios |
| **Validación** | Principalmente en frontend | Backend robusto + frontend |
| **Seguridad** | CORS básico | Rate limiting + autenticación |
| **Performance** | Sin caché | Redis + optimizaciones |
| **Monitoreo** | No disponible | Health checks + métricas |
| **Escalabilidad** | Manual | Auto-scaling + load balancing |
| **Testing** | No visible | Suite completa de tests |
| **Documentación** | Parcial (solo NestJS) | OpenAPI completo |

## Flujo de Datos Mejorado

### Con Circuit Breaker y Fallback

```mermaid
sequenceDiagram
    participant F as Frontend
    participant G as Gateway
    participant FA as FastAPI
    participant NS as NestJS
    participant C as Cache
    participant M as Monitor

    F->>G: POST /convert
    G->>G: Rate Limit Check
    G->>G: Authentication
    G->>FA: Route Request
    
    FA->>FA: Input Validation
    FA->>FA: Process Content
    
    alt Cache Hit
        FA->>C: Check Cache
        C->>FA: Return Cached PDF
    else Cache Miss
        FA->>NS: POST /html-to-pdf
        alt Service Available
            NS->>NS: Generate PDF
            NS->>FA: Return PDF
            FA->>C: Cache PDF
        else Service Unavailable
            FA->>FA: Circuit Breaker Open
            FA->>FA: Return Fallback Response
        end
    end
    
    FA->>F: Return Response
    FA->>M: Log Metrics
```

## Implementación Gradual

### Fase 1: Estabilización (2-3 semanas)
```mermaid
gantt
    title Fase 1: Estabilización
    dateFormat  YYYY-MM-DD
    section FastAPI
    Manejo de Errores    :done, error-handling, 2024-01-01, 1w
    Logging Estructurado :done, logging, 2024-01-08, 1w
    Health Checks        :done, health, 2024-01-15, 1w
    
    section NestJS
    Manejo de Errores    :done, error-handling-ns, 2024-01-01, 1w
    Logging Estructurado :done, logging-ns, 2024-01-08, 1w
    Health Checks        :done, health-ns, 2024-01-15, 1w
```

### Fase 2: Seguridad y Performance (3-4 semanas)
```mermaid
gantt
    title Fase 2: Seguridad y Performance
    dateFormat  YYYY-MM-DD
    section Seguridad
    Rate Limiting        :rate-limit, 2024-02-01, 1w
    Autenticación        :auth, 2024-02-08, 1w
    
    section Performance
    Redis Cache          :cache, 2024-02-15, 1w
    Optimización PDF     :pdf-opt, 2024-02-22, 1w
```

### Fase 3: Escalabilidad (4-5 semanas)
```mermaid
gantt
    title Fase 3: Escalabilidad
    dateFormat  YYYY-MM-DD
    section Infraestructura
    Service Discovery    :discovery, 2024-03-01, 1w
    Load Balancing       :lb, 2024-03-08, 1w
    Circuit Breakers     :circuit, 2024-03-15, 1w
    
    section Monitoreo
    Métricas            :metrics, 2024-03-22, 1w
    Alertas             :alerts, 2024-03-29, 1w
```

## Beneficios de las Mejoras

### Técnicos
- **Resiliencia**: Circuit breakers y fallbacks
- **Performance**: Caché y optimizaciones
- **Observabilidad**: Logging y métricas estructuradas
- **Escalabilidad**: Auto-scaling y load balancing

### Operacionales
- **Mantenibilidad**: Código más limpio y testeable
- **Debugging**: Mejor trazabilidad de errores
- **Deployment**: CI/CD más robusto
- **Monitoreo**: Alertas proactivas

### Empresariales
- **Confiabilidad**: Mayor uptime y disponibilidad
- **Eficiencia**: Menor tiempo de respuesta
- **Escalabilidad**: Soporte para más usuarios
- **Cumplimiento**: Mejores prácticas de seguridad
