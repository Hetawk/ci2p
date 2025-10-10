import { Metadata } from "next";
import { MemberCard, TeamMember } from "@/components/team";
import { Button } from "@/components/ui/button";
import { Users, GraduationCap, Sparkles, Award, Mail } from "lucide-react";
import { UserRole } from "@prisma/client";

export const metadata: Metadata = {
  title: "Our Team - CI2P Research Lab | University of Jinan",
  description:
    "Meet the talented researchers, graduate students, and alumni of CI2P Lab at University of Jinan. Join our team advancing AI, ML, and Medical Image Analysis research.",
};

// Mark this page as dynamic (not static)
export const dynamic = "force-dynamic";

// Fetch team members from API
async function getTeamMembers(): Promise<TeamMember[]> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const response = await fetch(
      `${baseUrl}/api/users?showInTeam=true&limit=100`,
      {
        cache: "no-store",
      }
    );

    if (!response.ok) {
      console.error("Failed to fetch team members");
      return [];
    }

    const data = await response.json();

    // Map API response to TeamMember format
    return data.users.map(
      (user: {
        id: string;
        role: UserRole;
        profile: {
          fullName: string;
          chineseName?: string;
          title?: string;
          avatar?: string;
          email?: string;
          interests?: string;
          orcidId?: string;
          github?: string;
          publicationCount?: number;
          projectCount?: number;
        };
      }) => {
        const profile = user.profile;

        // Determine category based on role and title
        let category: "faculty" | "phd" | "masters" | "undergrad" | "alumni" =
          "masters";
        if (
          user.role === UserRole.SUPER_ADMIN ||
          profile.title?.includes("Professor")
        ) {
          category = "faculty";
        } else if (profile.title?.includes("PhD")) {
          category = "phd";
        } else if (profile.title?.includes("Master")) {
          category = "masters";
        } else if (profile.title?.includes("Undergraduate")) {
          category = "undergrad";
        }

        return {
          id: user.id,
          name: profile.fullName || "Unknown",
          chineseName: profile.chineseName,
          role: profile.title || "Researcher",
          category,
          photo: profile.avatar,
          email: profile.email,
          researchInterests:
            profile.interests?.split(",").map((i: string) => i.trim()) || [],
          orcid: profile.orcidId,
          github: profile.github,
          publications: profile.publicationCount || 0,
          projects: profile.projectCount || 0,
        };
      }
    );
  } catch (error) {
    console.error("Error fetching team members:", error);
    return [];
  }
}

