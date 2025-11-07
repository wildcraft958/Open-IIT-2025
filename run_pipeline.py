"""Standalone script to run the entire Netflix analysis pipeline."""

import sys
import logging
from pathlib import Path

# Add analytics_code to path
sys.path.insert(0, str(Path(__file__).parent))

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

def main():
    print("=" * 80)
    print("NETFLIX CONTENT ANALYTICS - END-TO-END PIPELINE")
    print("=" * 80)
    
    # Step 1: Run data preprocessing
    print("\n[1/3] Running data preprocessing...")
    try:
        from analytics_code.data_preprocessing import run_all
        run_all()
        print("✓ Data preprocessing completed successfully!")
    except Exception as e:
        print(f"✗ Data preprocessing failed: {e}")
        import traceback
        traceback.print_exc()
        return
    
    # Step 2: Generate all visualizations
    print("\n[2/3] Generating visualization portfolio...")
    try:
        from analytics_code.visualization_functions import generate_visualization_portfolio
        generate_visualization_portfolio()
        print("✓ Visualizations generated successfully!")
    except Exception as e:
        print(f"✗ Visualization generation failed: {e}")
        import traceback
        traceback.print_exc()
        return
    
    # Step 3: Run statistical analyses
    print("\n[3/3] Running statistical analyses...")
    try:
        import pandas as pd
        from analytics_code.statistical_analysis import chi_square_test, lag_correlation
        from analytics_code.text_analysis import tfidf_top_terms, add_sentiment
        
        PROCESSED_DIR = Path(__file__).parent / 'artifacts' / 'processed'
        
        titles = pd.read_parquet(PROCESSED_DIR / 'titles.parquet')
        genres = pd.read_parquet(PROCESSED_DIR / 'genres.parquet')
        countries = pd.read_parquet(PROCESSED_DIR / 'countries.parquet')
        
        # Chi-square test
        merged_genre_country = genres.merge(countries, on='show_id')
        top_genres = genres['genre'].value_counts().head(5).index
        top_countries = countries['country_std'].value_counts().head(5).index
        filtered_df = merged_genre_country[
            merged_genre_country['genre'].isin(top_genres) & 
            merged_genre_country['country_std'].isin(top_countries)
        ]
        chi2_result = chi_square_test(filtered_df, 'genre', 'country_std')
        print(f"  Chi-square test (genre vs country): p-value = {chi2_result['p_value']:.4f}")
        
        # Correlation test
        lag_corr_result = lag_correlation(titles)
        if lag_corr_result:
            print(f"  Spearman correlation (release year vs lag): rho = {lag_corr_result['spearman_rho']:.3f}, p-value = {lag_corr_result['p_value']:.4f}")
        
        # Sentiment analysis
        titles_with_sentiment = add_sentiment(titles)
        merged_sentiment = titles_with_sentiment.merge(genres, on='show_id')
        sentiment_by_genre = merged_sentiment.groupby('genre')['sentiment'].mean().sort_values(ascending=False)
        print(f"  Top 5 genres by sentiment: {sentiment_by_genre.head(5).to_dict()}")
        
        print("✓ Statistical analyses completed successfully!")
        
    except Exception as e:
        print(f"✗ Statistical analysis failed: {e}")
        import traceback
        traceback.print_exc()
        return
    
    print("\n" + "=" * 80)
    print("✓ PIPELINE COMPLETED SUCCESSFULLY!")
    print("=" * 80)
    print("\nGenerated files:")
    print("  - artifacts/processed/*.parquet (processed data tables)")
    print("  - visualizations/**/*.html (interactive charts)")
    print("  - dashboard-react/public/netflix_data.json (React dashboard data)")
    print("\nNext steps:")
    print("  1. Review visualizations in the visualizations/ directory")
    print("  2. Start the React dashboard: cd dashboard-react && npm start")
    print("  3. Review reports in submission/report/")

if __name__ == '__main__':
    main()
