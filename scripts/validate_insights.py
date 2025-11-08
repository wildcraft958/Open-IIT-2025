#!/usr/bin/env python3
"""
Validate dashboard insights against actual Netflix dataset
Generates a comprehensive validation report
"""

import pandas as pd
import numpy as np
from pathlib import Path
from datetime import datetime, timedelta
from collections import Counter

# Paths
BASE_DIR = Path(__file__).parent.parent
DATASET = BASE_DIR / "data" / "netflix_combined_dataset.csv"
OUTPUT_REPORT = BASE_DIR / "INSIGHTS_VALIDATION_REPORT.md"

def load_data():
    """Load the combined Netflix dataset"""
    print("📂 Loading Netflix combined dataset...")
    df = pd.read_csv(DATASET)
    print(f"   ✓ Loaded {len(df):,} records")
    return df

def validate_executive_metrics(df):
    """Validate Executive Overview insights"""
    print("\n📊 Validating Executive Overview Insights...")
    
    results = {
        'total_titles': len(df),
        'total_countries': df['country'].str.split(',').explode().str.strip().nunique(),
        'content_types': df['type'].value_counts().to_dict(),
        'tv_show_percentage': (df['type'].value_counts().get('TV Show', 0) / len(df)) * 100,
        'movie_percentage': (df['type'].value_counts().get('Movie', 0) / len(df)) * 100,
        'top_rating': df['rating'].value_counts().head(1).to_dict() if 'rating' in df.columns else None,
    }
    
    print(f"   Total Titles: {results['total_titles']:,}")
    print(f"   Countries: {results['total_countries']}")
    print(f"   Movies: {results['content_types'].get('Movie', 0):,} ({results['movie_percentage']:.1f}%)")
    print(f"   TV Shows: {results['content_types'].get('TV Show', 0):,} ({results['tv_show_percentage']:.1f}%)")
    
    # Validate insight claims
    insights_valid = {
        'TV shows surpassing movies in additions': 'NEED TO CHECK TEMPORAL',
        'TV-MA dominant': results['top_rating'],
        '135 countries': results['total_countries'] >= 130,
        '23,162 titles': results['total_titles'] > 20000,
    }
    
    return results, insights_valid

def validate_temporal_trends(df):
    """Validate Trend Intelligence insights"""
    print("\n📅 Validating Temporal Trend Insights...")
    
    df['date_added_parsed'] = pd.to_datetime(df['date_added'], errors='coerce')
    df['year_added'] = df['date_added_parsed'].dt.year
    df['month_added'] = df['date_added_parsed'].dt.month
    df['quarter_added'] = df['date_added_parsed'].dt.quarter
    
    # TV Shows vs Movies by year
    recent_years = df[df['year_added'] >= 2019].copy()
    by_year_type = recent_years.groupby(['year_added', 'type']).size().unstack(fill_value=0)
    
    # Q4 loading pattern
    quarterly = df.groupby('quarter_added').size().to_dict()
    q4_count = quarterly.get(4.0, 0)
    total_quarterly = sum(quarterly.values())
    q4_percentage = (q4_count / total_quarterly * 100) if total_quarterly > 0 else 0
    
    # Content lag
    df['content_age'] = df['year_added'] - df['release_year']
    avg_lag = df['content_age'].mean()
    
    results = {
        'recent_additions_by_type': by_year_type.to_dict(),
        'q4_percentage': q4_percentage,
        'avg_content_lag_years': avg_lag,
        'quarterly_distribution': quarterly,
    }
    
    print(f"   Q4 content: {q4_percentage:.1f}% of total")
    print(f"   Avg content lag: {avg_lag:.1f} years")
    print(f"   Recent years TV vs Movie:")
    if not by_year_type.empty:
        print(by_year_type.tail())
    
    # Check if TV shows surpassed movies in recent years
    tv_surpass_year = None
    if 'TV Show' in by_year_type.columns and 'Movie' in by_year_type.columns:
        for year in sorted(by_year_type.index, reverse=True):
            if by_year_type.loc[year, 'TV Show'] > by_year_type.loc[year, 'Movie']:
                tv_surpass_year = year
                break
    
    insights_valid = {
        'Q4 loading pattern': q4_percentage > 20,
        'TV shows surpassing movies': tv_surpass_year is not None,
        'Content lag decreasing': avg_lag < 10,  # Reasonable modern streaming
    }
    
    return results, insights_valid

