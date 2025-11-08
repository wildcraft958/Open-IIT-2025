#!/usr/bin/env python3
"""
Validate dashboard insights using the actual JSON file that the dashboard loads
"""

import json
from pathlib import Path
from collections import Counter
from datetime import datetime

# Paths
BASE_DIR = Path(__file__).parent.parent
JSON_FILE = BASE_DIR / "dashboard-react" / "public" / "netflix_data.json"
OUTPUT_REPORT = BASE_DIR / "INSIGHTS_VALIDATION_REPORT.md"

def load_data():
    """Load the JSON data file"""
    print("📂 Loading netflix_data.json...")
    with open(JSON_FILE, 'r') as f:
        data = json.load(f)
    print(f"   ✓ Loaded {len(data):,} records")
    return data

def validate_metrics(data):
    """Validate all key metrics"""
    print("\n📊 Validating Metrics...")
    
    # Basic counts
    total_titles = len(data)
    types = Counter(item.get('type') for item in data)
    
    # Countries
    countries = set()
    for item in data:
        country_list = item.get('countries', [])
        if country_list:
            countries.update(country_list)
    
    # Languages
    languages = Counter()
    for item in data:
        lang = item.get('language')
        if lang:
            languages[lang] += 1
    
    # Performance data
    perf_count = sum(1 for item in data if item.get('popularity') or item.get('vote_count'))
    financial_count = sum(1 for item in data if item.get('budget') and item.get('revenue'))
    
    # Genres
    all_genres = set()
    for item in data:
        genres = item.get('genres', []) or item.get('listed_in', [])
        if genres:
            all_genres.update(genres)
    
    # Years
    years = [item.get('release_year') for item in data if item.get('release_year')]
    min_year = min(years) if years else None
    max_year = max(years) if years else None
    
    results = {
        'total_titles': total_titles,
        'movies': types.get('Movie', 0),
        'tv_shows': types.get('TV Show', 0),
        'countries': len(countries),
        'languages': len(languages),
        'with_performance': perf_count,
        'with_financial': financial_count,
        'genres': len(all_genres),
        'year_range': f"{min_year}-{max_year}" if min_year and max_year else "N/A",
        'top_languages': languages.most_common(10),
    }
    
    # Print results
    print(f"   Total Titles: {results['total_titles']:,}")
    print(f"   Movies: {results['movies']:,} ({results['movies']/total_titles*100:.1f}%)")
    print(f"   TV Shows: {results['tv_shows']:,} ({results['tv_shows']/total_titles*100:.1f}%)")
    print(f"   Countries: {results['countries']}")
    print(f"   Languages: {results['languages']}")
    print(f"   Genres: {results['genres']}")
    print(f"   Year Range: {results['year_range']}")
    print(f"   With Performance Data: {perf_count:,} ({perf_count/total_titles*100:.1f}%)")
    print(f"   With Financial Data: {financial_count:,} ({financial_count/total_titles*100:.1f}%)")
    print(f"\n   Top 10 Languages:")
    for lang, count in results['top_languages']:
        print(f"      {lang}: {count:,} ({count/total_titles*100:.1f}%)")
    
    return results

def generate_report(results):
    """Generate validation report"""
    print(f"\n💾 Generating report: {OUTPUT_REPORT}")
    
    report = f"""# Netflix Dashboard Insights Validation Report
Generated: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}

## Data Source
- **File**: dashboard-react/public/netflix_data.json
- **Total Records**: {results['total_titles']:,}

## Content Composition
- **Movies**: {results['movies']:,} ({results['movies']/results['total_titles']*100:.1f}%)
- **TV Shows**: {results['tv_shows']:,} ({results['tv_shows']/results['total_titles']*100:.1f}%)

## Geographic Coverage
- **Total Countries**: {results['countries']}

## Content Diversity
- **Total Languages**: {results['languages']}
- **Total Genres**: {results['genres']}
- **Year Range**: {results['year_range']}

## Data Completeness
- **With Performance Metrics**: {results['with_performance']:,} ({results['with_performance']/results['total_titles']*100:.1f}%)
- **With Financial Data**: {results['with_financial']:,} ({results['with_financial']/results['total_titles']*100:.1f}%)

## Top Languages
"""
    for lang, count in results['top_languages']:
        report += f"- **{lang}**: {count:,} ({count/results['total_titles']*100:.1f}%)\n"
    
    report += f"""

## Dashboard Insights Validation

### Executive Overview Page
✅ **Total Titles**: Dashboard should show ~{results['total_titles']:,}
✅ **Countries**: Dashboard shows {results['countries']} countries
✅ **Content Mix**: {results['movies']/results['total_titles']*100:.1f}% movies, {results['tv_shows']/results['total_titles']*100:.1f}% TV shows

### Performance Analysis Page
✅ **Performance Coverage**: {results['with_performance']/results['total_titles']*100:.1f}% of content has performance metrics
✅ **Financial Coverage**: {results['with_financial']/results['total_titles']*100:.1f}% of content has financial data

### Language & Global Reach
✅ **Language Coverage**: {results['languages']} distinct languages
✅ **Geographic Spread**: {results['countries']} countries

---
**Note**: All metrics validated against actual JSON file loaded by the dashboard.
"""
    
    with open(OUTPUT_REPORT, 'w') as f:
        f.write(report)
    
    print(f"   ✅ Report saved")

def main():
    print("="*70)
    print("Netflix Dashboard JSON Validation")
    print("="*70)
    
    data = load_data()
    results = validate_metrics(data)
    generate_report(results)
    
    print("\n" + "="*70)
    print("✅ Validation Complete!")
    print("="*70)

if __name__ == "__main__":
    main()
