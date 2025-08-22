const ESTIMATE_TEMPLATE = `
     <div class="container">
        <h1>Propuesta de Desarrollo Web</h1>
        <p><strong>Cliente:</strong> Centro de Peritaje y Arbitraje - Colegio de Ingenieros de Junín<br>
        <strong>Empresa:</strong> Syssoft Integra<br>
        <strong>RUC:</strong> 10764233889<br>
        <strong>Sitio Web:</strong> <a href="https://www.syssoftintegra.com" target="_blank">www.syssoftintegra.com</a><br>
        <strong>Fecha:</strong> 24/02/2025</p>

        <h2>📌 1. Descripción del Proyecto</h2>
        <p>Desarrollo de una página web moderna y dinámica para el <strong>Centro de Peritaje y Arbitraje del Colegio de Ingenieros de Junín</strong> que permita brindar transparencia en la información, facilidad de navegación y herramientas interactivas para usuarios y administradores.</p>
        <p>El proyecto se desarrollará utilizando la <strong>metodología Scrum</strong>, permitiendo que cada sprint involucre al cliente para obtener retroalimentación constante y mejorar el producto final. Esta metodología asegura una entrega incremental y adaptable a nuevas necesidades.</p>

        <h2>🖥️ 2. Características Principales</h2>
        <h3>Frontend (Página pública):</h3>
        <ul>
            <li>Diseño moderno, intuitivo y adaptable (responsive).</li>
            <li>Sección informativa sobre servicios de peritaje y arbitraje.</li>
            <li>Sistema de noticias y comunicados.</li>
            <li>Área de descarga de folletos y brochures.</li>
            <li>Galería de fotos y actualizaciones.</li>
            <li>Integración de chat en línea o chatbot para consultas.</li>
            <li>Módulo de transparencia: publicación de documentos oficiales y resoluciones.</li>
        </ul>

        <h3>Backend (Panel Administrativo):</h3>
        <ul>
            <li>Acceso seguro para administradores.</li>
            <li>Gestión de contenido (texto, imágenes, documentos, folletos, etc.).</li>
            <li>Actualización de logotipos y galería de fotos.</li>
            <li>Creación y edición de folletos/brochures.</li>
            <li>Gestión de usuarios y roles.</li>
            <li>Configuración del chatbot o chat en línea.</li>
        </ul>

        <h3>Infraestructura:</h3>
        <ul>
            <li>Despliegue en <strong>AWS</strong> o <strong>GCP</strong> según elección del cliente.</li>
            <li>Alojamiento seguro y escalable.</li>
            <li>Respaldo automático y medidas de seguridad.</li>
        </ul>

        <h2>💲 3. Costo del Proyecto</h2>
        <div class="highlight">
            <strong>Monto total:</strong> S/ 8,000.00 (Sin IGV)
        </div>
        <p><strong>Incluye:</strong></p>
        <ul>
            <li>Desarrollo completo del sitio web.</li>
            <li>Entrega del código fuente.</li>
            <li>Despliegue en AWS o GCP.</li>
            <li>Capacitación al personal para el uso del sistema.</li>
            <li>Soporte técnico por 1 año (fallos o pequeñas actualizaciones).</li>
        </ul>
        <p><strong>No Incluye:</strong></p>
        <ul>
            <li>IGV.</li>
            <li>Modificaciones o ampliaciones estructurales posteriores (se cotizan aparte).</li>
        </ul>

        <h2>📅 4. Cronograma de Trabajo</h2>
        <table>
            <tr>
                <th>Fase</th>
                <th>Duración</th>
                <th>Entrega Parcial</th>
            </tr>
            <tr>
                <td>Fase 1 - Diseño y Estructura</td>
                <td>1 mes</td>
                <td>Maqueta y páginas informativas</td>
            </tr>
            <tr>
                <td>Fase 2 - Funcionalidades</td>
                <td>1 mes</td>
                <td>Chatbot, panel y gestión básica</td>
            </tr>
            <tr>
                <td>Fase 3 - Ajustes y Despliegue</td>
                <td>1 mes</td>
                <td>Sistema completo y pruebas</td>
            </tr>
        </table>
        <p><em>Entrega de avances mensuales y reuniones de revisión bajo la metodología Scrum.</em></p>

        <h2>✅ 5. Entregables</h2>
        <ul>
            <li>Sitio web funcional y desplegado.</li>
            <li>Código fuente completo.</li>
            <li>Documentación técnica básica.</li>
            <li>Capacitación al equipo administrativo.</li>
        </ul>

        <h2>💡 6. Condiciones de Soporte</h2>
        <ul>
            <li>Soporte por fallos y pequeñas actualizaciones durante 1 año.</li>
            <li>Nuevas funcionalidades o cambios estructurales se cotizan aparte.</li>
        </ul>

        <h2>📸 7. Servicios Adicionales</h2>
        <h3>Sesión de Fotos</h3>
        <ul>
            <li>Captura de imágenes profesionales del equipo y las instalaciones.</li>
            <li>Edición básica de las fotos.</li>
            <li>Entrega de fotografías en alta calidad.</li>
            <li>Opcional: Sesión en múltiples locaciones.</li>
        </ul>
        <div class="highlight">
            <strong>Costo Adicional:</strong> Se cotiza aparte según requerimientos específicos.
        </div>

        <div class="footer">
            <p><strong>Syssoftintegra</strong><br>Desarrollamos soluciones que integran tecnología y eficiencia.</p>
        </div>
    </div>
`