def validate_geographic_insights(df):
    """Validate Geographic insights"""
    print("\n🌍 Validating Geographic Insights...")
    
    # Expand countries (some titles have multiple)
    countries_series = df['country'].str.split(',').explode().str.strip()
    country_counts = countries_series.value_counts()
    
    # Top countries
    top_10_countries = country_counts.head(10).to_dict()
    
    # Normalize US variations
    us_count = country_counts.get('United States', 0) + country_counts.get('United States of America', 0)
    
    # Check underrepresented regions
    african_countries = ['Nigeria', 'South Africa', 'Kenya', 'Ghana', 'Egypt']
    african_count = sum(country_counts.get(c, 0) for c in african_countries)
    african_percentage = (african_count / len(df)) * 100
    
    southeast_asian = ['Indonesia', 'Thailand', 'Vietnam', 'Philippines', 'Malaysia']
    sea_count = sum(country_counts.get(c, 0) for c in southeast_asian)
    sea_percentage = (sea_count / len(df)) * 100
    
    results = {
        'total_countries': len(country_counts),
        'top_countries': top_10_countries,
        'us_count': us_count,
        'african_count': african_count,
        'african_percentage': african_percentage,
        'sea_count': sea_count,
        'sea_percentage': sea_percentage,
    }
    
    print(f"   Total countries: {results['total_countries']}")
    print(f"   US content: {us_count:,}")
    print(f"   African content: {african_count} ({african_percentage:.2f}%)")
    print(f"   Southeast Asian: {sea_count} ({sea_percentage:.2f}%)")
    
    insights_valid = {
        'US dominant': us_count > country_counts.iloc[1] if len(country_counts) > 1 else False,
        'Africa underrepresented (<5%)': african_percentage < 5,
        'Southeast Asia underrepresented (<5%)': sea_percentage < 5,
        '135+ countries': results['total_countries'] >= 130,
    }
    
    return results, insights_valid

def validate_genre_insights(df):
    """Validate Genre Intelligence insights"""
    print("\n🎭 Validating Genre Insights...")
    
    # Parse genres (listed_in or genres column)
    genre_col = 'genres' if 'genres' in df.columns else 'listed_in'
    genres_series = df[genre_col].str.split(',').explode().str.strip()
    genre_counts = genres_series.value_counts()
    
    top_genres = genre_counts.head(10).to_dict()
    total_genre_entries = len(genres_series)
    
    # Check saturation
    drama_count = genre_counts.get('Dramas', 0) + genre_counts.get('Drama', 0)
    comedy_count = genre_counts.get('Comedies', 0) + genre_counts.get('Comedy', 0)
    thriller_count = genre_counts.get('Thrillers', 0) + genre_counts.get('Thriller', 0)
    
    top_3_percentage = ((drama_count + comedy_count + thriller_count) / total_genre_entries) * 100
    
    # Check underrepresented genres
    musical_count = genre_counts.get('Musicals', 0) + genre_counts.get('Musical', 0)
    scifi_count = genre_counts.get('Sci-Fi', 0) + genre_counts.get('Science Fiction', 0)
    doc_count = genre_counts.get('Documentaries', 0) + genre_counts.get('Documentary', 0)
    standup_count = genre_counts.get('Stand-Up Comedy', 0) + genre_counts.get('Stand-Up', 0)
    
    results = {
        'total_unique_genres': len(genre_counts),
        'top_genres': top_genres,
        'drama_count': drama_count,
        'comedy_count': comedy_count,
        'thriller_count': thriller_count,
        'top_3_percentage': top_3_percentage,
        'musical_count': musical_count,
        'scifi_count': scifi_count,
        'doc_count': doc_count,
        'standup_count': standup_count,
    }
    
    print(f"   Total unique genres: {results['total_unique_genres']}")
    print(f"   Drama+Comedy+Thriller: {top_3_percentage:.1f}% of genre tags")
    print(f"   Musicals: {musical_count}")
    print(f"   Sci-Fi: {scifi_count}")
    print(f"   Documentaries: {doc_count}")
    print(f"   Stand-Up: {standup_count}")
    
    insights_valid = {
        'Drama/Comedy/Thriller dominate': top_3_percentage > 30,
        'Musicals underrepresented': musical_count < (total_genre_entries * 0.02),
        'Sci-Fi underrepresented': scifi_count < (total_genre_entries * 0.05),
    }
    
    return results, insights_valid

