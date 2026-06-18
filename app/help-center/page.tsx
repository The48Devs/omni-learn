"use client";

import Link from "next/link";
import { ChevronLeft, HelpCircle, BookOpen, CreditCard, Users, Settings, ChevronDown, ChevronUp, Search, FileText, ExternalLink } from "lucide-react";
import { useState } from "react";

const categories = [
  { icon: BookOpen, label: "Courses & Learning", color: "bg-blue-100 text-blue-600", count: 8 },
  { icon: CreditCard, label: "Billing & Payments", color: "bg-green-100 text-green-600", count: 7 },
  { icon: Users, label: "Account & Profile", color: "bg-purple-100 text-purple-600", count: 7 },
  { icon: Settings, label: "Technical Support", color: "bg-orange-100 text-orange-600", count: 6 },
];

const articles: Record<string, { title: string; content: string }[]> = {
  "Courses & Learning": [
    {
      title: "How to choose the right course",
      content: "Browse our catalog and use the search bar to filter by subject, level, or instructor. Each course page includes a syllabus, instructor bio, and student reviews. We recommend checking the prerequisites and estimated time commitment before enrolling. You can also preview the first module of most courses to get a feel for the teaching style.",
    },
    {
      title: "Course enrollment guide",
      content: "To enroll in a course, navigate to the course page and click 'Enroll Now'. If the course is free, it will be added to your Student Portal immediately. For paid courses, you'll be guided through our secure checkout. Once enrolled, you'll receive a confirmation email and the course will appear under 'My Courses' in your Student Portal.",
    },
    {
      title: "Understanding course levels",
      content: "Courses are categorized as Beginner, Intermediate, Advanced, or Masterclass. Beginner courses assume no prior knowledge. Intermediate courses require basic familiarity with the topic. Advanced courses are designed for learners with solid experience. Masterclasses are intensive, expert-led deep dives. Your skill level is assessed during onboarding to help us recommend the right starting point.",
    },
    {
      title: "How to track your progress",
      content: "Your Student Portal displays a progress bar for each enrolled course showing percentage completed. Module-level checkmarks indicate finished lessons. You can also view time spent, quiz scores, and certificates earned. The 'Continue Learning' button on your dashboard takes you directly to your next incomplete lesson.",
    },
    {
      title: "Certificate requirements",
      content: "Certificates are awarded when you complete all required modules and pass the final assessment with a score of 70% or higher. Some courses have additional requirements like submitting a project or participating in discussion forums. Certificates include a unique verification ID and are available for download as PDF from your Achievements page.",
    },
    {
      title: "Course completion checklist",
      content: "Before marking a course as complete: (1) Finish all video lessons and readings, (2) Pass all module quizzes with at least 60%, (3) Submit any required assignments or projects, (4) Pass the final assessment with 70% or higher, (5) Complete the course feedback survey. Once all items are checked, your certificate will be automatically generated.",
    },
    {
      title: "Downloading course resources",
      content: "Many courses include downloadable resources such as PDFs, code samples, templates, and worksheets. These are available on the Resources tab of each course page. On mobile, resources are downloaded to the app's internal storage. We recommend downloading resources while connected to Wi-Fi to avoid data charges.",
    },
    {
      title: "Interacting with instructors",
      content: "Each course has a Q&A section where you can post questions directly to the instructor. You can also participate in live office hours scheduled weekly (check the course calendar). Instructors typically respond within 24 hours. For urgent issues, use the 'Report a Problem' link on the course page to escalate to our support team.",
    },
  ],
  "Billing & Payments": [
    {
      title: "Payment methods accepted",
      content: "We accept Visa, Mastercard, American Express, Discover, and PayPal. In select regions, we also support Apple Pay, Google Pay, and local payment methods like iDEAL (Netherlands) and Alipay (China). All payments are processed securely through our PCI-compliant payment partners. We do not store full credit card numbers on our servers.",
    },
    {
      title: "Understanding your invoice",
      content: "Invoices are generated for every purchase and available in your Account Settings under 'Payment History'. Each invoice includes the course name, transaction ID, amount charged, payment method, and date. You can download invoices as PDF for your records. If you notice a discrepancy, contact billing@omnilearn.io within 30 days.",
    },
    {
      title: "How to update billing information",
      content: "Go to Account Settings > Payment Methods to add, remove, or update your payment methods. You can set a default payment method for future purchases. Changes to billing information do not affect existing subscriptions until the next billing cycle. For security, you'll be asked to re-enter your CVV when adding a new card.",
    },
    {
      title: "Refund request process",
      content: "We offer a 30-day satisfaction guarantee. To request a refund: (1) Go to Account Settings > Purchases, (2) Find the course you want refunded, (3) Click 'Request Refund', (4) Select a reason and submit. Refunds are processed within 5-10 business days and returned to the original payment method. You must have completed less than 30% of the course content to qualify.",
    },
    {
      title: "Subscription plans explained",
      content: "OmniLearn offers three subscription tiers: Basic (free, limited access), Pro ($29/month, full access to all courses), and Enterprise (custom pricing for teams). Pro subscribers also get priority support, offline access, and exclusive masterclasses. You can upgrade, downgrade, or cancel your subscription at any time from Account Settings.",
    },
    {
      title: "Applying promo codes and discounts",
      content: "Promo codes can be applied at checkout in the 'Have a promo code?' field. Codes are case-sensitive and must be entered exactly as provided. Only one promo code can be applied per purchase. Discounts from referral programs and student verification programs stack with promo codes. Expired or invalid codes will show an error message.",
    },
    {
      title: "Corporate and team billing",
      content: "Enterprise plans offer consolidated billing for teams of 10 or more. Features include centralized account management, usage analytics, dedicated support, and custom content integration. Contact sales@omnilearn.io for a personalized quote. We offer volume discounts and flexible payment terms for annual commitments.",
    },
  ],
  "Account & Profile": [
    {
      title: "Creating your account",
      content: "Click 'Sign Up' on the homepage and enter your name, email address, and a strong password. You can also sign up using Google or Apple SSO for faster access. Verify your email address by clicking the link sent to your inbox. Once verified, complete your profile by adding a profile picture, bio, and learning preferences to help us personalize your experience.",
    },
    {
      title: "Editing your profile",
      content: "Navigate to your profile by clicking your avatar in the top-right corner and selecting 'Profile'. Here you can update your name, bio, profile photo, timezone, and learning goals. Changes are saved automatically. Your profile is visible to instructors and peers in community forums. You can adjust visibility settings in Privacy Settings.",
    },
    {
      title: "Changing your password",
      content: "Go to Account Settings > Security > Change Password. Enter your current password, then your new password twice. Passwords must be at least 8 characters and include a number and a special character. You'll receive a confirmation email when your password is changed. If you forgot your password, use the 'Forgot Password' link on the sign-in page.",
    },
    {
      title: "Account security tips",
      content: "Use a unique, strong password for your OmniLearn account — never reuse passwords from other sites. Enable two-factor authentication (2FA) in Security Settings for an extra layer of protection. Be cautious of phishing emails pretending to be from OmniLearn. We will never ask for your password via email. Report suspicious activity to security@omnilearn.io immediately.",
    },
    {
      title: "Profile privacy settings",
      content: "Control who can see your profile, learning activity, and achievements in Privacy Settings. Options include: Public (visible to everyone), Community (visible to logged-in users), and Private (visible only to you). Your name and email are never shared publicly. You can also opt out of personalized recommendations based on your activity.",
    },
    {
      title: "Deleting your account",
      content: "To delete your account, go to Account Settings > Account > Delete Account. This action is irreversible. Your profile, course progress, and certificates will be permanently removed within 30 days. If you have active subscriptions, cancel them first to avoid future charges. Download any certificates you want to keep before initiating deletion.",
    },
    {
      title: "Managing email notifications",
      content: "Control which emails you receive in Account Settings > Notifications. Options include: course recommendations, progress reminders, weekly digest, forum activity, promotional offers, and certificate achievements. You can also unsubscribe from marketing emails using the link at the bottom of any promotional email. Transactional emails (receipts, password resets) cannot be disabled.",
    },
  ],
  "Technical Support": [
    {
      title: "Browser and system requirements",
      content: "OmniLearn works best on the latest versions of Chrome, Firefox, Safari, and Edge. You need a stable internet connection of at least 5 Mbps for video playback. JavaScript must be enabled. For interactive labs and simulations, we recommend at least 8GB of RAM and a modern multi-core processor. Mobile apps require iOS 15+ or Android 11+.",
    },
    {
      title: "Troubleshooting video playback",
      content: "If videos are buffering or not playing: (1) Check your internet connection speed, (2) Try lowering the video quality to 480p, (3) Clear your browser cache and cookies, (4) Disable browser extensions that block content, (5) Try a different browser or device. If issues persist, our support team can provide alternative video format links.",
    },
    {
      title: "Mobile app troubleshooting",
      content: "If the mobile app crashes or behaves unexpectedly: (1) Ensure you have the latest version from the App Store or Google Play, (2) Restart the app completely, (3) Clear the app cache in Settings, (4) Reinstall the app if problems persist. Progress is synced to your account, so reinstalling will not lose your data.",
    },
    {
      title: "Connectivity and loading issues",
      content: "Slow loading or timeout errors are often caused by network issues. Try switching from Wi-Fi to mobile data or vice versa. If using a VPN or corporate network, try disabling it temporarily. Our servers are optimized for global access with CDN edge locations worldwide. Check our status page at status.omnilearn.io for any ongoing outages.",
    },
    {
      title: "Quiz and assessment technical issues",
      content: "If a quiz fails to submit or scores incorrectly: (1) Do not refresh the page — your answers are autosaved every 30 seconds, (2) Try submitting again after waiting 1 minute, (3) Check that all questions have been answered (unanswered questions are highlighted), (4) Contact support with your course name and quiz module number for manual grade adjustment.",
    },
    {
      title: "Report a technical bug",
      content: "Found a bug? Help us fix it by reporting it through the 'Report a Problem' link in the footer or by emailing bugs@omnilearn.io. Include: (1) A clear description of the issue, (2) Steps to reproduce it, (3) Your browser and operating system versions, (4) A screenshot or screen recording if possible. We aim to acknowledge bug reports within 24 hours.",
    },
  ],
};

