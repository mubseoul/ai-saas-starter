import { pageMetadata } from "@/lib/seo";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export const metadata = pageMetadata.terms;

export default function TermsPage() {
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
            Terms of Service
          </h1>
          <p className="mb-8 text-muted-foreground">
            Last updated: {new Date().toLocaleDateString()}
          </p>

          <div className="prose prose-gray dark:prose-invert max-w-none">
            <h2>1. Acceptance of Terms</h2>
            <p>
              By accessing and using AI SaaS Starter (&quot;the Service&quot;), you accept and agree to be bound by the terms and provision of this agreement.
            </p>

            <h2>2. Use License</h2>
            <p>
              Permission is granted to temporarily use the Service for personal or commercial purposes. This is the grant of a license, not a transfer of title, and under this license you may not:
            </p>
            <ul>
              <li>Modify or copy the materials</li>
              <li>Use the materials for any commercial purpose without proper licensing</li>
              <li>Attempt to decompile or reverse engineer any software contained in the Service</li>
              <li>Remove any copyright or other proprietary notations from the materials</li>
              <li>Transfer the materials to another person or &quot;mirror&quot; the materials on any other server</li>
            </ul>

            <h2>3. User Accounts</h2>
            <p>
              When you create an account with us, you must provide information that is accurate, complete, and current at all times. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account.
            </p>
            <p>
              You are responsible for safeguarding the password that you use to access the Service and for any activities or actions under your password.
            </p>

            <h2>4. Subscriptions and Billing</h2>
            <p>
              Some parts of the Service are billed on a subscription basis. You will be billed in advance on a recurring and periodic basis. Billing cycles are set on a monthly basis.
            </p>
            <p>
              A valid payment method, including credit card, is required to process the payment for your subscription. You shall provide accurate and complete billing information.
            </p>

            <h2>5. Free Trial</h2>
            <p>
              We may offer a Free Trial for a limited period of time. You may be required to enter your billing information in order to sign up for the Free Trial. If you do enter your billing information when signing up for the Free Trial, you will not be charged until the Free Trial has expired.
            </p>

            <h2>6. Fee Changes</h2>
            <p>
              AI SaaS Starter, in its sole discretion and at any time, may modify the subscription fees. Any subscription fee change will become effective at the end of the then-current billing cycle.
            </p>

            <h2>7. Refunds</h2>
            <p>
              Except when required by law, paid subscription fees are non-refundable. Certain refund requests for subscriptions may be considered by AI SaaS Starter on a case-by-case basis.
            </p>

            <h2>8. Content</h2>
            <p>
              Our Service allows you to post, link, store, share and otherwise make available certain information, text, graphics, or other material. You are responsible for the content that you post to the Service.
            </p>
            <p>
              By posting content to the Service, you grant us the right and license to use, modify, publicly perform, publicly display, reproduce, and distribute such content on and through the Service.
            </p>

            <h2>9. Prohibited Uses</h2>
            <p>
              You may use the Service only for lawful purposes and in accordance with these Terms. You agree not to use the Service:
            </p>
            <ul>
              <li>In any way that violates any applicable national or international law or regulation</li>
              <li>To transmit, or procure the sending of, any advertising or promotional material without our prior written consent</li>
              <li>To impersonate or attempt to impersonate the Company, a Company employee, another user, or any other person or entity</li>
              <li>In any way that infringes upon the rights of others, or in any way is illegal, threatening, fraudulent, or harmful</li>
            </ul>

            <h2>10. AI-Generated Content</h2>
            <p>
              The Service uses third-party AI services (OpenAI, Anthropic) to generate content. We do not guarantee the accuracy, completeness, or reliability of AI-generated content. You are responsible for reviewing and validating all AI-generated content before use.
            </p>

            <h2>11. Intellectual Property</h2>
            <p>
              The Service and its original content (excluding content provided by users and AI-generated content), features, and functionality are and will remain the exclusive property of AI SaaS Starter and its licensors.
            </p>

            <h2>12. Termination</h2>
            <p>
              We may terminate or suspend your account immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms. Upon termination, your right to use the Service will immediately cease.
            </p>

            <h2>13. Limitation of Liability</h2>
            <p>
              In no event shall AI SaaS Starter, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses.
            </p>

            <h2>14. Disclaimer</h2>
            <p>
              Your use of the Service is at your sole risk. The Service is provided on an &quot;AS IS&quot; and &quot;AS AVAILABLE&quot; basis. The Service is provided without warranties of any kind, whether express or implied.
            </p>

            <h2>15. Governing Law</h2>
            <p>
              These Terms shall be governed and construed in accordance with the laws of your jurisdiction, without regard to its conflict of law provisions.
            </p>

            <h2>16. Changes to Terms</h2>
            <p>
              We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material, we will try to provide at least 30 days notice prior to any new terms taking effect.
            </p>

            <h2>17. Contact Us</h2>
            <p>
              If you have any questions about these Terms, please contact us at support@yourdomain.com.
            </p>
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
