const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

const NOTES_DIR       = path.join(__dirname, '..', 'notes');
const ATTACHMENTS_DIR = path.join(__dirname, '..', 'notes', 'attachments');
const CONFIG_PATH     = path.join(__dirname, '..', 'site.config.json');
const OUTPUT_PATH     = path.join(__dirname, '..', 'public', 'data.json');

// public/attachments is a symlink → notes/attachments, so /attachments/* is
// served directly by Next.js with no file-copying needed.

const FOCUS_TAGS = [
  'lecture-notes', 'review-assignment', 'setup-environment',
  'code-prototype', 'study-prerequisite', 'optimize-impl',
];

// ── Obsidian wikilink helpers ──────────────────────────────────────────────

/**
 * Extract the bare filename from an Obsidian wikilink.
 * Accepts "![[filename]]" or "[[filename]]".
 * Returns null if the value isn't a wikilink.
 */
function parseWikilink(raw) {
  if (!raw) return null;
  const m = String(raw).match(/!?\[\[(.+?)\]\]/);
  return m ? m[1].trim() : null;
}

/**
 * Given a bare filename, return the web URL if the file exists in
 * notes/attachments/, or null with a warning otherwise.
 */
function attachmentUrl(filename) {
  const src = path.join(ATTACHMENTS_DIR, filename);
  if (!fs.existsSync(src)) {
    console.warn(`  ⚠  Attachment not found: ${filename}`);
    return null;
  }
  return `/attachments/${encodeURIComponent(filename)}`;
}

/**
 * Replace every ![[filename]] in a markdown body with a standard
 * markdown image tag pointing at /attachments/<filename>.
 */
function resolveBodyImages(content) {
  return content.replace(/!\[\[(.+?)\]\]/g, (_, filename) => {
    const url = attachmentUrl(filename.trim());
    return url ? `![${filename.trim()}](${url})` : '';
  });
}

// ── Misc helpers ───────────────────────────────────────────────────────────

function inferFocusFromTags(content) {
  const tagMatches = content.match(/#(\w+)/g);
  if (!tagMatches) return 'lecture-notes';
  for (const tag of tagMatches) {
    const clean = tag.slice(1).toLowerCase();
    if (FOCUS_TAGS.includes(clean)) return clean;
  }
  return 'lecture-notes';
}

function formatDate(dateStr) {
  return new Date(dateStr).toISOString().split('T')[0];
}

function calculateStreak(notes, startDate, totalDays) {
  const dateSet = new Set(notes.map(n => formatDate(n.frontmatter.date)));
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const start = new Date(startDate); start.setHours(0, 0, 0, 0);

  const dailyStatus = [];
  for (let i = 0; i < Math.ceil(totalDays); i++) {
    const d = new Date(start);
    d.setDate(d.getDate() + i);
    const dateStr = d.toISOString().split('T')[0];
    dailyStatus.push({ date: dateStr, hasNote: dateSet.has(dateStr), isFuture: d > today });
  }

  let currentStreak = 0;
  for (let i = dailyStatus.length - 1; i >= 0; i--) {
    if (dailyStatus[i].hasNote) currentStreak++;
    else if (!dailyStatus[i].isFuture) break;
  }

  let longestStreak = 0, cur = 0;
  for (const day of dailyStatus) {
    if (day.hasNote) { cur++; longestStreak = Math.max(longestStreak, cur); }
    else cur = 0;
  }

  return { currentStreak, longestStreak, dailyStatus };
}

// ── Main build ─────────────────────────────────────────────────────────────

function buildData() {
  console.log('Building data...');
  const config = JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf-8'));

  const notes = [];
  if (fs.existsSync(NOTES_DIR)) {
    const files = fs.readdirSync(NOTES_DIR).filter(f => f.endsWith('.md'));

    for (const file of files) {
      const raw = fs.readFileSync(path.join(NOTES_DIR, file), 'utf-8');
      const { data, content: body } = matter(raw);

      if (data.date) data.date = formatDate(data.date);
      if (!data.focus) data.focus = inferFocusFromTags(body);

      // Resolve cover_image: "![[filename]]" → "/attachments/filename"
      if (data.cover_image) {
        const filename = parseWikilink(data.cover_image);
        data.cover_image = filename ? attachmentUrl(filename) : null;
      }

      // Resolve inline ![[...]] image links in the body
      const resolvedBody = resolveBodyImages(body);

      notes.push({ slug: file.replace('.md', ''), frontmatter: data, content: resolvedBody });
    }
  }

  notes.sort((a, b) => new Date(a.frontmatter.date) - new Date(b.frontmatter.date));

  const totalNotes      = notes.length;
  const totalHours      = notes.reduce((s, n) => s + (n.frontmatter.duration_hours || 0), 0);
  const percentComplete = Math.round((totalNotes / config.expected_note_count) * 100);
  const daysDiff        = Math.floor((new Date() - new Date(config.start_date)) / 864e5) + 1;
  const currentDay      = Math.max(1, Math.min(daysDiff, Math.ceil(config.total_days)));
  const streak          = calculateStreak(notes, config.start_date, config.total_days);

  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(
    { config, notes, streak, stats: { totalNotes, totalHours, percentComplete, currentDay } },
    null, 2
  ));
  console.log(`Built data.json with ${notes.length} notes`);
}

buildData();
