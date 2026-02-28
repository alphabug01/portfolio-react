import bcrypt from "bcryptjs";
import express from "express";
import fs from "fs/promises";
import jwt from "jsonwebtoken";
import path from "path";
import { fileURLToPath } from "url";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "portfolio-admin-secret-change-me";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ENV_PATH = path.join(__dirname, "..", "..", ".env");

// POST /api/auth/login
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    const adminUsername = process.env.ADMIN_USERNAME || "admin";
    const adminPasswordHash = process.env.ADMIN_PASSWORD_HASH;

    if (!adminPasswordHash) {
      return res
        .status(500)
        .json({ error: "Admin password not configured on server" });
    }

    if (username !== adminUsername) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const validPassword = await bcrypt.compare(password, adminPasswordHash);
    if (!validPassword) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign(
      { username: adminUsername, role: "admin" },
      JWT_SECRET,
      {
        expiresIn: "24h",
      },
    );

    res.json({ token, username: adminUsername });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// GET /api/auth/verify — check if token is still valid
router.get("/verify", (req, res) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ valid: false });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    res.json({ valid: true, username: decoded.username });
  } catch {
    res.status(401).json({ valid: false });
  }
});

// POST /api/auth/change-password — protected, change admin password
router.post("/change-password", authenticateToken, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res
        .status(400)
        .json({ error: "Current password and new password are required" });
    }

    if (newPassword.length < 8) {
      return res
        .status(400)
        .json({ error: "New password must be at least 8 characters" });
    }

    const adminPasswordHash = process.env.ADMIN_PASSWORD_HASH;
    const validCurrent = await bcrypt.compare(currentPassword, adminPasswordHash);
    if (!validCurrent) {
      return res.status(401).json({ error: "Current password is incorrect" });
    }

    // Hash the new password and update .env file
    const newHash = await bcrypt.hash(newPassword, 10);

    // Read current .env, replace the hash line, write back
    const envContent = await fs.readFile(ENV_PATH, "utf-8");
    const updatedEnv = envContent.replace(
      /^ADMIN_PASSWORD_HASH=.*$/m,
      `ADMIN_PASSWORD_HASH=${newHash}`,
    );
    await fs.writeFile(ENV_PATH, updatedEnv, "utf-8");

    // Update the in-memory env var so it works immediately without restart
    process.env.ADMIN_PASSWORD_HASH = newHash;

    res.json({ message: "Password changed successfully" });
  } catch (err) {
    console.error("Change password error:", err);
    res.status(500).json({ error: "Failed to change password" });
  }
});

export default router;
