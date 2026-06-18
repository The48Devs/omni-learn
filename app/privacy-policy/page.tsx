"use client";

import Link from "next/link";
import { ChevronLeft, Shield } from "lucide-react";

const sections = [
  {
    title: "1. Information We Collect",
    content: `We collect information you provide directly to us, such as when you create an account, enroll in a course, or contact us for support. This includes:

• Personal identifiers: name, email address, username, and password.
• Profile information: bio, avatar, and learning preferences.
• Payment information: processed securely through our payment partners (we do not store full card numbers).
• Usage data: courses viewed, progress made, quiz results, and time spent on the platform.
• Device and log data: IP address, browser type, operating system, and pages visited.`,
  },
  {
    title: "2. How We Use Your Information",
    content: `OmniLearn uses the information we collect to:

• Provide, maintain, and improve our services.
• Personalize your learning experience and recommend relevant courses.
• Process transactions and send related information, including purchase confirmations.
• Send technical notices, updates, security alerts, and support messages.
• Respond to your comments and questions.
• Monitor and analyze trends, usage, and activities on the platform.
• Detect, investigate, and prevent fraudulent transactions and other illegal activities.`,
  },
  {
    title: "3. Information Sharing",
    content: `We do not sell, trade, or otherwise transfer your personally identifiable information to outside parties except as described below:

• Service providers: We share information with third-party vendors who assist us in operating our platform (e.g., hosting, analytics, payment processing).
• Legal requirements: We may disclose information if required by law or in response to valid requests by public authorities.
• Business transfers: In the event of a merger, acquisition, or sale of all or substantially all of our assets, your information may be transferred.
• Consent: We may share information in other ways with your prior consent.`,
  },
  {
    title: "4. Data Retention",
    content: `We retain your personal information for as long as your account is active or as needed to provide you with services. You may request deletion of your account and associated data at any time by contacting us at privacy@omnilearn.io. We will delete or anonymize your information within 30 days of a verified request, unless we are legally required to retain it.`,
  },
  {
    title: "5. Security",
    content: `We implement industry-standard security measures including TLS encryption for data in transit, AES-256 encryption for data at rest, regular security audits, and strict internal access controls. However, no method of transmission over the Internet or electronic storage is 100% secure. We encourage you to use a strong, unique password and to report any suspected security vulnerabilities to security@omnilearn.io.`,
  },
  {
    title: "6. Cookies and Tracking Technologies",
    content: `We use cookies and similar tracking technologies to collect and track information about your use of our platform. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, if you do not accept cookies, some portions of our services may not function properly. We use both session cookies (which expire when you close your browser) and persistent cookies (which remain on your device until deleted).`,
  },
  {
    title: "7. Your Rights",
    content: `Depending on your location, you may have the following rights regarding your personal data:

• Access: Request a copy of the personal data we hold about you.
• Rectification: Request correction of inaccurate data.
• Erasure: Request deletion of your personal data.
• Restriction: Request that we limit how we use your data.
• Portability: Request a machine-readable copy of your data.
• Objection: Object to certain types of processing.

To exercise any of these rights, contact us at privacy@omnilearn.io.`,
  },
  {
    title: "8. Children's Privacy",
    content: `OmniLearn is not directed to individuals under the age of 13. We do not knowingly collect personal information from children under 13. If you become aware that a child has provided us with personal information, please contact us and we will take steps to delete such information promptly.`,
  },
  {
    title: "9. Changes to This Policy",
    content: `We may update this Privacy Policy from time to time. We will notify you of any significant changes by posting the new policy on this page and updating the "Last Updated" date. We encourage you to review this policy periodically for any changes.`,
  },
  {
    title: "10. Contact Us",
    content: `If you have any questions about this Privacy Policy, please contact us at:\n\nOmniLearn Systems\nprivacy@omnilearn.io\n123 Learning Lane, Suite 400\nSan Francisco, CA 94105`,
  },
];

export default function PrivacyPolicy() {
  return (
    <div className="bg-white min-h-screen">
      {/* Hero */}
      <div className="bg-gray-900 text-white py-14 px-6">
        <div className="max-w-3xl mx-auto">
          <Link
            href="/"
            className="inline-flex items-center gap-1 text-gray-400 hover:text-white text-sm mb-8 transition-colors"
          >
            <ChevronLeft size={16} /> Back to Home
          </Link>
          <div className="flex items-center gap-4 mb-4">
            <div className="w-11 h-11 bg-indigo-500 rounded-xl flex items-center justify-center">
              <Shield size={20} className="text-white" />
            </div>
            <h1 className="text-white" style={{ fontWeight: 700, fontSize: "2rem" }}>
              Privacy Policy
            </h1>
          </div>
          <p className="text-gray-400 text-sm">Last Updated: June 1, 2026 &nbsp;·&nbsp; Effective: June 15, 2026</p>
          <p className="text-gray-300 text-sm mt-4 leading-relaxed max-w-xl">
            OmniLearn Systems (&ldquo;OmniLearn&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;, or &ldquo;our&rdquo;) is committed to protecting your privacy. This policy explains how we collect, use, and protect your information when you use our platform.
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-6 py-14">
        <div className="flex flex-col gap-10">
          {sections.map((section) => (
            <div key={section.title}>
              <h2 className="text-gray-900 mb-3" style={{ fontWeight: 700, fontSize: "1.1rem" }}>
                {section.title}
              </h2>
              <p className="text-gray-600 text-sm leading-loose whitespace-pre-line">
                {section.content}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-12 border-t border-gray-100 pt-8 text-center">
          <p className="text-gray-400 text-sm">
            Have a question about our Privacy Policy?{" "}
            <Link href="/contact" className="text-orange-500 hover:underline">Contact us</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
