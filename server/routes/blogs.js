import express from "express";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_FILE = path.join(__dirname, "..", "data", "blogs.json");

async function readBlogs() {
  const data = await fs.readFile(DATA_FILE, "utf-8");
  return JSON.parse(data);
}

async function writeBlogs(blogs) {
  await fs.writeFile(DATA_FILE, JSON.stringify(blogs, null, 2), "utf-8");
}

// GET /api/blogs — public, list all blogs
router.get("/", async (req, res) => {
  try {
    const blogs = await readBlogs();
    res.json(blogs);
  } catch (err) {
    console.error("Error reading blogs:", err);
    res.status(500).json({ error: "Failed to read blogs" });
  }
});

// GET /api/blogs/:slug — public, get single blog
router.get("/:slug", async (req, res) => {
  try {
    const blogs = await readBlogs();
    const blog = blogs.find((b) => b.slug === req.params.slug);
    if (!blog) return res.status(404).json({ error: "Blog not found" });
    res.json(blog);
  } catch (err) {
    console.error("Error reading blog:", err);
    res.status(500).json({ error: "Failed to read blog" });
  }
});

// POST /api/blogs — protected, create blog
router.post("/", authenticateToken, async (req, res) => {
  try {
    const blogs = await readBlogs();
    const { slug, title, date, readTime, excerpt, content } = req.body;

    if (!slug || !title) {
      return res.status(400).json({ error: "slug and title are required" });
    }

    if (blogs.find((b) => b.slug === slug)) {
      return res
        .status(409)
        .json({ error: "A blog with this slug already exists" });
    }

    const newBlog = {
      slug,
      date:
        date ||
        new Date().toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        }),
      readTime: readTime || "5 min read",
      title,
      excerpt: excerpt || "",
      content: content || [],
    };

    blogs.push(newBlog);
    await writeBlogs(blogs);
    res.status(201).json(newBlog);
  } catch (err) {
    console.error("Error creating blog:", err);
    res.status(500).json({ error: "Failed to create blog" });
  }
});

// PUT /api/blogs/:slug — protected, update blog
router.put("/:slug", authenticateToken, async (req, res) => {
  try {
    const blogs = await readBlogs();
    const index = blogs.findIndex((b) => b.slug === req.params.slug);

    if (index === -1) {
      return res.status(404).json({ error: "Blog not found" });
    }

    const updated = { ...blogs[index], ...req.body };
    // Don't allow changing the slug via body to avoid orphaned data
    updated.slug = req.params.slug;
    blogs[index] = updated;
    await writeBlogs(blogs);
    res.json(updated);
  } catch (err) {
    console.error("Error updating blog:", err);
    res.status(500).json({ error: "Failed to update blog" });
  }
});

// DELETE /api/blogs/:slug — protected, delete blog
router.delete("/:slug", authenticateToken, async (req, res) => {
  try {
    const blogs = await readBlogs();
    const index = blogs.findIndex((b) => b.slug === req.params.slug);

    if (index === -1) {
      return res.status(404).json({ error: "Blog not found" });
    }

    blogs.splice(index, 1);
    await writeBlogs(blogs);
    res.json({ message: "Blog deleted" });
  } catch (err) {
    console.error("Error deleting blog:", err);
    res.status(500).json({ error: "Failed to delete blog" });
  }
});

export default router;
