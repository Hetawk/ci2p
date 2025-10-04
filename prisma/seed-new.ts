import {
  PrismaClient,
  AwardType,
  ExpType,
  SkillType,
  SkillLevel,
} from "@prisma/client";
import { readFileSync } from "fs";
import { join } from "path";

const prisma = new PrismaClient();

// Helper function to read JSON files
function readJsonFile(filename: string) {
  const filePath = join(process.cwd(), "data", "portfolio", filename);
  const fileContent = readFileSync(filePath, "utf-8");
  return JSON.parse(fileContent);
}

// Map award category from JSON to Prisma enum
function mapAwardCategory(category: string): AwardType {
  const categoryMap: Record<string, AwardType> = {
    "public speaking": AwardType.PUBLIC_SPEAKING,
    sports: AwardType.SPORTS,
    multimedia: AwardType.TECHNICAL,
    technical: AwardType.TECHNICAL,
    academic: AwardType.ACADEMIC,
    leadership: AwardType.LEADERSHIP,
    certification: AwardType.CERTIFICATION,
  };

  const normalized = category.toLowerCase();
  return categoryMap[normalized] || AwardType.ACADEMIC;
}

// Map experience type from JSON to Prisma enum
function mapExpType(type: string): ExpType {
  const typeMap: Record<string, ExpType> = {
    leadership: ExpType.LEADERSHIP,
    professional: ExpType.PROFESSIONAL,
    teaching: ExpType.PROFESSIONAL,
    volunteer: ExpType.VOLUNTEER,
    entrepreneurship: ExpType.ENTREPRENEURSHIP,
  };

  const normalized = type.toLowerCase().trim();
  return typeMap[normalized] || ExpType.PROFESSIONAL;
}
async function main() {
  console.log("🌱 Starting seed from JSON files...");

  // ============================================
  // PERSONAL INFORMATION
  // ============================================
  console.log("📝 Seeding personal information...");

  const personalData = readJsonFile("personal-info.json");

  await prisma.personalInfo.upsert({
    where: { id: "patience-info" },
    update: {
      fullName: personalData.name,
      email: personalData.contact.email,
      phone: personalData.contact.phone,
      location: personalData.contact.location,
      linkedIn: personalData.contact.linkedin,
      weChat: personalData.contact.wechat,
      dateOfBirth: personalData.personalInfo.dateOfBirth,
      nationality: personalData.personalInfo.nationality,
      placeOfBirth: personalData.personalInfo.placeOfBirth,
      bio: `${personalData.bio}\n\n${personalData.profileSummary}`,
      profileImage: personalData.profileImage,
    },
    create: {
      id: "patience-info",
      fullName: personalData.name,
      email: personalData.contact.email,
      phone: personalData.contact.phone,
      location: personalData.contact.location,
      linkedIn: personalData.contact.linkedin,
      weChat: personalData.contact.wechat,
      dateOfBirth: personalData.personalInfo.dateOfBirth,
      nationality: personalData.personalInfo.nationality,
      placeOfBirth: personalData.personalInfo.placeOfBirth,
      bio: `${personalData.bio}\n\n${personalData.profileSummary}`,
      profileImage: personalData.profileImage,
    },
  });

  // ============================================
  // EDUCATION
  // ============================================
  console.log("🎓 Seeding education...");

  const educationData = readJsonFile("education.json");

  // Clear existing education records
  await prisma.education.deleteMany({});

  for (let i = 0; i < educationData.length; i++) {
    const edu = educationData[i];
    await prisma.education.create({
      data: {
        degree: edu.degree,
        institution: edu.institution,
        location: edu.location,
        startDate: edu.startDate,
        endDate: edu.endDate === "Present" ? null : edu.endDate,
        description: edu.description,
        order: i + 1,
      },
    });
  }

  // ============================================
  // AWARDS
  // ============================================
  console.log("🏆 Seeding awards...");

  const awardsData = readJsonFile("awards.json");

  // Clear existing awards
  await prisma.award.deleteMany({});

  for (let i = 0; i < awardsData.length; i++) {
    const award = awardsData[i];
    await prisma.award.create({
      data: {
        title: award.title,
        organization: award.organization,
        date: award.date,
        description: award.description,
        category: mapAwardCategory(award.category),
        imageUrl: award.certificateImage,
        featured: award.featured || false,
        order: i + 1,
      },
    });
  }

  // ============================================
  // CERTIFICATIONS (as Awards)
  // ============================================
  console.log("📜 Seeding certifications...");

  const certificationsData = readJsonFile("certifications.json");

  const currentAwardCount = await prisma.award.count();

  for (let i = 0; i < certificationsData.length; i++) {
    const cert = certificationsData[i];
    await prisma.award.create({
      data: {
        title: cert.title,
        organization: cert.organization,
        date: cert.date,
        description: cert.description,
        category: AwardType.CERTIFICATION,
        imageUrl: cert.certificateImage,
        featured: false,
        order: currentAwardCount + i + 1,
      },
    });
  }

  // ============================================
  // EXPERIENCE
  // ============================================
  console.log("💼 Seeding experience...");

  const experienceData = readJsonFile("experience.json");

  // Clear existing experience
  await prisma.experience.deleteMany({});

  for (let i = 0; i < experienceData.length; i++) {
    const exp = experienceData[i];
    await prisma.experience.create({
      data: {
        role: exp.role,
        organization: exp.organization,
        location: exp.location,
        startDate: exp.startDate,
        endDate: exp.endDate === "Present" ? null : exp.endDate,
        description: exp.description,
        highlights:
          exp.highlights.length > 0 ? JSON.stringify(exp.highlights) : null,
        type: mapExpType(exp.type),
        order: i + 1,
      },
    });
  }

  // ============================================
  // SKILLS
  // ============================================
  console.log("🔧 Seeding skills...");

  const skillsData = readJsonFile("skills.json");

  // Clear existing skills
  await prisma.skill.deleteMany({});

  let skillOrder = 1;

  // Technical skills
  for (const skill of skillsData.technical) {
    await prisma.skill.create({
      data: {
        name: skill,
        category: SkillType.TECHNICAL,
        level: SkillLevel.ADVANCED,
        order: skillOrder++,
      },
    });
  }

  // Soft skills (Communication & Leadership)
  for (const skill of skillsData.soft) {
    const category =
      skill.toLowerCase().includes("communication") ||
      skill.toLowerCase().includes("speaking")
        ? SkillType.COMMUNICATION
        : skill.toLowerCase().includes("leadership") ||
          skill.toLowerCase().includes("team")
        ? SkillType.LEADERSHIP
        : SkillType.COMMUNICATION;

    await prisma.skill.create({
      data: {
        name: skill,
        category: category,
        level: SkillLevel.ADVANCED,
        order: skillOrder++,
      },
    });
  }

  // ============================================
  // LANGUAGES
  // ============================================
  console.log("🌍 Seeding languages...");

  const languagesData = readJsonFile("languages.json");

  // Clear existing languages
  await prisma.language.deleteMany({});

  for (let i = 0; i < languagesData.length; i++) {
    const lang = languagesData[i];
    const level =
      lang.proficiency.toUpperCase() === "FLUENT"
        ? SkillLevel.FLUENT
        : SkillLevel.BASIC;

    await prisma.language.create({
      data: {
        name: lang.language,
        level: level,
        order: i + 1,
      },
    });
  }

  // ============================================
  // RESEARCH INTERESTS (as Research)
  // ============================================
  console.log("📚 Seeding research interests...");

  const interestsData = readJsonFile("interests.json");

  // Clear existing research
  await prisma.research.deleteMany({});

  for (let i = 0; i < interestsData.length; i++) {
    const interest = interestsData[i];
    await prisma.research.create({
      data: {
        title: `Research Interest ${i + 1}`,
        description: interest,
        status: "Ongoing",
        featured: false,
        order: i + 1,
      },
    });
  }

  console.log("✅ Seed completed successfully!");
  console.log("📊 Summary:");
  console.log(`   - Personal Info: 1 record`);
  console.log(`   - Education: ${educationData.length} records`);
  console.log(`   - Awards: ${awardsData.length} records`);
  console.log(`   - Certifications: ${certificationsData.length} records`);
  console.log(`   - Experience: ${experienceData.length} records`);
  console.log(
    `   - Skills: ${
      skillsData.technical.length + skillsData.soft.length
    } records`
  );
  console.log(`   - Languages: ${languagesData.length} records`);
  console.log(`   - Research Interests: ${interestsData.length} records`);
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
