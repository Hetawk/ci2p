// Check user ORCID settings in database
import { prisma } from "./lib/prisma";

const userId = "cmgl21yx20000rwbnajhsdjk1";

async function checkUserOrcid() {
  console.log(`Checking ORCID settings for user ${userId}...\n`);

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        profile: true,
      },
    });

    if (!user) {
      console.log("❌ User not found in database");
      return;
    }

    console.log("User Information:");
    console.log(`  Email: ${user.email}`);
    console.log(`  Name: ${user.profile?.fullName || "N/A"}`);
    console.log(`  Active: ${user.active}`);

    console.log("\nProfile ORCID Settings:");
    console.log(`  ORCID ID: ${user.profile?.orcidId || "NOT SET"}`);
    console.log(`  ORCID Enabled: ${user.profile?.orcidEnabled ?? "NOT SET"}`);
    console.log(`  Last Synced: ${user.profile?.orcidSyncedAt || "NEVER"}`);

    if (!user.profile?.orcidId) {
      console.log("\n⚠️  ISSUE: User has no ORCID ID set in database!");
      console.log(
        "   Please set the ORCID ID in the database or through admin panel"
      );
    } else if (user.profile.orcidEnabled === false) {
      console.log("\n⚠️  ISSUE: ORCID sync is disabled for this user!");
      console.log("   Set orcidEnabled = true in the database");
    } else {
      console.log("\n✅ ORCID settings look good!");
      console.log(
        `   ORCID ID ${user.profile.orcidId} should be fetched automatically`
      );
    }
  } catch (error) {
    console.error("Error checking user:", error);
  } finally {
    await prisma.$disconnect();
  }
}

checkUserOrcid();
