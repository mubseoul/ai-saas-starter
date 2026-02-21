import { pageMetadata } from "@/lib/seo";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export const metadata = pageMetadata.privacy;

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4">
          <Button asChild variant="ghost" size="sm">
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Link>
          </Button>
        </div>
      </header>

      {/* Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="mx-auto max-w-3xl">
          <h1 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
            Privacy Policy
          </h1>
          <p className="mb-8 text-muted-foreground">
            Last updated: {new Date().toLocaleDateString()}
          </p>

          <div className="prose prose-gray dark:prose-invert max-w-none">
            <h2>1. Introduction</h2>
            <p>
              AI SaaS Starter (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;) is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our Service.
            </p>

            <h2>2. Information We Collect</h2>

            <h3>2.1 Personal Information</h3>
            <p>
              We collect information that you provide directly to us when you:
            </p>
            <ul>
              <li>Create an account (name, email address, password)</li>
              <li>Subscribe to our service (billing information via Stripe)</li>
              <li>Contact us for support</li>
              <li>Use our AI generation features (prompts and generated content)</li>
            </ul>

            <h3>2.2 Automatically Collected Information</h3>
            <p>
              When you use our Service, we automatically collect certain information, including:
            </p>
            <ul>
              <li>Log data (IP address, browser type, pages visited, time spent)</li>
              <li>Device information (device type, operating system)</li>
              <li>Usage data (features used, actions taken)</li>
              <li>Cookies and similar tracking technologies</li>
            </ul>

            <h3>2.3 Third-Party Information</h3>
            <p>
              If you choose to sign in using Google OAuth, we receive your name, email address, and profile picture from Google.
            </p>

            <h2>3. How We Use Your Information</h2>
            <p>
              We use the information we collect to:
            </p>
            <ul>
              <li>Provide, maintain, and improve our Service</li>
              <li>Process transactions and send related information</li>
              <li>Send you technical notices, updates, and support messages</li>
              <li>Respond to your comments and questions</li>
              <li>Monitor and analyze trends, usage, and activities</li>
              <li>Detect, prevent, and address technical issues and security vulnerabilities</li>
              <li>Personalize your experience</li>
            </ul>

            <h2>4. Information Sharing and Disclosure</h2>

            <h3>4.1 Third-Party Service Providers</h3>
            <p>
              We share your information with third-party service providers who perform services on our behalf:
            </p>
            <ul>
              <li><strong>Stripe</strong> - Payment processing</li>
              <li><strong>OpenAI & Anthropic</strong> - AI content generation (prompts only)</li>
              <li><strong>Vercel</strong> - Hosting and analytics</li>
              <li><strong>Resend</strong> - Email delivery</li>
            </ul>

            <h3>4.2 Legal Requirements</h3>
            <p>
              We may disclose your information if required to do so by law or in response to valid requests by public authorities.
            </p>

            <h3>4.3 Business Transfers</h3>
            <p>
              If we are involved in a merger, acquisition, or sale of assets, your information may be transferred as part of that transaction.
            </p>

            <h2>5. Data Retention</h2>
            <p>
              We retain your personal information for as long as necessary to provide you with our Service and as described in this Privacy Policy. We also retain and use your information to comply with our legal obligations, resolve disputes, and enforce our agreements.
            </p>
            <p>
              You can delete your account at any time from your account settings, which will delete all your personal data.
            </p>

            <h2>6. Data Security</h2>
            <p>
              We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. These measures include:
            </p>
            <ul>
              <li>Encryption of data in transit and at rest</li>
              <li>Password hashing using bcrypt</li>
              <li>Regular security assessments</li>
              <li>Limited access to personal information</li>
              <li>Secure hosting infrastructure</li>
            </ul>
            <p>
              However, no method of transmission over the Internet or electronic storage is 100% secure. While we strive to protect your information, we cannot guarantee absolute security.
            </p>

            <h2>7. Your Rights</h2>
            <p>
              Depending on your location, you may have the following rights:
            </p>
            <ul>
              <li><strong>Access</strong> - Request access to your personal information</li>
              <li><strong>Rectification</strong> - Request correction of inaccurate information</li>
              <li><strong>Erasure</strong> - Request deletion of your personal information</li>
              <li><strong>Portability</strong> - Request transfer of your information</li>
              <li><strong>Objection</strong> - Object to processing of your information</li>
              <li><strong>Restriction</strong> - Request restriction of processing</li>
            </ul>
            <p>
              To exercise these rights, please contact us at privacy@yourdomain.com.
            </p>

            <h2>8. Cookies and Tracking</h2>
            <p>
              We use cookies and similar tracking technologies to track activity on our Service and hold certain information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.
            </p>
            <p>
              We use the following types of cookies:
            </p>
            <ul>
              <li><strong>Essential cookies</strong> - Required for the Service to function</li>
              <li><strong>Authentication cookies</strong> - Keep you logged in</li>
              <li><strong>Analytics cookies</strong> - Help us understand how you use our Service</li>
              <li><strong>Preference cookies</strong> - Remember your settings (e.g., dark mode)</li>
            </ul>

            <h2>9. Third-Party Links</h2>
            <p>
              Our Service may contain links to third-party websites. We are not responsible for the privacy practices of these websites. We encourage you to read their privacy policies.
            </p>

            <h2>10. Children&apos;s Privacy</h2>
            <p>
              Our Service is not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13. If you are a parent or guardian and believe your child has provided us with personal information, please contact us.
            </p>

            <h2>11. International Data Transfers</h2>
            <p>
              Your information may be transferred to and processed in countries other than your own. These countries may have data protection laws that are different from your country. We take appropriate measures to ensure your information remains protected.
            </p>

            <h2>12. GDPR Compliance (EU Users)</h2>
            <p>
              If you are in the European Economic Area (EEA), we process your personal data based on the following legal grounds:
            </p>
            <ul>
              <li>Your consent</li>
              <li>Performance of a contract with you</li>
              <li>Compliance with legal obligations</li>
              <li>Our legitimate business interests</li>
            </ul>

            <h2>13. CCPA Compliance (California Users)</h2>
            <p>
              If you are a California resident, you have specific rights regarding your personal information under the California Consumer Privacy Act (CCPA). Please contact us to exercise these rights.
            </p>

            <h2>14. Changes to This Privacy Policy</h2>
            <p>
              We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the &quot;Last updated&quot; date.
            </p>
            <p>
              We encourage you to review this Privacy Policy periodically for any changes.
            </p>

            <h2>15. Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy, please contact us:
            </p>
            <ul>
              <li>By email: privacy@yourdomain.com</li>
              <li>By visiting our website contact page</li>
            </ul>
          </div>

          <div className="mt-12 border-t pt-8">
            <Button asChild>
              <Link href="/">Return to Home</Link>
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
