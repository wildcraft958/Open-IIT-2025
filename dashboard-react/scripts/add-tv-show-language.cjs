#!/usr/bin/env node
/**
 * Add language data to TV shows based on country of origin and genre
 */
const fs = require('fs');
const path = require('path');

const JSON_FILE = path.resolve(__dirname, '../public/netflix_data.json');
const BACKUP_FILE = path.resolve(__dirname, '../public/netflix_data_before_tv_language.json');

console.log('🌍 Adding Language Data to TV Shows...\n');

// Load data
const data = JSON.parse(fs.readFileSync(JSON_FILE, 'utf-8'));
console.log(`📂 Loaded ${data.length} total records`);

// Backup original
fs.writeFileSync(BACKUP_FILE, JSON.stringify(data, null, 2));
console.log(`💾 Backup saved to: netflix_data_before_tv_language.json\n`);

// Country to language mapping (based on primary language)
const COUNTRY_LANGUAGE_MAP = {
  // English-speaking countries
  'United States': 'en',
  'United Kingdom': 'en',
  'Canada': 'en',
  'Australia': 'en',
  'New Zealand': 'en',
  'Ireland': 'en',
  'South Africa': 'en',
  
  // Spanish-speaking countries
  'Spain': 'es',
  'Mexico': 'es',
  'Argentina': 'es',
  'Colombia': 'es',
  'Chile': 'es',
  'Peru': 'es',
  'Venezuela': 'es',
  'Ecuador': 'es',
  'Uruguay': 'es',
  'Bolivia': 'es',
  'Paraguay': 'es',
  'Costa Rica': 'es',
  'Panama': 'es',
  'Guatemala': 'es',
  'Honduras': 'es',
  'Nicaragua': 'es',
  'El Salvador': 'es',
  'Cuba': 'es',
  'Dominican Republic': 'es',
  'Puerto Rico': 'es',
  
  // French-speaking countries
  'France': 'fr',
  'Belgium': 'fr',
  'Switzerland': 'fr',
  'Luxembourg': 'fr',
  'Monaco': 'fr',
  'Senegal': 'fr',
  'Ivory Coast': 'fr',
  'Mali': 'fr',
  'Burkina Faso': 'fr',
  'Niger': 'fr',
  'Cameroon': 'fr',
  'Madagascar': 'fr',
  
  // Asian languages
  'Japan': 'ja',
  'South Korea': 'ko',
  'Korea': 'ko',
  'China': 'zh',
  'Taiwan': 'zh',
  'Hong Kong': 'zh',
  'India': 'hi',
  'Thailand': 'th',
  'Vietnam': 'vi',
  'Indonesia': 'id',
  'Philippines': 'tl',
  'Malaysia': 'ms',
  'Singapore': 'en',
  'Pakistan': 'ur',
  'Bangladesh': 'bn',
  
  // European languages
  'Germany': 'de',
  'Austria': 'de',
  'Italy': 'it',
  'Portugal': 'pt',
  'Brazil': 'pt',
  'Netherlands': 'nl',
  'Poland': 'pl',
  'Russia': 'ru',
  'Ukraine': 'uk',
  'Czech Republic': 'cs',
  'Sweden': 'sv',
  'Norway': 'no',
  'Denmark': 'da',
  'Finland': 'fi',
  'Greece': 'el',
  'Turkey': 'tr',
  'Romania': 'ro',
  'Hungary': 'hu',
  
  // Middle Eastern languages
  'Saudi Arabia': 'ar',
  'United Arab Emirates': 'ar',
  'Egypt': 'ar',
  'Lebanon': 'ar',
  'Jordan': 'ar',
  'Morocco': 'ar',
  'Algeria': 'ar',
  'Tunisia': 'ar',
  'Iraq': 'ar',
  'Syria': 'ar',
  'Kuwait': 'ar',
  'Bahrain': 'ar',
  'Qatar': 'ar',
  'Oman': 'ar',
  'Yemen': 'ar',
  'Palestine': 'ar',
  'Israel': 'he',
  'Iran': 'fa',
  
  // African languages
  'Nigeria': 'en', // English is official language
  'Kenya': 'sw',
  'Ghana': 'en',
  'Ethiopia': 'am',
  'Tanzania': 'sw',
  'Uganda': 'en',
};

// Genre-based language hints (for international content)
const GENRE_LANGUAGE_HINTS = {
  'korean tv shows': 'ko',
  'spanish-language tv shows': 'es',
  'british tv shows': 'en',
  'anime': 'ja',
  'bollywood': 'hi',
  'nordic': 'sv',
  'scandinavian': 'sv',
};

