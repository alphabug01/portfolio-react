// Helper script to generate a bcrypt password hash
// Usage: node server/hash-password.js your-password-here

import bcrypt from "bcryptjs";

const password = process.argv[2];

if (!password) {
  console.log("Usage: node server/hash-password.js <password>");
  console.log("Example: node server/hash-password.js mySecretPassword123");
  process.exit(1);
}

const hash = await bcrypt.hash(password, 10);
console.log("\nGenerated password hash:");
console.log(hash);
console.log("\nCopy this hash into your .env file as ADMIN_PASSWORD_HASH");
