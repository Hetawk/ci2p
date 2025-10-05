import {
  PrismaClient,
  AwardType,
  ExpType,
  SkillType,
  SkillLevel,
} from "@prisma/client";
import { hashPassword } from "../lib/password";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting seed...");

  // ============================================
  // SUPER ADMIN USER
  // ============================================
  console.log("👤 Seeding super admin user...");

  const adminEmail =
    process.env.ADMIN_EMAIL || "patience@herpromisefulfilled.org";
  const adminPassword = process.env.DASHBOARD_PASSWORD || "loveGod30!ekd";

  // Check if super admin already exists
  const existingSuperAdmin = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  if (!existingSuperAdmin) {
    const hashedPassword = await hashPassword(adminPassword);

    await prisma.user.create({
      data: {
        email: adminEmail,
        name: "Patience Fero",
        username: "patience_admin",
        password: hashedPassword,
        role: "SUPER_ADMIN",
        dashboard: "BOTH",
        active: true,
        emailVerified: true,
      },
    });

    console.log(`✅ Super admin created: ${adminEmail}`);
  } else {
    console.log(`ℹ️  Super admin already exists: ${adminEmail}`);
  }

  // ============================================
  // PERSONAL INFORMATION
  // ============================================
  console.log("📝 Seeding personal information...");

  await prisma.personalInfo.upsert({
    where: { id: "patience-info" },
    update: {},
    create: {
      id: "patience-info",
      fullName: "Patience Fero",
      email: "feropatience@gmail.com",
      phone: "+86 195-5811-1273",
      location: "Hangzhou, China",
      linkedIn: "https://linkedin.com/in/patiefero",
      weChat: "Patieyannah30",
      dateOfBirth: "2000-05-30",
      nationality: "Zimbabwean",
      placeOfBirth: "Harare, Zimbabwe",
      bio: `Ambitious and multidisciplinary scholar pursuing a Master's degree in Applied Economics, with a background in Computer Science & Technology and extensive leadership experience in academic, cultural, and volunteer organizations. Recognized for research potential, analytical problem-solving, and public speaking excellence at national competitions.

Patience combines academic rigor with cross-cultural communication skills and has consistently demonstrated leadership, service, and social entrepreneurship. She is passionate about advancing research in economics, fostering innovation, and empowering communities through education and social impact initiatives.`,
    },
  });

  // ============================================
  // EDUCATION
  // ============================================
  console.log("🎓 Seeding education...");

  await prisma.education.createMany({
    data: [
      {
        degree: "Master of Applied Economics",
        institution: "Zhejiang Sci-Tech University",
        location: "Hangzhou, China",
        startDate: "2023",
        endDate: "Present",
        description:
          "Advancing expertise in economic policy analysis, development economics, and research methodologies to drive sustainable development initiatives.",
        order: 1,
      },
      {
        degree: "Bachelor of Science in Computer Science & Technology",
        institution: "Zhejiang Sci-Tech University",
        location: "Hangzhou, China",
        startDate: "2019",
        endDate: "2023",
        description:
          "Built a strong foundation in technology, problem-solving, and analytical thinking while developing leadership skills and social impact initiatives.",
        order: 2,
      },
    ],
    skipDuplicates: true,
  });

  // ============================================
  // AWARDS & CERTIFICATIONS
  // ============================================
  console.log("🏆 Seeding awards and certifications...");

  await prisma.award.createMany({
    data: [
      // Academic & Public Speaking
      {
        title: "Grand Prize (Special Prize), Public Speaking",
        organization: '"FLTRP-ETIC Cup" English Public Speaking Contest',
        date: "2022",
        description:
          "Achieved the highest distinction in the Online Contest of China's prestigious national competition.",
        category: AwardType.PUBLIC_SPEAKING,
        featured: true,
        order: 1,
      },
      {
        title: "Third Prize, National Final (Public Speaking)",
        organization: '"FLTRP-ETIC Cup" Contest Organizing Committee',
        date: "2022",
        description:
          "Secured a top-three finish in the National Final, competing against students nationwide.",
        category: AwardType.PUBLIC_SPEAKING,
        featured: true,
        order: 2,
      },
      {
        title: "Third Place, Mixed Doubles Badminton",
        organization: "Committee for Physical Education & Sports, ZSTU",
        date: "2020",
        description:
          "Recognized for athletic performance and teamwork in the university badminton tournament.",
        category: AwardType.SPORTS,
        order: 3,
      },
      // Technical & Digital Skills
      {
        title: "Certification: China-Africa Live Streamer",
        organization: "China Africa Bridge (Lofica)",
        date: "2021-08",
        description:
          "Completed theoretical and practical training in digital communication, cross-border e-commerce, and live-streaming operations.",
        category: AwardType.CERTIFICATION,
        order: 4,
      },
      {
        title: "Certificate: Online Winter Computer Concepts Event (OWCCE)",
        organization: "TIT & Urneeds Technology, with Gopawe and MITSG",
        date: "2022-01",
        description:
          "Gained proficiency in Computer Networking, Programming, Software, and Web Development.",
        category: AwardType.TECHNICAL,
        order: 5,
      },
      {
        title: "Third Prize, Video Competition",
        organization: "China Africa Bridge (Lofica)",
        date: "2021-09",
        description:
          "Awarded for creativity and technical skills in multimedia content production.",
        category: AwardType.TECHNICAL,
        order: 6,
      },
      // Leadership Recognition
      {
        title: "Presidium Member, International Students Union",
        organization: "Zhejiang Sci-Tech University",
        date: "2022",
        description:
          "Served in a senior leadership role, participating in strategic decision-making for student affairs.",
        category: AwardType.LEADERSHIP,
        order: 7,
      },
      {
        title: "Recognition, Autumn Experiential Study Trip",
        organization: "Zhejiang Sci-Tech University",
        date: "2022-10",
        description:
          "Commended for active participation and strong performance during international experiential learning programs.",
        category: AwardType.ACADEMIC,
        order: 8,
      },
    ],
    skipDuplicates: true,
  });

  // ============================================
  // PROFESSIONAL EXPERIENCE
  // ============================================
  console.log("💼 Seeding professional experience...");

  await prisma.experience.createMany({
    data: [
      // Leadership
      {
        role: "President",
        organization: "International Student Union",
        location: "Zhejiang Sci-Tech University",
        startDate: "2022-01",
        endDate: "2023-12",
        description:
          "Directed a team to organize academic, cultural, and welfare programs for international students. Acted as the main liaison between international students and the university administration.",
        highlights: JSON.stringify([
          "Led a diverse team organizing campus-wide events",
          "Facilitated cross-cultural understanding and integration",
          "Advocated for international student welfare and rights",
        ]),
        type: ExpType.LEADERSHIP,
        order: 1,
      },
      {
        role: "Vice Director, Life Mutual-Aid Department",
        organization:
          "International Student Union, Zhejiang Sci-Tech University",
        location: "Hangzhou, China",
        startDate: "2021-01",
        endDate: "2022-12",
        description:
          "Managed student support activities, including wellness programs, cultural exchanges, and holiday initiatives.",
        highlights: JSON.stringify([
          "Organized wellness and support programs",
          "Coordinated cultural exchange activities",
          "Managed holiday celebration initiatives",
        ]),
        type: ExpType.LEADERSHIP,
        order: 2,
      },
      // Entrepreneurship
      {
        role: "Founder & Director",
        organization: "Her Promise Fulfilled",
        location: "Global",
        startDate: "2025-01",
        endDate: "Present",
        description:
          "Established a nonprofit organization dedicated to empowering single mothers, widows, children, and disadvantaged families through education, economic support, and community development.",
        highlights: JSON.stringify([
          "Designed targeted empowerment programs for vulnerable families",
          "Led education and economic development initiatives",
          "Built sustainable community engagement strategies",
          "Developed programs focused on breaking cycles of poverty",
        ]),
        type: ExpType.ENTREPRENEURSHIP,
        order: 3,
      },
      // Professional
      {
        role: "Private Academic Tutor",
        organization: "Self-Employed",
        location: "Hangzhou, China",
        startDate: "2020-01",
        endDate: "Present",
        description:
          "Delivered academic tutoring across disciplines, emphasizing critical thinking, communication, and technical subjects.",
        highlights: JSON.stringify([
          "Mentored students in academic excellence",
          "Developed customized learning strategies",
          "Fostered confidence and independent thinking",
        ]),
        type: ExpType.PROFESSIONAL,
        order: 4,
      },
      // Volunteer
      {
        role: "Volunteer, Higher Education Accreditation",
        organization: "Zhejiang Sci-Tech University",
        location: "Hangzhou, China",
        startDate: "2022-11",
        endDate: "2022-11",
        description:
          "Supported accreditation review through translation, orientation, and coordination.",
        type: ExpType.VOLUNTEER,
        order: 5,
      },
      {
        role: "Volunteer, Summer Self-Management Team",
        organization: "Zhejiang Sci-Tech University",
        location: "Hangzhou, China",
        startDate: "2022-06",
        endDate: "2022-08",
        description:
          "Helped manage operations and student activities during vacation periods.",
        type: ExpType.VOLUNTEER,
        order: 6,
      },
      {
        role: "Community Service Volunteer",
        organization: "Riverlea Community",
        location: "South Africa",
        startDate: "2014-01",
        endDate: "2018-12",
        description:
          "Organized youth education, mentorship, and recreational initiatives in local communities.",
        highlights: JSON.stringify([
          "Led youth education programs",
          "Provided mentorship to young people",
          "Organized recreational and community activities",
        ]),
        type: ExpType.VOLUNTEER,
        order: 7,
      },
    ],
    skipDuplicates: true,
  });

  // ============================================
  // SKILLS
  // ============================================
  console.log("🔧 Seeding skills...");

  await prisma.skill.createMany({
    data: [
      // Research & Analysis
      {
        name: "Research Methodology",
        category: SkillType.RESEARCH,
        level: SkillLevel.ADVANCED,
        order: 1,
      },
      {
        name: "Academic Inquiry",
        category: SkillType.RESEARCH,
        level: SkillLevel.ADVANCED,
        order: 2,
      },
      {
        name: "Data Analysis",
        category: SkillType.RESEARCH,
        level: SkillLevel.ADVANCED,
        order: 3,
      },

      // Economics & Policy
      {
        name: "Applied Economics",
        category: SkillType.ECONOMICS,
        level: SkillLevel.ADVANCED,
        order: 4,
      },
      {
        name: "Policy Analysis",
        category: SkillType.ECONOMICS,
        level: SkillLevel.ADVANCED,
        order: 5,
      },
      {
        name: "Economic Development",
        category: SkillType.ECONOMICS,
        level: SkillLevel.INTERMEDIATE,
        order: 6,
      },

      // Technical
      {
        name: "Computer Networking",
        category: SkillType.TECHNICAL,
        level: SkillLevel.INTERMEDIATE,
        order: 7,
      },
      {
        name: "Programming",
        category: SkillType.TECHNICAL,
        level: SkillLevel.INTERMEDIATE,
        order: 8,
      },
      {
        name: "Web Development",
        category: SkillType.TECHNICAL,
        level: SkillLevel.INTERMEDIATE,
        order: 9,
      },
      {
        name: "Mobile App Development",
        category: SkillType.TECHNICAL,
        level: SkillLevel.INTERMEDIATE,
        order: 10,
      },

      // Communication
      {
        name: "Public Speaking",
        category: SkillType.COMMUNICATION,
        level: SkillLevel.ADVANCED,
        order: 11,
      },
      {
        name: "Academic Writing",
        category: SkillType.COMMUNICATION,
        level: SkillLevel.ADVANCED,
        order: 12,
      },
      {
        name: "Debate",
        category: SkillType.COMMUNICATION,
        level: SkillLevel.ADVANCED,
        order: 13,
      },
      {
        name: "Cross-Cultural Communication",
        category: SkillType.COMMUNICATION,
        level: SkillLevel.ADVANCED,
        order: 14,
      },

      // Leadership
      {
        name: "Project Management",
        category: SkillType.LEADERSHIP,
        level: SkillLevel.ADVANCED,
        order: 15,
      },
      {
        name: "Team Leadership",
        category: SkillType.LEADERSHIP,
        level: SkillLevel.ADVANCED,
        order: 16,
      },
      {
        name: "Event Coordination",
        category: SkillType.LEADERSHIP,
        level: SkillLevel.ADVANCED,
        order: 17,
      },
      {
        name: "Nonprofit Management",
        category: SkillType.LEADERSHIP,
        level: SkillLevel.INTERMEDIATE,
        order: 18,
      },
      {
        name: "Social Entrepreneurship",
        category: SkillType.LEADERSHIP,
        level: SkillLevel.ADVANCED,
        order: 19,
      },
    ],
    skipDuplicates: true,
  });

  // ============================================
  // LANGUAGES
  // ============================================
  console.log("🌍 Seeding languages...");

  await prisma.language.createMany({
    data: [
      { name: "English", level: SkillLevel.FLUENT, order: 1 },
      { name: "Shona", level: SkillLevel.NATIVE, order: 2 },
      { name: "Afrikaans", level: SkillLevel.BASIC, order: 3 },
      { name: "Mandarin Chinese", level: SkillLevel.BASIC, order: 4 },
    ],
    skipDuplicates: true,
  });

  // ============================================
  // RESEARCH & PROJECTS
  // ============================================
  console.log("📚 Seeding research projects...");

  await prisma.research.createMany({
    data: [
      {
        title: "Project Management Systems",
        description:
          "Participated in projects integrating theory with practical implementation in project management systems.",
        status: "Completed",
        date: "2022",
        order: 1,
      },
      {
        title: "Mobile Application Development",
        description:
          "Developed mobile applications with focus on user experience and practical functionality.",
        status: "Completed",
        date: "2022",
        order: 2,
      },
      {
        title: "Systems Design",
        description:
          "Engaged in systems design projects combining theoretical knowledge with practical applications.",
        status: "Completed",
        date: "2021",
        order: 3,
      },
    ],
    skipDuplicates: true,
  });

  console.log("✅ Seed completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
