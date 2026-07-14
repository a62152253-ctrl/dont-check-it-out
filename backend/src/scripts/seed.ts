import { adminDb } from "../config/firebase.js";

export async function seedInitialData() {
  console.log("[Seeding] Initiating Firestore schema seeds...");
  
  const dummyProfiles = [
    {
      uid: "system_seeder_prod",
      email: "prod_admin@ciphervault.io",
      displayName: "System Admin Seeder",
      role: "admin",
      plan: "enterprise",
      createdAt: new Date().toISOString(),
      onboardingCompleted: true,
      status: "Active"
    }
  ];

  for (const profile of dummyProfiles) {
    await adminDb.collection("users").doc(profile.uid).set(profile);
    console.log(`[Seeding] Created seeder account metadata for: ${profile.email}`);
  }

  console.log("[Seeding] Completed database setup successfully.");
}

// Automatically invoke if run directly
if (process.argv[1]?.endsWith("seed.ts")) {
  seedInitialData().catch(console.error);
}
