import {
  PrismaClient,
  UserRole,
  PublicationType,
  ProjectStatus,
  ResourceStatus,
  ProjectRole,
} from "@prisma/client";
import { hashPassword } from "../lib/password";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting CI2P Research Lab seed...");

  const password = await hashPassword("password123");

  // USERS & PROFILES
  console.log("👥 Creating users...");

  const admin = await prisma.user.upsert({
    where: { email: "admin@ci2p.ujn.edu.cn" },
    update: {},
    create: {
      email: "admin@ci2p.ujn.edu.cn",
      username: "admin",
      password,
      role: UserRole.SUPER_ADMIN,
      emailVerified: true,
      active: true,
      profile: {
        create: {
          fullName: "Dr. Wei Zhang",
          chineseName: "张伟",
          title: "Professor & Lab Director",
          bio: "Leading expert in artificial intelligence with over 15 years of research experience in machine learning, deep learning, and computer vision. Director of CI2P Research Lab at University of Jinan.",
          interests:
            "Artificial Intelligence, Machine Learning, Deep Learning, Computer Vision, Medical AI",
          email: "wei.zhang@ci2p.ujn.edu.cn",
          phone: "+86 531 8276 8888",
          showInTeam: true,
          teamOrder: 1,
          googleScholar: "https://scholar.google.com/citations?user=weizhang",
          orcidId: "0000-0001-2345-6789",
        },
      },
    },
    include: { profile: true },
  });

  const researcher1 = await prisma.user.upsert({
    where: { email: "liu.ming@ci2p.ujn.edu.cn" },
    update: {},
    create: {
      email: "liu.ming@ci2p.ujn.edu.cn",
      username: "liuming",
      password,
      role: UserRole.RESEARCHER,
      emailVerified: true,
      active: true,
      profile: {
        create: {
          fullName: "Dr. Ming Liu",
          chineseName: "刘明",
          title: "Associate Professor",
          bio: "Expert in natural language processing and text mining with focus on machine translation and information retrieval systems.",
          interests:
            "NLP, Machine Translation, Information Retrieval, Text Mining, Semantic Analysis",
          email: "liu.ming@ci2p.ujn.edu.cn",
          showInTeam: true,
          teamOrder: 2,
          googleScholar: "https://scholar.google.com/citations?user=liuming",
        },
      },
    },
    include: { profile: true },
  });

  const researcher2 = await prisma.user.upsert({
    where: { email: "wang.fang@ci2p.ujn.edu.cn" },
    update: {},
    create: {
      email: "wang.fang@ci2p.ujn.edu.cn",
      username: "wangfang",
      password,
      role: UserRole.RESEARCHER,
      emailVerified: true,
      active: true,
      profile: {
        create: {
          fullName: "Dr. Fang Wang",
          chineseName: "王芳",
          title: "Assistant Professor",
          bio: "Researcher focusing on intelligent transportation systems and urban computing applications.",
          interests:
            "Intelligent Transportation, Urban Computing, Data Analytics, IoT",
          email: "wang.fang@ci2p.ujn.edu.cn",
          showInTeam: true,
          teamOrder: 3,
        },
      },
    },
    include: { profile: true },
  });

  const student1 = await prisma.user.upsert({
    where: { email: "chen.yang@student.ujn.edu.cn" },
    update: {},
    create: {
      email: "chen.yang@student.ujn.edu.cn",
      username: "chenyang",
      password,
      role: UserRole.STUDENT,
      emailVerified: true,
      active: true,
      profile: {
        create: {
          fullName: "Yang Chen",
          chineseName: "陈阳",
          title: "PhD Student",
          bio: "PhD student working on reinforcement learning and its applications in robotics.",
          interests: "Reinforcement Learning, Robotics, Control Systems",
          email: "chen.yang@student.ujn.edu.cn",
          showInTeam: true,
          teamOrder: 4,
        },
      },
    },
    include: { profile: true },
  });

  const student2 = await prisma.user.upsert({
    where: { email: "li.xiaohui@student.ujn.edu.cn" },
    update: {},
    create: {
      email: "li.xiaohui@student.ujn.edu.cn",
      username: "lixiaohui",
      password,
      role: UserRole.STUDENT,
      emailVerified: true,
      active: true,
      profile: {
        create: {
          fullName: "Xiaohui Li",
          chineseName: "李晓慧",
          title: "Master Student",
          bio: "Master student researching generative models and image synthesis.",
          interests: "Generative AI, Computer Vision, Image Processing",
          email: "li.xiaohui@student.ujn.edu.cn",
          showInTeam: true,
          teamOrder: 5,
        },
      },
    },
    include: { profile: true },
  });

  const student3 = await prisma.user.upsert({
    where: { email: "zhao.jun@student.ujn.edu.cn" },
    update: {},
    create: {
      email: "zhao.jun@student.ujn.edu.cn",
      username: "zhaojun",
      password,
      role: UserRole.STUDENT,
      emailVerified: true,
      active: true,
      profile: {
        create: {
          fullName: "Jun Zhao",
          chineseName: "赵军",
          title: "Master Student",
          bio: "Master student focusing on knowledge graphs and semantic web technologies.",
          interests: "Knowledge Graphs, Semantic Web, Information Extraction",
          email: "zhao.jun@student.ujn.edu.cn",
          showInTeam: true,
          teamOrder: 6,
        },
      },
    },
    include: { profile: true },
  });

  console.log("✅ Created 6 users with profiles");

  // PUBLICATIONS
  console.log("📚 Creating publications...");

  await prisma.publication.createMany({
    data: [
      {
        title:
          "Deep Learning for Automated Retinal Disease Detection: A Comprehensive Survey",
        abstract:
          "This paper presents a comprehensive survey of deep learning methods for automated retinal disease detection, covering convolutional neural networks, attention mechanisms, and transfer learning approaches. We analyze over 100 recent studies and provide insights into future research directions.",
        authors: JSON.stringify([
          { name: "Wei Zhang", affiliation: "University of Jinan" },
          { name: "Yang Chen", affiliation: "University of Jinan" },
          { name: "John Smith", affiliation: "Stanford University" },
        ]),
        publicationType: PublicationType.JOURNAL_ARTICLE,
        journal: "IEEE Transactions on Medical Imaging",
        volume: "43",
        issue: "2",
        pages: "456-478",
        year: 2024,
        doi: "10.1109/TMI.2024.1234567",
        url: "https://ieeexplore.ieee.org/document/1234567",
        customTags:
          "deep learning, medical imaging, retinal disease, computer vision, healthcare AI",
        isPublished: true,
        isFeatured: true,
        featuredOrder: 1,
        authorId: admin.id,
      },
      {
        title:
          "Neural Machine Translation for Low-Resource Languages with Enhanced Attention Mechanisms",
        abstract:
          "We propose a novel attention mechanism for neural machine translation that significantly improves performance on low-resource language pairs. Experimental results on 10 language pairs demonstrate substantial improvements over existing methods.",
        authors: JSON.stringify([
          { name: "Ming Liu", affiliation: "University of Jinan" },
          { name: "Wei Zhang", affiliation: "University of Jinan" },
        ]),
        publicationType: PublicationType.CONFERENCE_PAPER,
        conference: "ACL 2024",
        year: 2024,
        pages: "1234-1245",
        url: "https://aclanthology.org/2024.acl-long.123",
        customTags:
          "NLP, machine translation, low-resource languages, attention mechanism, deep learning",
        isPublished: true,
        isFeatured: true,
        featuredOrder: 2,
        authorId: researcher1.id,
      },
      {
        title: "Reinforcement Learning for Autonomous Robotic Manipulation",
        abstract:
          "This paper explores the application of deep reinforcement learning to robotic manipulation tasks, demonstrating significant improvements in sample efficiency and generalization capability.",
        authors: JSON.stringify([
          { name: "Yang Chen", affiliation: "University of Jinan" },
          { name: "Wei Zhang", affiliation: "University of Jinan" },
        ]),
        publicationType: PublicationType.CONFERENCE_PAPER,
        conference: "ICML 2024",
        year: 2024,
        pages: "567-580",
        customTags:
          "reinforcement learning, robotics, manipulation, deep learning",
        isPublished: true,
        isFeatured: true,
        featuredOrder: 3,
        authorId: student1.id,
      },
      {
        title:
          "Smart Traffic Flow Prediction Using Spatio-Temporal Graph Neural Networks",
        abstract:
          "We present a novel spatio-temporal graph neural network architecture for traffic flow prediction in urban environments, achieving state-of-the-art results on multiple benchmark datasets.",
        authors: JSON.stringify([
          { name: "Fang Wang", affiliation: "University of Jinan" },
          { name: "Wei Zhang", affiliation: "University of Jinan" },
        ]),
        publicationType: PublicationType.JOURNAL_ARTICLE,
        journal: "Transportation Research Part C",
        volume: "158",
        pages: "104234",
        year: 2024,
        customTags:
          "intelligent transportation, graph neural networks, traffic prediction, urban computing",
        isPublished: true,
        authorId: researcher2.id,
      },
      {
        title: "Generative Adversarial Networks for Medical Image Synthesis",
        abstract:
          "A comprehensive study on using GANs for synthesizing realistic medical images to augment training datasets for diagnostic AI systems.",
        authors: JSON.stringify([
          { name: "Xiaohui Li", affiliation: "University of Jinan" },
          { name: "Wei Zhang", affiliation: "University of Jinan" },
        ]),
        publicationType: PublicationType.CONFERENCE_PAPER,
        conference: "MICCAI 2023",
        year: 2023,
        pages: "234-246",
        customTags: "GANs, medical imaging, image synthesis, data augmentation",
        isPublished: true,
        authorId: student2.id,
      },
      {
        title: "Knowledge Graph Construction for Biomedical Literature Mining",
        abstract:
          "We propose an end-to-end framework for constructing knowledge graphs from biomedical literature, incorporating entity recognition, relation extraction, and graph reasoning.",
        authors: JSON.stringify([
          { name: "Jun Zhao", affiliation: "University of Jinan" },
          { name: "Ming Liu", affiliation: "University of Jinan" },
        ]),
        publicationType: PublicationType.JOURNAL_ARTICLE,
        journal: "Bioinformatics",
        volume: "40",
        issue: "5",
        pages: "890-905",
        year: 2024,
        customTags:
          "knowledge graphs, biomedical NLP, information extraction, semantic analysis",
        isPublished: true,
        authorId: student3.id,
      },
    ],
  });

  console.log("✅ Created 6 publications");

  // PROJECTS
  console.log("🚀 Creating projects...");

  await prisma.project.createMany({
    data: [
      {
        title: "AI-Powered Diabetic Retinopathy Screening System",
        slug: "ai-diabetic-retinopathy-screening",
        description:
          "Development of an automated screening system for diabetic retinopathy detection using deep learning, aimed at improving early diagnosis in underserved communities. The system achieves 95% accuracy in clinical trials.",
        status: ProjectStatus.ACTIVE,
        startDate: new Date("2023-01-15"),
        tags: JSON.stringify([
          "deep learning",
          "medical AI",
          "healthcare",
          "computer vision",
        ]),
        fundingSource: "National Natural Science Foundation of China",
        fundingAmount: 500000,
        isPublished: true,
        isFeatured: true,
        featuredOrder: 1,
      },
      {
        title: "Urban Traffic Intelligence Platform",
        slug: "urban-traffic-intelligence",
        description:
          "Smart traffic management system using AI to optimize traffic flow and reduce congestion in Jinan city. The platform processes real-time data from 500+ traffic cameras.",
        status: ProjectStatus.ACTIVE,
        startDate: new Date("2022-06-01"),
        tags: JSON.stringify([
          "intelligent transportation",
          "urban computing",
          "IoT",
          "data analytics",
        ]),
        fundingSource: "Shandong Provincial Science Foundation",
        fundingAmount: 300000,
        isPublished: true,
        isFeatured: true,
        featuredOrder: 2,
      },
      {
        title: "Neural Machine Translation for Chinese Dialects",
        slug: "neural-machine-translation-dialects",
        description:
          "Research project developing machine translation systems for preserving and translating Chinese dialects, with focus on Shandong dialects.",
        status: ProjectStatus.ACTIVE,
        startDate: new Date("2023-09-01"),
        tags: JSON.stringify([
          "NLP",
          "machine translation",
          "Chinese dialects",
          "language preservation",
        ]),
        fundingSource: "Ministry of Education Research Grant",
        fundingAmount: 200000,
        isPublished: true,
        isFeatured: true,
        featuredOrder: 3,
      },
      {
        title: "Reinforcement Learning for Industrial Robotics",
        slug: "rl-industrial-robotics",
        description:
          "Collaborative project with local manufacturers to develop RL-based solutions for industrial automation and quality control.",
        status: ProjectStatus.ACTIVE,
        startDate: new Date("2023-03-15"),
        tags: JSON.stringify([
          "reinforcement learning",
          "robotics",
          "industrial automation",
          "manufacturing",
        ]),
        isPublished: true,
      },
      {
        title: "Biomedical Knowledge Graph Platform",
        slug: "biomedical-knowledge-graph",
        description:
          "Building a comprehensive knowledge graph platform for biomedical research, integrating data from multiple sources.",
        status: ProjectStatus.ACTIVE,
        startDate: new Date("2023-11-01"),
        endDate: new Date("2025-10-31"),
        tags: JSON.stringify([
          "knowledge graphs",
          "biomedical informatics",
          "semantic web",
          "data integration",
        ]),
        isPublished: true,
      },
    ],
  });

  // Get created projects for adding members
  const projects = await prisma.project.findMany({
    where: {
      slug: {
        in: [
          "ai-diabetic-retinopathy-screening",
          "urban-traffic-intelligence",
          "neural-machine-translation-dialects",
          "rl-industrial-robotics",
          "biomedical-knowledge-graph",
        ],
      },
    },
  });

  // Add project members
  await prisma.projectMember.createMany({
    data: [
      // Project 1: AI-Powered Diabetic Retinopathy Screening
      { projectId: projects[0].id, userId: admin.id, role: ProjectRole.LEAD },
      {
        projectId: projects[0].id,
        userId: student1.id,
        role: ProjectRole.RESEARCHER,
      },
      {
        projectId: projects[0].id,
        userId: student2.id,
        role: ProjectRole.RESEARCHER,
      },
      // Project 2: Urban Traffic Intelligence
      {
        projectId: projects[1].id,
        userId: researcher2.id,
        role: ProjectRole.LEAD,
      },
      {
        projectId: projects[1].id,
        userId: admin.id,
        role: ProjectRole.COLLABORATOR,
      },
      // Project 3: Neural Machine Translation
      {
        projectId: projects[2].id,
        userId: researcher1.id,
        role: ProjectRole.LEAD,
      },
      {
        projectId: projects[2].id,
        userId: student3.id,
        role: ProjectRole.RESEARCHER,
      },
      // Project 4: RL Industrial Robotics
      {
        projectId: projects[3].id,
        userId: student1.id,
        role: ProjectRole.LEAD,
      },
      {
        projectId: projects[3].id,
        userId: admin.id,
        role: ProjectRole.COLLABORATOR,
      },
      // Project 5: Biomedical Knowledge Graph
      {
        projectId: projects[4].id,
        userId: researcher1.id,
        role: ProjectRole.LEAD,
      },
      {
        projectId: projects[4].id,
        userId: student3.id,
        role: ProjectRole.RESEARCHER,
      },
    ],
  });

  console.log("✅ Created 5 projects with members");

  // RESOURCES
  console.log("🖥️ Creating resources...");

  await prisma.resource.createMany({
    data: [
      {
        name: "GPU Cluster - NVIDIA A100",
        type: "GPU",
        description:
          "High-performance GPU cluster with 8x NVIDIA A100 GPUs (80GB each) for deep learning training and inference. Equipped with 2x AMD EPYC 7763 CPUs, 1TB DDR4 RAM, 20TB NVMe SSD storage, and 100Gbps InfiniBand networking.",
        location: "Server Room A, Building 3",
        status: ResourceStatus.AVAILABLE,
        isBookable: true,
        manufacturer: "NVIDIA",
        modelNumber: "A100-80GB",
      },
      {
        name: "Workstation - RTX 4090",
        type: "COMPUTER",
        description:
          "High-end workstation for individual researchers. Specs: NVIDIA RTX 4090 24GB GPU, Intel i9-13900K CPU, 128GB RAM, 4TB NVMe storage.",
        location: "Lab Room 301",
        status: ResourceStatus.AVAILABLE,
        isBookable: true,
        capacity: 1,
        manufacturer: "NVIDIA",
        modelNumber: "RTX-4090",
      },
      {
        name: "Medical Imaging Dataset - RetinaScan",
        type: "DATASET",
        description:
          "Curated dataset of 50,000 retinal fundus photographs (PNG, 2048x2048) with expert multi-label disease classifications for diabetic retinopathy research. Total size: 500GB.",
        location: "Data Server - /datasets/retinascan",
        status: ResourceStatus.AVAILABLE,
        isBookable: false,
      },
      {
        name: "Traffic Data Collection System",
        type: "LAB_EQUIPMENT",
        description:
          "IoT sensor kit for collecting traffic data. Includes 4x HD cameras, radar sensors, GPS modules, temperature sensors, and 4G/5G communication module.",
        location: "Equipment Room 205",
        status: ResourceStatus.AVAILABLE,
        isBookable: true,
      },
      {
        name: "Conference Room A",
        type: "MEETING_ROOM",
        description:
          "Large meeting room (60 sqm) with 4K projector, Zoom Room video conferencing system, and whiteboard. Suitable for presentations and team meetings.",
        location: "Building 3, 2nd Floor, Room 201",
        capacity: 20,
        status: ResourceStatus.AVAILABLE,
        isBookable: true,
      },
      {
        name: "Conference Room B",
        type: "MEETING_ROOM",
        description: "Small meeting room for group discussions.",
        location: "Building 3, 2nd Floor, Room 205",
        capacity: 8,
        status: ResourceStatus.AVAILABLE,
        isBookable: true,
      },
      {
        name: "3D Printer - Ultimaker S5",
        type: "LAB_EQUIPMENT",
        description:
          "Professional 3D printer for prototyping robot parts and mechanical components. Build volume: 330x240x300mm. Materials: PLA, ABS, Nylon, TPU. Resolution: 0.25mm - 0.8mm.",
        location: "Fabrication Lab 310",
        status: ResourceStatus.AVAILABLE,
        isBookable: true,
        manufacturer: "Ultimaker",
        modelNumber: "S5",
      },
      {
        name: "Development Server",
        type: "COMPUTER",
        description:
          "Shared development server for code hosting, CI/CD, and team collaboration. Specs: AMD EPYC 7542, 256GB RAM, 10TB RAID10 storage. Services: GitLab, Jenkins, Docker Registry.",
        location: "Server Room A",
        status: ResourceStatus.AVAILABLE,
        isBookable: false,
      },
    ],
  });

  console.log("✅ Created 8 resources");

  console.log("\n✅ Seed completed successfully!");
  console.log("\n📊 Summary:");
  console.log("  - 6 users (1 admin, 2 researchers, 3 students)");
  console.log("  - 6 publications (3 featured)");
  console.log("  - 5 projects (3 featured)");
  console.log("  - 8 resources (compute, equipment, rooms, data)");
  console.log("\n🔐 Login credentials:");
  console.log("  Email: admin@ci2p.ujn.edu.cn");
  console.log("  Password: password123");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
