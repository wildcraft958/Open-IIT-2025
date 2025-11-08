# Netflix Dashboard Insights Validation Report
Generated: 2025-11-08 06:09:48
Dataset: netflix_combined_dataset.csv
---
## Executive Summary
Validation of all dashboard insights against actual dataset.

## Executive Overview
### Data Facts
- **total_titles**: 42539
- **total_countries**: 150
- **content_types**:
  - Movie: 39862
  - TV Show: 2676
  - 16.473: 1
- **tv_show_percentage**: 6.29069794776558
- **movie_percentage**: 93.70695126824796
- **top_rating**:
  - 6.9: 19576

### Insight Validation
- TV shows surpassing movies in additions: **✅ VALID**
- TV-MA dominant: **✅ VALID**
- 135 countries: **✅ VALID**
- 23,162 titles: **✅ VALID**

## Temporal Trends
### Data Facts
- **recent_additions_by_type**:
  - Movie: {2019.0: 1099, 2020.0: 886, 2021.0: 691}
  - TV Show: {2019.0: 575, 2020.0: 594, 2021.0: 505}
- **q4_percentage**: 25.990939977349942
- **avg_content_lag_years**: 5.217298980747452
- **quarterly_distribution**:
  - 1.0: 1647
  - 2.0: 1709
  - 3.0: 1872
  - 4.0: 1836

### Insight Validation
- Q4 loading pattern: **✅ VALID**
- TV shows surpassing movies: **❌ INVALID**
- Content lag decreasing: **✅ VALID**

## Geographic Insights
### Data Facts
- **total_countries**: 150
- **top_countries**: 10 entries
- **us_count**: 10449
- **african_count**: 369
- **african_percentage**: 0.8674392910035497
- **sea_count**: 601
- **sea_percentage**: 1.41282117586215

### Insight Validation
- US dominant: **✅ VALID**
- Africa underrepresented (<5%): **✅ VALID**
- Southeast Asia underrepresented (<5%): **✅ VALID**
- 135+ countries: **✅ VALID**

## Genre Intelligence
### Data Facts
- **total_unique_genres**: 62
- **top_genres**: 10 entries
- **drama_count**: 8638
- **comedy_count**: 5751
- **thriller_count**: 4082
- **top_3_percentage**: 25.39702182073176
- **musical_count**: 0
- **scifi_count**: 1454
- **doc_count**: 1660
- **standup_count**: 325

### Insight Validation
- Drama/Comedy/Thriller dominate: **ℹ️  False**
- Musicals underrepresented: **✅ VALID**
- Sci-Fi underrepresented: **✅ VALID**

## Performance Data
### Data Facts
- **has_popularity**: 15999
- **has_votes**: 15999
- **has_rating**: 15999
- **has_budget**: 15999
- **has_revenue**: 15999
- **performance_coverage**: 37.61019299936529
- **financial_coverage**: 11.39424998236912

### Insight Validation
- 69% performance coverage: **ℹ️  False**
- 21% financial coverage: **ℹ️  False**

## Language Data
### Data Facts
- **total_languages**: 75
- **language_coverage**: 83.16368508897718
- **top_languages**: 15 entries
- **english_count**: 28910

### Insight Validation
- 15+ languages: **✅ VALID**
- English dominant: **✅ VALID**
