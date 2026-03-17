# Playground Project Context

## What This Is
This project started as a way to test out WebMCP, but has evolved into a GitHub Pages site where I can build and publish anything I want to with Claude — web apps, AI demos, creative experiments, or whatever else comes to mind.

- **URL:** `agbayliss.github.io/playground/`
- **Hosting:** GitHub Pages (free, deploys from a GitHub repo)
- **Home page:** `index.html` — a dark-themed landing page with intro copy and project cards. To add a new project, copy an existing `<a class="project-card">` block and update the href/icon/title/description/tags.
- **Design:** Dark theme across all pages (DM Sans/DM Mono, indigo accent)
- **Workflow:** Cowork edits files locally → `git add . / commit / push` → live in ~1-2 minutes

## Infrastructure Notes

### Git Cheat Sheet
```bash
git add .                           # Stage all changes
git commit -m "description here"    # Save a snapshot
git push                            # Push to GitHub (and deploy)
git log                             # View commit history
git remote -v                       # Check where your repo points
```
- Write descriptive commit messages
- Git tracks all history automatically, no need to save backup copies
- GitHub requires a Personal Access Token (PAT) instead of a password — credentials are cached after first successful push

### For WebMCP Projects
- Requires Chrome 146 Canary with the "WebMCP for testing" flag enabled
- Requires Google's WebMCP test agent Chrome extension
- Extension needs a Gemini API key from Google AI Studio
- Free tier: 100-250 requests/day depending on model; rate limits reset at midnight Pacific Time
- Tip: create new Google Cloud projects for fresh quotas if you hit the limit

## Projects

### 1. `/webmcp-demo/` — Support Ticket Form
A bare-bones support form that an AI agent can understand and fill out — built with just HTML, no JavaScript. The simplest possible WebMCP demo.

**WebMCP attributes used:**
- `toolname` on `<form>` — names the tool for agents
- `tooldescription` on `<form>` — tells the agent what the form does
- `toolparamdescription` on `<input>`, `<select>`, `<textarea>` — describes each field
- `toolautosubmit` omitted for human-in-the-loop safety

### 2. `/alien-adoption/` — Alien Pet Adoption Agency
Browse a catalog of 10 fictional alien pets and adopt one through a multi-step flow — all powered by an AI agent that can search, filter, and fill out forms on your behalf.

**Pages:**
- `index.html` — Catalog with 3 imperative tools: `search_aliens`, `get_alien_details`, `adopt_alien`
- `adopt.html` — Adoption form using the declarative API with a field-change-detecting tool log

**Features:**
- Inline detail panel (expands below card's row, no modal)
- Filter pills for browsing by size/temperament
- Agent tool log showing real-time tool calls on both pages
- Multi-page flow: catalog → adoption form → success confirmation
- Full code reference blocks on both pages showing actual tool registrations/markup

### 3. `/domain-scraper/` — Domain Scraper Bookmarklet
A one-click bookmarklet that extracts source/citation domains from AI answer pages and copies them to the clipboard as a comma-separated list. Built for internal use — quickly grab domains from AI research to paste into a spreadsheet.

**Supported platforms:** ChatGPT, Perplexity, Google AI Mode

**How it works:**
- Detects platform from `window.location.hostname`
- Uses a 4-layer DOM selector strategy to find source links: semantic selectors (class/data-testid containing "source"/"citation"), structural selectors (dialogs, panels, drawers), platform-specific selectors (Perplexity refs, Google cite/data-ved/favicon patterns), broad content-area fallback
- Unwraps Google redirect URLs (`google.com/url?q=...`)
- Strips `www.`, filters out platform-internal domains, deduplicates while preserving page order
- Copies result to clipboard with a green toast notification; falls back to `window.prompt` if clipboard API is blocked

**Files:**
- `index.html` — Installer page with drag-to-install button, usage steps, platform cards, and troubleshooting
- `bookmarklet.js` — Readable source (minified version is embedded in the `href` attribute of the install button)

**Not a WebMCP project** — this is a plain bookmarklet with no dependencies or build step.
