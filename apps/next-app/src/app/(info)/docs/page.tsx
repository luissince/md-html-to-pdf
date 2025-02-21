export default function Documentation() {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Documentation</h1>
        <section>
          <h2 className="text-2xl font-semibold mb-4">Getting Started</h2>
          <p>
            Welcome to the MD/HTML to PDF Converter documentation. This guide will help you understand how to use our tool
            effectively.
          </p>
        </section>
        <section>
          <h2 className="text-2xl font-semibold mb-4">Converting Markdown</h2>
          <p>To convert Markdown to PDF:</p>
          <ol className="list-decimal list-inside pl-4 space-y-2 mt-2">
            <li>Navigate to the MD to PDF conversion page</li>
            <li>Paste your Markdown content into the text area</li>
            <li>Adjust the paper size, margins, and background color as needed</li>
            <li>Click the Convert button</li>
            <li>Download your PDF</li>
          </ol>
        </section>
        <section>
          <h2 className="text-2xl font-semibold mb-4">Converting HTML</h2>
          <p>To convert HTML to PDF:</p>
          <ol className="list-decimal list-inside pl-4 space-y-2 mt-2">
            <li>Navigate to the HTML to PDF conversion page</li>
            <li>Paste your HTML content into the text area</li>
            <li>Adjust the paper size, margins, and background color as needed</li>
            <li>Click the Convert button</li>
            <li>Download your PDF</li>
          </ol>
        </section>
        <section>
          <h2 className="text-2xl font-semibold mb-4">Customizing Your PDF</h2>
          <p>Our tool offers several customization options:</p>
          <ul className="list-disc list-inside pl-4 space-y-2 mt-2">
            <li>Paper Size: Choose from predefined sizes (A4, 80mm, 58mm) or set a custom size</li>
            <li>Margins: Adjust top, right, bottom, and left margins independently</li>
            <li>Background Color: Set any color as the background for your PDF</li>
          </ul>
        </section>
        <section>
          <h2 className="text-2xl font-semibold mb-4">Tips for Best Results</h2>
          <ul className="list-disc list-inside pl-4 space-y-2 mt-2">
            <li>Ensure your Markdown or HTML is well-formatted</li>
            <li>Use the preview feature to check your layout before converting</li>
            <li>For thermal printer sizes (80mm, 58mm), keep your content simple and concise</li>
            <li>Test different margin settings to find the best fit for your content</li>
          </ul>
        </section>
      </div>
    )
  }
  
  