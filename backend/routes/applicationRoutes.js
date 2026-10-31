import { Router } from "express";
import applications from "../data/applications.js";
import requireAuth from "../middleware/requireAuth.js";

const router = Router();

router.use(requireAuth);

// GET /api/applications — return all applications
router.get("/", (req, res) => {
  res.json({ count: applications.length, applications });
});

// GET /api/applications/:id — return one application
router.get("/:id", (req, res) => {
  const id = Number(req.params.id);
  const application = applications.find((item) => item.id === id);

  if (!application) {
    return res.status(404).json({ message: "Application not found" });
  }

  res.json(application);
});

// POST /api/applications — create a new application
router.post("/", (req, res) => {
  const { company, role, location, salary, type, status, appliedDate, description } = req.body;

  if (!company?.trim() || !role?.trim()) {
    return res.status(400).json({
      message: "Company and role are required."
    });
  }

  const newApplication = {
    id: applications.length
      ? Math.max(...applications.map((item) => item.id)) + 1
      : 1,
    company: company.trim(),
    role: role.trim(),
    location: location?.trim() || "Not specified",
    salary: salary?.trim() || "Not specified",
    type: type || "Internship",
    status: status || "Applied",
    postedDate: new Date().toISOString().slice(0, 10),
    appliedDate: appliedDate || new Date().toISOString().slice(0, 10),
    match: 0,
    color: "#0a9a6c",
    description: description?.trim() || "No description provided."
  };

  applications.unshift(newApplication);
  res.status(201).json({
    message: "Application created successfully.",
    application: newApplication
  });
});

export default router;
