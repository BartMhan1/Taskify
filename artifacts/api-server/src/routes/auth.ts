import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { db, usersTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { authMiddleware, type AuthRequest } from "../middlewares/auth";

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET ?? "taskify_secret_key";

function toPublicUser(user: typeof usersTable.$inferSelect) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    jobTitle: user.jobTitle,
    timezone: user.timezone,
    phone: user.phone,
    language: user.language,
    bio: user.bio,
    avatarUrl: user.avatarUrl,
    createdAt: user.createdAt.toISOString(),
  };
}

router.post("/auth/register", async (req, res): Promise<void> => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      res.status(400).json({ success: false, message: "Name, email and password are required" });
      return;
    }
    if (password.length < 8) {
      res.status(400).json({ success: false, message: "Password must be at least 8 characters" });
      return;
    }
    const existing = await db.select().from(usersTable).where(eq(usersTable.email, email)).limit(1);
    if (existing.length > 0) {
      res.status(400).json({ success: false, message: "Email already in use" });
      return;
    }
    const hashed = await bcrypt.hash(password, 10);
    const [user] = await db.insert(usersTable).values({ name, email, password: hashed }).returning();
    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: "7d" });
    res.status(201).json({ success: true, token, user: toPublicUser(user) });
  } catch (err) {
    req.log.error({ err }, "register error");
    res.status(500).json({ success: false, message: "Server error" });
  }
});

router.post("/auth/login", async (req, res): Promise<void> => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json({ success: false, message: "Email and password are required" });
      return;
    }
    const [user] = await db.select().from(usersTable).where(eq(usersTable.email, email)).limit(1);
    if (!user) {
      res.status(401).json({ success: false, message: "Invalid credentials" });
      return;
    }
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      res.status(401).json({ success: false, message: "Invalid credentials" });
      return;
    }
    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: "7d" });
    res.json({ success: true, token, user: toPublicUser(user) });
  } catch (err) {
    req.log.error({ err }, "login error");
    res.status(500).json({ success: false, message: "Server error" });
  }
});

router.post("/auth/logout", (_req, res): void => {
  res.json({ success: true, message: "Logged out" });
});

router.get("/auth/me", authMiddleware, async (req: AuthRequest, res): Promise<void> => {
  try {
    const [user] = await db.select().from(usersTable).where(eq(usersTable.id, req.userId!)).limit(1);
    if (!user) {
      res.status(401).json({ success: false, message: "User not found" });
      return;
    }
    res.json(toPublicUser(user));
  } catch (err) {
    req.log.error({ err }, "getMe error");
    res.status(500).json({ success: false, message: "Server error" });
  }
});

router.put("/auth/profile", authMiddleware, async (req: AuthRequest, res): Promise<void> => {
  try {
    const { name, email, jobTitle, timezone, phone, language, bio } = req.body;
    const updates: Partial<typeof usersTable.$inferInsert> = {};
    if (name) updates.name = name;
    if (email) updates.email = email;
    if (jobTitle !== undefined) updates.jobTitle = jobTitle;
    if (timezone !== undefined) updates.timezone = timezone;
    if (phone !== undefined) updates.phone = phone;
    if (language !== undefined) updates.language = language;
    if (bio !== undefined) updates.bio = bio;

    const [user] = await db.update(usersTable).set(updates).where(eq(usersTable.id, req.userId!)).returning();
    res.json(toPublicUser(user));
  } catch (err) {
    req.log.error({ err }, "updateProfile error");
    res.status(500).json({ success: false, message: "Server error" });
  }
});

export default router;
