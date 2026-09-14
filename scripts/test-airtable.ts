import { findParticipantByName, getParticipantById } from "../lib/airtable-service";

async function test() {
  console.log("🧪 Testing Airtable connection...\n");

  // Check environment variables
  if (!process.env.AIRTABLE_API_KEY || !process.env.AIRTABLE_BASE_ID) {
    console.error(
      "❌ Missing AIRTABLE_API_KEY or AIRTABLE_BASE_ID in .env.local",
    );
    process.exit(1);
  }

  console.log("✅ Credentials found\n");

  try {
    // Test 1: Find by name
    console.log("Test 1: Find participant by name (María)");
    const maria = await findParticipantByName("María");
    if (maria) {
      console.log("✅ Found:", JSON.stringify(maria, null, 2));
      console.log();

      // Test 2: Get by ID
      console.log("Test 2: Get participant by ID");
      const byId = await getParticipantById(maria.id);
      if (byId) {
        console.log("✅ Found:", JSON.stringify(byId, null, 2));
      } else {
        console.error("❌ Could not get participant by ID");
      }
    } else {
      console.error("❌ María not found");
    }

    console.log("\n✅ All tests passed!");
  } catch (error) {
    console.error("❌ Test failed:", error);
    process.exit(1);
  }
}

test();
