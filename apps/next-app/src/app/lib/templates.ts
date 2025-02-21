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

body {
    font-family: "Roboto", serif;
    line-height: 1.6;
    margin: 0 auto;
    padding: 0;
}

h1 {
    color: #2c3e50;
    font-size: 24pt; /* Equivale a ~32px */
    margin-bottom: 10mm;
    border-bottom: 0.5mm solid #eee;
    padding-bottom: 5mm;
}

h2 {
    color: #34495e;
    font-size: 18pt;
    margin-top: 10mm;
    margin-bottom: 7mm;
}

h3 {
    color: #445566;
    font-size: 14pt;
    margin-top: 7mm;
}

p {
    margin-bottom: 5mm;
    color: #333;
    font-size: 12pt;
}

ul, ol {
    margin-bottom: 5mm;
    padding-left: 10mm;
}

li {
    margin-bottom: 2mm;
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
    padding: 3mm;
    text-align: left;
    font-size: 12pt;
}

th {
    background-color: #f5f5f5;
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

export const templates = {
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