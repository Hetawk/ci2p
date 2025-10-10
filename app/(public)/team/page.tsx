import { Metadata } from "next";
import { MemberCard, TeamMember } from "@/components/team";
import { Button } from "@/components/ui/button";
import { Users, GraduationCap, Sparkles, Award, Mail } from "lucide-react";

export const metadata: Metadata = {
  title: "Our Team - CI2P Research Lab | University of Jinan",
  description:
    "Meet the talented researchers, graduate students, and alumni of CI2P Lab at University of Jinan. Join our team advancing AI, ML, and Medical Image Analysis research.",
};

// Team members data (based on Professor Niu's information)
const teamMembers: TeamMember[] = [
  // Faculty
  {
    id: "sijie-niu",
    name: "Prof. Sijie Niu",
    role: "Professor & Doctoral Supervisor",
    category: "faculty",
    photo: "/SJ.jpg",
    email: "ise_niusj@ujn.edu.cn",
    researchInterests: [
      "Machine Learning",
      "Pattern Recognition",
      "Medical Image Analysis",
      "Remote Sensing",
    ],
    orcid: "0000-0002-1401-9859",
    github: "sjniu",
  },

  // Master's Students
  {
    id: "member-1",
    name: "Zhang Wei",
    role: "Master's Student",
    category: "masters",
    researchInterests: ["Deep Learning", "Computer Vision", "Medical Imaging"],
  },
  {
    id: "member-2",
    name: "Li Ming",
    role: "Master's Student",
    category: "masters",
    researchInterests: ["Machine Learning", "Pattern Recognition"],
  },
  {
    id: "member-3",
    name: "Wang Fang",
    role: "Master's Student",
    category: "masters",
    researchInterests: ["Natural Language Processing", "AI"],
  },
  {
    id: "member-4",
    name: "Chen Jing",
    role: "Master's Student",
    category: "masters",
    researchInterests: ["Computer Vision", "Image Processing"],
  },
  {
    id: "member-5",
    name: "Liu Yang",
    role: "Master's Student",
    category: "masters",
    researchInterests: ["Deep Learning", "Medical AI"],
  },
  {
    id: "member-6",
    name: "Zhao Lei",
    role: "Master's Student",
    category: "masters",
    researchInterests: ["Remote Sensing", "Image Analysis"],
  },
  {
    id: "member-7",
    name: "Wu Hua",
    role: "Master's Student",
    category: "masters",
    researchInterests: ["Machine Learning", "Data Science"],
  },
  {
    id: "member-8",
    name: "Zhou Xin",
    role: "Master's Student",
    category: "masters",
    researchInterests: ["AI", "Pattern Recognition"],
  },
  {
    id: "member-9",
    name: "Xu Min",
    role: "Master's Student",
    category: "masters",
    researchInterests: ["Computer Vision", "Deep Learning"],
  },
  {
    id: "member-10",
    name: "Sun Qiang",
    role: "Master's Student",
    category: "masters",
    researchInterests: ["Medical Imaging", "AI"],
  },
  {
    id: "member-11",
    name: "Ma Li",
    role: "Master's Student",
    category: "masters",
    researchInterests: ["Machine Learning", "Computer Vision"],
  },
  {
    id: "member-12",
    name: "Gao Ting",
    role: "Master's Student",
    category: "masters",
    researchInterests: ["Deep Learning", "Image Processing"],
  },
  {
    id: "member-13",
    name: "Huang Yan",
    role: "Master's Student",
    category: "masters",
    researchInterests: ["AI", "Pattern Recognition"],
  },

  // Undergraduate Students
  {
    id: "undergrad-1",
    name: "Song Jie",
    role: "Undergraduate Researcher",
    category: "undergrad",
    researchInterests: ["Machine Learning", "Data Analysis"],
  },
  {
    id: "undergrad-2",
    name: "Tang Hao",
    role: "Undergraduate Researcher",
    category: "undergrad",
    researchInterests: ["Computer Vision", "AI"],
  },
  {
    id: "undergrad-3",
    name: "Zhu Mei",
    role: "Undergraduate Researcher",
    category: "undergrad",
    researchInterests: ["Deep Learning", "Image Processing"],
  },
  {
    id: "undergrad-4",
    name: "Feng Bo",
    role: "Undergraduate Researcher",
    category: "undergrad",
    researchInterests: ["AI", "Machine Learning"],
  },
  {
    id: "undergrad-5",
    name: "Deng Xia",
    role: "Undergraduate Researcher",
    category: "undergrad",
    researchInterests: ["Computer Vision", "Pattern Recognition"],
  },

  // Alumni (examples)
  {
    id: "alumni-1",
    name: "Dr. Lin Cheng",
    role: "Research Scientist",
    category: "alumni",
    graduationYear: "2022",
    currentPosition: "AI Research Scientist at Alibaba",
    researchInterests: ["Deep Learning", "Computer Vision"],
  },
  {
    id: "alumni-2",
    name: "Dr. Yang Xu",
    role: "Assistant Professor",
    category: "alumni",
    graduationYear: "2021",
    currentPosition: "Assistant Professor at Shandong University",
    researchInterests: ["Medical Image Analysis", "AI"],
  },
  {
    id: "alumni-3",
    name: "Chen Rui",
    role: "Software Engineer",
    category: "alumni",
    graduationYear: "2023",
    currentPosition: "ML Engineer at Tencent",
    researchInterests: ["Machine Learning", "NLP"],
  },
  {
    id: "alumni-4",
    name: "Wang Dong",
    role: "Data Scientist",
    category: "alumni",
    graduationYear: "2022",
    currentPosition: "Data Scientist at ByteDance",
    researchInterests: ["Data Science", "AI"],
  },
  {
    id: "alumni-5",
    name: "Li Shuai",
    role: "PhD Candidate",
    category: "alumni",
    graduationYear: "2021",
    currentPosition: "PhD Student at University of California",
    researchInterests: ["Computer Vision", "Deep Learning"],
  },
  {
    id: "alumni-6",
    name: "Zhang Hong",
    role: "Research Engineer",
    category: "alumni",
    graduationYear: "2020",
    currentPosition: "Research Engineer at Huawei",
    researchInterests: ["AI", "Pattern Recognition"],
  },
  {
    id: "alumni-7",
    name: "Liu Peng",
    role: "Algorithm Engineer",
    category: "alumni",
    graduationYear: "2023",
    currentPosition: "Algorithm Engineer at Baidu",
    researchInterests: ["Machine Learning", "Computer Vision"],
  },
  {
    id: "alumni-8",
    name: "Zhao Na",
    role: "Postdoctoral Researcher",
    category: "alumni",
    graduationYear: "2019",
    currentPosition: "Postdoc at Peking University",
    researchInterests: ["Medical Imaging", "Deep Learning"],
  },
];

