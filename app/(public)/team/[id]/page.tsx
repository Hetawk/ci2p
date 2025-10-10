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
  Linkedin,
  Phone,
  Globe,
} from "lucide-react";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

// Fetch team member from API
async function getTeamMember(id: string) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const response = await fetch(`${baseUrl}/api/users/${id}`, {
      cache: "no-store",
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching team member:", error);
    return null;
  }
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id } = await params;
  const member = await getTeamMember(id);

  if (!member) {
    return {
      title: "Member Not Found - CI2P Lab",
    };
  }

  return {
    title: `${member.profile.fullName} - CI2P Research Lab Team`,
    description: `Profile of ${member.profile.fullName}, ${
      member.profile.title || "Researcher"
    } at CI2P Lab, University of Jinan. Research interests: ${
      member.profile.interests || ""
    }.`,
  };
}

export default async function TeamMemberPage({ params }: PageProps) {
  const { id } = await params;
  const member = await getTeamMember(id);

  if (!member) {
    notFound();
  }

  const profile = member.profile;
  const researchInterests = profile.interests
    ? profile.interests.split(",").map((i: string) => i.trim())
    : [];

  return (
    <main className="min-h-screen bg-gradient-to-br from-white via-blue-50/30 to-slate-50">
      {/* Header */}
      <section className="relative py-12 px-4 bg-white border-b border-gray-200">
        <div className="container mx-auto max-w-7xl">
          <Link href="/team">
            <Button
              variant="ghost"
              className="mb-6 hover:bg-blue-50 text-blue-600"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Team
            </Button>
          </Link>

          <div className="flex flex-col md:flex-row gap-8 items-start">
            {/* Profile Photo */}
            <div className="relative w-48 h-48 rounded-2xl overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 flex-shrink-0 shadow-lg">
              {profile.avatar ? (
                <Image
                  src={profile.avatar}
                  alt={profile.fullName}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-500 to-indigo-600 text-white text-5xl font-bold">
                  {profile.fullName.charAt(0)}
                </div>
              )}
            </div>

            {/* Basic Info */}
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-4xl font-bold text-gray-900">
                  {profile.fullName}
                </h1>
                {profile.chineseName && (
                  <span className="text-2xl text-gray-600">
                    ({profile.chineseName})
                  </span>
                )}
              </div>

              <p className="text-xl text-blue-600 mb-4">{profile.title}</p>

              {profile.bio && (
                <p className="text-gray-600 leading-relaxed mb-6">
                  {profile.bio}
                </p>
              )}

              {/* Contact & Links */}
              <div className="flex flex-wrap gap-3">
                {profile.email && (
                  <Button
                    variant="outline"
                    size="sm"
                    asChild
                    className="border-blue-200 hover:bg-blue-50 hover:border-blue-300"
                  >
                    <a href={`mailto:${profile.email}`}>
                      <Mail className="w-4 h-4 mr-2" />
                      Email
                    </a>
                  </Button>
                )}

                {profile.phone && (
                  <Button
                    variant="outline"
                    size="sm"
                    asChild
                    className="border-blue-200 hover:bg-blue-50 hover:border-blue-300"
                  >
                    <a href={`tel:${profile.phone}`}>
                      <Phone className="w-4 h-4 mr-2" />
                      Phone
                    </a>
                  </Button>
                )}

                {profile.github && (
                  <Button
                    variant="outline"
                    size="sm"
                    asChild
                    className="border-gray-200 hover:bg-gray-50"
                  >
                    <a
                      href={`https://github.com/${profile.github}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Github className="w-4 h-4 mr-2" />
                      GitHub
                    </a>
                  </Button>
                )}

                {profile.linkedin && (
                  <Button
                    variant="outline"
                    size="sm"
                    asChild
                    className="border-blue-600 hover:bg-blue-50"
                  >
                    <a
                      href={profile.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Linkedin className="w-4 h-4 mr-2" />
                      LinkedIn
                    </a>
                  </Button>
                )}

                {profile.website && (
                  <Button
                    variant="outline"
                    size="sm"
                    asChild
                    className="border-gray-200 hover:bg-gray-50"
                  >
                    <a
                      href={profile.website}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Globe className="w-4 h-4 mr-2" />
                      Website
                    </a>
                  </Button>
                )}

                {profile.orcidId && (
                  <Button
                    variant="outline"
                    size="sm"
                    asChild
                    className="border-green-200 hover:bg-green-50"
                  >
                    <a
                      href={`https://orcid.org/${profile.orcidId}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      ORCID
                    </a>
                  </Button>
                )}

                {profile.googleScholar && (
                  <Button
                    variant="outline"
                    size="sm"
                    asChild
                    className="border-blue-200 hover:bg-blue-50"
                  >
                    <a
                      href={profile.googleScholar}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <GraduationCap className="w-4 h-4 mr-2" />
                      Google Scholar
                    </a>
                  </Button>
                )}
              </div>
            </div>

            {/* Stats Card */}
            <Card className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
              <h3 className="text-sm font-semibold text-gray-600 mb-4">
                Research Metrics
              </h3>
              <div className="space-y-3">
                <div>
                  <div className="text-3xl font-bold text-blue-600">
                    {profile.publicationCount || 0}
                  </div>
                  <div className="text-sm text-gray-600">Publications</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-purple-600">
                    {profile.projectCount || 0}
                  </div>
                  <div className="text-sm text-gray-600">Projects</div>
                </div>
                {profile.citationCount !== null &&
                  profile.citationCount !== undefined && (
                    <div>
                      <div className="text-3xl font-bold text-green-600">
                        {profile.citationCount}
                      </div>
                      <div className="text-sm text-gray-600">Citations</div>
                    </div>
                  )}
                {profile.hIndex !== null && profile.hIndex !== undefined && (
                  <div>
                    <div className="text-3xl font-bold text-orange-600">
                      {profile.hIndex}
                    </div>
                    <div className="text-sm text-gray-600">h-Index</div>
                  </div>
                )}
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-8">
              {/* Research Interests */}
              {researchInterests.length > 0 && (
                <Card className="p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Award className="w-5 h-5 text-blue-600" />
                    <h2 className="text-2xl font-bold text-gray-900">
                      Research Interests
                    </h2>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {researchInterests.map(
                      (interest: string, index: number) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="px-3 py-1.5 text-sm bg-blue-100 text-blue-700 hover:bg-blue-200"
                        >
                          {interest}
                        </Badge>
                      )
                    )}
                  </div>
                </Card>
              )}

              {/* Publications */}
              {member.publications && member.publications.length > 0 && (
                <Card className="p-6">
                  <div className="flex items-center gap-2 mb-6">
                    <BookOpen className="w-5 h-5 text-green-600" />
                    <h2 className="text-2xl font-bold text-gray-900">
                      Recent Publications
                    </h2>
                  </div>
                  <div className="space-y-4">
                    {member.publications
                      .slice(0, 5)
                      .map(
                        (pub: {
                          id: string;
                          title: string;
                          journal?: string;
                          conference?: string;
                          year: number;
                          customTags?: string;
                        }) => (
                          <Link
                            key={pub.id}
                            href={`/papers/${pub.id}`}
                            className="block group"
                          >
                            <div className="p-4 rounded-lg border border-gray-200 hover:border-green-300 hover:bg-green-50/50 transition-all">
                              <h3 className="font-semibold text-gray-900 group-hover:text-green-600 mb-2">
                                {pub.title}
                              </h3>
                              <p className="text-sm text-gray-600 mb-2">
                                {pub.journal || pub.conference} • {pub.year}
                              </p>
                              {pub.customTags && (
                                <div className="flex flex-wrap gap-1">
                                  {pub.customTags
                                    .split(",")
                                    .slice(0, 3)
                                    .map((tag: string, i: number) => (
                                      <Badge
                                        key={i}
                                        variant="outline"
                                        className="text-xs"
                                      >
                                        {tag.trim()}
                                      </Badge>
                                    ))}
                                </div>
                              )}
                            </div>
                          </Link>
                        )
                      )}
                  </div>
                  {member.publications.length > 5 && (
                    <Button variant="outline" className="w-full mt-4" asChild>
                      <Link href="/papers">
                        View All Publications ({member.publications.length})
                      </Link>
                    </Button>
                  )}
                </Card>
              )}

              {/* Projects */}
              {member.projects && member.projects.length > 0 && (
                <Card className="p-6">
                  <div className="flex items-center gap-2 mb-6">
                    <FileText className="w-5 h-5 text-purple-600" />
                    <h2 className="text-2xl font-bold text-gray-900">
                      Active Projects
                    </h2>
                  </div>
                  <div className="space-y-4">
                    {member.projects.map(
                      (project: {
                        id: string;
                        title: string;
                        description: string;
                        status: string;
                        startDate?: string;
                      }) => (
                        <Link
                          key={project.id}
                          href={`/research/projects/${project.id}`}
                          className="block group"
                        >
                          <div className="p-4 rounded-lg border border-gray-200 hover:border-purple-300 hover:bg-purple-50/50 transition-all">
                            <h3 className="font-semibold text-gray-900 group-hover:text-purple-600 mb-2">
                              {project.title}
                            </h3>
                            <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                              {project.description}
                            </p>
                            <div className="flex items-center gap-4 text-xs text-gray-500">
                              <span className="flex items-center gap-1">
                                <Award className="w-3 h-3" />
                                {project.status}
                              </span>
                              {project.startDate && (
                                <span>
                                  Started:{" "}
                                  {new Date(
                                    project.startDate
                                  ).toLocaleDateString()}
                                </span>
                              )}
                            </div>
                          </div>
                        </Link>
                      )
                    )}
                  </div>
                </Card>
              )}
            </div>

            {/* Right Column - Additional Info */}
            <div className="space-y-6">
              {/* Contact Card */}
              {(profile.office || profile.phone || profile.email) && (
                <Card className="p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">
                    Contact Information
                  </h3>
                  <div className="space-y-3 text-sm">
                    {profile.office && (
                      <div className="flex items-start gap-2">
                        <MapPin className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-600">{profile.office}</span>
                      </div>
                    )}
                    {profile.phone && (
                      <div className="flex items-start gap-2">
                        <Phone className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />
                        <a
                          href={`tel:${profile.phone}`}
                          className="text-blue-600 hover:underline"
                        >
                          {profile.phone}
                        </a>
                      </div>
                    )}
                    {profile.email && (
                      <div className="flex items-start gap-2">
                        <Mail className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />
                        <a
                          href={`mailto:${profile.email}`}
                          className="text-blue-600 hover:underline break-all"
                        >
                          {profile.email}
                        </a>
                      </div>
                    )}
                  </div>
                </Card>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
