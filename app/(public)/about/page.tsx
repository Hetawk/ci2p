import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Award,
  Building2,
  MapPin,
  Mail,
  ExternalLink,
  Users,
  BookOpen,
  Trophy,
  Microscope,
} from "lucide-react";

export const metadata: Metadata = {
  title: "About - CI2P Research Lab | University of Jinan",
  description:
    "Learn about CI2P Research Lab, our mission, team, and cutting-edge research in Machine Learning, AI, and Medical Image Analysis at University of Jinan.",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-blue-50/30 to-white">
      {/* Hero Section */}
      <section className="relative py-20 px-4 bg-gradient-to-br from-slate-900 via-primary-900 to-slate-900">
        <div className="absolute inset-0 opacity-10">
          <div
            className="w-full h-full"
            style={{
              backgroundImage: `radial-gradient(circle, rgb(59 130 246 / 0.15) 1px, transparent 1px)`,
              backgroundSize: "32px 32px",
            }}
          />
        </div>

        <div className="container mx-auto max-w-6xl relative z-10">
          <div className="text-center space-y-6">
            <h1 className="text-5xl lg:text-6xl font-bold text-white">
              About <span className="text-secondary-400">CI2P Lab</span>
            </h1>
            <p className="text-xl text-gray-200 max-w-3xl mx-auto leading-relaxed">
              Computational Intelligence Lab at University of Jinan, advancing
              research in Machine Learning, Pattern Recognition, and Medical
              Image Analysis
            </p>
            <div className="flex items-center justify-center gap-4 text-secondary-300">
              <MapPin className="w-5 h-5" />
              <span>University of Jinan, Shandong Province, China 🇨🇳</span>
            </div>
          </div>
        </div>
      </section>

      {/* Lab Director Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              Lab <span className="text-primary-600">Director</span>
            </h2>
            <div className="h-1 w-32 mx-auto bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full" />
          </div>

          <Card className="overflow-hidden border-2 border-primary-100 hover:border-primary-300 transition-all duration-300 hover:shadow-xl">
            <div className="grid lg:grid-cols-3 gap-8 p-8">
              {/* Photo */}
              <div className="flex justify-center items-start">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-2xl blur-xl opacity-20" />
                  <div className="relative w-64 h-64 rounded-2xl overflow-hidden border-4 border-white shadow-2xl">
                    <Image
                      src="/SJ.jpg"
                      alt="Professor Sijie Niu"
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
              </div>

              {/* Information */}
              <div className="lg:col-span-2 space-y-6">
                <div>
                  <h3 className="text-3xl font-bold text-slate-900 mb-2">
                    Prof. Sijie Niu
                  </h3>
                  <p className="text-xl text-primary-600 font-semibold mb-4">
                    Professor & Doctoral Supervisor
                  </p>

                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-medium">
                      PhD, Pattern Recognition
                    </span>
                    <span className="px-3 py-1 bg-secondary-100 text-secondary-700 rounded-full text-sm font-medium">
                      ACM Jinan Rising Star
                    </span>
                    <span className="px-3 py-1 bg-accent-100 text-accent-700 rounded-full text-sm font-medium">
                      Youth Innovation Team Leader
                    </span>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <Building2 className="w-5 h-5 text-primary-600 mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-slate-900">
                        Computational Intelligence Lab (CI2P)
                      </p>
                      <p className="text-slate-600">
                        School of Information Science and Engineering
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-primary-600 mt-1 flex-shrink-0" />
                    <p className="text-slate-600">
                      No. 336, Nanxinzhuang West Road, Shizhong District
                      <br />
                      Jinan, Shandong Province, 250022, China
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-primary-600 flex-shrink-0" />
                    <a
                      href="mailto:ise_niusj@ujn.edu.cn"
                      className="text-primary-600 hover:text-primary-700 hover:underline"
                    >
                      ise_niusj@ujn.edu.cn
                    </a>
                  </div>
                </div>

                {/* Social Links */}
                <div className="flex flex-wrap gap-3 pt-4 border-t">
                  <Button variant="outline" size="sm" asChild>
                    <a
                      href="https://orcid.org/0000-0002-1401-9859"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      ORCID
                    </a>
                  </Button>
                  <Button variant="outline" size="sm" asChild>
                    <a
                      href="https://scholar.google.com.hk/citations?user=tRi0nMcAAAAJ&hl=zh-en"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Google Scholar
                    </a>
                  </Button>
                  <Button variant="outline" size="sm" asChild>
                    <a
                      href="https://github.com/sjniu"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      GitHub
                    </a>
                  </Button>
                  <Button variant="outline" size="sm" asChild>
                    <a
                      href="https://www.researchgate.net/profile/Sijie_Niu"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      ResearchGate
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* About Professor Niu */}
      <section className="py-16 px-4 bg-gradient-to-br from-blue-50 to-white">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-slate-900 mb-8">
            Academic <span className="text-primary-600">Background</span>
          </h2>

          <div className="prose prose-lg max-w-none">
            <Card className="p-8 border-l-4 border-primary-500">
              <p className="text-slate-700 leading-relaxed mb-6">
                Professor Sijie Niu is a distinguished researcher and educator
                at the University of Jinan, where he serves as a Professor and
                Doctoral Supervisor in the School of Information Science and
                Engineering. He received his PhD in Pattern Recognition and
                Intelligent Systems from Nanjing University of Science and
                Technology in 2016.
              </p>

              <p className="text-slate-700 leading-relaxed mb-6">
                In October 2014, he was awarded a full scholarship from the
                China Scholarship Council to conduct research at Stanford
                University. From December 2019 to January 2021, he completed a
                postdoctoral fellowship at the University of North Carolina at
                Chapel Hill under the supervision of Professor Dinggang Shen.
              </p>

              <p className="text-slate-700 leading-relaxed">
                Professor Niu is the leader of the Shandong Province Higher
                Education Youth Innovation Team and a Haiyou Industry Leading
                Talent. He has been honored with the ACM Jinan Rising Star Award
                and has received the Outstanding Doctoral Dissertation Award
                from both Jinan and Nanjing University of Science and
                Technology.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Research Interests */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center">
            Research <span className="text-primary-600">Interests</span>
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Microscope,
                title: "Machine Learning",
                description:
                  "Weakly supervised, semi-supervised, and transfer learning",
              },
              {
                icon: BookOpen,
                title: "Pattern Recognition",
                description:
                  "Visual recognition models with minimal supervision",
              },
              {
                icon: Award,
                title: "Medical Image Analysis",
                description: "Retinal imaging, lesion segmentation, diagnosis",
              },
              {
                icon: Users,
                title: "Remote Sensing",
                description: "Hyperspectral image interpretation and analysis",
              },
            ].map((item, index) => (
              <Card
                key={index}
                className="p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-2 border-transparent hover:border-primary-200"
              >
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="p-3 bg-gradient-to-br from-primary-100 to-secondary-100 rounded-2xl">
                    <item.icon className="w-8 h-8 text-primary-600" />
                  </div>
                  <h3 className="font-bold text-lg text-slate-900">
                    {item.title}
                  </h3>
                  <p className="text-sm text-slate-600">{item.description}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Achievements */}
      <section className="py-16 px-4 bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-slate-900 mb-12 text-center">
            Notable <span className="text-primary-600">Achievements</span>
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="p-6 text-center hover:shadow-xl transition-all duration-300">
              <div className="flex justify-center mb-4">
                <div className="p-4 bg-primary-100 rounded-full">
                  <BookOpen className="w-8 h-8 text-primary-600" />
                </div>
              </div>
              <div className="text-4xl font-bold text-primary-600 mb-2">
                59+
              </div>
              <p className="text-slate-600">Published Papers</p>
              <p className="text-sm text-slate-500 mt-2">
                18 as first/corresponding author
              </p>
            </Card>

            <Card className="p-6 text-center hover:shadow-xl transition-all duration-300">
              <div className="flex justify-center mb-4">
                <div className="p-4 bg-secondary-100 rounded-full">
                  <Trophy className="w-8 h-8 text-secondary-600" />
                </div>
              </div>
              <div className="text-4xl font-bold text-secondary-600 mb-2">
                Top 1%
              </div>
              <p className="text-slate-600">ESI Highly Cited Paper</p>
              <p className="text-sm text-slate-500 mt-2">
                5 consecutive years (2017-2021)
              </p>
            </Card>

            <Card className="p-6 text-center hover:shadow-xl transition-all duration-300">
              <div className="flex justify-center mb-4">
                <div className="p-4 bg-accent-100 rounded-full">
                  <Award className="w-8 h-8 text-accent-600" />
                </div>
              </div>
              <div className="text-4xl font-bold text-accent-600 mb-2">7+</div>
              <p className="text-slate-600">Research Projects</p>
              <p className="text-sm text-slate-500 mt-2">
                Including NSFC and provincial grants
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <Card className="p-12 bg-gradient-to-br from-primary-600 to-secondary-600 border-0 text-white">
            <h2 className="text-3xl font-bold mb-4">Join Our Research Team</h2>
            <p className="text-xl mb-8 text-blue-100">
              We welcome motivated students and researchers interested in
              machine learning and AI
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button size="lg" variant="secondary" asChild>
                <Link href="/team">
                  <Users className="w-5 h-5 mr-2" />
                  Meet Our Team
                </Link>
              </Button>
              <Button
                size="lg"
                className="bg-white text-primary-600 hover:bg-gray-100"
                asChild
              >
                <Link href="/contact">
                  <Mail className="w-5 h-5 mr-2" />
                  Contact Us
                </Link>
              </Button>
            </div>
          </Card>
        </div>
      </section>
    </div>
  );
}
