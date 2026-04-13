# CS336 Progress Tracker — Site Specification

**Project:** Public progress-tracking website for Stanford CS336 (Language Modeling from Scratch)  
**Sprint duration:** 33.6 days  
**Audience:** This document is intended for a web designer and/or Claude Code to implement the site end-to-end.

---

## 1. Overview & Goals

A publicly hosted, read-only website that displays one person's progress through Stanford CS336 across a 33.6-day self-imposed sprint. The site ingests a folder of Markdown notes (committed to a GitHub repo) and renders them with a timeline, progress stats, and a note reader. There is no login, no user-generated content on the site, and no annotations. The site owner updates the site by pushing new `.md` files to the repo.

---

## 2. Hosting & Data Architecture

### Hosting
- **Platform:** GitHub Pages or Vercel (static site, zero backend)
- **Framework:** Next.js (static export) or plain React + Vite, deployed via GitHub Actions on every push to `main`

### Data source
- All notes live in a GitHub repository under `/notes/`, one `.md` file per session
- **File naming convention:** `YYYY-MM-DD_<slug>.md` (e.g. `2025-06-01_tokenization-bpe.md`)
- At build time, a build script reads all `.md` files, parses their frontmatter and `#tags`, and outputs a single `data.json` that the frontend consumes
- No database, no API — the compiled `data.json` is the entire data layer

### Note frontmatter schema
Each `.md` file should include the following YAML frontmatter block:

```yaml
---
title: "BPE Tokenization"
date: 2025-06-01
day: 3
week: 1
tags: [lecture-notes, study-prerequisite]
focus: lecture-notes          # primary focus tag (see Section 5)
duration_hours: 2.5
cs336_topic: "Tokenization"   # maps to official course week/lecture
---
```

The `focus` field drives timeline color-coding (Section 5). If absent, the build script infers it from the first `#tag` found in the file body.

---

## 3. Site Structure

The site is a single-page application with three distinct sections rendered on one scrollable page (no routing needed):

```
┌─────────────────────────────────┐
│  Header / Nav (fixed)           │
├─────────────────────────────────┤
│  Section 1: Dashboard           │
│    • About (2 lines)            │
│    • Progress + Streak          │
│    • Today's Focus              │
├─────────────────────────────────┤
│  Section 2: Full Timeline       │
├─────────────────────────────────┤
│  Section 3: Note Viewer         │
│    • Mini-timeline (top)        │
│    • Rendered note body         │
└─────────────────────────────────┘
```

---

## 4. Section 1 — Dashboard

### 4a. About Block
- Two lines of static text, editable in a config file (`site.config.json` or frontmatter in a `README.md`)
- Example:
  > Working through Stanford CS336 — Language Modeling from Scratch — in 33.6 days.  
  > Documenting every session publicly as I build a language model from the ground up.
- Rendered in a clean typographic style, centered or left-aligned at the top of the page

### 4b. Progress & Streak Tracker

