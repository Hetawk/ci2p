// Test script to verify ORCID integration
import { OrcidService } from "./lib/orcid";

const testOrcidId = "0009-0005-5213-9834"; // Enoch's ORCID

async function testOrcidFetch() {
  console.log(`Testing ORCID fetch for ${testOrcidId}...`);

  try {
    const profile = await OrcidService.fetchCompleteProfile(testOrcidId);
    console.log("\n✅ Successfully fetched ORCID profile!");
    console.log("\nProfile Summary:");
    console.log(`  Name: ${profile.name.givenName} ${profile.name.familyName}`);
    console.log(`  ORCID: ${profile.orcid}`);
    console.log(`  Works: ${profile.works.length}`);
    console.log(`  Employment: ${profile.employment.length}`);
    console.log(`  Education: ${profile.education.length}`);
    console.log(`  Funding: ${profile.funding.length}`);
    console.log(`  Peer Reviews: ${profile.peerReviews.length}`);

    if (profile.works.length > 0) {
      console.log("\nSample Works:");
      profile.works.slice(0, 3).forEach((work, i) => {
        console.log(
          `  ${i + 1}. ${work.title} (${work.publicationDate?.year || "N/A"})`
        );
      });
    }

    if (profile.employment.length > 0) {
      console.log("\nSample Employment:");
      profile.employment.slice(0, 2).forEach((emp, i) => {
        console.log(
          `  ${i + 1}. ${emp.role || "Position"} at ${emp.organization}`
        );
      });
    }
  } catch (error) {
    console.error("\n❌ Failed to fetch ORCID profile:");
    console.error(error);
  }
}

testOrcidFetch();
