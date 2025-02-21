export default function FAQ() {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Frequently Asked Questions</h1>
        <section>
          <h2 className="text-xl font-semibold mb-2">What file formats can I convert to PDF?</h2>
          <p>Our tool currently supports converting Markdown (.md) and HTML files to PDF.</p>
        </section>
        <section>
          <h2 className="text-xl font-semibold mb-2">Is there a file size limit?</h2>
          <p>
            Yes, the maximum file size for conversion is 10MB. This limit helps ensure fast processing times for all
            users.
          </p>
        </section>
        <section>
          <h2 className="text-xl font-semibold mb-2">Can I use custom fonts in my PDF?</h2>
          <p>
            Currently, we support a range of standard fonts. Custom font support is planned for a future update. For now,
            we recommend using web-safe fonts in your HTML to ensure consistent rendering.
          </p>
        </section>
        <section>
          <h2 className="text-xl font-semibold mb-2">Is my data secure?</h2>
          <p>
            Yes, we take data security seriously. We do not store any of your uploaded content. All conversions are
            processed in real-time and then immediately deleted from our servers.
          </p>
        </section>
        <section>
          <h2 className="text-xl font-semibold mb-2">Can I convert multiple files at once?</h2>
          <p>
            Currently, our tool processes one file at a time. Batch conversion is on our roadmap for future development.
          </p>
        </section>
        <section>
          <h2 className="text-xl font-semibold mb-2">How accurate is the preview compared to the final PDF?</h2>
          <p>
            Our preview is designed to be as accurate as possible. However, slight variations may occur due to differences
            in how browsers render content compared to PDF generators. We recommend always reviewing your final PDF.
          </p>
        </section>
        <section>
          <h2 className="text-xl font-semibold mb-2">Can I password-protect my PDF?</h2>
          <p>
            This feature is not currently available, but it is on our list of potential future enhancements. Stay tuned for
            updates!
          </p>
        </section>
      </div>
    )
  }
  
  