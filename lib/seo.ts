import { Metadata } from "next";

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  noIndex?: boolean;
  keywords?: string[];
}

const siteConfig = {
  name: "AI SaaS Starter",
  description:
    "Production-ready Next.js 14 SaaS starter kit with AI integration, authentication, and subscription management",
  url: process.env.NEXTAUTH_URL || "https://your-domain.com",
  ogImage: "/og-image.png",
  keywords: [
    "AI SaaS",
    "Next.js 14",
    "SaaS starter kit",
    "OpenAI",
    "Claude AI",
    "Stripe",
    "TypeScript",
    "Authentication",
    "Subscription management",
  ],
};

export function generateSEO({
  title,
  description,
  image,
  url,
  noIndex = false,
  keywords,
}: SEOProps = {}): Metadata {
  const seoTitle = title
    ? `${title} | ${siteConfig.name}`
    : siteConfig.name;
  const seoDescription = description || siteConfig.description;
  const seoImage = image || siteConfig.ogImage;
  const seoUrl = url || siteConfig.url;
  const seoKeywords = keywords || siteConfig.keywords;

  return {
    title: seoTitle,
    description: seoDescription,
    keywords: seoKeywords,
    authors: [{ name: siteConfig.name }],
    creator: siteConfig.name,
    openGraph: {
      type: "website",
      locale: "en_US",
      url: seoUrl,
      title: seoTitle,
      description: seoDescription,
      siteName: siteConfig.name,
      images: [
        {
          url: seoImage,
          width: 1200,
          height: 630,
          alt: seoTitle,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: seoTitle,
      description: seoDescription,
      images: [seoImage],
      creator: "@yourusername",
    },
    robots: noIndex
      ? {
          index: false,
          follow: false,
        }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            "max-video-preview": -1,
            "max-image-preview": "large",
            "max-snippet": -1,
          },
        },
    icons: {
      icon: "/favicon.ico",
      shortcut: "/favicon-16x16.png",
      apple: "/apple-touch-icon.png",
    },
    manifest: "/site.webmanifest",
  };
}

/**
 * Common metadata for all pages
 */
export const defaultMetadata: Metadata = generateSEO();

/**
 * Metadata for specific pages
 */
export const pageMetadata = {
  home: generateSEO({
    title: "Home",
    description:
      "Build and launch your AI SaaS faster with our production-ready Next.js 14 starter kit. Includes authentication, payments, and AI integration.",
  }),
  pricing: generateSEO({
    title: "Pricing",
    description:
      "Choose the perfect plan for your needs. Start free and scale as you grow with flexible pricing options.",
  }),
  login: generateSEO({
    title: "Login",
    description: "Sign in to your account to access your AI-powered dashboard.",
    noIndex: true,
  }),
  signup: generateSEO({
    title: "Sign Up",
    description:
      "Create your account and start using AI-powered tools today. Get 10 free requests to try our service.",
    noIndex: true,
  }),
  dashboard: generateSEO({
    title: "Dashboard",
    description: "Your AI SaaS dashboard - manage your projects and usage.",
    noIndex: true,
  }),
  aiGenerator: generateSEO({
    title: "AI Generator",
    description:
      "Generate high-quality content with GPT-4, GPT-3.5, and Claude AI models.",
    noIndex: true,
  }),
  history: generateSEO({
    title: "Prompt History",
    description: "View and manage your AI generation history.",
    noIndex: true,
  }),
  billing: generateSEO({
    title: "Billing",
    description: "Manage your subscription and payment methods.",
    noIndex: true,
  }),
  settings: generateSEO({
    title: "Settings",
    description: "Manage your account settings and preferences.",
    noIndex: true,
  }),
  admin: generateSEO({
    title: "Admin Dashboard",
    description: "System administration and user management.",
    noIndex: true,
  }),
  terms: generateSEO({
    title: "Terms of Service",
    description: "Read our terms of service and user agreement.",
  }),
  privacy: generateSEO({
    title: "Privacy Policy",
    description: "Learn how we protect and handle your data.",
  }),
};
