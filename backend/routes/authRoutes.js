import { randomUUID } from "node:crypto";
import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import users from "../data/users.js";

const router = Router();
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const maximumPasswordBytes = 72;
const asyncHandler = (handler) => (req, res, next) =>
  Promise.resolve(handler(req, res, next)).catch(next);

const validateCredentials = (req, res, next) => {
  const { email, password } = req.body ?? {};
  if (
    typeof email !== "string" ||
    email.length > 254 ||
    !emailPattern.test(email.trim()) ||
    typeof password !== "string" ||
    Buffer.byteLength(password, "utf8") < 8 ||
    Buffer.byteLength(password, "utf8") > maximumPasswordBytes
  ) {
    return res.status(400).json({
      message: "Enter a valid email and a password between 8 and 72 bytes."
    });
  }

  req.credentials = { email: email.trim().toLowerCase(), password };
  next();
};

const createToken = (user) =>
  jwt.sign(
    { userId: user.id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );

router.post("/register", validateCredentials, asyncHandler(async (req, res) => {
  const { email, password } = req.credentials;
  if (users.has(email)) {
    return res.status(409).json({ message: "An account with this email already exists." });
  }

  const passwordHash = await bcrypt.hash(password, 12);
  if (users.has(email)) {
    return res.status(409).json({ message: "An account with this email already exists." });
  }

  const user = { id: randomUUID(), email, passwordHash };
  users.set(email, user);
  res.status(201).json({
    message: "Account created successfully.",
    token: createToken(user),
    user: { id: user.id, email: user.email }
  });
}));

router.post("/login", validateCredentials, asyncHandler(async (req, res) => {
  const { email, password } = req.credentials;
  const user = users.get(email);

  if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
    return res.status(401).json({ message: "Invalid email or password." });
  }

  res.json({
    message: "Login successful.",
    token: createToken(user),
    user: { id: user.id, email: user.email }
  });
}));

export default router;
