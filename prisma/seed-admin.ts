import { PrismaClient, UserRole } from "@prisma/client";
import * as bcrypt from "bcryptjs";

const prisma = new PrismaClient();

// Hash password function
async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

async function main() {
  console.log("🔑 Creating admin user from environment variables...");

  // Get admin credentials from environment
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;
  const adminMemberId = process.env.ADMIN_MEMBER_ID;
  const adminUniversityId = process.env.ADMIN_UNIVERSITY_ID || undefined;

  if (!adminEmail || !adminPassword || !adminMemberId) {
    throw new Error(
      "ADMIN_EMAIL, ADMIN_PASSWORD, and ADMIN_MEMBER_ID must be set in .env file"
    );
  } 

  console.log(`Admin Email: ${adminEmail}`);
  console.log(`Admin Password: ${adminPassword}`);
  console.log(`Admin Member ID: ${adminMemberId}`);
  console.log(`Admin University ID: ${adminUniversityId || "Not set"}`);

  // Hash the password
  const hashedPassword = await hashPassword(adminPassword);

  // Create or update admin user
  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      password: hashedPassword,
      role: UserRole.SUPER_ADMIN,
      emailVerified: true,
      active: true,
    },
    create: {
      email: adminEmail,
      username: "admin",
      password: hashedPassword,
      role: UserRole.SUPER_ADMIN,
      emailVerified: true,
      active: true,
      profile: {
        create: {
          fullName: "Administrator",
          email: adminEmail,
          memberId: adminMemberId,
          universityId: adminUniversityId,
        },
      },
    },
    include: {
      profile: true,
    },
  });

  console.log("✅ Admin user created/updated successfully!");
  console.log(`   Email: ${admin.email}`);
  console.log(`   Role: ${admin.role}`);
  console.log(`   Active: ${admin.active}`);
  console.log(`   Email Verified: ${admin.emailVerified}`);
  console.log("\n🎉 You can now login with:");
  console.log(`   Email: ${adminEmail}`);
  console.log(`   Password: ${adminPassword}`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error("❌ Error seeding admin:", e);
    await prisma.$disconnect();
    process.exit(1);
  });