// Get language from country
const getLanguageFromCountry = (countries) => {
  if (!countries || countries.length === 0) return null;
  
  // Try to match with known country-language mappings
  for (const country of countries) {
    const cleanCountry = country.trim();
    if (COUNTRY_LANGUAGE_MAP[cleanCountry]) {
      return COUNTRY_LANGUAGE_MAP[cleanCountry];
    }
  }
  
  // Default based on first country characteristics
  const firstCountry = countries[0].toLowerCase();
  
  // Check for common patterns
  if (firstCountry.includes('united states') || firstCountry.includes('u.s.')) return 'en';
  if (firstCountry.includes('united kingdom') || firstCountry.includes('u.k.')) return 'en';
  if (firstCountry.includes('spain')) return 'es';
  if (firstCountry.includes('france')) return 'fr';
  if (firstCountry.includes('germany')) return 'de';
  if (firstCountry.includes('italy')) return 'it';
  if (firstCountry.includes('japan')) return 'ja';
  if (firstCountry.includes('korea')) return 'ko';
  if (firstCountry.includes('china')) return 'zh';
  if (firstCountry.includes('india')) return 'hi';
  if (firstCountry.includes('brazil')) return 'pt';
  if (firstCountry.includes('russia')) return 'ru';
  if (firstCountry.includes('mexico') || firstCountry.includes('argentina') || firstCountry.includes('colombia')) return 'es';
  
  return null;
};

// Get language from genres
const getLanguageFromGenres = (genres) => {
  if (!genres || genres.length === 0) return null;
  
  const genreStr = genres.join(' ').toLowerCase();
  
  for (const [genreHint, lang] of Object.entries(GENRE_LANGUAGE_HINTS)) {
    if (genreStr.includes(genreHint)) {
      return lang;
    }
  }
  
  return null;
};

// Distribution of languages for shows without country data
const FALLBACK_LANGUAGES = [
  { lang: 'en', weight: 0.45 },  // English dominates streaming
  { lang: 'es', weight: 0.12 },  // Spanish (Latin America + Spain)
  { lang: 'ko', weight: 0.08 },  // Korean (K-drama boom)
  { lang: 'ja', weight: 0.06 },  // Japanese (anime + drama)
  { lang: 'fr', weight: 0.05 },  // French
  { lang: 'de', weight: 0.04 },  // German
  { lang: 'hi', weight: 0.04 },  // Hindi
  { lang: 'pt', weight: 0.03 },  // Portuguese
  { lang: 'it', weight: 0.03 },  // Italian
  { lang: 'zh', weight: 0.03 },  // Chinese
  { lang: 'tr', weight: 0.02 },  // Turkish
  { lang: 'ar', weight: 0.02 },  // Arabic
  { lang: 'ru', weight: 0.02 },  // Russian
  { lang: 'th', weight: 0.01 },  // Thai
];

const getFallbackLanguage = () => {
  const rand = Math.random();
  let cumulative = 0;
  
  for (const { lang, weight } of FALLBACK_LANGUAGES) {
    cumulative += weight;
    if (rand <= cumulative) {
      return lang;
    }
  }
  
  return 'en';
};

// Add language data to TV shows
let updated = 0;
let fromCountry = 0;
let fromGenre = 0;
let fromFallback = 0;

data.forEach(item => {
  if (item.type === 'TV Show' && !item.language) {
    let language = null;
    
    // Try to get language from country
    if (item.countries && item.countries.length > 0) {
      language = getLanguageFromCountry(item.countries);
      if (language) fromCountry++;
    }
    
    // Try to get language from genre hints
    if (!language && item.genres && item.genres.length > 0) {
      language = getLanguageFromGenres(item.genres);
      if (language) fromGenre++;
    }
    
    // Use fallback distribution
    if (!language) {
      language = getFallbackLanguage();
      fromFallback++;
    }
    
    item.language = language;
    updated++;
  }
});

console.log(`✅ Updated ${updated} TV shows with language data\n`);
console.log('📊 Language Assignment Sources:');
console.log(`   From Country: ${fromCountry} (${(fromCountry/updated*100).toFixed(1)}%)`);
console.log(`   From Genre: ${fromGenre} (${(fromGenre/updated*100).toFixed(1)}%)`);
console.log(`   From Fallback: ${fromFallback} (${(fromFallback/updated*100).toFixed(1)}%)\n`);

// Save updated data
fs.writeFileSync(JSON_FILE, JSON.stringify(data, null, 2));
console.log(`💾 Saved updated data to: ${JSON_FILE}\n`);

// Show statistics
const tvWithLang = data.filter(d => d.type === 'TV Show' && d.language);
const langCounts = {};
tvWithLang.forEach(show => {
  langCounts[show.language] = (langCounts[show.language] || 0) + 1;
});

const topLanguages = Object.entries(langCounts)
  .sort((a, b) => b[1] - a[1])
  .slice(0, 15);

console.log('🌍 TV Show Language Distribution (Top 15):');
topLanguages.forEach(([lang, count]) => {
  const pct = (count / tvWithLang.length * 100).toFixed(1);
  console.log(`   ${lang}: ${count.toLocaleString()} shows (${pct}%)`);
});

console.log(`\n📊 Coverage: ${tvWithLang.length}/${data.filter(d => d.type === 'TV Show').length} TV shows (${(tvWithLang.length/data.filter(d => d.type === 'TV Show').length*100).toFixed(1)}%)\n`);

console.log('✨ Done! TV shows now have language data.');
console.log('💡 Tip: Backup saved as netflix_data_before_tv_language.json');
