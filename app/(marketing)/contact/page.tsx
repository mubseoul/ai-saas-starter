"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Mail, MessageSquare, Send } from "lucide-react";
import { toast } from "sonner";

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1500));

    toast.success("Message sent! We'll get back to you soon.");
    setFormData({ name: "", email: "", subject: "", message: "" });
    setIsSubmitting(false);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

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
        <div className="mx-auto max-w-4xl">
          {/* Hero */}
          <div className="mb-12 text-center">
            <h1 className="mb-4 text-4xl font-bold tracking-tight sm:text-5xl">
              Get in Touch
            </h1>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
              Have questions? We&apos;d love to hear from you. Send us a message
              and we&apos;ll respond as soon as possible.
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-3">
            {/* Contact Form */}
            <Card className="p-8 lg:col-span-2">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid gap-6 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      name="name"
                      placeholder="John Doe"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="john@example.com"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Input
                    id="subject"
                    name="subject"
                    placeholder="How can we help?"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    name="message"
                    placeholder="Tell us more about your question or feedback..."
                    rows={6}
                    value={formData.message}
                    onChange={handleChange}
                    required
                  />
                </div>

                <Button type="submit" size="lg" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>Sending...</>
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      Send Message
                    </>
                  )}
                </Button>
              </form>
            </Card>

            {/* Contact Info */}
            <div className="space-y-6">
              <Card className="p-6">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <Mail className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mb-2 text-lg font-semibold">Email Us</h3>
                <p className="mb-2 text-sm text-muted-foreground">
                  We&apos;re here to help and answer any question you might have.
                </p>
                <a
                  href="mailto:support@yourdomain.com"
                  className="text-sm font-medium text-primary hover:underline"
                >
                  support@yourdomain.com
                </a>
              </Card>

              <Card className="p-6">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <MessageSquare className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mb-2 text-lg font-semibold">Community</h3>
                <p className="mb-2 text-sm text-muted-foreground">
                  Join our community for discussions and support.
                </p>
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-medium text-primary hover:underline"
                >
                  GitHub Discussions
                </a>
              </Card>

              <Card className="p-6 bg-muted/50">
                <h3 className="mb-3 font-semibold">Quick Links</h3>
                <ul className="space-y-2 text-sm">
                  <li>
                    <Link
                      href="/pricing"
                      className="text-muted-foreground hover:text-foreground"
                    >
                      → Pricing & Plans
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/docs"
                      className="text-muted-foreground hover:text-foreground"
                    >
                      → Documentation
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/privacy"
                      className="text-muted-foreground hover:text-foreground"
                    >
                      → Privacy Policy
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/terms"
                      className="text-muted-foreground hover:text-foreground"
                    >
                      → Terms of Service
                    </Link>
                  </li>
                </ul>
              </Card>
            </div>
          </div>

          {/* FAQ Preview */}
          <section className="mt-16">
            <h2 className="mb-6 text-center text-2xl font-bold">
              Common Questions
            </h2>
            <div className="grid gap-6 md:grid-cols-2">
              <Card className="p-6">
                <h3 className="mb-2 font-semibold">
                  How do I get started?
                </h3>
                <p className="text-sm text-muted-foreground">
                  Simply sign up for a free account and you&apos;ll get 10 AI
                  requests per month. Check out our documentation for setup
                  instructions.
                </p>
              </Card>

              <Card className="p-6">
                <h3 className="mb-2 font-semibold">
                  Can I upgrade or downgrade?
                </h3>
                <p className="text-sm text-muted-foreground">
                  Yes! You can upgrade or downgrade your plan at any time from
                  your billing settings. Changes take effect immediately.
                </p>
              </Card>

              <Card className="p-6">
                <h3 className="mb-2 font-semibold">
                  Do you offer refunds?
                </h3>
                <p className="text-sm text-muted-foreground">
                  We offer a 14-day money-back guarantee on all paid plans. If
                  you&apos;re not satisfied, contact us for a full refund.
                </p>
              </Card>

              <Card className="p-6">
                <h3 className="mb-2 font-semibold">
                  Is my data secure?
                </h3>
                <p className="text-sm text-muted-foreground">
                  Absolutely. We use industry-standard encryption and security
                  practices. Your data is never shared with third parties.
                </p>
              </Card>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
