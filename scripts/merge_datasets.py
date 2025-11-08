#!/usr/bin/env python3
"""
Merge the old Netflix dataset (with TV shows) and new 2025 dataset (with performance metrics)
to create a comprehensive combined dataset.
"""

import pandas as pd
import numpy as np
from pathlib import Path

# Define paths
BASE_DIR = Path(__file__).parent.parent
OLD_DATASET = BASE_DIR / "data" / "Copy of netflix_titles.csv"
NEW_DATASET = BASE_DIR / "data" / "Copy of netflix_movies_detailed_up_to_2025 (1).csv"
OUTPUT_FILE = BASE_DIR / "data" / "netflix_combined_dataset.csv"

def load_old_dataset():
    """Load the old Netflix dataset with TV shows"""
    print("📂 Loading old dataset (with TV shows)...")
    df = pd.read_csv(OLD_DATASET)
    print(f"   ✓ Loaded {len(df)} records")
    print(f"   Types: {df['type'].value_counts().to_dict()}")
    return df

def load_new_dataset():
    """Load the new 2025 dataset with performance metrics"""
    print("\n📂 Loading new 2025 dataset (movies with performance data)...")
    df = pd.read_csv(NEW_DATASET)
    print(f"   ✓ Loaded {len(df)} records")
    print(f"   Types: {df['type'].value_counts().to_dict()}")
    return df

def standardize_schema(df_old, df_new):
    """Standardize column names and create unified schema"""
    print("\n🔧 Standardizing schemas...")
    
    # Rename 'listed_in' to 'genres' in old dataset
    if 'listed_in' in df_old.columns:
        df_old = df_old.rename(columns={'listed_in': 'genres'})
    
    # Add missing columns to old dataset with null values
    new_columns = ['language', 'popularity', 'vote_count', 'vote_average', 'budget', 'revenue']
    for col in new_columns:
        if col not in df_old.columns:
            df_old[col] = np.nan
    
    # Ensure both have same column order
    common_cols = ['show_id', 'type', 'title', 'director', 'cast', 'country', 
                   'date_added', 'release_year', 'rating', 'duration', 'genres', 
                   'language', 'description', 'popularity', 'vote_count', 
                   'vote_average', 'budget', 'revenue']
    
    # Add any missing columns
    for col in common_cols:
        if col not in df_old.columns:
            df_old[col] = np.nan
        if col not in df_new.columns:
            df_new[col] = np.nan
    
    df_old = df_old[common_cols]
    df_new = df_new[common_cols]
    
    print(f"   ✓ Standardized to {len(common_cols)} columns")
    return df_old, df_new

def merge_datasets(df_old, df_new):
    """Merge datasets with deduplication strategy"""
    print("\n🔀 Merging datasets...")
    
    # Create a title-year key for matching
    df_old['merge_key'] = df_old['title'].str.lower().str.strip() + '_' + df_old['release_year'].astype(str)
    df_new['merge_key'] = df_new['title'].str.lower().str.strip() + '_' + df_new['release_year'].astype(str)
    
    # Split old dataset into TV shows and movies
    old_tv = df_old[df_old['type'] == 'TV Show'].copy()
    old_movies = df_old[df_old['type'] == 'Movie'].copy()
    
    print(f"   Old dataset: {len(old_movies)} movies, {len(old_tv)} TV shows")
    print(f"   New dataset: {len(df_new)} movies")
    
    # Find movies that exist in new dataset (with better data)
    movies_in_new = set(df_new['merge_key'])
    old_movies_not_in_new = old_movies[~old_movies['merge_key'].isin(movies_in_new)]
    
    print(f"   Unique movies in old dataset: {len(old_movies_not_in_new)}")
    print(f"   Movies from new dataset (with metrics): {len(df_new)}")
    print(f"   TV shows (preserved from old): {len(old_tv)}")
    
    # Combine: All TV shows + unique old movies + all new movies (with metrics)
    combined = pd.concat([
        old_tv.drop('merge_key', axis=1),
        old_movies_not_in_new.drop('merge_key', axis=1),
        df_new.drop('merge_key', axis=1)
    ], ignore_index=True)
    
    print(f"\n   ✅ Combined dataset: {len(combined)} total records")
    print(f"      Type distribution: {combined['type'].value_counts().to_dict()}")
    
    return combined

