// Daily Craft — project generator
// Runs inside GitHub Actions. Calls the Claude API to generate a fresh,
// small, contribution-friendly project. Falls back to a local template
// kata if the API is unavailable, so the daily streak never breaks.

const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const PROJECTS_DIR = path.join(ROOT, "projects");

// Category rotation — one per day of week, aligned to UI/UX + QA skills.
const CATEGORIES = [
  { key: "ui-component",       label: "UI Component",        desc: "A small, polished UI component built with plain HTML/CSS/JS (no frameworks) — think pricing card, toast system, stepper, tag input." },
  { key: "css-layout",         label: "CSS Layout Challenge", desc: "A layout exercise showcasing modern CSS (grid, container queries, clamp, logical properties) recreating a realistic interface section." },
  { key: "playwright-testing", label: "Playwright Test Suite", desc: "A tiny static page PLUS a Playwright test suite covering it — selectors, assertions, one visual/behavioral edge case." },
  { key: "cypress-testing",    label: "Cypress Test Suite",   desc: "A tiny static page PLUS a Cypress test suite covering it — custom commands, intercepts, and at least one deliberate failing-test exercise for contributors to fix." },
  { key: "api-testing",        label: "API Testing Kata",     desc: "A small Node script or test suite (plain JS, node:test or Playwright API testing) against a public API — validation, error cases, schema checks." },
  { key: "accessibility",      label: "Accessibility Audit",  desc: "A deliberately imperfect small page plus an AUDIT.md checklist — contributors find and fix WCAG issues (contrast, focus order, ARIA, keyboard nav)." },
  { key: "ux-pattern",         label: "UX Pattern Study",     desc: "A small interactive demo of one UX pattern (optimistic UI, skeleton loading, undo toast, inline validation) with a README explaining the reasoning." },
];

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

function slugify(s) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "").slice(0, 40);
}

function pickCategory() {
  const dayOfWeek = new Date().getUTCDay(); // 0-6, stable rotation
  return CATEGORIES[dayOfWeek % CATEGORIES.length];
}

// Titles of past projects so the model avoids repeats.
function pastProjectTitles() {
  if (!fs.existsSync(PROJECTS_DIR)) return [];
  return fs.readdirSync(PROJECTS_DIR).filter((d) => !d.startsWith("."));
}

async function callClaude(category, history) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) throw new Error("ANTHROPIC_API_KEY not set");

  const prompt = `You are generating today's project for "Daily Craft", a public GitHub repo of small, high-quality daily exercises in UI/UX and software testing. Visitors include recruiters and open-source contributors, so quality and clarity matter more than size.

Today's category: ${category.label}
Category brief: ${category.desc}

Already-existing project folders (do NOT repeat these ideas):
${history.slice(-60).join("\n") || "(none yet)"}

Generate ONE small project. Requirements:
- 2 to 5 files total, each complete and runnable/openable as-is.
- Plain JavaScript only (no TypeScript). Vanilla HTML/CSS/JS for UI work. For test suites, assume the contributor runs "npm init -y && npm i -D playwright" (or cypress) themselves — include exact setup commands in the README.
- Code must be clean, commented where non-obvious, and genuinely well-crafted — this is a public portfolio.
- README.md must include: what it is, why it's interesting, how to run it, and a "Contribute" section with 2-3 concrete improvement ideas.
- Also write ONE "good first issue" for contributors: specific, scoped to under an hour of work, friendly tone.

Respond ONLY with valid JSON, no markdown fences, in this exact shape:
{
  "title": "Short Project Title",
  "files": [
    { "path": "README.md", "content": "..." },
    { "path": "index.html", "content": "..." }
  ],
  "issue": { "title": "...", "body": "..." }
}`;

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-6",
      max_tokens: 8000,
      messages: [{ role: "user", content: prompt }],
    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`API error ${res.status}: ${errText.slice(0, 300)}`);
  }

  const data = await res.json();
  const text = (data.content || [])
    .filter((b) => b.type === "text")
    .map((b) => b.text)
    .join("\n");

  const clean = text.replace(/```json|```/g, "").trim();
  return JSON.parse(clean);
}

function loadFallback(category) {
  // Fallback kata so the streak never breaks if the API call fails.
  const fbPath = path.join(ROOT, "templates", `${category.key}.json`);
  const generic = path.join(ROOT, "templates", "generic.json");
  const file = fs.existsSync(fbPath) ? fbPath : generic;
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

function writeProject(project) {
  const date = todayISO();
  const slug = `${date}-${slugify(project.title)}`;
  const dir = path.join(PROJECTS_DIR, slug);

  if (fs.existsSync(dir)) {
    console.log(`Project for ${date} already exists, skipping.`);
    process.exit(0);
  }

  fs.mkdirSync(dir, { recursive: true });

  for (const f of project.files) {
    // Guard against path traversal from generated content.
    const safe = path.normalize(f.path).replace(/^(\.\.(\/|\\|$))+/, "");
    const dest = path.join(dir, safe);
    if (!dest.startsWith(dir)) continue;
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.writeFileSync(dest, f.content, "utf8");
  }

  // Hand the slug + issue text to later workflow steps.
  fs.writeFileSync(path.join(ROOT, ".today-slug"), slug, "utf8");
  if (project.issue) {
    fs.writeFileSync(
      path.join(ROOT, ".today-issue.md"),
      `# [${slug}] ${project.issue.title}\n${project.issue.body}\n\n---\nProject folder: \`projects/${slug}\``,
      "utf8"
    );
  }

  console.log(`Created projects/${slug} (${project.files.length} files)`);
}

(async () => {
  const category = pickCategory();
  const history = pastProjectTitles();
  console.log(`Category today: ${category.label}`);

  let project;
  try {
    project = await callClaude(category, history);
    console.log("Generated via Claude API.");
  } catch (err) {
    console.warn(`API generation failed (${err.message}). Using fallback template.`);
    project = loadFallback(category);
  }

  writeProject(project);
})();
