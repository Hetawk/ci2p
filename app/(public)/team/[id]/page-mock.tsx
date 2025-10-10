import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Mail,
  MapPin,
  Github,
  ExternalLink,
  Award,
  BookOpen,
  GraduationCap,
  ArrowLeft,
  FileText,
} from "lucide-react";

// This would normally come from your database
// For now, using the same data structure from team page
const getTeamMember = (id: string) => {
  // TODO: Replace with actual database query
  // const member = await prisma.user.findUnique({ where: { id } })

  const members = [
    {
      id: "sijie-niu",
      name: "Prof. Sijie Niu",
      role: "Professor & Doctoral Supervisor",
      category: "faculty" as const,
      photo: "/SJ.jpg",
      email: "ise_niusj@ujn.edu.cn",
      bio: "Professor Sijie Niu is the director of CI2P Lab at University of Jinan. He received his PhD from Nanjing University of Science and Technology in 2016, and completed postdoctoral research at UNC Chapel Hill (2019-2021) with Prof. Dinggang Shen. His research focuses on machine learning, pattern recognition, medical image analysis, and remote sensing.",
      researchInterests: [
        "Machine Learning",
        "Pattern Recognition",
        "Medical Image Analysis",
        "Remote Sensing",
        "Deep Learning",
        "Computer Vision",
      ],
      education: [
        {
          degree: "Ph.D. in Pattern Recognition and Intelligent Systems",
          institution: "Nanjing University of Science and Technology",
          year: "2016",
        },
        {
          degree: "Visiting Scholar",
          institution: "Stanford University",
          year: "2014",
        },
      ],
      achievements: [
        "ACM Jinan Rising Star Award",
        "Leader of Shandong Province Youth Innovation Team",
        "Top 1% ESI Highly Cited Paper (2017-2021)",
        "59+ Published Papers",
        "7+ Research Projects (NSFC, Provincial Grants)",
      ],
      orcid: "0000-0002-1401-9859",
      github: "sjniu",
      googleScholar: "https://scholar.google.com",
      researchGate: "https://researchgate.net",
      location: "Jinan, Shandong, China",
    },
    // Add other members as needed
  ];

  return members.find((m) => m.id === id);
};

interface PageProps {
  params: {
    id: string;
  };
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const member = getTeamMember(params.id);

  if (!member) {
    return {
      title: "Member Not Found - CI2P Lab",
    };
  }

  return {
    title: `${member.name} - CI2P Research Lab Team`,
    description: `Profile of ${member.name}, ${
      member.role
    } at CI2P Lab, University of Jinan. Research interests: ${member.researchInterests.join(
      ", "
    )}.`,
  };
}

