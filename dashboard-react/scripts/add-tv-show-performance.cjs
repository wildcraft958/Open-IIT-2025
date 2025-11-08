#!/usr/bin/env node
/**
 * Add realistic dummy performance data to TV shows
 * Based on typical Netflix TV show performance metrics
 */
const fs = require('fs');
const path = require('path');

const JSON_FILE = path.resolve(__dirname, '../public/netflix_data.json');
const BACKUP_FILE = path.resolve(__dirname, '../public/netflix_data_before_tv_perf.json');

console.log('📺 Adding Performance Data to TV Shows...\n');

// Load data
const data = JSON.parse(fs.readFileSync(JSON_FILE, 'utf-8'));
console.log(`📂 Loaded ${data.length} total records`);

// Backup original
fs.writeFileSync(BACKUP_FILE, JSON.stringify(data, null, 2));
console.log(`💾 Backup saved to: netflix_data_before_tv_perf.json\n`);

// Count TV shows
const tvShows = data.filter(d => d.type === 'TV Show');
console.log(`📊 Found ${tvShows.length} TV shows\n`);

// Realistic TV show performance ranges based on Netflix data
// Source: Typical Netflix TV show ratings from IMDb/TMDB
const PERFORMANCE_PROFILES = {
  // Hit shows (15% of catalog)
  hit: {
    popularity: { min: 45, max: 95 },
    vote_average: { min: 7.5, max: 9.2 },
    vote_count: { min: 1500, max: 8000 },
    weight: 0.15
  },
  // Popular shows (25% of catalog)
  popular: {
    popularity: { min: 25, max: 45 },
    vote_average: { min: 6.8, max: 7.5 },
    vote_count: { min: 500, max: 1500 },
    weight: 0.25
  },
  // Average shows (40% of catalog)
  average: {
    popularity: { min: 10, max: 25 },
    vote_average: { min: 6.0, max: 6.8 },
    vote_count: { min: 150, max: 500 },
    weight: 0.40
  },
  // Below average (20% of catalog)
  below: {
    popularity: { min: 3, max: 10 },
    vote_average: { min: 5.2, max: 6.0 },
    vote_count: { min: 50, max: 150 },
    weight: 0.20
  }
};

// Helper to generate random number in range
const randomInRange = (min, max) => {
  return min + Math.random() * (max - min);
};

// Helper to get performance profile based on weighted distribution
const getPerformanceProfile = () => {
  const rand = Math.random();
  let cumulative = 0;
  
  for (const [profile, config] of Object.entries(PERFORMANCE_PROFILES)) {
    cumulative += config.weight;
    if (rand <= cumulative) {
      return config;
    }
  }
  return PERFORMANCE_PROFILES.average;
};

// Add performance data to TV shows
let updated = 0;
data.forEach(item => {
  if (item.type === 'TV Show' && !item.popularity && !item.vote_average && !item.vote_count) {
    const profile = getPerformanceProfile();
    
    // Generate realistic metrics
    item.popularity = parseFloat(randomInRange(profile.popularity.min, profile.popularity.max).toFixed(2));
    item.vote_average = parseFloat(randomInRange(profile.vote_average.min, profile.vote_average.max).toFixed(1));
    item.vote_count = Math.floor(randomInRange(profile.vote_count.min, profile.vote_count.max));
    
    // Add some variance based on release year (newer shows tend to have more votes)
    if (item.release_year >= 2020) {
      item.vote_count = Math.floor(item.vote_count * randomInRange(1.2, 1.8));
      item.popularity = parseFloat((item.popularity * randomInRange(1.1, 1.5)).toFixed(2));
    } else if (item.release_year >= 2015) {
      item.vote_count = Math.floor(item.vote_count * randomInRange(1.0, 1.3));
    } else if (item.release_year < 2010) {
      item.vote_count = Math.floor(item.vote_count * randomInRange(0.6, 0.9));
      item.popularity = parseFloat((item.popularity * randomInRange(0.7, 1.0)).toFixed(2));
    }
    
    // Add rating variance based on genre
    if (item.genres && item.genres.length > 0) {
      const genres = item.genres.map(g => g.toLowerCase());
      
      // Documentaries and Crime shows tend to rate higher
      if (genres.some(g => g.includes('document') || g.includes('crime'))) {
        item.vote_average = Math.min(9.5, parseFloat((item.vote_average * 1.08).toFixed(1)));
      }
      
      // Reality shows tend to rate lower
      if (genres.some(g => g.includes('reality'))) {
        item.vote_average = Math.max(4.5, parseFloat((item.vote_average * 0.92).toFixed(1)));
      }
      
      // Kids shows have fewer votes but decent ratings
      if (genres.some(g => g.includes('kids') || g.includes('children'))) {
        item.vote_count = Math.floor(item.vote_count * 0.7);
        item.vote_average = Math.min(8.0, Math.max(6.0, item.vote_average));
      }
    }
    
    updated++;
  }
});

console.log(`✅ Updated ${updated} TV shows with performance data\n`);

// Save updated data
fs.writeFileSync(JSON_FILE, JSON.stringify(data, null, 2));
console.log(`💾 Saved updated data to: ${JSON_FILE}\n`);

// Show statistics
const tvWithPerf = data.filter(d => d.type === 'TV Show' && d.popularity);
const avgPopularity = tvWithPerf.reduce((sum, d) => sum + d.popularity, 0) / tvWithPerf.length;
const avgRating = tvWithPerf.reduce((sum, d) => sum + d.vote_average, 0) / tvWithPerf.length;
const avgVotes = tvWithPerf.reduce((sum, d) => sum + d.vote_count, 0) / tvWithPerf.length;

console.log('📊 TV Show Performance Statistics:');
console.log(`   Average Popularity: ${avgPopularity.toFixed(2)}`);
console.log(`   Average Rating: ${avgRating.toFixed(1)}/10`);
console.log(`   Average Vote Count: ${Math.floor(avgVotes).toLocaleString()}`);
console.log(`   Coverage: ${tvWithPerf.length}/${data.filter(d => d.type === 'TV Show').length} TV shows (${(tvWithPerf.length/data.filter(d => d.type === 'TV Show').length*100).toFixed(1)}%)\n`);

console.log('✨ Done! TV shows now have realistic performance data.');
console.log('💡 Tip: Backup saved as netflix_data_before_tv_perf.json');
