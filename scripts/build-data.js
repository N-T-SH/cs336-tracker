const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

const NOTES_DIR = path.join(__dirname, '..', 'notes');
const CONFIG_PATH = path.join(__dirname, '..', 'site.config.json');
const OUTPUT_PATH = path.join(__dirname, '..', 'public', 'data.json');

const FOCUS_TAGS = [
  'lecture-notes',
  'review-assignment',
  'setup-environment',
  'code-prototype',
  'study-prerequisite',
  'optimize-impl'
];

function inferFocusFromTags(content) {
  const tagMatches = content.match(/#(\w+)/g);
  if (!tagMatches) return 'lecture-notes';
  
  for (const tag of tagMatches) {
    const cleanTag = tag.slice(1).toLowerCase();
    if (FOCUS_TAGS.includes(cleanTag)) return cleanTag;
  }
  return 'lecture-notes';
}

function formatDate(dateStr) {
  // Ensure consistent YYYY-MM-DD format
  const d = new Date(dateStr);
  return d.toISOString().split('T')[0];
}

function calculateStreak(notes, startDate, totalDays) {
  const dates = notes.map(n => formatDate(n.frontmatter.date)).sort();
  const dateSet = new Set(dates);
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const start = new Date(startDate);
  start.setHours(0, 0, 0, 0);
  
  // Build daily status array
  const dailyStatus = [];
  for (let i = 0; i < Math.ceil(totalDays); i++) {
    const d = new Date(start);
    d.setDate(d.getDate() + i);
    const dateStr = d.toISOString().split('T')[0];
    dailyStatus.push({
      date: dateStr,
      hasNote: dateSet.has(dateStr),
      isFuture: d > today
    });
  }
  
  // Calculate current streak
  let currentStreak = 0;
  for (let i = dailyStatus.length - 1; i >= 0; i--) {
    if (dailyStatus[i].hasNote) {
      currentStreak++;
    } else if (!dailyStatus[i].isFuture) {
      break;
    }
  }
  
  // Calculate longest streak
  let longestStreak = 0;
  let current = 0;
  for (const day of dailyStatus) {
    if (day.hasNote) {
      current++;
      longestStreak = Math.max(longestStreak, current);
    } else {
      current = 0;
    }
  }
  
  return { currentStreak, longestStreak, dailyStatus };
}

function buildData() {
  console.log('Building data...');
  
  // Read config
  const config = JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf-8'));
  
  // Read all notes
  const notes = [];
  if (fs.existsSync(NOTES_DIR)) {
    const files = fs.readdirSync(NOTES_DIR).filter(f => f.endsWith('.md'));
    
    for (const file of files) {
      const filePath = path.join(NOTES_DIR, file);
      const content = fs.readFileSync(filePath, 'utf-8');
      const { data, content: body } = matter(content);
      
      // Normalize date to YYYY-MM-DD
      if (data.date) {
        data.date = formatDate(data.date);
      }
      
      // Infer focus if not set
      if (!data.focus) {
        data.focus = inferFocusFromTags(body);
      }
      
      notes.push({
        slug: file.replace('.md', ''),
        frontmatter: data,
        content: body
      });
    }
  }
  
  // Sort by date
  notes.sort((a, b) => new Date(a.frontmatter.date) - new Date(b.frontmatter.date));
  
  // Calculate stats
  const totalNotes = notes.length;
  const totalHours = notes.reduce((sum, n) => sum + (n.frontmatter.duration_hours || 0), 0);
  const percentComplete = Math.round((totalNotes / config.expected_note_count) * 100);
  
  // Calculate current day
  const start = new Date(config.start_date);
  const today = new Date();
  const daysDiff = Math.floor((today - start) / (1000 * 60 * 60 * 24)) + 1;
  const currentDay = Math.max(1, Math.min(daysDiff, Math.ceil(config.total_days)));
  
  // Calculate streak
  const streak = calculateStreak(notes, config.start_date, config.total_days);
  
  const data = {
    config,
    notes,
    streak,
    stats: {
      totalNotes,
      totalHours,
      percentComplete,
      currentDay
    }
  };
  
  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(data, null, 2));
  console.log(`Built data.json with ${notes.length} notes`);
}

buildData();
