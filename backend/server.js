import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import authRoutes from "./routes/authRoutes.js";
import applicationRoutes from "./routes/applicationRoutes.js";

dotenv.config({ path: resolve(dirname(fileURLToPath(import.meta.url)), ".env") });

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Pipeline API is running" });
});

app.use("/api/auth", authRoutes);
app.use("/api/applications", applicationRoutes);

app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.use((error, req, res, next) => {
  if (error.type === "entity.parse.failed") {
    return res.status(400).json({ message: "Request body must contain valid JSON." });
  }
  if (res.headersSent) {
    return next(error);
  }
  console.error(error);
  res.status(500).json({ message: "An unexpected server error occurred." });
});

if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
  throw new Error("JWT_SECRET must be set to a secret with at least 32 characters.");
}

app.listen(PORT, () => {
  console.log(`Backend running at http://localhost:${PORT}`);
});