**Progress bar / ring:**
- Shows **Day X of 33.6** (calculated from `start_date` in `site.config.json` vs. today's date at build time)
- Shows **% of notes filed** = `(total .md files) / (expected total files)` — expected total is a config value (e.g. 33 or however many sessions are planned)
- Shows **hours logged** = sum of `duration_hours` across all notes

**Streak tracker:**
- A streak is defined as consecutive calendar days on which at least one `.md` file was committed (file `date` field, not git commit timestamp, to be robust)
- Display: current streak (🔥 N days), longest streak
- Visual: a small grid of the last 33 days, each cell colored if a note exists for that day (like a GitHub contribution graph), greyed out if no note, future days shown as empty outlines

### 4c. Today's Focus
- Pulls the note whose `date` matches today (build date)
- If a note exists for today: show its `title`, `cs336_topic`, `focus` tag (as a color-coded pill), and `duration_hours`
- If no note exists yet for today: show a placeholder — "No note yet for today"
- Link/button: "Read today's note →" scrolls to Section 3 with that note loaded

---

## 5. Color Coding by Focus Tag

Six focus categories, each with a distinct color. These are detected from the `focus` frontmatter field or inferred from `#tags` in the note body.

| Focus Tag            | Display Label            | Suggested Color  |
|----------------------|--------------------------|------------------|
| `lecture-notes`      | Lecture Notes            | Blue `#3B82F6`   |
| `review-assignment`  | Review / Assignment      | Amber `#F59E0B`  |
| `setup-environment`  | Setup & Environment      | Slate `#64748B`  |
| `code-prototype`     | Code Up Prototype        | Green `#22C55E`  |
| `study-prerequisite` | Study Prerequisite       | Purple `#A855F7` |
| `optimize-impl`      | Optimize Implementation  | Rose `#F43F5E`   |

All six colors should be accessible (WCAG AA contrast) against both light and dark backgrounds.

---

## 6. Section 2 — Full Timeline

A full-width horizontal strip spanning 33.6 days. This is the main navigation element of the site.

### Layout
- Each day is a cell in the strip
- Width of each cell is proportional (all equal, 33 cells + one half-cell for the 0.6)
- Days with a note: filled cell, colored by `focus` tag
- Days without a note: empty/grey cell
- Today's date: marked with a small indicator (dot or border highlight)
- Future days: visually dimmed

### Cell contents (on hover / tap)
- Tooltip or popover showing: Day number, date, note title, focus label

### Interaction
- Clicking a cell loads that note into Section 3 (smooth scroll)
- If a day has multiple notes, clicking cycles through them or shows a mini-list

### Week markers
- Subtle week separators and labels above the strip (Week 1, Week 2, etc.)
- Each week can have a sub-label matching the CS336 curriculum topic for that week (configurable in `site.config.json`)

---

## 7. Section 3 — Note Viewer

### Mini-timeline (top of section)
- A condensed version of the full timeline from Section 2
- Same color-coding, same click behavior
- Compact: cells are smaller (no labels), serves as a scrubber to navigate between notes without scrolling back up
- Currently selected note is highlighted

### Note body
- Rendered from the `.md` file source
- Full Markdown support: headings, code blocks (syntax highlighted), bold/italic, blockquotes, lists, tables
- Obsidian-flavored extras: callouts (`> [!NOTE]`), and `[[wikilinks]]` rendered as plain bold text (no linking, since not all notes may be present)
- No sidebar, no file tree, no annotations
- A small header above the note body shows: title, date, focus pill, duration
- Navigation: "← Previous note" / "Next note →" buttons at the bottom

---

## 8. Header / Nav

- Site name / logo (left): e.g. "CS336 × 33.6"
- Right side: link to the GitHub repo (source of notes), and optionally a link to the official CS336 course page
- Fixed/sticky on scroll
- Minimal — single line, no dropdown menus

---

## 9. Configuration File

A single `site.config.json` at the repo root controls all site-wide settings:

```json
{
  "site_title": "CS336 × 33.6",
  "about_line_1": "Working through Stanford CS336 — Language Modeling from Scratch — in 33.6 days.",
  "about_line_2": "Documenting every session publicly as I build a language model from the ground up.",
  "start_date": "2025-06-01",
  "total_days": 33.6,
  "expected_note_count": 33,
  "github_repo_url": "https://github.com/username/cs336-notes",
  "cs336_course_url": "https://stanford-cs336.github.io/spring2025/",
  "week_labels": {
    "1": "Tokenization & Data",
    "2": "Transformer Architecture",
    "3": "Training & Optimization",
    "4": "Scaling & Evaluation",
    "5": "Buffer / Review"
  }
}
```

---

## 10. Build Script

A Node.js script (`scripts/build-data.js`) that runs before the frontend build:

1. Reads all `.md` files from `/notes/`
2. Parses YAML frontmatter (`gray-matter`)
3. Infers `focus` from body `#tags` if not set in frontmatter
4. Checks for files missing required frontmatter fields and warns
5. Sorts notes by `date`
6. Computes streak data from `date` fields
7. Outputs `/public/data.json`

The frontend imports `data.json` as static JSON — no runtime file reading.

---

## 11. Tech Stack (Recommended)

| Layer           | Choice                        | Notes                                      |
|-----------------|-------------------------------|--------------------------------------------|
| Framework       | Next.js 14 (static export)    | `next export` → deploy to GitHub Pages     |
| Styling         | Tailwind CSS v3               | Dark mode via `class` strategy             |
| Markdown render | `react-markdown` + `rehype-highlight` | Code syntax highlighting             |
| Frontmatter     | `gray-matter`                 | Build-time only                            |
| Deployment      | GitHub Actions → GitHub Pages | Trigger on push to `main`                  |
| Font            | Inter (body) + JetBrains Mono (code) | Via `next/font` or Google Fonts     |

---

## 12. Repo Structure

```
/
├── notes/
│   ├── 2025-06-01_tokenization-bpe.md
│   ├── 2025-06-02_data-pipeline.md
│   └── ...
├── site.config.json
├── scripts/
│   └── build-data.js
├── public/
│   └── data.json             ← generated at build time
├── src/
│   ├── app/
│   │   └── page.tsx          ← single page, three sections
│   ├── components/
│   │   ├── Dashboard.tsx
│   │   ├── Timeline.tsx
│   │   ├── MiniTimeline.tsx
│   │   ├── NoteViewer.tsx
│   │   ├── StreakGrid.tsx
│   │   ├── FocusPill.tsx
│   │   └── Header.tsx
│   └── lib/
│       └── types.ts
├── package.json
└── .github/
    └── workflows/
        └── deploy.yml
```

---

## 13. GitHub Actions Deploy Workflow

```yaml
# .github/workflows/deploy.yml
name: Build and Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm ci
      - run: node scripts/build-data.js
      - run: npm run build
      - uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./out
```

---

## 14. Design Notes for Web Designer

- **Aesthetic:** Dark background preferred (dark slate / near-black). Clean, minimal, developer-ish but not cold. Think Linear.app or Vercel's dashboard aesthetic.
- **Typography:** Large, confident heading for the site title. Body text at comfortable reading size (16–18px). Code in monospace.
- **Timeline:** Should feel like a physical strip / film reel. The color blocks are the main visual element — let them breathe.
- **Mobile:** Timeline scrolls horizontally on mobile. Dashboard and Note Viewer stack vertically.
- **No animations needed** beyond smooth scroll and subtle hover states on timeline cells.
- **Favicon:** Simple — a monogram or small flame icon.

---

## 15. Out of Scope

The following are explicitly not part of this build:

- User login or authentication
- Comments or reactions
- Annotation or highlighting on notes
- Search functionality
- Sidebar file tree
- Observations log
- Any backend or database
- Editing notes from the web UI (all edits happen in Obsidian, pushed via git)

---

*End of specification.*
