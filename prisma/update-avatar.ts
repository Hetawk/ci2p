import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🖼️  Updating Professor Niu's avatar...");

  const profNiu = await prisma.user.findUnique({
    where: { email: "ise_niusj@ujn.edu.cn" },
    include: { profile: true },
  });

  if (!profNiu) {
    console.log("❌ Professor Niu not found in database");
    return;
  }

  if (!profNiu.profile) {
    console.log("❌ Professor Niu has no profile");
    return;
  }

  await prisma.profile.update({
    where: { userId: profNiu.id },
    data: {
      avatar: "/SJ.jpg",
    },
  });

  console.log("✅ Updated Professor Niu's avatar to /SJ.jpg");
  console.log("🔗 View at: http://localhost:3000/team");
}

main()
  .catch((e) => {
    console.error("❌ Update failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