const CV_TEMPLATE = `
<h1>John Doe</h1>
<h2>Software Developer</h2>
<h3>Experience</h3>
<ul>
  <li>Company A - Senior Developer (2018-Present)</li>
  <li>Company B - Junior Developer (2015-2018)</li>
</ul>`

const INVOICE = `
# Invoice
  
## Company Name
123 Business St, City, Country
  
| Item | Quantity | Price |
|------|----------|-------|
| Widget A | 2 | $10 |
| Widget B | 1 | $15 |
  
**Total: $35**
  
Thank you for your business!`

const PRODUCT_CATALOG = `
<h1>Our Products</h1>

<div class="product">
  <h2>Product A</h2>
  <img src="https://picsum.photos/seed/productA/200/200" alt="Product A">
  <p>Description of Product A</p>
  <p>Price: $19.99</p>
</div>

<div class="product">
  <h2>Product B</h2>
  <img src="https://picsum.photos/seed/productB/200/200" alt="Product B">
  <p>Description of Product B</p>
  <p>Price: $24.99</p>
</div>`

const NEWSLETTER = `
<h1>Newsletter</h1>

<form>
  <label for="email">Email:</label>
  <input type="email" id="email" name="email" placeholder="Enter your email">
  <button type="submit">Subscribe</button>
</form>`

const RECEIPT = `
# Receipt

## Company Name
123 Business St, City, Country

| Item | Quantity | Price |
|------|----------|-------|
| Widget A | 2 | $10 |
| Widget B | 1 | $15 |

**Total: $35**

Thank you for your business!`

const TICKET = `
# Ticket

## Event or Transportation Ticket

| Item | Quantity | Price |
|------|----------|-------|
| Widget A | 2 | $10 |
| Widget B | 1 | $15 |

**Total: $35**

Thank you for your business!` 

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100..900;1,100..900&display=swap');

/* @page {
    margin: 0;
    padding: 0;
} */

* {
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    margin: 0;
    padding: 0;
}

html {
    -webkit-text-size-adjust: 100%;
    font-size: 100%;
}

body {
    font-family: "Roboto", serif;
    font-weight: normal;
    background-color: white;
    color: #000;
    padding: 0mm;
}

h1 {
    color: #2c3e50;
    font-size: 22pt;
    padding: 5mm 0mm;
    border-bottom: 0.5mm solid #eee;
    font-weight: bold;
}

h2 {
    color: #34495e;
    font-size: 18pt;
     padding: 3mm 0mm;
    font-weight: bold;
}

h3 {
    color: #445566;
    font-size: 14pt;
    padding: 3mm 0mm;
    font-weight: bold;
}

h4 {
    color: #445566;
    font-size: 10pt;
    padding: 3mm 0mm;
    font-weight: bold;
}

p {
    padding: 3mm 0mm;
    color: #333;
    font-size: 10pt;
    font-weight: normal;
}

ul, ol {
    padding: 3mm 0mm;
    padding-left: 10mm;
}

li {
    padding: 2mm 0mm;
}

