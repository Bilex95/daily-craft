# Setup Guide (for Tobi — delete this file after setup)

## 1. Create the repo

```bash
cd daily-craft
git init -b main
gh repo create daily-craft --public --source=. --push
```

## 2. Add your Claude API key

1. Get a key from https://console.anthropic.com → API Keys
2. In the repo: **Settings → Secrets and variables → Actions → New repository secret**
3. Name: `ANTHROPIC_API_KEY`, value: your key

Each daily generation costs a few cents at most. Without the key, the workflow still runs using local fallback templates — the streak never breaks.

## 3. Allow the workflow to write

**Settings → Actions → General → Workflow permissions** → select **Read and write permissions** → Save.

## 4. Create the label (one time)

```bash
gh label create "good first issue" --color 7057ff --description "Scoped to under an hour — perfect entry point" 2>/dev/null || true
```

(GitHub usually pre-creates this label, so this may already exist.)

## 5. Test it now

Go to **Actions → Daily Craft Project → Run workflow**. Within a minute you should see a new folder in `projects/`, an updated README index, and a fresh good-first-issue.

## 6. Recruiter polish (recommended)

- **Pin the repo** on your profile.
- Add repo **topics**: `ui-ux`, `playwright`, `cypress`, `accessibility`, `daily-coding`, `good-first-issues`.
- Add a one-line **repo description**: "One small UI/UX or testing project every day — automated, open to contributors."
- Mention it in your **profile README** with a link.

## Notes

- Schedule is 06:15 UTC (07:15 WAT). Edit the cron in `.github/workflows/daily-project.yml` to change it.
- GitHub sometimes disables scheduled workflows after 60 days of no repo activity from *you* — a single manual commit or workflow run resets this. Since you also have your daily-log automation, just interact with this repo occasionally (reviewing contributor PRs counts!).
