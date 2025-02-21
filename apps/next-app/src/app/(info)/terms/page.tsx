export default function TermsOfService() {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Terms of Service</h1>
        <p>Last updated: {new Date().toLocaleDateString()}</p>
        <section>
          <h2 className="text-2xl font-semibold mb-4">1. Acceptance of Terms</h2>
          <p>
            By accessing or using our MD/HTML to PDF Converter service, you agree to be bound by these Terms of Service.
            If you disagree with any part of the terms, you may not access the service.
          </p>
        </section>
        <section>
          <h2 className="text-2xl font-semibold mb-4">2. Description of Service</h2>
          <p>
            Our service provides conversion of Markdown and HTML files to PDF format. We reserve the right to modify or
            discontinue the service at any time without notice.
          </p>
        </section>
        <section>
          <h2 className="text-2xl font-semibold mb-4">3. User Responsibilities</h2>
          <p>
            You are responsible for the content you submit for conversion. You agree not to use our service for any
            unlawful purposes or to convert any content that:
          </p>
          <ul className="list-disc list-inside pl-4 space-y-2 mt-2">
            <li>Infringes on any intellectual property rights</li>
            <li>Is defamatory, abusive, or otherwise objectionable</li>
            <li>Contains malware or any form of malicious code</li>
            <li>Violates any applicable laws or regulations</li>
          </ul>
        </section>
        <section>
          <h2 className="text-2xl font-semibold mb-4">4. Intellectual Property</h2>
          <p>
            The service and its original content, features, and functionality are owned by MD/HTML to PDF Converter and
            are protected by international copyright, trademark, patent, trade secret, and other intellectual property or
            proprietary rights laws.
          </p>
        </section>
        <section>
          <h2 className="text-2xl font-semibold mb-4">5. Limitation of Liability</h2>
          <p>
            In no event shall MD/HTML to PDF Converter, nor its directors, employees, partners, agents, suppliers, or
            affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including
            without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from:
          </p>
          <ul className="list-disc list-inside pl-4 space-y-2 mt-2">
            <li>Your access to or use of or inability to access or use the service</li>
            <li>Any conduct or content of any third party on the service</li>
            <li>Any content obtained from the service</li>
            <li>Unauthorized access, use or alteration of your transmissions or content</li>
          </ul>
        </section>
        <section>
          <h2 className="text-2xl font-semibold mb-4">6. Governing Law</h2>
          <p>
            These Terms shall be governed and construed in accordance with the laws of [Your Country/State], without
            regard to its conflict of law provisions.
          </p>
        </section>
        <section>
          <h2 className="text-2xl font-semibold mb-4">7. Changes to Terms</h2>
          <p>
            We reserve the right, at our sole discretion, to modify or replace these Terms at any time. We will provide
            notice of any significant changes by posting the new Terms on this page.
          </p>
        </section>
        <section>
          <h2 className="text-2xl font-semibold mb-4">8. Contact Us</h2>
          <p>If you have any questions about these Terms, please contact us at terms@mdhtml2pdf.com.</p>
        </section>
      </div>
    )
  }
  
  