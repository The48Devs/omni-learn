"use client";

import Link from "next/link";
import { ChevronLeft, Mail, MessageSquare, Phone, MapPin, Send, Clock } from "lucide-react";
import { useState } from "react";

const contactOptions = [
  {
    icon: MessageSquare,
    label: "Live Chat",
    desc: "Chat with support in real time.",
    detail: "Available 24/7",
    color: "bg-blue-100 text-blue-600",
  },
  {
    icon: Mail,
    label: "Email Support",
    desc: "We'll get back to you within 2 hours.",
    detail: "support@omnilearn.io",
    color: "bg-green-100 text-green-600",
  },
  {
    icon: Phone,
    label: "Phone",
    desc: "Talk to a human on our team.",
    detail: "+1 (800) 555-0199",
    color: "bg-purple-100 text-purple-600",
  },
];

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
    category: "general",
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
  }

  return (
    <div className="bg-white min-h-screen">
      {/* Hero */}
      <div className="bg-gray-900 text-white py-14 px-6">
        <div className="max-w-4xl mx-auto">
          <Link
            href="/"
            className="inline-flex items-center gap-1 text-gray-400 hover:text-white text-sm mb-8 transition-colors"
          >
            <ChevronLeft size={16} /> Back to Home
          </Link>
          <div className="flex items-center gap-4 mb-4">
            <div className="w-11 h-11 bg-orange-500 rounded-xl flex items-center justify-center">
              <Mail size={20} className="text-white" />
            </div>
            <h1 className="text-white" style={{ fontWeight: 700, fontSize: "2rem" }}>
              Contact Us
            </h1>
          </div>
          <p className="text-gray-300 text-sm mt-2 max-w-lg">
            Have a question or need help? Choose how you'd like to reach us, or fill out the form and we'll get back to you promptly.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-14">
        {/* Contact options */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-14">
          {contactOptions.map((opt) => (
            <div
              key={opt.label}
              className="bg-gray-50 border border-gray-100 rounded-2xl p-6 hover:border-orange-200 hover:bg-orange-50/20 transition-colors"
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${opt.color}`}>
                <opt.icon size={18} />
              </div>
              <div className="text-gray-900 text-sm mb-1" style={{ fontWeight: 600 }}>
                {opt.label}
              </div>
              <p className="text-gray-500 text-xs mb-2">{opt.desc}</p>
              <div className="text-orange-500 text-xs" style={{ fontWeight: 500 }}>
                {opt.detail}
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-10">
          {/* Form */}
          <div className="md:col-span-3">
            <h2 className="text-gray-900 mb-6" style={{ fontWeight: 700, fontSize: "1.2rem" }}>
              Send us a message
            </h2>

            {submitted ? (
              <div className="bg-green-50 border border-green-100 rounded-2xl p-10 text-center">
                <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Send size={22} className="text-green-600" />
                </div>
                <h3 className="text-gray-900 mb-2" style={{ fontWeight: 700 }}>Message Sent!</h3>
                <p className="text-gray-500 text-sm mb-5">
                  Thanks for reaching out. Our team will get back to you within 2 hours.
                </p>
                <button
                  onClick={() => { setSubmitted(false); setForm({ name: "", email: "", subject: "", message: "", category: "general" }); }}
                  className="text-sm text-orange-500 hover:underline"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 text-xs mb-1.5" style={{ fontWeight: 500 }}>
                      Your Name
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Jane Doe"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition-all placeholder-gray-400 text-gray-900"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 text-xs mb-1.5" style={{ fontWeight: 500 }}>
                      Email Address
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="jane@example.com"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition-all placeholder-gray-400 text-gray-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-700 text-xs mb-1.5" style={{ fontWeight: 500 }}>
                    Category
                  </label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition-all text-gray-900 bg-white"
                  >
                    <option value="general">General Inquiry</option>
                    <option value="billing">Billing & Payments</option>
                    <option value="courses">Courses & Content</option>
                    <option value="technical">Technical Issue</option>
                    <option value="partnership">Partnership</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-700 text-xs mb-1.5" style={{ fontWeight: 500 }}>
                    Subject
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="What's this about?"
                    value={form.subject}
                    onChange={(e) => setForm({ ...form, subject: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition-all placeholder-gray-400 text-gray-900"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 text-xs mb-1.5" style={{ fontWeight: 500 }}>
                    Message
                  </label>
                  <textarea
                    required
                    rows={5}
                    placeholder="Tell us more about your question or issue..."
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition-all placeholder-gray-400 text-gray-900 resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="flex items-center justify-center gap-2 bg-gray-900 text-white text-sm px-6 py-3 rounded-xl hover:bg-gray-800 transition-colors"
                >
                  <Send size={15} />
                  Send Message
                </button>
              </form>
            )}
          </div>

          {/* Info panel */}
          <div className="md:col-span-2 flex flex-col gap-5">
            <div className="bg-gray-50 border border-gray-100 rounded-2xl p-6">
              <h3 className="text-gray-900 text-sm mb-4" style={{ fontWeight: 600 }}>
                Office Hours
              </h3>
              <div className="flex flex-col gap-3">
                {[
                  { day: "Monday – Friday", hours: "9:00 AM – 8:00 PM PST" },
                  { day: "Saturday", hours: "10:00 AM – 6:00 PM PST" },
                  { day: "Sunday", hours: "Closed (chat support active)" },
                ].map((item) => (
                  <div key={item.day} className="flex justify-between items-center">
                    <span className="text-gray-600 text-xs">{item.day}</span>
                    <span className="text-gray-900 text-xs" style={{ fontWeight: 500 }}>{item.hours}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gray-50 border border-gray-100 rounded-2xl p-6">
              <h3 className="text-gray-900 text-sm mb-4" style={{ fontWeight: 600 }}>
                Office Address
              </h3>
              <div className="flex gap-3">
                <MapPin size={16} className="text-orange-500 flex-shrink-0 mt-0.5" />
                <address className="text-gray-500 text-xs leading-relaxed not-italic">
                  OmniLearn Systems<br />
                  123 Learning Lane, Suite 400<br />
                  San Francisco, CA 94105<br />
                  United States
                </address>
              </div>
            </div>

            <div className="bg-orange-50 border border-orange-100 rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-2">
                <Clock size={15} className="text-orange-500" />
                <span className="text-orange-700 text-sm" style={{ fontWeight: 600 }}>Typical Response Time</span>
              </div>
              <p className="text-orange-600 text-xs leading-relaxed">
                Our support team typically responds within <strong>2 hours</strong> during business hours. For urgent issues, use our live chat for the fastest response.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
