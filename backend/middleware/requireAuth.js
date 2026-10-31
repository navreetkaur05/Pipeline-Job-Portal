import jwt from "jsonwebtoken";

export default function requireAuth(req, res, next) {
  const match = /^Bearer\s+(\S+)$/i.exec(req.get("authorization") ?? "");
  if (!match) {
    return res.status(401).json({ message: "Authentication is required." });
  }

  try {
    const payload = jwt.verify(match[1], process.env.JWT_SECRET);
    if (
      typeof payload !== "object" ||
      !payload ||
      typeof payload.userId !== "string" ||
      typeof payload.email !== "string"
    ) {
      return res.status(401).json({ message: "Invalid or expired token." });
    }

    req.user = { id: payload.userId, email: payload.email };
    next();
  } catch {
    return res.status(401).json({ message: "Invalid or expired token." });
  }
}
