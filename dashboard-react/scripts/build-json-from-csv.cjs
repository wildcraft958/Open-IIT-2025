#!/usr/bin/env node
/**
 * Build netflix_data.json from source CSV
 * Now supports both old format (2021) and new format (2025)
 * Normalizes fields and writes to public/netflix_data.json
 */
const fs = require('fs');
const path = require('path');
const { parse } = require('csv-parse/sync');

// Use combined dataset (movies + TV shows with performance metrics)
const COMBINED_CSV = path.resolve(__dirname, '../../data/netflix_combined_dataset.csv');
const NEW_CSV = path.resolve(__dirname, '../../data/Copy of netflix_movies_detailed_up_to_2025 (1).csv');
const OLD_CSV = path.resolve(__dirname, '../../data/Copy of netflix_titles.csv');

// Priority: Combined > New > Old
const SRC_CSV = fs.existsSync(COMBINED_CSV) ? COMBINED_CSV : 
                fs.existsSync(NEW_CSV) ? NEW_CSV : OLD_CSV;
const DEST_JSON = path.resolve(__dirname, '../public/netflix_data.json');

console.log('📁 Using source CSV:', SRC_CSV);
if (SRC_CSV === COMBINED_CSV) {
  console.log('   🎉 Using COMBINED dataset (Movies + TV Shows + Metrics)');
}

if (!fs.existsSync(SRC_CSV)) {
  console.error('❌ Source CSV not found at', SRC_CSV);
  process.exit(1);
}

const NA_TOKENS = new Set([ 'n/a', 'na', 'null', 'none', 'unknown', 'not given', ''] );

const clean = (val) => {
  if (val === undefined || val === null) return null;
  const s = String(val).trim();
  if (NA_TOKENS.has(s.toLowerCase())) return null;
  return s;
};

const normalizeType = (val, duration) => {
  const c = clean(val);
  if (!c) {
    // Infer from duration if possible
    const d = String(duration || '').toLowerCase();
    if (/min/.test(d)) return 'Movie';
    if (/season/.test(d)) return 'TV Show';
    return 'Unknown';
  }
  const t = c.toLowerCase();
  if (['movie', 'movies', 'film'].includes(t)) return 'Movie';
  if (['tv show','tv shows','tv-show','tv series','tv-series','series','show','tvshow'].includes(t)) return 'TV Show';
  return c;
};

const toArray = (value) => {
  if (!value) return [];
  if (Array.isArray(value)) return value;
  return String(value)
    .split(',')
    .map((item) => clean(item))
    .filter(Boolean);
};

(async () => {
  const csvContent = fs.readFileSync(SRC_CSV, 'utf-8');
  const records = parse(csvContent, {
    columns: true,
    skip_empty_lines: true,
    relax_quotes: true,
    relax_column_count: true,
    trim: true,
  });

  const rows = records.map((obj) => {
    const duration = clean(obj.duration);
    // Handle both old format (listed_in) and new format (genres)
    const genresField = obj.genres || obj.listed_in || '';
    
    const mapped = {
      show_id: clean(obj.show_id),
      type: normalizeType(obj.type, duration),
      title: clean(obj.title),
      director: clean(obj.director),
      cast: toArray(obj.cast),
      countries: toArray(obj.country),
      date_added: clean(obj.date_added),
      release_year: clean(obj.release_year) ? Number(obj.release_year) : null,
      rating: clean(obj.rating),
      duration,
      listed_in: toArray(genresField),
      description: clean(obj.description),
      genres: toArray(genresField),
      directors: toArray(obj.director),
      // New fields from 2025 dataset
      language: clean(obj.language),
      popularity: clean(obj.popularity) ? Number(obj.popularity) : null,
      vote_count: clean(obj.vote_count) ? Number(obj.vote_count) : null,
      vote_average: clean(obj.vote_average) ? Number(obj.vote_average) : null,
      budget: clean(obj.budget) ? Number(obj.budget) : null,
      revenue: clean(obj.revenue) ? Number(obj.revenue) : null,
    };
    return mapped;
  });

  fs.writeFileSync(DEST_JSON, JSON.stringify(rows, null, 2));
  console.log(`✅ Wrote ${rows.length} records to ${DEST_JSON}`);
  console.log(`📊 Dataset: ${SRC_CSV.includes('2025') ? '2010-2025 (Movies)' : '2019-2021 (Movies + TV Shows)'}`);
  console.log(`🎬 Types: ${[...new Set(rows.map(r => r.type))].join(', ')}`);
})();
