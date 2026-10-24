import { Router } from "express";
import mongoose from "mongoose";
import Application from "../models/Application.js";

const router = Router();
const editableFields = new Set([
  "company",
  "role",
  "location",
  "salary",
  "type",
  "status",
  "appliedDate",
  "match",
  "color",
  "description"
]);
const stringLimits = {
  company: 120,
  role: 120,
  location: 120,
  salary: 120,
  type: 40,
  status: 40,
  appliedDate: 10,
  color: 7,
  description: 1000
};
const types = ["Internship", "Full-time", "Scholarship", "Training"];
const statuses = ["Applied", "Under Review", "Shortlisted", "Rejected"];

const asyncHandler = (handler) => (req, res, next) =>
  Promise.resolve(handler(req, res, next)).catch(next);

const validateApplication = ({ requireCompanyAndRole = false } = {}) =>
  (req, res, next) => {
    const input = req.body;
    if (!input || typeof input !== "object" || Array.isArray(input)) {
      return res.status(400).json({ message: "Request body must be a JSON object." });
    }

    const errors = [];
    const data = {};
    for (const [field, value] of Object.entries(input)) {
      if (!editableFields.has(field)) {
        errors.push(`"${field}" is not an editable application field.`);
        continue;
      }

      if (field === "match") {
        if (typeof value !== "number" || !Number.isFinite(value) || value < 0 || value > 100) {
          errors.push("match must be a number between 0 and 100.");
        } else {
          data.match = value;
        }
        continue;
      }

      if (typeof value !== "string") {
        errors.push(`${field} must be a string.`);
        continue;
      }

      const trimmed = value.trim();
      if (trimmed.length > stringLimits[field]) {
        errors.push(`${field} must be at most ${stringLimits[field]} characters.`);
        continue;
      }
      if (["company", "role"].includes(field) && !trimmed) {
        errors.push(`${field} is required.`);
        continue;
      }
      if (field === "type" && !types.includes(trimmed)) {
        errors.push(`type must be one of: ${types.join(", ")}.`);
        continue;
      }
      if (field === "status" && !statuses.includes(trimmed)) {
        errors.push(`status must be one of: ${statuses.join(", ")}.`);
        continue;
      }
      if (field === "appliedDate") {
        const parsedDate = new Date(`${trimmed}T00:00:00.000Z`);
        if (
          !/^\d{4}-\d{2}-\d{2}$/.test(trimmed) ||
          Number.isNaN(parsedDate.getTime()) ||
          parsedDate.toISOString().slice(0, 10) !== trimmed
        ) {
          errors.push("appliedDate must be a valid date in YYYY-MM-DD format.");
          continue;
        }
      }
      if (field === "color" && !/^#[0-9a-fA-F]{6}$/.test(trimmed)) {
        errors.push("color must be a six-digit hexadecimal color.");
        continue;
      }
      data[field] = trimmed;
    }

    if (requireCompanyAndRole) {
      for (const field of ["company", "role"]) {
        if (!(field in data) && !errors.some((error) => error.startsWith(`${field} `))) {
          errors.push(`${field} is required.`);
        }
      }
    } else if (Object.keys(input).length === 0) {
      errors.push("At least one application field must be provided.");
    }

    if (errors.length) {
      return res.status(400).json({ message: "Invalid application data.", errors });
    }

    req.validatedApplication = data;
    next();
  };

const validateId = (req, res, next) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).json({ message: "Application id must be a valid MongoDB id." });
  }
  next();
};

router.get("/", asyncHandler(async (req, res) => {
  const applications = await Application.find().sort({ appliedDate: -1, createdAt: -1 });
  res.json({ count: applications.length, applications });
}));

router.get("/:id", validateId, asyncHandler(async (req, res) => {
  const application = await Application.findById(req.params.id);
  if (!application) {
    return res.status(404).json({ message: "Application not found" });
  }
  res.json(application);
}));

router.post("/", validateApplication({ requireCompanyAndRole: true }), asyncHandler(async (req, res) => {
  const application = await Application.create(req.validatedApplication);
  res.status(201).json({
    message: "Application created successfully.",
    application
  });
}));

router.patch("/:id", validateId, validateApplication(), asyncHandler(async (req, res) => {
  const application = await Application.findByIdAndUpdate(
    req.params.id,
    { $set: req.validatedApplication },
    { new: true, runValidators: true }
  );
  if (!application) {
    return res.status(404).json({ message: "Application not found" });
  }
  res.json({
    message: "Application updated successfully.",
    application
  });
}));

router.delete("/:id", validateId, asyncHandler(async (req, res) => {
  const application = await Application.findByIdAndDelete(req.params.id);
  if (!application) {
    return res.status(404).json({ message: "Application not found" });
  }
  res.json({ message: "Application deleted successfully." });
}));

export default router;
