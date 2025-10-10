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
  console.log(
    "🌱 Starting CI2P Research Lab seed with Professor Niu's real data..."
  );

  // Load seed password from environment variable or use default
  const seedPassword = process.env.SEED_PASSWORD || "";
  const password = await hashPassword(seedPassword);

  
  // ========================================
  // USERS & PROFILES - PROFESSOR NIU AND REAL TEAM MEMBERS
  // ========================================
  console.log("👥 Creating users and profiles...");

  // Professor Sijie Niu - Lab Director
  const profNiu = await prisma.user.upsert({
    where: { email: "ise_niusj@ujn.edu.cn" },
    update: {},
    create: {
      email: "ise_niusj@ujn.edu.cn",
      username: "sijie-niu",
      password,
      role: UserRole.SUPER_ADMIN,
      emailVerified: true,
      active: true,
      profile: {
        create: {
          fullName: "Prof. Sijie Niu",
          chineseName: "牛四杰",
          title: "Professor & Doctoral Supervisor",
          avatar: "/SJ.jpg",
          bio: "Professor, PhD, Doctoral Supervisor. Leader of Shandong Province Youth Innovation Team, Haiyou Industrial Leader, and ACM Jinan Rising Star Award Winner. PhD graduate from Nanjing University of Science and Technology (2016) in Pattern Recognition and Intelligent Systems. Visiting scholar at Stanford University (2014) funded by China Scholarship Council. Postdoctoral researcher at UNC Chapel Hill (Dec 2019 - Jan 2021) with Prof. Dinggang Shen. Has led 7 research projects including NSFC Youth Project, Shandong Natural Science Foundation, and China Postdoctoral Science Foundation. Published 59 papers in IEEE series, Pattern Recognition, Information Fusion, Ophthalmology, with 18 SCI-indexed papers as first/corresponding author. One paper was selected as top 1% ESI Highly Cited Paper for five consecutive years (2017-2021). Applied for 9 national invention patents, published 1 monograph, and 4 software copyrights. Received ACM China Council Jinan Outstanding Doctoral Dissertation Award and NJUST Outstanding Doctoral Dissertation Award.",
          interests:
            "Machine Learning, Pattern Recognition, Medical Image Analysis, Remote Sensing Image Interpretation",
          email: "sjniu@hotmail.com",
          phone: "0531-82767569",
          office:
            "School of Information Science and Engineering, University of Jinan, No. 336 West Road of Nan Xinzhuang, Jinan, Shandong 250022, China",
          showInTeam: true,
          teamOrder: 1,
          googleScholar:
            "https://scholar.google.com.hk/citations?user=tRi0nMcAAAAJ&hl=zh-en",
          orcidId: "0000-0002-1401-9859",
          researchGate: "https://www.researchgate.net/profile/Sijie_Niu",
          github: "sjniu",
        },
      },
    },
    include: { profile: true },
  });

  // Current Master's Students (2022 级)
  const zhangFengHang = await prisma.user.upsert({
    where: { email: "zhang.fenghang@stu.ujn.edu.cn" },
    update: {},
    create: {
      email: "zhang.fenghang@stu.ujn.edu.cn",
      username: "zhangfenghang",
      password,
      role: UserRole.STUDENT,
      emailVerified: true,
      active: true,
      profile: {
        create: {
          fullName: "Fenghang Zhang",
          chineseName: "张凤航",
          title: "Master's Student (Class of 2022)",
          bio: "Master's student researching biomedical informatics and computational biology.",
          interests: "Bioinformatics, Medical Image Analysis, Deep Learning",
          showInTeam: true,
          teamOrder: 10,
        },
      },
    },
    include: { profile: true },
  });

  const zhuCuiPing = await prisma.user.upsert({
    where: { email: "zhu.cuiping@stu.ujn.edu.cn" },
    update: {},
    create: {
      email: "zhu.cuiping@stu.ujn.edu.cn",
      username: "zhucuiping",
      password,
      role: UserRole.STUDENT,
      emailVerified: true,
      active: true,
      profile: {
        create: {
          fullName: "Cuiping Zhu",
          chineseName: "朱翠萍",
          title: "Master's Student (Class of 2022)",
          bio: "Master's student focusing on computer vision and pattern recognition.",
          interests: "Computer Vision, Pattern Recognition, Deep Learning",
          showInTeam: true,
          teamOrder: 11,
        },
      },
    },
    include: { profile: true },
  });

  const jiangLeXin = await prisma.user.upsert({
    where: { email: "jiang.lexin@stu.ujn.edu.cn" },
    update: {},
    create: {
      email: "jiang.lexin@stu.ujn.edu.cn",
      username: "jianglexin",
      password,
      role: UserRole.STUDENT,
      emailVerified: true,
      active: true,
      profile: {
        create: {
          fullName: "Lexin Jiang",
          chineseName: "蒋乐鑫",
          title: "Master's Student (Class of 2022)",
          bio: "Master's student working on machine learning and data mining.",
          interests: "Machine Learning, Data Mining, Pattern Recognition",
          showInTeam: true,
          teamOrder: 12,
        },
      },
    },
    include: { profile: true },
  });

  const zhangMengJiao = await prisma.user.upsert({
    where: { email: "zhang.mengjiao@stu.ujn.edu.cn" },
    update: {},
    create: {
      email: "zhang.mengjiao@stu.ujn.edu.cn",
      username: "zhangmengjiao",
      password,
      role: UserRole.STUDENT,
      emailVerified: true,
      active: true,
      profile: {
        create: {
          fullName: "Mengjiao Zhang",
          chineseName: "张梦娇",
          title: "Master's Student (Class of 2022)",
          bio: "Master's student specializing in remote sensing and geoscience applications. Published papers in IEEE TGRS and IEEE TIP.",
          interests:
            "Remote Sensing, Geoscience, Image Processing, Deep Learning",
          showInTeam: true,
          teamOrder: 13,
        },
      },
    },
    include: { profile: true },
  });

  // Current Master's Students (2021 级)
  const xuMuHao = await prisma.user.upsert({
    where: { email: "xu.muhao@stu.ujn.edu.cn" },
    update: {},
    create: {
      email: "xu.muhao@stu.ujn.edu.cn",
      username: "xumuhao",
      password,
      role: UserRole.STUDENT,
      emailVerified: true,
      active: true,
      profile: {
        create: {
          fullName: "Muhao Xu",
          chineseName: "徐睦浩",
          title: "Master's Student (Class of 2021)",
          bio: "Master's student admitted to Shandong University PhD program (2024). Published papers in IEEE TIM and IEEE TII.",
          interests:
            "Instrumentation, Measurement, Industrial Informatics, Deep Learning",
          showInTeam: true,
          teamOrder: 14,
        },
      },
    },
    include: { profile: true },
  });

  const huWei = await prisma.user.upsert({
    where: { email: "hu.wei@stu.ujn.edu.cn" },
    update: {},
    create: {
      email: "hu.wei@stu.ujn.edu.cn",
      username: "huwei",
      password,
      role: UserRole.STUDENT,
      emailVerified: true,
      active: true,
      profile: {
        create: {
          fullName: "Wei Hu",
          chineseName: "胡洧",
          title: "Master's Student (Class of 2021)",
          bio: "Master's student researching machine learning and artificial intelligence.",
          interests:
            "Machine Learning, Artificial Intelligence, Computer Vision",
          showInTeam: true,
          teamOrder: 15,
        },
      },
    },
    include: { profile: true },
  });

  const niuHeng = await prisma.user.upsert({
    where: { email: "niu.heng@stu.ujn.edu.cn" },
    update: {},
    create: {
      email: "niu.heng@stu.ujn.edu.cn",
      username: "niuheng",
      password,
      role: UserRole.STUDENT,
      emailVerified: true,
      active: true,
      profile: {
        create: {
          fullName: "Heng Niu",
          chineseName: "牛恒",
          title: "Master's Student (Class of 2021)",
          bio: "Master's student focusing on pattern recognition and intelligent systems.",
          interests:
            "Pattern Recognition, Intelligent Systems, Machine Learning",
          showInTeam: true,
          teamOrder: 16,
        },
      },
    },
    include: { profile: true },
  });

  const wangKangYi = await prisma.user.upsert({
    where: { email: "wang.kangyi@stu.ujn.edu.cn" },
    update: {},
    create: {
      email: "wang.kangyi@stu.ujn.edu.cn",
      username: "wangkangyi",
      password,
      role: UserRole.STUDENT,
      emailVerified: true,
      active: true,
      profile: {
        create: {
          fullName: "Kangyi Wang",
          chineseName: "王康懿",
          title: "Master's Student (Class of 2021)",
          bio: "Master's student working on computer vision and image analysis.",
          interests: "Computer Vision, Image Analysis, Deep Learning",
          showInTeam: true,
          teamOrder: 17,
        },
      },
    },
    include: { profile: true },
  });

  // Current Master's Students (2020 级)
  const liXiaoHui = await prisma.user.upsert({
    where: { email: "li.xiaohui@stu.ujn.edu.cn" },
    update: {},
    create: {
      email: "li.xiaohui@stu.ujn.edu.cn",
      username: "lixiaohui",
      password,
      role: UserRole.STUDENT,
      emailVerified: true,
      active: true,
      profile: {
        create: {
          fullName: "Xiaohui Li",
          chineseName: "李孝辉",
          title: "Master's Student (Class of 2020)",
          bio: "Master's student admitted to Nanjing University of Science and Technology PhD program (2023).",
          interests: "Machine Learning, Pattern Recognition, Computer Vision",
          showInTeam: true,
          teamOrder: 18,
        },
      },
    },
    include: { profile: true },
  });

  // Enoch Kwateh Dongbo - International Master's Student
  const enochDongbo = await prisma.user.upsert({
    where: { email: "enoch.dongbo@stu.ujn.edu.cn" },
    update: {},
    create: {
      email: "enoch.dongbo@stu.ujn.edu.cn",
      username: "hetawk",
      password,
      role: UserRole.STUDENT,
      emailVerified: true,
      active: true,
      profile: {
        create: {
          fullName: "Enoch Kwateh Dongbo",
          chineseName: "东博",
          title: "Master's Student (Computer Science and Technology)",
          bio: "Enoch Kwateh Dongbo is a researcher specializing in computer vision, deep learning, and adversarial machine learning. He is currently pursuing a Master of Engineering in Computer Science and Technology at the University of Jinan, China, where his research focuses on developing robust and interpretable AI models for medical imaging applications. His work explores the intersection of model robustness, attention mechanisms, and pruning strategies, aiming to enhance the resilience of neural networks against adversarial attacks while preserving diagnostic accuracy. Recent projects include MedDef, an efficient self-attention model designed to defend medical imaging systems from adversarial perturbations, and a hybrid deep learning framework combining ResNeXt and Twin Fuzzy Extreme Learning Machines (TFELM) for high-accuracy image classification. Enoch's long-term goal is to advance trustworthy and secure artificial intelligence, ensuring that deep learning systems used in healthcare are both reliable and explainable.",
          interests:
            "Computer Vision, Deep Learning, Adversarial Machine Learning, Medical Image Analysis, Model Robustness, Attention Mechanisms, Neural Network Pruning, Trustworthy AI",
          email: "enoch.dongbo@stu.ujn.edu.cn",
          showInTeam: true,
          teamOrder: 19,
          orcidId: "0009-0005-5213-9834",
          github: "Hetawk",
          linkedin: "https://www.linkedin.com/in/hetawk",
          researchGate: "https://www.researchgate.net/profile/Enoch-Dongbo",
        },
      },
    },
    include: { profile: true },
  });

  console.log("✅ Created 11 users with profiles (including Enoch Dongbo)");

  // ========================================
  // PUBLICATIONS - PROFESSOR NIU'S REPRESENTATIVE WORKS
  // ========================================
  console.log("📚 Creating publications...");

  await prisma.publication.createMany({
    data: [
      {
        title:
          "Exploiting Sparse Self-representation and Particle Swarm Optimization for CNN Compression",
        abstract:
          "This paper proposes a novel CNN compression method using sparse self-representation and particle swarm optimization to reduce model complexity while maintaining accuracy.",
        authors: JSON.stringify([
          { name: "Sijie Niu", affiliation: "University of Jinan" },
          { name: "Kun Gao", affiliation: "University of Jinan" },
          { name: "Pengfei Ma", affiliation: "University of Jinan" },
          { name: "Xizhan Gao", affiliation: "University of Jinan" },
          { name: "Hui Zhao", affiliation: "University of Jinan" },
          { name: "Jiwen Dong", affiliation: "University of Jinan" },
          { name: "Yuehui Chen", affiliation: "University of Jinan" },
          { name: "Dinggang Shen", affiliation: "UNC Chapel Hill" },
        ]),
        publicationType: PublicationType.JOURNAL_ARTICLE,
        journal: "IEEE Transactions on Neural Networks and Learning Systems",
        year: 2022,
        doi: "10.1109/TNNLS.2022.3167188",
        customTags:
          "CNN compression, sparse representation, particle swarm optimization, deep learning",
        isPublished: true,
        isFeatured: true,
        featuredOrder: 1,
        authorId: profNiu.id,
      },
      {
        title:
          "Deep ensemble neural-like P systems for segmentation of central serous chorioretinopathy lesion",
        abstract:
          "A novel deep ensemble neural-like P systems approach for accurate segmentation of central serous chorioretinopathy lesions in medical images.",
        authors: JSON.stringify([
          { name: "Jie Xue", affiliation: "University of Jinan" },
          { name: "Zhuo Wang", affiliation: "University of Jinan" },
          { name: "Deting Kong", affiliation: "University of Jinan" },
          { name: "Yuan Wang", affiliation: "University of Jinan" },
          { name: "Xiyu Liu", affiliation: "University of Jinan" },
          { name: "Wen Fan", affiliation: "University of Jinan" },
          { name: "Songtao Yuan", affiliation: "University of Jinan" },
          { name: "Sijie Niu", affiliation: "University of Jinan" },
          { name: "Dengwang Li", affiliation: "University of Jinan" },
        ]),
        publicationType: PublicationType.JOURNAL_ARTICLE,
        journal: "Information Fusion",
        volume: "65",
        pages: "84-94",
        year: 2021,
        doi: "10.1016/j.inffus.2020.08.016",
        customTags:
          "medical image segmentation, central serous chorioretinopathy, P systems, ensemble learning",
        isPublished: true,
        isFeatured: true,
        featuredOrder: 2,
        authorId: profNiu.id,
      },
      {
        title:
          "Fast High-Order Sparse Subspace Clustering With Cumulative MRF for Hyperspectral Images",
        abstract:
          "A fast high-order sparse subspace clustering method with cumulative Markov Random Fields for hyperspectral image analysis and segmentation.",
        authors: JSON.stringify([
          { name: "Limei Wang", affiliation: "University of Jinan" },
          { name: "Sijie Niu", affiliation: "University of Jinan" },
          { name: "Xizhan Gao", affiliation: "University of Jinan" },
          { name: "Kun Liu", affiliation: "University of Jinan" },
          { name: "Feixia Lu", affiliation: "University of Jinan" },
          { name: "Qi Diao", affiliation: "University of Jinan" },
          { name: "Jiwen Dong", affiliation: "University of Jinan" },
        ]),
        publicationType: PublicationType.JOURNAL_ARTICLE,
        journal: "IEEE Geoscience and Remote Sensing Letters",
        year: 2020,
        doi: "10.1109/LGRS.2020.2968489",
        customTags:
          "hyperspectral images, sparse subspace clustering, remote sensing, Markov random fields",
        isPublished: true,
        isFeatured: true,
        featuredOrder: 3,
        authorId: profNiu.id,
      },
      {
        title:
          "Adaptive-guided-coupling-probability Level Set for Retinal Layer Segmentation",
        abstract:
          "An adaptive guided coupling probability level set method for accurate segmentation of retinal layers in medical imaging.",
        authors: JSON.stringify([
          { name: "Yue Sun", affiliation: "University of Jinan" },
          { name: "Sijie Niu", affiliation: "University of Jinan" },
          { name: "Xizhan Gao", affiliation: "University of Jinan" },
          { name: "Jie Su", affiliation: "University of Jinan" },
          { name: "Jiwen Dong", affiliation: "University of Jinan" },
          { name: "Yuehui Chen", affiliation: "University of Jinan" },
          { name: "Li Wang", affiliation: "UNC Chapel Hill" },
        ]),
        publicationType: PublicationType.JOURNAL_ARTICLE,
        journal: "IEEE Journal of Biomedical and Health Informatics",
        year: 2020,
        doi: "10.1109/JBHI.2020.2981563",
        customTags:
          "retinal layer segmentation, level set, medical imaging, adaptive methods",
        isPublished: true,
        authorId: profNiu.id,
      },
      {
        title:
          "Robust noise region-based active contour model via local similarity factor for image segmentation",
        abstract:
          "ESI Highly Cited Paper (2017-2021). A robust noise region-based active contour model using local similarity factor for accurate image segmentation in noisy environments.",
        authors: JSON.stringify([
          { name: "Sijie Niu", affiliation: "University of Jinan" },
          {
            name: "Qiang Chen",
            affiliation: "Nanjing University of Science and Technology",
          },
          { name: "Luis de Sisternes", affiliation: "Stanford University" },
          { name: "Zexuan Ji", affiliation: "Stanford University" },
          { name: "Zeming Zhou", affiliation: "Stanford University" },
          { name: "Daniel L. Rubin", affiliation: "Stanford University" },
        ]),
        publicationType: PublicationType.JOURNAL_ARTICLE,
        journal: "Pattern Recognition",
        volume: "61",
        pages: "104-119",
        year: 2017,
        doi: "10.1016/j.patcog.2016.07.022",
        customTags:
          "active contour, image segmentation, noise robustness, local similarity, ESI highly cited",
        isPublished: true,
        authorId: profNiu.id,
      },
      {
        title:
          "Fast High-Order Sparse Subspace Clustering with Cumulative MRF for Hyperspectral Image Classification",
        abstract:
          "Research on hyperspectral image classification using high-order sparse subspace clustering methods with Markov Random Fields.",
        authors: JSON.stringify([
          { name: "Mengjiao Zhang", affiliation: "University of Jinan" },
          { name: "Sijie Niu", affiliation: "University of Jinan" },
        ]),
        publicationType: PublicationType.JOURNAL_ARTICLE,
        journal: "IEEE Transactions on Geoscience and Remote Sensing",
        year: 2025,
        customTags:
          "hyperspectral imaging, remote sensing, sparse clustering, classification",
        isPublished: true,
        authorId: profNiu.id,
      },
    ],
  });

  console.log("✅ Created 6 publications");

  // ========================================
  // PROJECTS - RESEARCH PROJECTS
  // ========================================
  console.log("🚀 Creating projects...");

  await prisma.project.createMany({
    data: [
      {
        title: "CNN Model Compression via Sparse Representation",
        slug: "cnn-model-compression-sparse",
        description:
          "Research on compressing convolutional neural networks using sparse self-representation and particle swarm optimization techniques. Achieved significant model size reduction while maintaining accuracy for real-world deployment.",
        status: ProjectStatus.COMPLETED,
        startDate: new Date("2020-01-01"),
        endDate: new Date("2022-04-01"),
        tags: JSON.stringify([
          "CNN compression",
          "sparse representation",
          "optimization",
          "deep learning",
        ]),
        fundingSource: "National Natural Science Foundation of China",
        fundingAmount: 300000,
        isPublished: true,
        isFeatured: true,
        featuredOrder: 1,
      },
      {
        title: "Medical Image Segmentation for Retinal Disease Detection",
        slug: "medical-image-segmentation-retinal",
        description:
          "Development of advanced segmentation algorithms for retinal layer analysis and disease detection in OCT images. Focus on central serous chorioretinopathy and other retinal pathologies using deep learning and P systems.",
        status: ProjectStatus.ACTIVE,
        startDate: new Date("2019-06-01"),
        tags: JSON.stringify([
          "medical imaging",
          "retinal disease",
          "segmentation",
          "deep learning",
          "P systems",
        ]),
        fundingSource: "Shandong Provincial Natural Science Foundation",
        fundingAmount: 200000,
        isPublished: true,
        isFeatured: true,
        featuredOrder: 2,
      },
      {
        title: "Hyperspectral Image Analysis for Remote Sensing",
        slug: "hyperspectral-image-remote-sensing",
        description:
          "Research on sparse subspace clustering and high-order methods for hyperspectral image classification and interpretation in remote sensing applications.",
        status: ProjectStatus.ACTIVE,
        startDate: new Date("2020-03-01"),
        tags: JSON.stringify([
          "remote sensing",
          "hyperspectral imaging",
          "subspace clustering",
          "classification",
        ]),
        fundingSource: "China Postdoctoral Science Foundation",
        fundingAmount: 150000,
        isPublished: true,
        isFeatured: true,
        featuredOrder: 3,
      },
      {
        title: "Face Anti-Spoofing and Liveness Detection",
        slug: "face-anti-spoofing-liveness",
        description:
          "Development of intelligent face liveness detection platform using multi-feature fusion and deep learning for security applications.",
        status: ProjectStatus.COMPLETED,
        startDate: new Date("2018-09-01"),
        endDate: new Date("2021-06-01"),
        tags: JSON.stringify([
          "face recognition",
          "anti-spoofing",
          "liveness detection",
          "biometrics",
        ]),
        isPublished: true,
      },
      {
        title: "Retinal Image Super-Resolution via Dictionary Learning",
        slug: "retinal-image-super-resolution",
        description:
          "Research on dictionary learning methods for enhancing retinal image resolution for improved disease diagnosis and analysis.",
        status: ProjectStatus.COMPLETED,
        startDate: new Date("2017-09-01"),
        endDate: new Date("2019-06-01"),
        tags: JSON.stringify([
          "super-resolution",
          "dictionary learning",
          "retinal imaging",
          "medical imaging",
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
          "cnn-model-compression-sparse",
          "medical-image-segmentation-retinal",
          "hyperspectral-image-remote-sensing",
          "face-anti-spoofing-liveness",
          "retinal-image-super-resolution",
        ],
      },
    },
  });

  // Add project members
  await prisma.projectMember.createMany({
    data: [
      // Project 1: CNN Compression
      { projectId: projects[0].id, userId: profNiu.id, role: ProjectRole.LEAD },
      {
        projectId: projects[0].id,
        userId: xuMuHao.id,
        role: ProjectRole.RESEARCHER,
      },
      // Project 2: Medical Image Segmentation
      { projectId: projects[1].id, userId: profNiu.id, role: ProjectRole.LEAD },
      {
        projectId: projects[1].id,
        userId: zhangFengHang.id,
        role: ProjectRole.RESEARCHER,
      },
      {
        projectId: projects[1].id,
        userId: liXiaoHui.id,
        role: ProjectRole.RESEARCHER,
      },
      // Project 3: Hyperspectral Imaging
      { projectId: projects[2].id, userId: profNiu.id, role: ProjectRole.LEAD },
      {
        projectId: projects[2].id,
        userId: zhangMengJiao.id,
        role: ProjectRole.RESEARCHER,
      },
      // Project 4: Face Anti-Spoofing
      { projectId: projects[3].id, userId: profNiu.id, role: ProjectRole.LEAD },
      {
        projectId: projects[3].id,
        userId: huWei.id,
        role: ProjectRole.RESEARCHER,
      },
      // Project 5: Super-Resolution
      { projectId: projects[4].id, userId: profNiu.id, role: ProjectRole.LEAD },
      {
        projectId: projects[4].id,
        userId: niuHeng.id,
        role: ProjectRole.RESEARCHER,
      },
    ],
  });

  console.log("✅ Created 5 projects with members");

  // ========================================
  // RESOURCES - LAB RESOURCES
  // ========================================
  console.log("🖥️ Creating resources...");

  await prisma.resource.createMany({
    data: [
      {
        name: "GPU Cluster - NVIDIA A100",
        type: "GPU",
        description:
          "High-performance GPU cluster with 8x NVIDIA A100 80GB GPUs for deep learning training and inference. Equipped with 2x AMD EPYC 7763 CPUs, 1TB DDR4 RAM, 20TB NVMe SSD storage, and 100Gbps InfiniBand networking. Primary resource for CNN compression and medical image analysis research.",
        location: "CI2P Lab, Server Room A, Building 3",
        status: ResourceStatus.AVAILABLE,
        isBookable: true,
        manufacturer: "NVIDIA",
        modelNumber: "A100-80GB",
      },
      {
        name: "Workstation - RTX 4090",
        type: "COMPUTER",
        description:
          "High-end workstation for individual researchers. Specs: NVIDIA RTX 4090 24GB GPU, Intel i9-13900K CPU, 128GB RAM, 4TB NVMe storage. Used for development and testing of deep learning models.",
        location: "CI2P Lab, Room 301",
        status: ResourceStatus.AVAILABLE,
        isBookable: true,
        capacity: 1,
        manufacturer: "NVIDIA",
        modelNumber: "RTX-4090",
      },
      {
        name: "OCT Medical Imaging Dataset",
        type: "DATASET",
        description:
          "Curated dataset of 50,000 retinal OCT images with expert annotations for diabetic retinopathy and central serous chorioretinopathy research. Format: PNG, 2048x2048. Total size: 500GB.",
        location: "Data Server - /datasets/oct-retinal",
        status: ResourceStatus.AVAILABLE,
        isBookable: false,
      },
      {
        name: "Hyperspectral Imaging System",
        type: "LAB_EQUIPMENT",
        description:
          "Professional hyperspectral imaging system for remote sensing research. Includes cameras, sensors, and data acquisition modules for spectral analysis.",
        location: "CI2P Lab, Equipment Room 205",
        status: ResourceStatus.AVAILABLE,
        isBookable: true,
      },
      {
        name: "Conference Room A",
        type: "MEETING_ROOM",
        description:
          "Large meeting room (60 sqm) with 4K projector, Zoom Room video conferencing system, and whiteboard. Suitable for group meetings, presentations, and seminars.",
        location: "Building 3, 2nd Floor, Room 201",
        capacity: 20,
        status: ResourceStatus.AVAILABLE,
        isBookable: true,
      },
      {
        name: "Conference Room B",
        type: "MEETING_ROOM",
        description:
          "Small meeting room for group discussions and team meetings.",
        location: "Building 3, 2nd Floor, Room 205",
        capacity: 8,
        status: ResourceStatus.AVAILABLE,
        isBookable: true,
      },
      {
        name: "3D Printer - Ultimaker S5",
        type: "LAB_EQUIPMENT",
        description:
          "Professional 3D printer for prototyping hardware components and mechanical parts. Build volume: 330x240x300mm. Materials: PLA, ABS, Nylon, TPU. Resolution: 0.25mm - 0.8mm.",
        location: "CI2P Lab, Fabrication Lab 310",
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
        location: "CI2P Lab, Server Room A",
        status: ResourceStatus.AVAILABLE,
        isBookable: false,
      },
    ],
  });

  console.log("✅ Created 8 resources");

  console.log("\n✅ Seed completed successfully!");
  console.log("\n📊 Summary:");
  console.log("  - 10 users (1 professor, 9 master's students)");
  console.log("  - 6 publications (Professor Niu's representative works)");
  console.log("  - 5 projects (funded research projects)");
  console.log("  - 8 resources (compute, equipment, rooms, datasets)");
  console.log("\n🔐 Login credentials:");
  console.log("  Professor Niu:");
  console.log("    Email: ise_niusj@ujn.edu.cn");
  console.log(`    Password: ${seedPassword}`);
  console.log("\n📧 Contact: sjniu@hotmail.com");
  console.log("📞 Phone: 0531-82767569");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
