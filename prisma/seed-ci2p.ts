// CI2P Lab Platform - Database Seed Script
// Seeds initial data: Professor Niu, sample publications, projects

import { PrismaClient, Role, ProjectStatus } from "@prisma/client";
import { hashPassword } from "../lib/password";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting CI2P Lab seed...");

  // ============================================
  // PROFESSOR NIU - Lab Director
  // ============================================
  console.log("👤 Seeding Professor Niu...");

  const profEmail = "niu@ujn.edu.cn";
  const profPassword = process.env.PROF_PASSWORD || "ChangeMeSecure123!";

  let profUser = await prisma.user.findUnique({
    where: { email: profEmail },
  });

  if (!profUser) {
    const hashedPassword = await hashPassword(profPassword);

    profUser = await prisma.user.create({
      data: {
        email: profEmail,
        name: "Professor Niu",
        username: "prof_niu",
        password: hashedPassword,
        role: Role.SUPER_ADMIN,
        active: true,
        emailVerified: true,
        profile: {
          create: {
            fullName: "Professor Niu",
            title: "Lab Director & Principal Investigator",
            bio: "Leading researcher in Machine Learning, Artificial Intelligence, and Image Processing. Director of CI2P Research Lab at University of Jinan, Key Laboratory of Intelligent Computing Technology.",
            avatar: "/SJ.jpg",
            showInTeam: true,
            teamOrder: 1,
            // Add ORCID if available
            // orcidId: "0000-0000-0000-0000",
          },
        },
      },
      include: {
        profile: true,
      },
    });

    console.log(`✅ Professor Niu created: ${profEmail}`);
  } else {
    console.log(`ℹ️  Professor Niu already exists: ${profEmail}`);

    // Ensure profile exists
    const profile = await prisma.profile.findUnique({
      where: { userId: profUser.id },
    });

    if (!profile) {
      await prisma.profile.create({
        data: {
          userId: profUser.id,
          fullName: "Professor Niu",
          title: "Lab Director & Principal Investigator",
          bio: "Leading researcher in Machine Learning, Artificial Intelligence, and Image Processing. Director of CI2P Research Lab at University of Jinan, Key Laboratory of Intelligent Computing Technology.",
          avatar: "/SJ.jpg",
          showInTeam: true,
          teamOrder: 1,
        },
      });
      console.log("✅ Professor Niu profile created");
    }
  }

  // ============================================
  // SAMPLE RESEARCHERS
  // ============================================
  console.log("👥 Seeding sample researchers...");

  const researchers = [
    {
      email: "researcher1@ujn.edu.cn",
      name: "Dr. Zhang Wei",
      title: "Senior Researcher - Machine Learning",
      teamOrder: 2,
    },
    {
      email: "researcher2@ujn.edu.cn",
      name: "Dr. Li Ming",
      title: "Senior Researcher - Computer Vision",
      teamOrder: 3,
    },
    {
      email: "phd1@ujn.edu.cn",
      name: "Wang Fang",
      title: "PhD Candidate - Deep Learning",
      teamOrder: 4,
      role: Role.STUDENT,
    },
  ];

  for (const researcher of researchers) {
    const existingUser = await prisma.user.findUnique({
      where: { email: researcher.email },
    });

    if (!existingUser) {
      const hashedPassword = await hashPassword("Welcome123!");

      await prisma.user.create({
        data: {
          email: researcher.email,
          name: researcher.name,
          username: researcher.email.split("@")[0],
          password: hashedPassword,
          role: researcher.role || Role.RESEARCHER,
          active: true,
          emailVerified: true,
          profile: {
            create: {
              fullName: researcher.name,
              title: researcher.title,
              showInTeam: true,
              teamOrder: researcher.teamOrder,
            },
          },
        },
      });
      console.log(`✅ Created: ${researcher.name}`);
    }
  }

  // ============================================
  // SAMPLE PUBLICATIONS
  // ============================================
  console.log("📚 Seeding sample publications...");

  const publications = [
    {
      title:
        "Advanced Deep Learning Techniques for Image Recognition in Smart Cities",
      abstract:
        "This paper presents novel deep learning architectures for real-time image recognition systems deployed in smart city environments. Our approach achieves state-of-the-art accuracy while maintaining computational efficiency.",
      year: 2024,
      journal: "IEEE Transactions on Image Processing",
      doi: "10.1109/TIP.2024.12345",
      isFeatured: true,
      featuredOrder: 1,
    },
    {
      title: "Neural Network Optimization for Edge Computing in IoT Devices",
      abstract:
        "We propose lightweight neural network models optimized for deployment on resource-constrained IoT devices. Our method reduces model size by 70% while maintaining 95% accuracy.",
      year: 2024,
      journal: "Journal of Machine Learning Research",
      doi: "10.5555/JMLR.2024.67890",
      isFeatured: true,
      featuredOrder: 2,
    },
    {
      title: "Intelligent Computing Systems for Medical Image Analysis",
      abstract:
        "An intelligent computing framework for automated medical image analysis, focusing on early disease detection using advanced AI algorithms.",
      year: 2023,
      journal: "Medical Image Analysis",
      doi: "10.1016/j.media.2023.54321",
      isFeatured: true,
      featuredOrder: 3,
    },
  ];

  for (const pub of publications) {
    const existing = await prisma.publication.findFirst({
      where: { title: pub.title },
    });

    if (!existing) {
      await prisma.publication.create({
        data: {
          ...pub,
          type: "JOURNAL_ARTICLE",
          authorId: profUser.id,
          isPublished: true,
          views: Math.floor(Math.random() * 500) + 100,
          downloads: Math.floor(Math.random() * 200) + 50,
          citations: Math.floor(Math.random() * 50) + 10,
        },
      });
      console.log(`✅ Created publication: ${pub.title.substring(0, 50)}...`);
    }
  }

  // ============================================
  // SAMPLE PROJECTS
  // ============================================
  console.log("🔬 Seeding sample projects...");

  const projects = [
    {
      title: "Smart City AI Vision System",
      description:
        "Development of an intelligent vision system for smart city applications, including traffic monitoring, crowd analysis, and urban planning support.",
      startDate: new Date("2023-01-15"),
      endDate: new Date("2025-12-31"),
      status: ProjectStatus.ACTIVE,
      fundingSource: "National Natural Science Foundation of China",
      fundingAmount: 1500000,
      isFeatured: true,
      tags: JSON.stringify([
        "Computer Vision",
        "Smart Cities",
        "Deep Learning",
        "IoT",
      ]),
    },
    {
      title: "Medical Image Analysis Platform",
      description:
        "AI-powered platform for automated medical image analysis, assisting radiologists in early disease detection and diagnosis.",
      startDate: new Date("2023-06-01"),
      endDate: new Date("2026-05-31"),
      status: ProjectStatus.ACTIVE,
      fundingSource: "Shandong Provincial Science and Technology Department",
      fundingAmount: 1200000,
      isFeatured: true,
      tags: JSON.stringify([
        "Medical AI",
        "Image Processing",
        "Healthcare",
        "Deep Learning",
      ]),
    },
    {
      title: "Intelligent Manufacturing Quality Control",
      description:
        "Machine learning system for real-time quality control in manufacturing processes, reducing defects and improving efficiency.",
      startDate: new Date("2024-01-01"),
      endDate: new Date("2026-12-31"),
      status: ProjectStatus.ACTIVE,
      fundingSource: "Industry Collaboration - Jinan Tech Corp",
      fundingAmount: 800000,
      isFeatured: true,
      tags: JSON.stringify([
        "Industrial AI",
        "Quality Control",
        "Machine Learning",
        "Automation",
      ]),
    },
  ];

  for (const project of projects) {
    const existing = await prisma.project.findFirst({
      where: { title: project.title },
    });

    if (!existing) {
      const createdProject = await prisma.project.create({
        data: {
          ...project,
          leaderId: profUser.id,
          isPublished: true,
        },
      });

      // Add Professor Niu as project leader
      await prisma.projectMember.create({
        data: {
          projectId: createdProject.id,
          userId: profUser.id,
          role: "Principal Investigator",
          isPrimary: true,
        },
      });

      console.log(`✅ Created project: ${project.title}`);
    }
  }

  // ============================================
  // LAB METRICS
  // ============================================
  console.log("📊 Updating lab metrics...");

  const today = new Date();
  const existingMetric = await prisma.labMetric.findFirst({
    where: {
      date: {
        gte: new Date(today.getFullYear(), today.getMonth(), 1),
      },
    },
  });

  if (!existingMetric) {
    await prisma.labMetric.create({
      data: {
        date: today,
        publicationCount: await prisma.publication.count({
          where: { isPublished: true },
        }),
        projectCount: await prisma.project.count({
          where: { status: ProjectStatus.ACTIVE },
        }),
        memberCount: await prisma.user.count({ where: { active: true } }),
        citationCount:
          (
            await prisma.publication.aggregate({
              _sum: { citations: true },
            })
          )._sum.citations || 0,
      },
    });
    console.log("✅ Lab metrics updated");
  }

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
