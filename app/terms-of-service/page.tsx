"use client";

import Link from "next/link";
import { ChevronLeft, FileText } from "lucide-react";

const sections = [
  {
    title: "1. Acceptance of Terms",
    content: `By accessing or using OmniLearn's platform, website, or any associated services (collectively, the "Service"), you agree to be bound by these Terms of Service ("Terms"). If you do not agree to all of these Terms, you may not use the Service. These Terms apply to all visitors, users, and others who access or use the Service.`,
  },
  {
    title: "2. Accounts and Registration",
    content: `To access certain features of the Service, you must register for an account. When you register, you agree to:

• Provide accurate, current, and complete information.
• Maintain and promptly update your account information.
• Keep your password confidential and not share it with any third party.
• Notify us immediately at support@omnilearn.io of any unauthorized use of your account.
• Accept responsibility for all activities that occur under your account.

You must be at least 13 years old to create an account. By creating an account, you confirm you meet this age requirement.`,
  },
  {
    title: "3. Intellectual Property",
    content: `The Service and its entire contents, features, and functionality — including but not limited to all information, software, text, displays, images, video, and audio — are owned by OmniLearn Systems, its licensors, or other providers and are protected by copyright, trademark, patent, trade secret, and other intellectual property laws.

You are granted a limited, non-exclusive, non-transferable license to access and use the Service for personal, non-commercial educational purposes. You may not reproduce, distribute, modify, create derivative works of, publicly display, publicly perform, republish, download, or transmit any material on our Service without prior written consent.`,
  },
  {
    title: "4. Course Enrollment and Access",
    content: `Upon enrollment in a course, you receive a limited, personal, non-transferable right to access the course content for the duration specified at purchase (lifetime access where applicable). OmniLearn reserves the right to update course content, retire courses with reasonable notice, and substitute substantially similar content if a course becomes unavailable.`,
  },
  {
    title: "5. Payment and Refund Policy",
    content: `Prices for courses are subject to change without notice. All purchases are final. We offer a 30-day satisfaction guarantee for course purchases: if you have completed less than 30% of the course content, you may request a full refund within 30 days of purchase by contacting billing@omnilearn.io. Refunds for subscription plans are prorated based on the remaining subscription period.`,
  },
  {
    title: "6. User Conduct",
    content: `You agree not to use the Service to:

• Violate any applicable local, national, or international law or regulation.
• Transmit any unsolicited or unauthorized advertising or promotional material.
• Impersonate or attempt to impersonate OmniLearn, an OmniLearn employee, another user, or any other person or entity.
• Engage in any conduct that restricts or inhibits anyone's use or enjoyment of the Service.
• Upload or transmit viruses or any other malicious code.
• Harvest or collect email addresses or other contact information of other users.
• Use the Service for any commercial solicitation purposes without our written consent.`,
  },
  {
    title: "7. Termination",
    content: `We may terminate or suspend your account and access to the Service immediately, without prior notice or liability, for any reason whatsoever, including if you breach these Terms. Upon termination, your right to use the Service will immediately cease. All provisions of these Terms which by their nature should survive termination shall survive, including ownership provisions, warranty disclaimers, indemnity, and limitations of liability.`,
  },
  {
    title: "8. Disclaimer of Warranties",
    content: `The Service is provided "as is" and "as available" without any warranties of any kind, either express or implied, including but not limited to implied warranties of merchantability, fitness for a particular purpose, or non-infringement. OmniLearn does not warrant that the Service will be uninterrupted, error-free, or free of viruses or other harmful components.`,
  },
  {
    title: "9. Limitation of Liability",
    content: `To the fullest extent permitted by applicable law, OmniLearn Systems shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of (or inability to access or use) the Service.`,
  },
  {
    title: "10. Governing Law",
    content: `These Terms shall be governed and construed in accordance with the laws of the State of California, United States, without regard to its conflict of law provisions. Any disputes arising from these Terms or the Service shall be subject to the exclusive jurisdiction of the courts located in San Francisco County, California.`,
  },
  {
    title: "11. Changes to Terms",
    content: `We reserve the right to modify these Terms at any time. We will provide notice of significant changes by posting the revised Terms on this page and updating the "Last Updated" date. Your continued use of the Service after any such changes constitutes your acceptance of the new Terms.`,
  },
];

export default function TermsOfService() {
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
            <div className="w-11 h-11 bg-blue-500 rounded-xl flex items-center justify-center">
              <FileText size={20} className="text-white" />
            </div>
            <h1 className="text-white" style={{ fontWeight: 700, fontSize: "2rem" }}>
              Terms of Service
            </h1>
          </div>
          <p className="text-gray-400 text-sm">Last Updated: June 1, 2026 &nbsp;·&nbsp; Effective: June 15, 2026</p>
          <p className="text-gray-300 text-sm mt-4 leading-relaxed max-w-xl">
            Please read these Terms of Service carefully before using OmniLearn. By accessing the platform, you agree to be bound by these terms.
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-6 py-14">
        {/* Quick nav */}
        <div className="bg-gray-50 rounded-2xl p-6 mb-10 border border-gray-100">
          <h3 className="text-gray-700 text-sm mb-3" style={{ fontWeight: 600 }}>Table of Contents</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
            {sections.map((s) => (
              <a
                key={s.title}
                href={`#${s.title.replace(/\s+/g, "-").toLowerCase()}`}
                className="text-blue-500 text-sm hover:text-blue-700 hover:underline"
              >
                {s.title}
              </a>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-10">
          {sections.map((section) => (
            <div key={section.title} id={section.title.replace(/\s+/g, "-").toLowerCase()}>
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
            Questions about our Terms?{" "}
            <Link href="/contact" className="text-orange-500 hover:underline">Get in touch</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
