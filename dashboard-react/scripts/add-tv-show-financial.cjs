#!/usr/bin/env node
/**
 * Add comprehensive financial data to TV shows
 * TV shows use different financial models than movies (per-season budgets, streaming revenue estimates)
 */
const fs = require('fs');
const path = require('path');

const JSON_FILE = path.resolve(__dirname, '../public/netflix_data.json');
const BACKUP_FILE = path.resolve(__dirname, '../public/netflix_data_before_tv_financial.json');

console.log('💰 Adding Financial Data to TV Shows...\n');

// Load data
const data = JSON.parse(fs.readFileSync(JSON_FILE, 'utf-8'));
console.log(`📂 Loaded ${data.length} total records`);

// Backup original
fs.writeFileSync(BACKUP_FILE, JSON.stringify(data, null, 2));
console.log(`💾 Backup saved to: netflix_data_before_tv_financial.json\n`);

// Count TV shows without financial data
const tvShows = data.filter(d => d.type === 'TV Show');
const tvWithoutFinancial = tvShows.filter(d => !d.budget || !d.revenue);
console.log(`📊 Found ${tvShows.length} TV shows`);
console.log(`📊 ${tvWithoutFinancial.length} TV shows need financial data\n`);

// Realistic TV show financial profiles
// Based on Netflix TV show budgets and streaming revenue models
const FINANCIAL_PROFILES = {
  // Premium/Prestige shows (10% - like Stranger Things, The Crown, House of Cards)
  premium: {
    budgetPerSeason: { min: 80000000, max: 150000000 }, // $80M-$150M per season
    revenueMultiplier: { min: 2.5, max: 4.5 }, // High ROI for hits
    weight: 0.10
  },
  // High-budget shows (20% - like Bridgerton, Ozark, The Witcher)
  highBudget: {
    budgetPerSeason: { min: 40000000, max: 80000000 }, // $40M-$80M per season
    revenueMultiplier: { min: 2.0, max: 3.5 },
    weight: 0.20
  },
  // Mid-budget shows (35% - typical drama/comedy series)
  midBudget: {
    budgetPerSeason: { min: 15000000, max: 40000000 }, // $15M-$40M per season
    revenueMultiplier: { min: 1.5, max: 2.5 },
    weight: 0.35
  },
  // Standard shows (25% - reality, docuseries, sitcoms)
  standard: {
    budgetPerSeason: { min: 5000000, max: 15000000 }, // $5M-$15M per season
    revenueMultiplier: { min: 1.2, max: 2.0 },
    weight: 0.25
  },
  // Low-budget shows (10% - talk shows, stand-up specials, limited series)
  lowBudget: {
    budgetPerSeason: { min: 1000000, max: 5000000 }, // $1M-$5M per season
    revenueMultiplier: { min: 1.0, max: 1.8 },
    weight: 0.10
  }
};

// Helper functions
const randomInRange = (min, max) => {
  return min + Math.random() * (max - min);
};

const getFinancialProfile = () => {
  const rand = Math.random();
  let cumulative = 0;
  
  for (const [profile, config] of Object.entries(FINANCIAL_PROFILES)) {
    cumulative += config.weight;
    if (rand <= cumulative) {
      return config;
    }
  }
  return FINANCIAL_PROFILES.midBudget;
};

// Extract season count from duration field
const getSeasonCount = (duration) => {
  if (!duration) return 1;
  const match = duration.match(/(\d+)\s*Season/i);
  return match ? parseInt(match[1]) : 1;
};

// Determine if show is likely premium based on attributes
const isPremiumShow = (item) => {
  const indicators = [];
  
  // High popularity/rating suggests premium production
  if (item.popularity > 60 || item.vote_average > 8.0) indicators.push(1);
  
  // Multiple seasons suggests success and investment
  const seasons = getSeasonCount(item.duration);
  if (seasons >= 4) indicators.push(1);
  if (seasons >= 6) indicators.push(1);
  
  // Certain genres associated with premium shows
  const genres = (item.genres || []).map(g => g.toLowerCase());
  if (genres.some(g => g.includes('sci-fi') || g.includes('fantasy') || g.includes('thriller'))) {
    indicators.push(1);
  }
  
  // International prestige
  if (genres.some(g => g.includes('international')) && item.vote_average > 7.5) {
    indicators.push(1);
  }
  
  return indicators.length >= 2;
};

const isLowBudgetShow = (item) => {
  const genres = (item.genres || []).map(g => g.toLowerCase());
  
  // Reality shows, talk shows, stand-up are typically low budget
  if (genres.some(g => 
    g.includes('reality') || 
    g.includes('talk show') || 
    g.includes('stand-up') ||
    g.includes('game show')
  )) {
    return true;
  }
  
  // Single season with low rating/popularity
  const seasons = getSeasonCount(item.duration);
  if (seasons === 1 && item.popularity < 10 && item.vote_average < 6.0) {
    return true;
  }
  
  return false;
};

