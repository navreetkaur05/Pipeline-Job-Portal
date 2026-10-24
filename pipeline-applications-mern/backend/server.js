import "dotenv/config";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import applicationRoutes from "./routes/applicationRoutes.js";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Pipeline API is running" });
});

app.use("/api/applications", applicationRoutes);

app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.use((error, req, res, next) => {
  if (error.type === "entity.parse.failed") {
    return res.status(400).json({ message: "Request body must contain valid JSON." });
  }

  if (error.name === "ValidationError") {
    return res.status(400).json({
      message: "Application validation failed.",
      errors: Object.values(error.errors).map((item) => item.message)
    });
  }

  if (error.name === "CastError") {
    return res.status(400).json({ message: "Invalid application data." });
  }

  console.error(error);
  res.status(500).json({ message: "An unexpected server error occurred." });
});

const startServer = async () => {
  try {
    await mongoose.connect(
      process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/pipeline"
    );
    app.listen(PORT, () => {
      console.log(`Backend running at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Could not connect to MongoDB:", error);
    process.exitCode = 1;
  }
};

startServer();