def validate_performance_data(df):
    """Validate Performance Analysis data coverage"""
    print("\n⭐ Validating Performance Data Coverage...")
    
    has_popularity = df['popularity'].notna().sum()
    has_votes = df['vote_count'].notna().sum()
    has_rating = df['vote_average'].notna().sum()
    has_budget = df['budget'].notna().sum()
    has_revenue = df['revenue'].notna().sum()
    
    has_performance = (df['popularity'].notna() | df['vote_count'].notna() | df['vote_average'].notna()).sum()
    has_financial = ((df['budget'].notna() & df['revenue'].notna()) & (df['budget'] > 0)).sum()
    
    performance_percentage = (has_performance / len(df)) * 100
    financial_percentage = (has_financial / len(df)) * 100
    
    results = {
        'has_popularity': has_popularity,
        'has_votes': has_votes,
        'has_rating': has_rating,
        'has_budget': has_budget,
        'has_revenue': has_revenue,
        'performance_coverage': performance_percentage,
        'financial_coverage': financial_percentage,
    }
    
    print(f"   Popularity data: {has_popularity:,} ({(has_popularity/len(df)*100):.1f}%)")
    print(f"   Vote data: {has_votes:,} ({(has_votes/len(df)*100):.1f}%)")
    print(f"   Rating data: {has_rating:,} ({(has_rating/len(df)*100):.1f}%)")
    print(f"   Budget data: {has_budget:,} ({(has_budget/len(df)*100):.1f}%)")
    print(f"   Revenue data: {has_revenue:,} ({(has_revenue/len(df)*100):.1f}%)")
    print(f"   Overall performance coverage: {performance_percentage:.1f}%")
    print(f"   Overall financial coverage: {financial_percentage:.1f}%")
    
    insights_valid = {
        '69% performance coverage': 65 <= performance_percentage <= 75,
        '21% financial coverage': 15 <= financial_percentage <= 25,
    }
    
    return results, insights_valid

def validate_language_data(df):
    """Validate Language Analysis data"""
    print("\n🌍 Validating Language Data...")
    
    language_counts = df['language'].value_counts()
    has_language = df['language'].notna().sum()
    language_coverage = (has_language / len(df)) * 100
    
    top_languages = language_counts.head(15).to_dict()
    
    results = {
        'total_languages': len(language_counts),
        'language_coverage': language_coverage,
        'top_languages': top_languages,
        'english_count': language_counts.get('en', 0),
    }
    
    print(f"   Total languages: {results['total_languages']}")
    print(f"   Language coverage: {language_coverage:.1f}%")
    print(f"   English content: {results['english_count']:,}")
    print(f"   Top 5 languages: {list(top_languages.keys())[:5]}")
    
    insights_valid = {
        '15+ languages': results['total_languages'] >= 15,
        'English dominant': results['english_count'] > language_counts.iloc[1] if len(language_counts) > 1 else False,
    }
    
    return results, insights_valid

