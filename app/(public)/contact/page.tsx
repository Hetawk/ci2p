import { Metadata } from "next";
import { ContactForm } from "@/components/forms";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Mail,
  MapPin,
  Clock,
  Building2,
  MessageSquare,
  Github,
  Linkedin,
  Globe,
} from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Contact Us - CI2P Research Lab | University of Jinan",
  description:
    "Get in touch with CI2P Lab at University of Jinan. Contact us for research collaborations, student inquiries, or general information about our AI and ML research.",
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-blue-50/20 to-white">
      {/* Hero Section */}
      <section className="relative py-20 px-4 bg-gradient-to-br from-slate-900 via-primary-900 to-slate-900 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div
            className="w-full h-full"
            style={{
              backgroundImage: `radial-gradient(circle, rgb(59 130 246 / 0.15) 1px, transparent 1px)`,
              backgroundSize: "32px 32px",
            }}
          />
        </div>

        {/* Animated gradient orbs */}
        <div className="absolute top-20 left-10 w-64 h-64 bg-primary-500/20 rounded-full blur-3xl animate-float" />
        <div
          className="absolute bottom-20 right-10 w-80 h-80 bg-secondary-500/20 rounded-full blur-3xl animate-float"
          style={{ animationDelay: "1s" }}
        />

        <div className="container mx-auto max-w-6xl relative z-10">
          <div className="text-center space-y-6">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="p-3 bg-primary-500/20 rounded-2xl backdrop-blur-sm border border-primary-400/30">
                <MessageSquare className="w-8 h-8 text-primary-300" />
              </div>
            </div>
            <h1 className="text-5xl lg:text-6xl font-bold text-white">
              Get in <span className="text-secondary-400">Touch</span>
            </h1>
            <p className="text-xl text-gray-200 max-w-3xl mx-auto leading-relaxed">
              Have questions about our research, collaborations, or joining our
              team? We&apos;d love to hear from you.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Contact Form - Takes 2 columns */}
            <div className="lg:col-span-2 space-y-6">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  Send Us a Message
                </h2>
                <p className="text-gray-600">
                  Fill out the form below and we&apos;ll get back to you as soon
                  as possible.
                </p>
              </div>
              <ContactForm />
            </div>

            {/* Contact Information - Takes 1 column */}
            <div className="space-y-6">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  Contact Info
                </h2>
                <p className="text-gray-600">
                  Reach out through any of these channels
                </p>
              </div>

              {/* Contact Cards */}
              <div className="space-y-4">
                {/* Email */}
                <Card className="p-6 hover:shadow-lg transition-shadow border-gray-200">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-primary-100 rounded-lg">
                      <Mail className="w-6 h-6 text-primary-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">
                        Email
                      </h3>
                      <a
                        href="mailto:ise_niusj@ujn.edu.cn"
                        className="text-primary-600 hover:text-primary-700 hover:underline"
                      >
                        ise_niusj@ujn.edu.cn
                      </a>
                    </div>
                  </div>
                </Card>

                {/* Location */}
                <Card className="p-6 hover:shadow-lg transition-shadow border-gray-200">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-secondary-100 rounded-lg">
                      <MapPin className="w-6 h-6 text-secondary-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">
                        Location
                      </h3>
                      <p className="text-gray-600 text-sm leading-relaxed">
                        No. 336, Nanxinzhuang West Road
                        <br />
                        Shizhong District, Jinan
                        <br />
                        Shandong Province, 250022
                        <br />
                        China
                      </p>
                    </div>
                  </div>
                </Card>

                {/* Office */}
                <Card className="p-6 hover:shadow-lg transition-shadow border-gray-200">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-purple-100 rounded-lg">
                      <Building2 className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">
                        Institution
                      </h3>
                      <p className="text-gray-600 text-sm">
                        University of Jinan
                        <br />
                        Key Laboratory of Intelligent Computing
                      </p>
                    </div>
                  </div>
                </Card>

                {/* Office Hours */}
                <Card className="p-6 hover:shadow-lg transition-shadow border-gray-200">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-green-100 rounded-lg">
                      <Clock className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">
                        Office Hours
                      </h3>
                      <p className="text-gray-600 text-sm">
                        Monday - Friday
                        <br />
                        9:00 AM - 5:00 PM (CST)
                      </p>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Social Links */}
              <Card className="p-6 bg-gradient-to-br from-slate-50 to-blue-50 border-blue-200">
                <h3 className="font-semibold text-gray-900 mb-4">Follow Us</h3>
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    size="icon"
                    className="hover:bg-gray-900 hover:text-white hover:border-gray-900"
                    asChild
                  >
                    <Link href="https://github.com/sjniu" target="_blank">
                      <Github className="w-5 h-5" />
                    </Link>
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="hover:bg-blue-600 hover:text-white hover:border-blue-600"
                    asChild
                  >
                    <Link href="#" target="_blank">
                      <Linkedin className="w-5 h-5" />
                    </Link>
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="hover:bg-primary-600 hover:text-white hover:border-primary-600"
                    asChild
                  >
                    <Link href="#" target="_blank">
                      <Globe className="w-5 h-5" />
                    </Link>
                  </Button>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section (Placeholder) */}
      <section className="py-16 px-4 bg-gradient-to-br from-slate-50 via-gray-50 to-slate-50">
        <div className="container mx-auto max-w-7xl">
          <Card className="overflow-hidden border-gray-200">
            <div className="aspect-[21/9] bg-gradient-to-br from-gray-200 to-gray-300 relative">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center space-y-2">
                  <MapPin className="w-12 h-12 text-gray-400 mx-auto" />
                  <p className="text-gray-600 font-medium">Interactive Map</p>
                  <p className="text-sm text-gray-500">
                    University of Jinan, Shandong Province, China
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Quick Links CTA */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Looking for Something Specific?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Explore more ways to connect with our lab
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800"
              asChild
            >
              <Link href="/team">
                <Mail className="w-5 h-5 mr-2" />
                Meet Our Team
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-2 border-primary-600 text-primary-600 hover:bg-primary-50"
              asChild
            >
              <Link href="/about">
                <Building2 className="w-5 h-5 mr-2" />
                About Our Lab
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
