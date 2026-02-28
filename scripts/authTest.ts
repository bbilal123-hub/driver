import { account, ID } from "../services/appwrite";

async function runAuthTest() {
  try {
    console.log("===== AUTH TEST START =====");

    // 1) Create a test user (signup)
    const user = await account.create(
      ID.unique(),
      "driver@example.com",
      "password123",
      "Driver One"
    );
    console.log("✅ User created:", user);

    // 2) Login with that user (your SDK uses createSession)
    const session = await account.createSession(
      "driver@example.com",
      "password123"
    );
    console.log("✅ Session created:", session);

    // 3) Get current user
    const currentUser = await account.get();
    console.log("✅ Current user:", currentUser);

    // 4) Logout
    await account.deleteSessions();
    console.log("✅ Logged out");
  } catch (err: any) {
    console.error("❌ Auth test failed:", err.message || err);
  }
}

runAuthTest();
