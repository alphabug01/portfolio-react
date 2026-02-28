/**
 * src/lib/api.js
 *
 * Public reads use raw fetch (bypasses Supabase JS client init issues).
 * Admin writes still use the Supabase client (needs auth session).
 * Column-name mapping:
 *   DB `description`  →  JS `desc`     (projects)
 *   DB `read_time`    →  JS `readTime` (blogs)
 */
import { supabase } from "./supabase";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

/** Raw authenticated fetch to Supabase REST API (no JS client needed). */
async function restFetch(path) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`,
      "Content-Type": "application/json",
    },
  });
  if (!res.ok)
    throw new Error(`Supabase REST error ${res.status}: ${await res.text()}`);
  return res.json();
}

// ── helpers ──────────────────────────────────────────────────

/** Convert a DB project row to the shape components expect. */
function toProject(row) {
  if (!row) return null;
  const { description: desc, ...rest } = row;
  return { ...rest, desc };
}

/** Convert a DB blog row to the shape components expect. */
function toBlog(row) {
  if (!row) return null;
  const { read_time: readTime, ...rest } = row;
  return { ...rest, readTime };
}

/** Convert a component project object to DB columns before insert/update. */
function fromProject({ desc, ...rest }) {
  return { ...rest, description: desc ?? "" };
}

/** Convert a component blog object to DB columns before insert/update. */
function fromBlog({ readTime, ...rest }) {
  return { ...rest, read_time: readTime ?? "5 min read" };
}

/**
 * Raw authenticated fetch to Supabase REST API.
 * accessToken must be passed in — we never call supabase.auth.getSession() here
 * to avoid hanging if the JS client has init issues.
 */
async function authRestFetch(path, accessToken, options = {}) {
  const token = accessToken ?? SUPABASE_KEY;
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    ...options,
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      Prefer: "return=representation",
      ...(options.headers ?? {}),
    },
  });
  if (!res.ok) {
    const text = await res.text();
    const err = new Error(`Supabase REST error ${res.status}: ${text}`);
    try {
      err.code = JSON.parse(text)?.code;
    } catch {}
    throw err;
  }
  if (res.status === 204) return null;
  return res.json();
}

// ── Public reads ─────────────────────────────────────────────

/**
 * Fetch profile row for the authenticated user.
 * @param {string} accessToken - JWT from the current Supabase session
 */
export async function getMyProfile(accessToken) {
  if (!accessToken)
    throw Object.assign(new Error("Not authenticated"), { code: "PGRST116" });
  // Decode user id from JWT (avoid extra network call)
  let uid;
  try {
    uid = JSON.parse(atob(accessToken.split(".")[1])).sub;
  } catch {}
  if (!uid)
    throw Object.assign(new Error("Invalid token"), { code: "PGRST116" });
  const data = await authRestFetch(
    `profiles?select=id,role&id=eq.${uid}&limit=1`,
    accessToken,
  );
  if (!data?.length)
    throw Object.assign(new Error("No profile row"), { code: "PGRST116" });
  return data[0];
}

/**
 * Insert a viewer profile row if one doesn't exist, then return the current row.
 * @param {string} accessToken - JWT from the current Supabase session
 */
export async function ensureMyProfile(accessToken) {
  if (!accessToken) return null;
  let uid;
  try {
    uid = JSON.parse(atob(accessToken.split(".")[1])).sub;
  } catch {}
  if (!uid) return null;
  // Insert; silently ignore if row already exists
  await authRestFetch("profiles", accessToken, {
    method: "POST",
    headers: { Prefer: "resolution=ignore-duplicates,return=minimal" },
    body: JSON.stringify({ id: uid, role: "viewer" }),
  }).catch(() => {});
  // Always re-fetch the current row so we return the real role
  const data = await authRestFetch(
    `profiles?select=id,role&id=eq.${uid}&limit=1`,
    accessToken,
  );
  if (!data?.length) throw new Error("Could not create or fetch profile");
  return data[0];
}

export async function getProjects() {
  const data = await restFetch("projects?select=*&order=sort_order.asc");
  return (data ?? []).map(toProject);
}

export async function getProjectBySlug(slug) {
  const data = await restFetch(
    `projects?select=*&slug=eq.${encodeURIComponent(slug)}&limit=1`,
  );
  if (!data?.length) throw new Error("Project not found");
  return toProject(data[0]);
}

export async function getBlogs() {
  const data = await restFetch("blogs?select=*&order=sort_order.asc");
  return (data ?? []).map(toBlog);
}

export async function getBlogBySlug(slug) {
  const data = await restFetch(
    `blogs?select=*&slug=eq.${encodeURIComponent(slug)}&limit=1`,
  );
  if (!data?.length) throw new Error("Blog post not found");
  return toBlog(data[0]);
}

// ── Admin writes (require authenticated Supabase session) ────

export async function createProject(projectData) {
  const payload = fromProject(projectData);
  const { data, error } = await supabase
    .from("projects")
    .insert(payload)
    .select()
    .single();
  if (error) throw error;
  return toProject(data);
}

export async function updateProject(slug, updates) {
  const payload = fromProject(updates);
  const { data, error } = await supabase
    .from("projects")
    .update(payload)
    .eq("slug", slug)
    .select()
    .single();
  if (error) throw error;
  return toProject(data);
}

export async function deleteProject(slug) {
  const { error } = await supabase.from("projects").delete().eq("slug", slug);
  if (error) throw error;
}

export async function createBlog(blogData) {
  const payload = fromBlog(blogData);
  const { data, error } = await supabase
    .from("blogs")
    .insert(payload)
    .select()
    .single();
  if (error) throw error;
  return toBlog(data);
}

export async function updateBlog(slug, updates) {
  const payload = fromBlog(updates);
  const { data, error } = await supabase
    .from("blogs")
    .update(payload)
    .eq("slug", slug)
    .select()
    .single();
  if (error) throw error;
  return toBlog(data);
}

export async function deleteBlog(slug) {
  const { error } = await supabase.from("blogs").delete().eq("slug", slug);
  if (error) throw error;
}
