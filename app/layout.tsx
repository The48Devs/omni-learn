import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import NavbarMain from "@/app/components/NavbarMain";
import { AccessibilityProvider } from "@/app/components/AccessibilityContext";
import AccessibilityToolbar from "@/app/components/AccessibilityToolbar";
import Footer from "./components/Footer";
import { AuthProvider } from "./components/AuthCOntext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "OmniLearn",
  description: "An interactive online learning platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[var(--bg-primary)] text-[var(--text-main)] transition-colors duration-200">
        <AccessibilityProvider>
          {/* Skip-to-Content Anchor */}
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[9999] focus:px-6 focus:py-3.5 focus:bg-[var(--focus-ring-color)] focus:text-white focus:font-extrabold focus:rounded-xl focus:shadow-2xl focus:outline-3 focus:outline-yellow-400 focus:outline-offset-2"
          >
            Skip to Main Content
          </a>
          <AuthProvider>
            <NavbarMain />
            <AccessibilityToolbar />
            {children}
          </AuthProvider>
        </AccessibilityProvider>
        <Footer />

      </body>
    </html>
  );
}