export default async function TeamPage() {
  const allMembers = await getTeamMembers();

  // Members are already sorted by teamOrder from the API

  // Group by category
  const faculty = allMembers.filter((m) => m.category === "faculty");
  const phd = allMembers.filter((m) => m.category === "phd");
  const masters = allMembers.filter((m) => m.category === "masters");
  const undergrads = allMembers.filter((m) => m.category === "undergrad");
  const alumni = allMembers.filter((m) => m.category === "alumni");

  return (
    <main className="min-h-screen bg-gradient-to-br from-white via-blue-50/30 to-slate-50">
      {/* Hero Section */}
      <section className="relative py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 via-transparent to-indigo-600/5" />

        <div className="container mx-auto max-w-7xl relative">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-6">
              <Users className="w-4 h-4" />
              Research Team
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Meet Our Team
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed">
              A diverse group of researchers, students, and collaborators
              advancing the frontiers of artificial intelligence and intelligent
              perception at University of Jinan.
            </p>
          </div>

          {/* Team Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="text-3xl font-bold text-blue-600 mb-1">
                {allMembers.length}
              </div>
              <div className="text-sm text-gray-600">Team Members</div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="text-3xl font-bold text-green-600 mb-1">
                {allMembers.reduce((sum, m) => sum + (m.publications || 0), 0)}
              </div>
              <div className="text-sm text-gray-600">Publications</div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="text-3xl font-bold text-purple-600 mb-1">
                {allMembers.reduce((sum, m) => sum + (m.projects || 0), 0)}
              </div>
              <div className="text-sm text-gray-600">Active Projects</div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="text-3xl font-bold text-orange-600 mb-1">
                {faculty.length}
              </div>
              <div className="text-sm text-gray-600">Faculty Members</div>
            </div>
          </div>
        </div>
      </section>

      {/* Faculty Section */}
      {faculty.length > 0 && (
        <section className="py-20 px-4 bg-white">
          <div className="container mx-auto max-w-7xl">
            <div className="flex items-center gap-3 mb-12">
              <div className="p-3 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl shadow-lg">
                <Award className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-4xl font-bold text-gray-900">
                  Faculty & Principal Investigators
                </h2>
                <p className="text-gray-600">Leading Research Excellence</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {faculty.map((member, index) => (
                <MemberCard key={member.id} member={member} index={index} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* PhD Students Section */}
      {phd.length > 0 && (
        <section className="py-20 px-4 bg-gradient-to-br from-blue-50 via-indigo-50/30 to-purple-50">
          <div className="container mx-auto max-w-7xl">
            <div className="flex items-center gap-3 mb-12">
              <div className="p-3 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl shadow-lg">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-4xl font-bold text-gray-900">
                  PhD Students
                </h2>
                <p className="text-gray-600">Advanced Research Contributors</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {phd.map((member, index) => (
                <MemberCard key={member.id} member={member} index={index} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Master's Students Section */}
      {masters.length > 0 && (
        <section className="py-20 px-4 bg-white">
          <div className="container mx-auto max-w-7xl">
            <div className="flex items-center gap-3 mb-12">
              <div className="p-3 bg-gradient-to-br from-green-600 to-teal-600 rounded-xl shadow-lg">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-4xl font-bold text-gray-900">
                  Master&apos;s Students
                </h2>
                <p className="text-gray-600">Emerging Researchers</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
              {masters.map((member, index) => (
                <MemberCard key={member.id} member={member} index={index} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Undergraduate Students Section */}
      {undergrads.length > 0 && (
        <section className="py-20 px-4 bg-gradient-to-br from-purple-50 via-pink-50/30 to-rose-50">
          <div className="container mx-auto max-w-7xl">
            <div className="flex items-center gap-3 mb-12">
              <div className="p-3 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl shadow-lg">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-4xl font-bold text-gray-900">
                  Undergraduate Researchers
                </h2>
                <p className="text-gray-600">Future Leaders in AI Research</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
              {undergrads.map((member, index) => (
                <MemberCard key={member.id} member={member} index={index} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Alumni Section */}
      {alumni.length > 0 && (
        <section className="py-20 px-4 bg-gradient-to-br from-slate-50 via-gray-50 to-slate-50">
          <div className="container mx-auto max-w-7xl">
            <div className="flex items-center gap-3 mb-12">
              <div className="p-3 bg-gradient-to-br from-gray-700 to-gray-800 rounded-xl shadow-lg">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-4xl font-bold text-gray-900">Alumni</h2>
                <p className="text-gray-600">Success Stories from CI2P Lab</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {alumni.map((member, index) => (
                <MemberCard key={member.id} member={member} index={index} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Join Team CTA */}
      <section className="py-20 px-4 bg-gradient-to-br from-blue-600 to-indigo-700">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-4xl font-bold text-white mb-6">Join Our Team</h2>
          <p className="text-xl text-blue-100 mb-8 leading-relaxed">
            We&apos;re always looking for talented and motivated individuals to
            join our research group. Explore opportunities for PhD,
            Master&apos;s, and undergraduate research positions.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Button
              size="lg"
              variant="secondary"
              className="bg-white text-blue-600 hover:bg-gray-50"
            >
              <Mail className="w-5 h-5 mr-2" />
              Contact Us
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white/10"
            >
              View Open Positions
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}