export default function TeamMemberPage({ params }: PageProps) {
  const member = getTeamMember(params.id);

  if (!member) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-blue-50/20 to-white">
      {/* Back Button */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto max-w-7xl px-4 py-4">
          <Button variant="ghost" asChild>
            <Link href="/team">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Team
            </Link>
          </Button>
        </div>
      </div>

      {/* Profile Header */}
      <section className="py-12 px-4 bg-gradient-to-br from-slate-900 via-primary-900 to-slate-900">
        <div className="container mx-auto max-w-7xl">
          <div className="grid md:grid-cols-[300px_1fr] gap-8">
            {/* Profile Photo */}
            <div className="space-y-4">
              <div className="relative aspect-square w-full rounded-2xl overflow-hidden border-4 border-white shadow-2xl">
                {member.photo ? (
                  <Image
                    src={member.photo}
                    alt={member.name}
                    fill
                    className="object-cover"
                    priority
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary-100 to-secondary-100">
                    <span className="text-6xl font-bold text-primary-600">
                      {member.name.charAt(0)}
                    </span>
                  </div>
                )}
              </div>

              {/* Quick Contact */}
              <Card className="p-4 bg-white/95 backdrop-blur">
                <div className="space-y-3">
                  {member.email && (
                    <a
                      href={`mailto:${member.email}`}
                      className="flex items-center gap-2 text-sm text-gray-600 hover:text-primary-600 transition-colors"
                    >
                      <Mail className="w-4 h-4" />
                      {member.email}
                    </a>
                  )}
                  {member.location && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <MapPin className="w-4 h-4" />
                      {member.location}
                    </div>
                  )}
                </div>
              </Card>

              {/* Social Links */}
              <Card className="p-4 bg-white/95 backdrop-blur">
                <h3 className="font-semibold text-gray-900 mb-3">Connect</h3>
                <div className="flex flex-wrap gap-2">
                  {member.orcid && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      asChild
                    >
                      <Link
                        href={`https://orcid.org/${member.orcid}`}
                        target="_blank"
                      >
                        <ExternalLink className="w-4 h-4 mr-1" />
                        ORCID
                      </Link>
                    </Button>
                  )}
                  {member.github && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      asChild
                    >
                      <Link
                        href={`https://github.com/${member.github}`}
                        target="_blank"
                      >
                        <Github className="w-4 h-4 mr-1" />
                        GitHub
                      </Link>
                    </Button>
                  )}
                </div>
              </Card>
            </div>

            {/* Profile Info */}
            <div className="space-y-6">
              <div>
                <Badge className="mb-3 bg-primary-500 text-white">
                  {member.category === "faculty"
                    ? "Faculty"
                    : member.category === "masters"
                    ? "Master's Student"
                    : member.category === "undergrad"
                    ? "Undergraduate Researcher"
                    : "Alumni"}
                </Badge>
                <h1 className="text-4xl lg:text-5xl font-bold text-white mb-2">
                  {member.name}
                </h1>
                <p className="text-xl text-secondary-300 mb-6">{member.role}</p>
                <p className="text-gray-200 leading-relaxed">{member.bio}</p>
              </div>

              {/* Research Interests */}
              <div>
                <h2 className="text-xl font-semibold text-white mb-3 flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-secondary-400" />
                  Research Interests
                </h2>
                <div className="flex flex-wrap gap-2">
                  {member.researchInterests.map((interest, idx) => (
                    <Badge
                      key={idx}
                      variant="outline"
                      className="bg-white/10 text-white border-white/30 backdrop-blur"
                    >
                      {interest}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column - Education & Achievements */}
            <div className="space-y-6">
              {/* Education */}
              {member.education && member.education.length > 0 && (
                <Card className="p-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <GraduationCap className="w-6 h-6 text-primary-600" />
                    Education
                  </h2>
                  <div className="space-y-4">
                    {member.education.map((edu, idx) => (
                      <div
                        key={idx}
                        className="border-l-2 border-primary-300 pl-4"
                      >
                        <h3 className="font-semibold text-gray-900">
                          {edu.degree}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {edu.institution}
                        </p>
                        <p className="text-xs text-gray-500">{edu.year}</p>
                      </div>
                    ))}
                  </div>
                </Card>
              )}

              {/* Achievements */}
              {member.achievements && member.achievements.length > 0 && (
                <Card className="p-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Award className="w-6 h-6 text-secondary-600" />
                    Achievements
                  </h2>
                  <ul className="space-y-2">
                    {member.achievements.map((achievement, idx) => (
                      <li
                        key={idx}
                        className="flex items-start gap-2 text-sm text-gray-700"
                      >
                        <span className="text-primary-500 mt-1">•</span>
                        {achievement}
                      </li>
                    ))}
                  </ul>
                </Card>
              )}
            </div>

            {/* Right Column - Publications */}
            <div className="lg:col-span-2">
              <Card className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                    <FileText className="w-6 h-6 text-primary-600" />
                    Publications
                  </h2>
                  {member.orcid && (
                    <Badge className="bg-green-100 text-green-700 border-green-300">
                      <ExternalLink className="w-3 h-3 mr-1" />
                      Synced from ORCID
                    </Badge>
                  )}
                </div>

                {/* Placeholder for papers - This will be fetched from ORCID */}
                <div className="text-center py-12 text-gray-500">
                  <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>Publications will be displayed here</p>
                  <p className="text-sm">
                    Papers synced from ORCID: {member.orcid || "Not connected"}
                  </p>
                </div>

                {/* TODO: Integrate with PaperCard component to show actual papers */}
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
