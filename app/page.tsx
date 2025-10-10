// CI2P Research Lab - Homepage
// University of Jinan - Key Laboratory of Intelligent Computing Technology

import { HeroSection } from "@/components/hero/HeroSection";
import { prisma } from "@/lib/prisma";

// Fetch hero data (ISR every 1 hour)
async function getHeroData() {
  // Get team members for carousel (showInTeam = true, ordered by teamOrder)
  const teamMembers = await prisma.profile.findMany({
    where: {
      showInTeam: true,
      user: { active: true },
    },
    select: {
      id: true,
      fullName: true,
      title: true,
      avatar: true,
      teamOrder: true,
    },
    orderBy: { teamOrder: "asc" },
    take: 5,
  });

  // Get stats
  const [publicationsCount, projectsCount, membersCount] = await Promise.all([
    prisma.publication.count({ where: { isPublished: true } }),
    prisma.project.count({ where: { status: "ACTIVE", isPublished: true } }),
    prisma.user.count({ where: { active: true } }),
  ]);

  return {
    teamMembers,
    stats: {
      publications: publicationsCount,
      projects: projectsCount,
      members: membersCount,
    },
  };
}

export default async function HomePage() {
  const heroData = await getHeroData();

  return (
    <>
      {/* Hero Section */}
      <HeroSection teamMembers={heroData.teamMembers} stats={heroData.stats} />

      {/* Featured Research Section */}
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Featured Research</h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Explore our latest groundbreaking research in Machine Learning,
              AI, and Image Processing
            </p>
          </div>

          <div className="text-center text-gray-500">
            Featured papers component coming soon...
          </div>
        </div>
      </section>

      {/* Research Areas Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Research Areas</h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Our lab focuses on cutting-edge research in intelligent computing
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Machine Learning",
                icon: "🤖",
                desc: "Deep learning, neural networks, and pattern recognition",
              },
              {
                title: "Artificial Intelligence",
                icon: "🧠",
                desc: "Intelligent systems and cognitive computing",
              },
              {
                title: "Image Processing",
                icon: "📷",
                desc: "Computer vision and image analysis",
              },
            ].map((area) => (
              <div
                key={area.title}
                className="p-6 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl hover:shadow-lg transition-shadow"
              >
                <div className="text-5xl mb-4">{area.icon}</div>
                <h3 className="text-xl font-bold mb-2">{area.title}</h3>
                <p className="text-gray-600">{area.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
