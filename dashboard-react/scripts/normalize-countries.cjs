#!/usr/bin/env node
/**
 * Normalize country names to remove duplicates like "United States" vs "United States of America"
 */
const fs = require('fs');
const path = require('path');

const JSON_FILE = path.resolve(__dirname, '../public/netflix_data.json');
const BACKUP_FILE = path.resolve(__dirname, '../public/netflix_data_before_country_fix.json');

console.log('🗺️  Normalizing Country Names...\n');

// Load data
const data = JSON.parse(fs.readFileSync(JSON_FILE, 'utf-8'));
console.log(`📂 Loaded ${data.length} total records`);

// Backup original
fs.writeFileSync(BACKUP_FILE, JSON.stringify(data, null, 2));
console.log(`💾 Backup saved to: netflix_data_before_country_fix.json\n`);

// Country name normalization map
const COUNTRY_NORMALIZATIONS = {
  // United States variations
  'United States': 'United States',
  'United States of America': 'United States',
  'USA': 'United States',
  'U.S.A.': 'United States',
  'U.S.': 'United States',
  'US': 'United States',
  
  // United Kingdom variations
  'United Kingdom': 'United Kingdom',
  'UK': 'United Kingdom',
  'U.K.': 'United Kingdom',
  'Great Britain': 'United Kingdom',
  'Britain': 'United Kingdom',
  'England': 'United Kingdom',
  
  // South Korea variations
  'South Korea': 'South Korea',
  'Korea': 'South Korea',
  'Republic of Korea': 'South Korea',
  
  // Other common variations
  'Hong Kong SAR China': 'Hong Kong',
  'Hong Kong, China': 'Hong Kong',
  'Taiwan, Province of China': 'Taiwan',
  'Russian Federation': 'Russia',
  'The Netherlands': 'Netherlands',
  'Czech Republic': 'Czechia',
  'The Philippines': 'Philippines',
  'The Bahamas': 'Bahamas',
  'United Arab Emirates': 'UAE',
  'U.A.E.': 'UAE',
  'Democratic Republic of the Congo': 'Congo (DRC)',
  'Republic of the Congo': 'Congo',
  'Republic of China': 'Taiwan',
  'People\'s Republic of China': 'China',
};

// Normalize a country name
const normalizeCountry = (country) => {
  if (!country) return null;
  
  const trimmed = country.trim();
  
  // Check if we have an exact normalization
  if (COUNTRY_NORMALIZATIONS[trimmed]) {
    return COUNTRY_NORMALIZATIONS[trimmed];
  }
  
  // Check case-insensitive
  const lowerCountry = trimmed.toLowerCase();
  for (const [key, value] of Object.entries(COUNTRY_NORMALIZATIONS)) {
    if (key.toLowerCase() === lowerCountry) {
      return value;
    }
  }
  
  // Return original if no normalization needed
  return trimmed;
};

// Track changes
let itemsModified = 0;
const countryChanges = {};

// Normalize country names in all items
data.forEach(item => {
  if (item.countries && Array.isArray(item.countries) && item.countries.length > 0) {
    const originalCountries = [...item.countries];
    const normalizedCountries = [];
    const seenCountries = new Set();
    
    // Normalize and deduplicate
    item.countries.forEach(country => {
      const normalized = normalizeCountry(country);
      if (normalized && !seenCountries.has(normalized)) {
        normalizedCountries.push(normalized);
        seenCountries.add(normalized);
        
        // Track changes
        if (normalized !== country) {
          countryChanges[country] = normalized;
        }
      }
    });
    
    // Update only if changed
    if (JSON.stringify(originalCountries) !== JSON.stringify(normalizedCountries)) {
      item.countries = normalizedCountries;
      itemsModified++;
    }
  }
});

console.log(`✅ Modified ${itemsModified} items\n`);

// Show country name changes
if (Object.keys(countryChanges).length > 0) {
  console.log('🔄 Country Name Normalizations:');
  const uniqueChanges = {};
  for (const [old, normalized] of Object.entries(countryChanges)) {
    uniqueChanges[old] = normalized;
  }
  
  Object.entries(uniqueChanges)
    .sort((a, b) => a[0].localeCompare(b[0]))
    .forEach(([old, normalized]) => {
      console.log(`   "${old}" → "${normalized}"`);
    });
  console.log('');
}

// Save updated data
fs.writeFileSync(JSON_FILE, JSON.stringify(data, null, 2));
console.log(`💾 Saved updated data to: ${JSON_FILE}\n`);

// Count unique countries before and after
const getUniqueCountries = (data) => {
  const countries = new Set();
  data.forEach(item => {
    if (item.countries) {
      item.countries.forEach(c => countries.add(c));
    }
  });
  return countries;
};

const uniqueCountries = getUniqueCountries(data);
console.log(`📊 Unique countries after normalization: ${uniqueCountries.size}`);

// Show top countries
const countryCounts = {};
data.forEach(item => {
  if (item.countries) {
    item.countries.forEach(country => {
      countryCounts[country] = (countryCounts[country] || 0) + 1;
    });
  }
});

const topCountries = Object.entries(countryCounts)
  .sort((a, b) => b[1] - a[1])
  .slice(0, 15);

console.log('\n🌍 Top 15 Countries (After Normalization):');
topCountries.forEach(([country, count]) => {
  console.log(`   ${country}: ${count.toLocaleString()} titles`);
});

console.log('\n✨ Done! Country names normalized and duplicates removed.');
console.log('💡 Tip: Backup saved as netflix_data_before_country_fix.json');
