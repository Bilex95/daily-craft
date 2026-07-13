// Rebuilds the "Project Index" section of README.md from the projects/ folder.
// Keeps everything above the <!-- INDEX --> marker untouched.

const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const README = path.join(ROOT, "README.md");
const PROJECTS_DIR = path.join(ROOT, "projects");
const MARKER = "<!-- INDEX -->";

const CATEGORY_LABELS = {
  "ui": "🎨 UI Component",
  "css": "🧩 CSS Layout",
  "playwright": "🎭 Playwright",
  "cypress": "🌲 Cypress",
  "api": "🔌 API Testing",
  "access": "♿ Accessibility",
  "ux": "🧠 UX Pattern",
};

function guessCategory(slug) {
  const s = slug.toLowerCase();
  for (const key of Object.keys(CATEGORY_LABELS)) {
    if (s.includes(key)) return CATEGORY_LABELS[key];
  }
  return "🛠️ Craft";
}

function firstHeading(dir) {
  const readme = path.join(PROJECTS_DIR, dir, "README.md");
  if (!fs.existsSync(readme)) return dir;
  const line = fs.readFileSync(readme, "utf8").split("\n").find((l) => l.startsWith("# "));
  return line ? line.replace(/^# /, "").trim() : dir;
}

const dirs = fs.existsSync(PROJECTS_DIR)
  ? fs.readdirSync(PROJECTS_DIR).filter((d) => !d.startsWith(".")).sort().reverse()
  : [];

const rows = dirs.map((d) => {
  const date = d.slice(0, 10);
  const title = firstHeading(d);
  return `| ${date} | [${title}](projects/${d}) | ${guessCategory(d)} |`;
});

const table = [
  "",
  `**${dirs.length} project${dirs.length === 1 ? "" : "s"} and counting** — newest first.`,
  "",
  "| Date | Project | Category |",
  "| --- | --- | --- |",
  ...rows,
  "",
].join("\n");

const readme = fs.readFileSync(README, "utf8");
const idx = readme.indexOf(MARKER);
if (idx === -1) {
  console.error("README is missing the <!-- INDEX --> marker.");
  process.exit(1);
}

fs.writeFileSync(README, readme.slice(0, idx + MARKER.length) + "\n" + table, "utf8");
console.log(`Index rebuilt with ${dirs.length} projects.`);