const faqs = [
  {
    question: "How do I enroll in a course?",
    answer:
      "To enroll in a course, browse our catalog and click on the course you're interested in. Click the 'Enroll Now' button on the course page. If the course requires payment, you'll be taken to our checkout. Once enrolled, the course will appear in your Student Portal under 'My Courses'.",
  },
  {
    question: "Can I access course content offline?",
    answer:
      "Currently, OmniLearn does not support offline access to course content. All videos and interactive modules require an active internet connection. We're actively working on offline support for our mobile app, expected to launch in Q3 2026.",
  },
  {
    question: "How does the Arena Leaderboard work?",
    answer:
      "The Arena Leaderboard ranks learners based on their accumulated XP points. You earn XP by completing course modules, passing quizzes, winning daily tournaments, and helping other learners in community forums. Rankings reset at the start of each Season (every 90 days), though your lifetime stats are preserved.",
  },
  {
    question: "What is the refund policy?",
    answer:
      "OmniLearn offers a 30-day satisfaction guarantee. If you've completed less than 30% of a course, you can request a full refund within 30 days of purchase. To initiate a refund, go to your Account Settings \u2192 Purchases, or contact billing@omnilearn.io. Refunds are processed within 5\u201310 business days.",
  },
  {
    question: "How do I reset my password?",
    answer:
      "On the Sign In page, click 'Forgot password?' and enter your registered email address. You'll receive a password reset link within a few minutes. Check your spam folder if you don't see it. The reset link expires after 1 hour for security purposes.",
  },
  {
    question: "Can I share my account with others?",
    answer:
      "No. OmniLearn accounts are for individual use only. Sharing your account credentials violates our Terms of Service and may result in account suspension. We offer team and corporate plans for organizations who need multi-seat access \u2014 contact sales@omnilearn.io for pricing.",
  },
  {
    question: "How do I get a certificate after completing a course?",
    answer:
      "Certificates are automatically generated when you complete all required modules and pass the final assessment with a score of 70% or higher. You can download and share your certificate from your profile under 'Achievements'. Certificates include a unique verification ID that employers can use to confirm authenticity.",
  },
  {
    question: "Is there a mobile app?",
    answer:
      "Yes! OmniLearn is available on iOS (App Store) and Android (Google Play). The mobile app supports all course content, progress sync, community features, and leaderboard access. Offline video downloads are coming in the next major app update.",
  },
];

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-gray-100 last:border-b-0 py-4">
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-gray-900 text-sm" style={{ fontWeight: 500 }}>{question}</h3>
        <button
          onClick={() => setOpen(!open)}
          className="flex-shrink-0 mt-0.5 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
          aria-label={open ? "Collapse answer" : "Expand answer"}
        >
          {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>
      </div>
      {open && (
        <p className="text-gray-500 text-sm leading-relaxed mt-2">{answer}</p>
      )}
    </div>
  );
}