export default function TeamPage() {
  // Filter team members by category
  const faculty = teamMembers.filter((m) => m.category === "faculty");
  const masters = teamMembers.filter((m) => m.category === "masters");
  const undergrads = teamMembers.filter((m) => m.category === "undergrad");
  const alumni = teamMembers.filter((m) => m.category === "alumni");

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
                <Users className="w-8 h-8 text-primary-300" />
              </div>
            </div>
            <h1 className="text-5xl lg:text-6xl font-bold text-white">
              Our <span className="text-secondary-400">Team</span>
            </h1>
            <p className="text-xl text-gray-200 max-w-3xl mx-auto leading-relaxed">
              Meet the talented researchers, students, and alumni driving
              innovation in AI, Machine Learning, and Computer Vision at CI2P
              Lab
            </p>

            {/* Stats */}
            <div className="flex items-center justify-center gap-8 pt-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-secondary-400">
                  {faculty.length}
                </div>
                <div className="text-sm text-gray-300">Faculty</div>
              </div>
              <div className="w-px h-12 bg-gray-600" />
              <div className="text-center">
                <div className="text-3xl font-bold text-secondary-400">
                  {masters.length}
                </div>
                <div className="text-sm text-gray-300">
                  Master&apos;s Students
                </div>
              </div>
              <div className="w-px h-12 bg-gray-600" />
              <div className="text-center">
                <div className="text-3xl font-bold text-secondary-400">
                  {undergrads.length}
                </div>
                <div className="text-sm text-gray-300">Undergrads</div>
              </div>
              <div className="w-px h-12 bg-gray-600" />
              <div className="text-center">
                <div className="text-3xl font-bold text-secondary-400">
                  {alumni.length}
                </div>
                <div className="text-sm text-gray-300">Alumni</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Faculty Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="flex items-center gap-3 mb-12">
            <div className="p-3 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl shadow-lg">
              <Award className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-4xl font-bold text-gray-900">Faculty</h2>
              <p className="text-gray-600">
                Lab Director & Principal Investigator
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {faculty.map((member, index) => (
              <MemberCard key={member.id} member={member} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* Master's Students Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-blue-50/50 via-white to-cyan-50/30">
        <div className="container mx-auto max-w-7xl">
          <div className="flex items-center gap-3 mb-12">
            <div className="p-3 bg-gradient-to-br from-secondary-500 to-secondary-600 rounded-xl shadow-lg">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-4xl font-bold text-gray-900">
                Master&apos;s Students
              </h2>
              <p className="text-gray-600">Graduate Researchers</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {masters.map((member, index) => (
              <MemberCard key={member.id} member={member} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* Undergraduate Students Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="flex items-center gap-3 mb-12">
            <div className="p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg">
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

      {/* Alumni Section */}
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

      {/* Join Team CTA */}
      <section className="py-20 px-4 bg-gradient-to-br from-primary-600 via-primary-700 to-secondary-600">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-4xl font-bold text-white mb-6">Join Our Team</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            We&apos;re always looking for talented, passionate researchers to
            join our lab. Explore opportunities for Master&apos;s students,
            undergraduate research, and collaborations.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-white text-primary-700 hover:bg-gray-100 shadow-xl"
            >
              <GraduationCap className="w-5 h-5 mr-2" />
              Graduate Programs
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-2 border-white text-white hover:bg-white/10 shadow-xl"
            >
              <Mail className="w-5 h-5 mr-2" />
              Contact Us
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
