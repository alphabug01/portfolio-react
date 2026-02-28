import express from "express";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_FILE = path.join(__dirname, "..", "data", "projects.json");

async function readProjects() {
  const data = await fs.readFile(DATA_FILE, "utf-8");
  return JSON.parse(data);
}

async function writeProjects(projects) {
  await fs.writeFile(DATA_FILE, JSON.stringify(projects, null, 2), "utf-8");
}

// GET /api/projects — public, list all projects
router.get("/", async (req, res) => {
  try {
    const projects = await readProjects();
    res.json(projects);
  } catch (err) {
    console.error("Error reading projects:", err);
    res.status(500).json({ error: "Failed to read projects" });
  }
});

// GET /api/projects/:slug — public, get single project
router.get("/:slug", async (req, res) => {
  try {
    const projects = await readProjects();
    const project = projects.find((p) => p.slug === req.params.slug);
    if (!project) return res.status(404).json({ error: "Project not found" });
    res.json(project);
  } catch (err) {
    console.error("Error reading project:", err);
    res.status(500).json({ error: "Failed to read project" });
  }
});

// POST /api/projects — protected, create project
router.post("/", authenticateToken, async (req, res) => {
  try {
    const projects = await readProjects();
    const {
      slug,
      number,
      title,
      desc,
      tags,
      problem,
      approach,
      outcome,
      links,
    } = req.body;

    if (!slug || !title) {
      return res.status(400).json({ error: "slug and title are required" });
    }

    if (projects.find((p) => p.slug === slug)) {
      return res
        .status(409)
        .json({ error: "A project with this slug already exists" });
    }

    // Auto-generate number if not provided
    const nextNumber = number || String(projects.length + 1).padStart(2, "0");

    const newProject = {
      slug,
      number: nextNumber,
      title,
      desc: desc || "",
      tags: tags || [],
      problem: problem || "",
      approach: approach || "",
      outcome: outcome || "",
      links: links || { github: "", live: "" },
    };

    projects.push(newProject);
    await writeProjects(projects);
    res.status(201).json(newProject);
  } catch (err) {
    console.error("Error creating project:", err);
    res.status(500).json({ error: "Failed to create project" });
  }
});

// PUT /api/projects/:slug — protected, update project
router.put("/:slug", authenticateToken, async (req, res) => {
  try {
    const projects = await readProjects();
    const index = projects.findIndex((p) => p.slug === req.params.slug);

    if (index === -1) {
      return res.status(404).json({ error: "Project not found" });
    }

    const updated = { ...projects[index], ...req.body };
    updated.slug = req.params.slug;
    projects[index] = updated;
    await writeProjects(projects);
    res.json(updated);
  } catch (err) {
    console.error("Error updating project:", err);
    res.status(500).json({ error: "Failed to update project" });
  }
});

// DELETE /api/projects/:slug — protected, delete project
router.delete("/:slug", authenticateToken, async (req, res) => {
  try {
    const projects = await readProjects();
    const index = projects.findIndex((p) => p.slug === req.params.slug);

    if (index === -1) {
      return res.status(404).json({ error: "Project not found" });
    }

    projects.splice(index, 1);
    await writeProjects(projects);
    res.json({ message: "Project deleted" });
  } catch (err) {
    console.error("Error deleting project:", err);
    res.status(500).json({ error: "Failed to delete project" });
  }
});

export default router;