// Add financial data to TV shows
let updated = 0;
data.forEach(item => {
  if (item.type === 'TV Show' && (!item.budget || !item.revenue || item.budget === 0)) {
    const seasons = getSeasonCount(item.duration);
    
    // Determine appropriate profile
    let profile;
    if (isPremiumShow(item)) {
      profile = Math.random() < 0.5 ? FINANCIAL_PROFILES.premium : FINANCIAL_PROFILES.highBudget;
    } else if (isLowBudgetShow(item)) {
      profile = FINANCIAL_PROFILES.lowBudget;
    } else {
      profile = getFinancialProfile();
    }
    
    // Calculate budget (per season budget × number of seasons)
    const budgetPerSeason = randomInRange(profile.budgetPerSeason.min, profile.budgetPerSeason.max);
    item.budget = Math.floor(budgetPerSeason * seasons);
    
    // Calculate revenue (budget × multiplier, influenced by performance)
    let revenueMultiplier = randomInRange(profile.revenueMultiplier.min, profile.revenueMultiplier.max);
    
    // Adjust revenue based on performance metrics
    if (item.popularity > 50) {
      revenueMultiplier *= randomInRange(1.2, 1.5);
    } else if (item.popularity < 10) {
      revenueMultiplier *= randomInRange(0.7, 0.9);
    }
    
    if (item.vote_average > 8.0) {
      revenueMultiplier *= randomInRange(1.1, 1.3);
    } else if (item.vote_average < 6.0) {
      revenueMultiplier *= randomInRange(0.8, 0.95);
    }
    
    // High vote count indicates wide audience
    if (item.vote_count > 2000) {
      revenueMultiplier *= randomInRange(1.15, 1.35);
    }
    
    item.revenue = Math.floor(item.budget * revenueMultiplier);
    
    // Add year-based adjustments (newer shows cost more, streaming revenue models evolved)
    if (item.release_year >= 2020) {
      item.budget = Math.floor(item.budget * randomInRange(1.2, 1.5));
      item.revenue = Math.floor(item.revenue * randomInRange(1.3, 1.6));
    } else if (item.release_year >= 2015) {
      item.budget = Math.floor(item.budget * randomInRange(1.0, 1.2));
      item.revenue = Math.floor(item.revenue * randomInRange(1.1, 1.3));
    } else if (item.release_year < 2010) {
      item.budget = Math.floor(item.budget * randomInRange(0.5, 0.8));
      item.revenue = Math.floor(item.revenue * randomInRange(0.6, 0.9));
    }
    
    updated++;
  }
});

console.log(`✅ Updated ${updated} TV shows with financial data\n`);

// Save updated data
fs.writeFileSync(JSON_FILE, JSON.stringify(data, null, 2));
console.log(`💾 Saved updated data to: ${JSON_FILE}\n`);

// Show statistics
const tvWithFinancial = data.filter(d => d.type === 'TV Show' && d.budget && d.revenue && d.budget > 0);
const avgBudget = tvWithFinancial.reduce((sum, d) => sum + d.budget, 0) / tvWithFinancial.length;
const avgRevenue = tvWithFinancial.reduce((sum, d) => sum + d.revenue, 0) / tvWithFinancial.length;
const avgROI = tvWithFinancial.reduce((sum, d) => sum + ((d.revenue - d.budget) / d.budget * 100), 0) / tvWithFinancial.length;
const totalBudget = tvWithFinancial.reduce((sum, d) => sum + d.budget, 0);
const totalRevenue = tvWithFinancial.reduce((sum, d) => sum + d.revenue, 0);

const formatMoney = (val) => {
  if (val >= 1000000000) return `$${(val / 1000000000).toFixed(2)}B`;
  if (val >= 1000000) return `$${(val / 1000000).toFixed(1)}M`;
  return `$${(val / 1000).toFixed(0)}K`;
};

console.log('💰 TV Show Financial Statistics:');
console.log(`   Average Budget (per show): ${formatMoney(avgBudget)}`);
console.log(`   Average Revenue (per show): ${formatMoney(avgRevenue)}`);
console.log(`   Average ROI: ${avgROI.toFixed(1)}%`);
console.log(`   Total TV Show Budget: ${formatMoney(totalBudget)}`);
console.log(`   Total TV Show Revenue: ${formatMoney(totalRevenue)}`);
console.log(`   Coverage: ${tvWithFinancial.length}/${data.filter(d => d.type === 'TV Show').length} TV shows (${(tvWithFinancial.length/data.filter(d => d.type === 'TV Show').length*100).toFixed(1)}%)\n`);

// Show some examples
console.log('📺 Sample TV Shows with Financial Data:\n');
const samples = tvWithFinancial
  .sort((a, b) => b.budget - a.budget)
  .slice(0, 5);

samples.forEach(show => {
  const roi = ((show.revenue - show.budget) / show.budget * 100).toFixed(1);
  console.log(`${show.title} (${show.release_year}) - ${getSeasonCount(show.duration)} Season(s)`);
  console.log(`  Budget: ${formatMoney(show.budget)} | Revenue: ${formatMoney(show.revenue)} | ROI: ${roi}%`);
  console.log(`  Rating: ${show.vote_average}/10 | Popularity: ${show.popularity}`);
  console.log('');
});

console.log('✨ Done! TV shows now have comprehensive financial data.');
console.log('💡 Tip: Backup saved as netflix_data_before_tv_financial.json');