function CategorySection({ category }: { category: typeof categories[number] }) {
  const [open, setOpen] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState<string | null>(null);
  const catArticles = articles[category.label] || [];

  return (
    <div className="bg-gray-50 border border-gray-100 rounded-2xl overflow-hidden">
      <button
        onClick={() => { setOpen(!open); setSelectedArticle(null); }}
        className="w-full p-5 text-left hover:bg-orange-50/30 transition-colors flex items-start justify-between gap-3"
      >
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${category.color}`}>
            <category.icon size={18} />
          </div>
          <div>
            <div className="text-gray-900 text-sm" style={{ fontWeight: 500 }}>{category.label}</div>
            <div className="text-gray-400 text-xs">{catArticles.length} articles</div>
          </div>
        </div>
        {open ? <ChevronUp size={18} className="text-gray-400 flex-shrink-0 mt-1" /> : <ChevronDown size={18} className="text-gray-400 flex-shrink-0 mt-1" />}
      </button>

      {open && (
        <div className="border-t border-gray-100">
          {catArticles.map((article) => (
            <div key={article.title}>
              <button
                onClick={() => setSelectedArticle(selectedArticle === article.title ? null : article.title)}
                className="w-full flex items-center justify-between gap-3 px-5 py-3 text-left hover:bg-orange-50/20 transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <FileText size={14} className="text-gray-400 flex-shrink-0" />
                  <span className="text-gray-700 text-sm">{article.title}</span>
                </div>
                {selectedArticle === article.title ? <ChevronUp size={14} className="text-gray-400 flex-shrink-0" /> : <ChevronDown size={14} className="text-gray-400 flex-shrink-0" />}
              </button>
              {selectedArticle === article.title && (
                <div className="px-5 pb-4 pt-1">
                  <p className="text-gray-500 text-sm leading-relaxed">{article.content}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function HelpCenter() {
  const [search, setSearch] = useState("");

  const filtered = faqs.filter(
    (f) =>
      f.question.toLowerCase().includes(search.toLowerCase()) ||
      f.answer.toLowerCase().includes(search.toLowerCase())
  );

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
            <div className="w-11 h-11 bg-green-500 rounded-xl flex items-center justify-center">
              <HelpCircle size={20} className="text-white" />
            </div>
            <h1 className="text-white" style={{ fontWeight: 700, fontSize: "2rem" }}>
              Help Center
            </h1>
          </div>
          <p className="text-gray-300 text-sm mt-2 mb-8 max-w-lg">
            Find answers to common questions, browse guides, or reach out to our support team.
          </p>

          {/* Search */}
          <div className="relative max-w-lg">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search for help..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white text-gray-900 text-sm pl-10 pr-4 py-3 rounded-xl border-0 outline-none focus:ring-2 focus:ring-orange-400 placeholder-gray-400"
            />
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="max-w-3xl mx-auto px-6 py-10">
        <h2 className="text-gray-900 mb-5" style={{ fontWeight: 700, fontSize: "1.1rem" }}>
          Browse by Category
        </h2>
        <div className="flex flex-col gap-3 mb-12">
          {categories.map((cat) => (
            <CategorySection key={cat.label} category={cat} />
          ))}
        </div>

        {/* FAQ */}
        <h2 className="text-gray-900 mb-5" style={{ fontWeight: 700, fontSize: "1.1rem" }}>
          Frequently Asked Questions
        </h2>
        <div className="bg-gray-50 rounded-2xl px-6 border border-gray-100">
          {filtered.length > 0 ? (
            filtered.map((faq) => (
              <FAQItem key={faq.question} question={faq.question} answer={faq.answer} />
            ))
          ) : (
            <p className="text-gray-400 text-sm py-8 text-center">
              No results for &ldquo;{search}&rdquo;. Try a different search term.
            </p>
          )}
        </div>

        {/* Contact CTA */}
        <div className="mt-10 bg-indigo-600 rounded-2xl p-8 text-center text-white">
          <h3 className="text-white mb-2" style={{ fontWeight: 700, fontSize: "1.2rem" }}>
            Still need help?
          </h3>
          <p className="text-indigo-200 text-sm mb-5">
            Our support team is available 24/7 and typically responds within 2 hours.
          </p>
          <Link
            href="/contact"
            className="inline-block bg-white text-indigo-600 text-sm px-7 py-3 rounded-full hover:bg-indigo-50 transition-colors"
            style={{ fontWeight: 600 }}
          >
            Contact Support
          </Link>
        </div>
      </div>
    </div>
  );
}