code {
    background-color: #f7f9fa;
    padding: 1mm 2mm;
    border-radius: 1mm;
    font-family: monospace;
}

pre {
    background-color: #f7f9fa;
    padding: 5mm;
    border-radius: 2mm;
    overflow-x: auto;
    font-size: 10pt;
}

blockquote {
    border-left: 1mm solid #ccc;
    margin: 5mm 0;
    padding-left: 5mm;
    font-style: italic;
    color: #666;
}

table {
    border-collapse: collapse;
    width: 100%;
    margin-bottom: 5mm;
}

th, td {
    border: 0.5mm solid #ddd;
    padding: 2mm 0mm;
    text-align: left;
    font-size: 10pt;
}

th {
    background-color: #f5f5f5;
}

strong, b {
    font-weight: bold;
}

em, i {
    font-style: italic;
}

a {
    color: #2980b9;
    text-decoration: underline;
    word-break: break-word;
}

img {
    max-width: 100%;
    height: auto;
    display: block;
    margin: 5mm auto;
}

.product {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 10mm;
    border: 0.5mm solid #ccc;
    padding: 5mm;
    border-radius: 2mm;
}

.product img {
    width: 50mm;
    height: 50mm;
    object-fit: cover;
    border-radius: 2mm;
}`

const CSS_MD= `
        @import url('https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100..900;1,100..900&display=swap');

        /* @page {
            margin: 0;
            padding: 0;
        } */

        * {
            -webkit-box-sizing: border-box;
            box-sizing: border-box;
            margin: 0;
            padding: 0;
        }

        html {
            -webkit-text-size-adjust: 100%;
            font-size: 14px; /* Tamaño base - cambiar aquí para escalar todo */
        }

        body {
            font-family: "Roboto", serif;
            font-weight: normal;
            background-color: white;
            color: #000;
            padding: 0;
            line-height: 1.6;
            font-size: 1rem; /* 14px */
        }

        /* ========== HEADINGS ========== */
        h1 {
            color: #2c3e50;
            font-size: 22pt;
            padding: 5mm 0mm;
            border-bottom: 0.5mm solid #eee;
            font-weight: bold;
        }

        h2 {
            color: #34495e;
            font-size: 18pt;
            padding: 3mm 0mm;
            font-weight: bold;
        }

        h3 {
            color: #445566;
            font-size: 14pt;
            padding: 3mm 0mm;
            font-weight: bold;
        }

        h4 {
            color: #445566;
            font-size: 12pt;
            padding: 3mm 0mm;
            font-weight: bold;
        }

        h5 {
            color: #556677;
            font-size: 11pt;
            padding: 2mm 0mm;
            font-weight: bold;
        }

        h6 {
            color: #667788;
            font-size: 10pt;
            padding: 2mm 0mm;
            font-weight: bold;
        }

        /* ========== TEXT ELEMENTS ========== */
        p {
            padding: 0.75rem 0;
            color: #333;
            font-size: 1rem;
            font-weight: normal;
            line-height: 1.6;
        }

        strong, b {
            font-weight: bold;
        }

        em, i {
            font-style: italic;
        }

        mark {
            background-color: #ffeb3b;
            padding: 0.125rem 0.25rem;
            border-radius: 0.125rem;
        }

        del, s {
            text-decoration: line-through;
            color: #999;
        }

        ins, u {
            text-decoration: underline;
            text-decoration-color: #2980b9;
        }

        sub {
            vertical-align: sub;
            font-size: 0.8em;
        }

        sup {
            vertical-align: super;
            font-size: 0.8em;
        }

        small {
            font-size: 0.875rem; /* ~12px */
        }

        /* ========== LISTS ========== */
        ol, ul {
            padding-left: 1.5rem;
            margin: 0.75rem 0;
            list-style-position: outside;
        }

        li {
            margin: 0.5rem 0;
            line-height: 1.5;
        }

        ul ul, ol ol, ul ol, ol ul {
            margin-top: 0.5rem;
            margin-bottom: 0.5rem;
            padding-left: 2rem;
        }

        /* Lista de tareas (checkboxes) */
        ul.task-list {
            list-style: none;
            padding-left: 0.75rem;
        }

        ul.task-list li {
            position: relative;
            padding-left: 1.5rem;
        }

        ul.task-list li input[type="checkbox"] {
            position: absolute;
            left: 0;
            top: 0.125rem;
            margin: 0;
        }

        /* Lista de definiciones */
        dl {
            margin: 0.75rem 0;
        }

        dt {
            font-weight: bold;
            margin-top: 0.5rem;
        }

        dd {
            margin-left: 1.5rem;
            margin-bottom: 0.5rem;
        }

        /* ========== CODE BLOCKS ========== */
        code {
            background-color: #f7f9fa;
            padding: 0.125rem 0.25rem;
            border-radius: 0.25rem;
            font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
            font-size: 0.875rem; /* ~12px */
            color: #d63384;
            border: 1px solid #e9ecef;
        }

        p code, li code, td code, th code {
            font-size: 0.875rem; /* ~12px */
            padding: 0.125rem 0.25rem;
        }

        pre {
            background-color: #f7f9fa;
            padding: 1rem;
            border-radius: 0.5rem;
            overflow-x: auto;
            font-size: 0.875rem; /* ~12px */
            border: 1px solid #e9ecef;
            margin: 1rem 0;
        }

        pre code {
            display: block;
            white-space: pre-wrap;
            word-wrap: break-word;
            background: transparent;
            border: none;
            padding: 0;
            color: #333;
        }

        /* Syntax highlighting clases comunes */
        .highlight {
            background-color: #f8f9fa;
            border-radius: 2mm;
        }

        .language-bash::before,
        .language-sh::before {
            content: "$ ";
            color: #6c757d;
        }

        /* ========== BLOCKQUOTES ========== */
        blockquote {
            border-left: 4px solid #007acc;
            margin: 1rem 0;
            padding-left: 1rem;
            font-style: italic;
            color: #555;
            background-color: #f8f9fa;
            padding: 0.75rem 0.75rem 0.75rem 2rem;
            border-radius: 0 0.5rem 0.5rem 0;
        }

        blockquote p {
            margin: 0;
            padding: 0.25rem 0;
        }

        blockquote blockquote {
            margin-left: 0.75rem;
            border-left-color: #6c757d;
        }

        /* ========== TABLES ========== */
        table {
            border-collapse: collapse;
            width: 100%;
            margin: 1rem 0;
            table-layout: auto;
            word-wrap: break-word;
            border: 1px solid #ddd;
        }

        th, td {
            border: 1px solid #ddd;
            padding: 0.5rem 0.75rem;
            text-align: left;
            font-size: 0.875rem; /* ~12px */
            vertical-align: top;
        }

        th {
            background-color: #f5f5f5;
            font-weight: bold;
        }

        tr:nth-child(even) {
            background-color: #f9f9f9;
        }

        tr:hover {
            background-color: #f0f8ff;
        }

        /* Alineación de tablas */
        td.align-center, th.align-center {
            text-align: center;
        }

        td.align-right, th.align-right {
            text-align: right;
        }

        /* ========== LINKS ========== */
        a {
            color: #2980b9;
            text-decoration: underline;
            word-break: break-word;
            transition: color 0.2s ease;
        }

        a:hover {
            color: #1abc9c;
            text-decoration: none;
        }

        a:visited {
            color: #8e44ad;
        }

        /* Enlaces de referencia footnotes */
        a[href^="#fn:"],
        a[href^="#fnref:"] {
            font-size: 0.8em;
            vertical-align: super;
            text-decoration: none;
            color: #007acc;
            font-weight: bold;
        }

        /* ========== IMAGES ========== */
        img {
            max-width: 100%;
            height: auto;
            display: block;
            margin: 5mm auto;
            border-radius: 1mm;
            box-shadow: 0 1mm 3mm rgba(0,0,0,0.1);
        }

        figure {
            margin: 5mm 0;
            text-align: center;
        }

        figcaption {
            font-size: 9pt;
            color: #666;
            font-style: italic;
            margin-top: 2mm;
            text-align: center;
        }

        /* ========== HORIZONTAL RULES ========== */
        hr {
            border: none;
            border-top: 0.5mm solid #ddd;
            margin: 8mm 0;
            width: 100%;
        }

        /* ========== FOOTNOTES ========== */
        .footnote {
            font-size: 8pt;
            color: #555;
        }

        .footnotes {
            margin-top: 10mm;
            padding-top: 5mm;
            border-top: 0.5mm solid #eee;
            font-size: 9pt;
        }

        .footnotes ol {
            padding-left: 5mm;
        }

        .footnotes li {
            margin: 1mm 0;
        }

        /* ========== TITLE ELEMENTS ========== */
        .title {
            font-size: 24pt;
            font-weight: bold;
            margin-bottom: 5mm;
            text-align: center;
            color: #2c3e50;
        }

        .author {
            font-size: 12pt;
            text-align: center;
            margin-bottom: 3mm;
            color: #555;
            font-style: italic;
        }

        .date {
            font-size: 10pt;
            text-align: center;
            margin-bottom: 8mm;
            color: #666;
        }

        /* ========== CUSTOM CLASSES ========== */
        .product {
            display: flex;
            flex-direction: column;
            align-items: center;
            margin-bottom: 10mm;
            border: 0.5mm solid #ccc;
            padding: 5mm;
            border-radius: 2mm;
            background-color: #fafafa;
        }

        .product img {
            width: 50mm;
            height: 50mm;
            object-fit: cover;
            border-radius: 2mm;
            margin-bottom: 2mm;
        }

        /* Alerts/Callouts */
        .alert {
            padding: 3mm 5mm;
            margin: 5mm 0;
            border-radius: 2mm;
            border-left: 3mm solid;
        }

        .alert-info {
            background-color: #e1f5fe;
            border-left-color: #0288d1;
            color: #01579b;
        }

        .alert-warning {
            background-color: #fff8e1;
            border-left-color: #ffa000;
            color: #e65100;
        }

        .alert-danger {
            background-color: #ffebee;
            border-left-color: #d32f2f;
            color: #b71c1c;
        }

        .alert-success {
            background-color: #e8f5e8;
            border-left-color: #388e3c;
            color: #1b5e20;
        }

        /* ========== KEYBOARD KEYS ========== */
        kbd {
            display: inline-block;
            padding: 1mm 2mm;
            font-size: 8pt;
            font-family: monospace;
            color: #444d56;
            background-color: #f6f8fa;
            border: 0.5mm solid #c6cbd1;
            border-radius: 1mm;
            box-shadow: inset 0 -0.5mm 0 #c6cbd1;
        }

        /* ========== ABBREVIATIONS ========== */
        abbr[title] {
            border-bottom: 0.5mm dotted #666;
            cursor: help;
            text-decoration: none;
        }

        /* ========== DETAILS/SUMMARY ========== */
        details {
            margin: 3mm 0;
            border: 0.5mm solid #e1e4e8;
            border-radius: 2mm;
            padding: 3mm;
        }

        summary {
            cursor: pointer;
            font-weight: bold;
            padding: 2mm;
            background-color: #f6f8fa;
            border-radius: 1mm;
            margin: -3mm -3mm 3mm -3mm;
        }

        summary:hover {
            background-color: #e1e4e8;
        }

        /* ========== PRINT STYLES ========== */
        @media print {
            body {
                font-size: 12pt;
                line-height: 1.4;
            }
            
            h1 { font-size: 18pt; }
            h2 { font-size: 16pt; }
            h3 { font-size: 14pt; }
            h4 { font-size: 12pt; }
            
            pre {
                page-break-inside: avoid;
            }
            
            h1, h2, h3, h4, h5, h6 {
                page-break-after: avoid;
            }
            
            blockquote, img, table {
                page-break-inside: avoid;
            }
            
            a {
                color: #000;
                text-decoration: none;
            }
            
            a[href]:after {
                content: " (" attr(href) ")";
                font-size: 8pt;
                color: #666;
            }
        }
`

export const templates = {
    "estimate": ESTIMATE_TEMPLATE,
    cssMs: CSS_MD,
    "cv-template": CV_TEMPLATE,
    invoice: INVOICE,
    "product-catalog": PRODUCT_CATALOG,
    newsletter: NEWSLETTER,
    receipt: RECEIPT,
    ticket: TICKET,
    css: CSS,
    // Add  templates here
}

export const predefinedSizes = {
    "A4": { width: 210, height: 297, printWidth: 190, printHeight: 277 },
    "80mm": { width: 80, height: 297, printWidth: 72, printHeight: 297 },
    "58mm": { width: 58, height: 297, printWidth: 48, printHeight: 297 },
}