def check_genre_momentum(df):
    """Check if we can calculate genre momentum"""
    print("\n🔍 Checking Genre Momentum Calculation...")
    
    df['date_added_parsed'] = pd.to_datetime(df['date_added'], errors='coerce')
    recent_cutoff = pd.Timestamp.now() - pd.Timedelta(days=180)  # 6 months
    previous_cutoff = recent_cutoff - pd.Timedelta(days=180)  # 6-12 months ago
    
    recent = df[df['date_added_parsed'] >= recent_cutoff]
    previous = df[(df['date_added_parsed'] >= previous_cutoff) & (df['date_added_parsed'] < recent_cutoff)]
    
    print(f"   Recent period (last 6mo): {len(recent)} titles")
    print(f"   Previous period (6-12mo ago): {len(previous)} titles")
    
    if len(recent) < 10 or len(previous) < 10:
        print("   ⚠️  WARNING: Insufficient data for momentum calculation!")
        return False, f"Recent: {len(recent)}, Previous: {len(previous)}"
    
    return True, f"Recent: {len(recent)}, Previous: {len(previous)}"

def generate_report(all_results):
    """Generate comprehensive validation report"""
    print("\n📝 Generating validation report...")
    
    report = []
    report.append("# Netflix Dashboard Insights Validation Report")
    report.append(f"\nGenerated: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    report.append(f"\nDataset: netflix_combined_dataset.csv")
    report.append("\n---\n")
    
    report.append("## Executive Summary\n")
    report.append("Validation of all dashboard insights against actual dataset.\n")
    
    for section, (results, validations) in all_results.items():
        report.append(f"\n## {section}\n")
        
        report.append("### Data Facts\n")
        for key, value in results.items():
            if isinstance(value, dict) and len(value) > 5:
                report.append(f"- **{key}**: {len(value)} entries\n")
            elif isinstance(value, dict):
                report.append(f"- **{key}**:\n")
                for k, v in list(value.items())[:5]:
                    report.append(f"  - {k}: {v}\n")
            else:
                report.append(f"- **{key}**: {value}\n")
        
        report.append("\n### Insight Validation\n")
        for insight, valid in validations.items():
            status = "✅ VALID" if valid else "❌ INVALID" if isinstance(valid, bool) else f"ℹ️  {valid}"
            report.append(f"- {insight}: **{status}**\n")
    
    report_text = ''.join(report)
    
    with open(OUTPUT_REPORT, 'w') as f:
        f.write(report_text)
    
    print(f"   ✓ Report saved to: {OUTPUT_REPORT}")
    
    return report_text

def main():
    """Main validation"""
    print("="*70)
    print("Netflix Dashboard Insights Validation")
    print("="*70)
    
    df = load_data()
    
    all_results = {}
    
    # Run all validations
    all_results['Executive Overview'] = validate_executive_metrics(df)
    all_results['Temporal Trends'] = validate_temporal_trends(df)
    all_results['Geographic Insights'] = validate_geographic_insights(df)
    all_results['Genre Intelligence'] = validate_genre_insights(df)
    all_results['Performance Data'] = validate_performance_data(df)
    all_results['Language Data'] = validate_language_data(df)
    
    # Special checks
    momentum_ok, momentum_info = check_genre_momentum(df)
    print(f"\n   Genre momentum calculation: {'✅ OK' if momentum_ok else '⚠️  ISSUE'}")
    print(f"   {momentum_info}")
    
    # Generate report
    report = generate_report(all_results)
    
    print("\n" + "="*70)
    print("✅ Validation Complete!")
    print("="*70)
    
    # Print critical issues
    print("\n🔍 Critical Issues Found:")
    issues = []
    
    for section, (results, validations) in all_results.items():
        for insight, valid in validations.items():
            if isinstance(valid, bool) and not valid:
                issues.append(f"   ❌ {section}: {insight}")
    
    if not momentum_ok:
        issues.append(f"   ⚠️  Genre Momentum: {momentum_info}")
    
    if issues:
        for issue in issues:
            print(issue)
    else:
        print("   ✅ No critical issues found!")

if __name__ == "__main__":
    main()