def add_derived_fields(df):
    """Add useful derived fields for analysis"""
    print("\n🎯 Adding derived fields...")
    
    # Extract year from date_added
    df['year_added'] = pd.to_datetime(df['date_added'], errors='coerce').dt.year
    
    # Calculate content age
    current_year = 2025
    df['content_age'] = current_year - df['release_year']
    
    # Parse duration into numeric
    df['duration_minutes'] = df['duration'].str.extract(r'(\d+)').astype(float)
    
    # Flag for having performance metrics
    df['has_performance_data'] = (
        df['popularity'].notna() | 
        df['vote_count'].notna() | 
        df['vote_average'].notna()
    )
    
    # Flag for having financial data
    df['has_financial_data'] = (
        df['budget'].notna() & 
        df['revenue'].notna() & 
        (df['budget'] > 0)
    )
    
    print(f"   ✓ Content with performance data: {df['has_performance_data'].sum()}")
    print(f"   ✓ Content with financial data: {df['has_financial_data'].sum()}")
    
    return df

def generate_summary_stats(df):
    """Generate and print summary statistics"""
    print("\n" + "="*70)
    print("📊 COMBINED DATASET SUMMARY")
    print("="*70)
    
    print(f"\n📈 Overall Statistics:")
    print(f"   Total Records: {len(df):,}")
    print(f"   Date Range: {df['release_year'].min():.0f} - {df['release_year'].max():.0f}")
    
    print(f"\n🎬 Content Type Distribution:")
    for ctype, count in df['type'].value_counts().items():
        pct = (count / len(df)) * 100
        print(f"   {ctype}: {count:,} ({pct:.1f}%)")
    
    print(f"\n⭐ Data Completeness:")
    print(f"   With performance metrics: {df['has_performance_data'].sum():,} ({(df['has_performance_data'].sum()/len(df)*100):.1f}%)")
    print(f"   With financial data: {df['has_financial_data'].sum():,} ({(df['has_financial_data'].sum()/len(df)*100):.1f}%)")
    
    # Language distribution (top 10)
    print(f"\n🌍 Top 10 Languages:")
    for lang, count in df['language'].value_counts().head(10).items():
        if pd.notna(lang):
            print(f"   {lang}: {count:,}")
    
    # Country distribution (top 10)
    print(f"\n🗺️  Top 10 Countries:")
    country_counts = df['country'].str.split(',').explode().str.strip().value_counts().head(10)
    for country, count in country_counts.items():
        if pd.notna(country):
            print(f"   {country}: {count:,}")
    
    print(f"\n📅 Content by Decade:")
    df['decade'] = (df['release_year'] // 10) * 10
    for decade, count in df['decade'].value_counts().sort_index().tail(6).items():
        print(f"   {int(decade)}s: {count:,}")
    
    print("\n" + "="*70)

def main():
    """Main execution"""
    print("🎬 Netflix Dataset Merger")
    print("="*70)
    
    # Load datasets
    df_old = load_old_dataset()
    df_new = load_new_dataset()
    
    # Standardize schemas
    df_old, df_new = standardize_schema(df_old, df_new)
    
    # Merge datasets
    df_combined = merge_datasets(df_old, df_new)
    
    # Add derived fields
    df_combined = add_derived_fields(df_combined)
    
    # Generate summary
    generate_summary_stats(df_combined)
    
    # Save combined dataset
    print(f"\n💾 Saving combined dataset to: {OUTPUT_FILE}")
    df_combined.to_csv(OUTPUT_FILE, index=False)
    print(f"   ✅ Saved {len(df_combined):,} records")
    
    # Also save a backup of the old combined data
    backup_file = BASE_DIR / "dashboard-react" / "public" / "netflix_data_backup.json"
    print(f"\n💾 Creating backup of old JSON data: {backup_file}")
    import json
    import shutil
    old_json = BASE_DIR / "dashboard-react" / "public" / "netflix_data.json"
    if old_json.exists():
        shutil.copy(old_json, backup_file)
        print("   ✅ Backup created")
    
    print("\n✨ Merge complete! Ready to rebuild JSON for dashboard.")
    print(f"\n💡 Next step: Run 'node scripts/build-json-from-csv.cjs' to update dashboard data")

if __name__ == "__main__":
    main()
