export default function PrivacyPolicy() {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Privacy Policy</h1>
        <p>Last updated: {new Date().toLocaleDateString()}</p>
        <section>
          <h2 className="text-2xl font-semibold mb-4">1. Information We Collect</h2>
          <p>We collect information you provide directly to us when you use our services. This may include:</p>
          <ul className="list-disc list-inside pl-4 space-y-2 mt-2">
            <li>The content of the files you convert (temporarily, for processing purposes only)</li>
            <li>Usage data and analytics (e.g., types of conversions, frequency of use)</li>
            <li>Technical data (e.g., browser type, IP address)</li>
          </ul>
        </section>
        <section>
          <h2 className="text-2xl font-semibold mb-4">2. How We Use Your Information</h2>
          <p>We use the information we collect to:</p>
          <ul className="list-disc list-inside pl-4 space-y-2 mt-2">
            <li>Provide, maintain, and improve our services</li>
            <li>Analyze how you use our services to enhance user experience</li>
            <li>Detect and prevent fraud and abuse</li>
          </ul>
        </section>
        <section>
          <h2 className="text-2xl font-semibold mb-4">3. Data Security</h2>
          <p>
            We implement appropriate technical and organizational measures to protect the security of your personal
            information. These measures include:
          </p>
          <ul className="list-disc list-inside pl-4 space-y-2 mt-2">
            <li>Encryption of data in transit and at rest</li>
            <li>Regular security audits and penetration testing</li>
            <li>Strict access controls for our staff</li>
          </ul>
        </section>
        <section>
          <h2 className="text-2xl font-semibold mb-4">4. Data Retention</h2>
          <p>
            We retain your converted files only for the duration of the conversion process. Once the PDF is generated and
            downloaded, we immediately delete all associated data from our servers.
          </p>
        </section>
        <section>
          <h2 className="text-2xl font-semibold mb-4">5. Your Rights</h2>
          <p>Depending on your location, you may have certain rights regarding your personal data, including:</p>
          <ul className="list-disc list-inside pl-4 space-y-2 mt-2">
            <li>The right to access your data</li>
            <li>The right to rectify inaccurate data</li>
            <li>The right to erasure of your data</li>
            <li>The right to restrict processing of your data</li>
          </ul>
        </section>
        <section>
          <h2 className="text-2xl font-semibold mb-4">6. Changes to This Policy</h2>
          <p>
            We may update this privacy policy from time to time. We will notify you of any changes by posting the new
            privacy policy on this page and updating the Last updated date at the top of this policy.
          </p>
        </section>
        <section>
          <h2 className="text-2xl font-semibold mb-4">7. Contact Us</h2>
          <p>If you have any questions about this privacy policy, please contact us at privacy@mdhtml2pdf.com.</p>
        </section>
      </div>
    )
  }
  
  