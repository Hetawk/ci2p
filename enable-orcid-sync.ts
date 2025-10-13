// Enable ORCID sync for all users who have ORCID IDs
import { prisma } from "./lib/prisma";

async function enableOrcidForUsers() {
  console.log("Finding users with ORCID IDs but sync disabled...\n");

  try {
    // Find all profiles with ORCID ID but sync disabled
    const profiles = await prisma.profile.findMany({
      where: {
        orcidId: {
          not: null,
        },
        orcidEnabled: false,
      },
      include: {
        user: {
          select: {
            email: true,
            active: true,
          },
        },
      },
    });

    console.log(
      `Found ${profiles.length} users with ORCID IDs but sync disabled:\n`
    );

    if (profiles.length === 0) {
      console.log("✅ All users with ORCID IDs already have sync enabled!");
      return;
    }

    // Show users before updating
    profiles.forEach((profile, i) => {
      console.log(`${i + 1}. ${profile.fullName} (${profile.user.email})`);
      console.log(`   ORCID: ${profile.orcidId}`);
      console.log(`   Active: ${profile.user.active}`);
      console.log("");
    });

    console.log("Enabling ORCID sync for these users...\n");

    // Update all profiles to enable ORCID sync
    const result = await prisma.profile.updateMany({
      where: {
        orcidId: {
          not: null,
        },
        orcidEnabled: false,
      },
      data: {
        orcidEnabled: true,
      },
    });

    console.log(
      `✅ Successfully enabled ORCID sync for ${result.count} users!`
    );
    console.log(
      "\nNow all users with ORCID IDs will automatically load their data."
    );
  } catch (error) {
    console.error("Error updating users:", error);
  } finally {
    await prisma.$disconnect();
  }
}

enableOrcidForUsers();
