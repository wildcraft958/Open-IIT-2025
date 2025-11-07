#!/usr/bin/env node
/**
 * Build netflix_data.json from source CSV in ../../data/Copy of netflix_titles.csv
 * Normalizes fields and writes to public/netflix_data.json
 */
const fs = require('fs');
const path = require('path');
const readline = require('readline');

const SRC_CSV = path.resolve(__dirname, '../../data/Copy of netflix_titles.csv');
const DEST_JSON = path.resolve(__dirname, '../public/netflix_data.json');

if (!fs.existsSync(SRC_CSV)) {
  console.error('Source CSV not found at', SRC_CSV);
  process.exit(1);
}

const normalizeType = (val) => {
  if (!val) return 'Unknown';
  const t = String(val).trim().toLowerCase();
  if (['movie', 'movies', 'film'].includes(t)) return 'Movie';
  if (['tv show','tv shows','tv-show','tv series','tv-series','series','show','tvshow'].includes(t)) return 'TV Show';
  return val;
};

const toArray = (value) => {
  if (!value) return [];
  if (Array.isArray(value)) return value;
  return String(value)
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
};

(async () => {
  const input = fs.createReadStream(SRC_CSV);
  const rl = readline.createInterface({ input, crlfDelay: Infinity });
  let headers = [];
  const rows = [];
  for await (const line of rl) {
    if (!line.trim()) continue;
    // naive CSV split (safe because file is simple; for complex CSV we'd use a parser)
    const parts = []; let current = ''; let inQuotes = false;
    for (let i=0;i<line.length;i++) {
      const c = line[i];
      if (c === '"') { inQuotes = !inQuotes; continue; }
      if (c === ',' && !inQuotes) { parts.push(current); current=''; continue; }
      current += c;
    }
    parts.push(current);
    if (headers.length === 0) { headers = parts; continue; }
    const obj = {};
    headers.forEach((h, idx) => { obj[h] = parts[idx]; });
    const mapped = {
      show_id: obj.show_id,
      type: normalizeType(obj.type),
      title: obj.title,
      director: obj.director,
      cast: toArray(obj.cast),
      countries: toArray(obj.country),
      date_added: obj.date_added,
      release_year: obj.release_year ? Number(obj.release_year) : null,
      rating: obj.rating,
      duration: obj.duration,
      listed_in: toArray(obj.listed_in),
      description: obj.description,
      genres: toArray(obj.listed_in),
      directors: toArray(obj.director),
    };
    rows.push(mapped);
  }
  fs.writeFileSync(DEST_JSON, JSON.stringify(rows, null, 2));
  console.log(`Wrote ${rows.length} records to ${DEST_JSON}`);
})();
