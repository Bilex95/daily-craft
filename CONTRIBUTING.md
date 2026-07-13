# Contributing to Daily Craft

Thanks for stopping by! This repo is intentionally beginner-friendly. Every project is small, self-contained, and comes with concrete improvement ideas.

## Ways to contribute

1. **Pick a `good first issue`** — a new one opens with every daily project. Comment "I'll take this" and it's yours.
2. **Improve any past project** — check the "Contribute" section in that project's README for ideas, or bring your own.
3. **Fix the automation** — the generator scripts in `scripts/` are plain JavaScript and open to improvements too.

## Ground rules

- **Plain JavaScript** — this repo is deliberately TypeScript-free to stay approachable.
- **Keep projects self-contained** — a change to `projects/2026-07-14-.../` shouldn't touch any other folder.
- **Small PRs are perfect** — a contrast fix, a missing test case, or a better animation curve are all great contributions.
- **Tests should pass** — if a project has a Playwright/Cypress suite, run it before opening your PR (setup commands are in each project's README).

## Workflow

```bash
# 1. Fork and clone
git clone https://github.com/<your-username>/daily-craft.git
cd daily-craft

# 2. Branch off main
git checkout -b fix/2026-07-14-toast-focus-trap

# 3. Make your change, then open a PR against main
```

PRs are usually reviewed within a day or two. Be kind, have fun, and don't worry about getting it perfect — that's what review is for.
