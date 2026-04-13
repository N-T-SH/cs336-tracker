# CS336 × 33.6 — Progress Tracker

A public progress-tracking website for Stanford CS336 (Language Modeling from Scratch) completed in a 33.6-day sprint.

## Structure

- `/notes/` — Markdown notes, one per session
- `/src/components/` — React components
- `site.config.json` — Site-wide configuration
- `scripts/build-data.js` — Build script to generate `data.json`

## Development

```bash
# Install dependencies
npm install

# Run dev server
npm run dev

# Build for production
npm run build
```

## Adding Notes

1. Create a new `.md` file in `/notes/` with format: `YYYY-MM-DD_<slug>.md`
2. Include YAML frontmatter with required fields
3. Push to main branch — site auto-deploys via GitHub Actions

### Frontmatter Schema

```yaml
---
title: "Note Title"
date: 2025-06-01
day: 1
week: 1
tags: [lecture-notes, tag2]
focus: lecture-notes
duration_hours: 3
cs336_topic: "Topic Name"
---
```

## Deployment

The site auto-deploys to GitHub Pages on every push to `main`.

## License

MIT
