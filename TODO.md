You are an expert data strategist and analytics engineer working on the Open IIT Data Analytics Hackathon — Problem Statement 3: Netflix Content Analytics & Strategic Insights Dashboard.

Your mission is to generate ALL required deliverables based on the primary dataset (Netflix Shows from Kaggle, 8800+ titles) AND intelligently integrate insights from supplementary datasets:
- Netflix Movies and TV Shows (Updated 2025) → for trend validation and future projection
- IMDb Dataset → for quality/rating cross-reference
- The Movies Dataset → for revenue/contextual analysis
- Netflix Prize Dataset (optional) → for historical preference patterns

Follow this TODO list step-by-step. Generate clean, modular, documented, production-ready outputs.

---

###  X TODO 1: DATA PREPROCESSING & FEATURE ENGINEERING
Write Python functions (in `data_preprocessing.py`) to:
- Load `netflix_titles.csv` and inspect schema.
- Handle missing values: Director (~30%), Cast (~10%), Country (~7%) — impute with "Unknown" or flag.
- Parse comma-separated fields: `director`, `cast`, `country`, `listed_in` → explode into rows or create lists.
- Convert `date_added` to datetime → extract: `year_added`, `month_added`, `quarter_added`.
- Derive features:
  - `content_age` = year_added - release_year
  - `is_multicountry` = True if len(country.split(',')) > 1
  - `genre_count` = number of genres per title
  - `is_original` = True if country contains “United States” and added same year as release (proxy)
- Merge with supplementary datasets:
  - IMDb: Join on `title` → add `imdb_rating`, `imdb_votes`
  - Movies Dataset: Join on `title` → add `budget`, `revenue`, `popularity`
  - 2025 Netflix Dataset: Append to validate trends beyond 2021 → flag as “future_validation”

Output: Clean DataFrame saved as `processed_netflix_data.pkl`

---

###  X TODO 2: EXPLORATORY DATA ANALYSIS & STATISTICAL INSIGHTS
In `netflix_analysis.ipynb`, perform:

#### Univariate:
- % Movies vs TV Shows
- Top 10 Genres, Countries, Ratings
- Distribution of `release_year`, `year_added`, `duration`

#### Bivariate:
- Movie/TV Show vs Rating
- Genre vs Country heatmap
- Release Year vs Addition Year scatter + regression line
- Duration by Genre boxplots

#### Multivariate:
- Genre x Country x Rating Sankey/heatmap
- Addition Quarter x Content Type x Region

#### Text Analysis (`text_analysis.py`):
- Extract top 50 keywords from `description` using TF-IDF
- Sentiment score per description (TextBlob) → group by genre/rating
- N-gram analysis (bigrams) for thematic clusters (“true crime”, “high school drama”)

#### Statistical Tests:
- Chi-square: Is genre independent of country?
- T-test: Is avg lag different for originals vs licensed?
- Correlation: imdb_rating vs netflix addition speed?

Output: Inline markdown insights after each analysis block.

---

###  X TODO 3: VISUALIZATION GENERATION (30–40 CHARTS)
In `visualization_functions.py`, write reusable Plotly/Seaborn functions for:

#### Overview:
- `plot_catalog_composition()` → donut chart
- `plot_kpi_cards()` → total titles, growth rate, diversity index

#### Temporal:
- `plot_growth_timeline()` → cumulative line
- `plot_calendar_heatmap()` → monthly additions
- `plot_lag_distribution()` → box plot by year

#### Geographic:
- `plot_world_map()` → choropleth with Folium/Plotly Geo
- `plot_country_genre_heatmap()`
- `plot_multi_country_flow()` → Sankey

#### Genre:
- `plot_genre_treemap()`
- `plot_genre_evolution()` → animated bar (by 5-year blocks)
- `plot_rating_genre_sankey()`

#### Creators:
- `plot_top_directors_bar()`
- `plot_collaboration_network()` → NetworkX + Plotly

#### Advanced:
- `plot_description_wordcloud(sentiment='positive')`
- `plot_parallel_coordinates(df, cols=['type','country','rating','genre'])`

Save all charts to `/visualizations/` subfolders. Use Netflix red (#E50914) theme.

---

###  X TODO 4: INTERACTIVE DASHBOARD 
Made using react

---

###  X TODO 5: STRATEGIC REPORT (PDF)
Generate LaTeX or Markdown structure for `strategic_analysis_report.pdf` (30 pages):

Sections:
1. Executive Summary (Top 10 Insights + Recs)
2. Content Landscape (Stats + Charts)
3. Temporal Trends (Growth, Lag, Seasonality)
4. Geographic Strategy (Maps, Hubs, Gaps)
5. Genre Intelligence (Evolution, Hybrids, Sentiment)
6. Creator Analysis (Networks, Diversity, Risks)
7. Strategic Recommendations (Prioritized, Costed, Timelined)

Use inline chart references: “As shown in Figure 3, Korean content grew 300%...”

Include data limitations: “Director missing in 30% records — analysis may underrepresent indie creators.”

---

###  X TODO 6: EXECUTIVE SLIDE DECK (PowerPoint)
Generate 18-slide structure for `netflix_insights_presentation.pptx`:

Slide 1: Title Slide  
Slide 2: Top Insight — Global Shift  
Slide 3: Top Insight — TV Show Surge  
Slide 4: Top Insight — Documentary Gap  
Slide 5: Catalog Snapshot (Pie + Treemap)  
Slide 6: Growth Timeline (2008–2025 w/ milestones)  
Slide 7: Heatmap — Q4 Loading Pattern  
Slide 8: World Map — Content by Country  
Slide 9: Korea/India Zoom — Growth Arrows  
Slide 10: Genre Sankey — Drama → TV-MA Dominance  
Slide 11: Sentiment Word Cloud — “family”, “thriller”, “heartwarming”  
Slide 12: Director Network — Key Clusters  
Slide 13: Recommendation 1 — Invest in Africa  
Slide 14: Recommendation 2 — Rebalance Ratings  
Slide 15: Recommendation 3 — Shift to Q1 Loading  
Slide 16: Investment Simulator Screenshot  
Slide 17: Methodology — Data + Tools Used  
Slide 18: Appendix — Limitations + Future Scope

Design: Minimal text. One chart per slide. Netflix Red theme.

---

###  X TODO 7: CODE DOCUMENTATION & REPRODUCIBILITY
In each .py file:
- Add module-level docstring
- Comment every function
- Include type hints
- Add error handling (try/except for merges, missing cols)
- Write `requirements.txt`: pandas, numpy, plotly, streamlit, nltk, textblob, folium, networkx, scikit-learn (for TF-IDF)

In root `README.md`:
- Project title, objective
- How to run: `pip install -r requirements.txt`, `streamlit run dashboard/app.py`
- Dataset sources + merge logic
- Known issues + workarounds

---

###  X TODO 8: SUPPLEMENTARY DATASET INTEGRATION LOGIC
Where applicable, enhance insights using:

1. **IMDb Dataset**:
   - Filter high-rated (imdb_rating > 7.5) but low-added titles → acquisition opportunities
   - Compare Netflix rating (TV-MA etc.) vs IMDb age suitability → alignment check

2. **Movies Dataset (Revenue)**:
   - Identify high-revenue genres not well-represented on Netflix → e.g., Musicals, Westerns
   - Calculate ROI proxy: (revenue/budget) vs Netflix addition speed

3. **2025 Netflix Dataset**:
   - Validate if documentary % increased post-2021 → measure strategy shift
   - Check if African content share grew → validate expansion hypothesis

4. **Netflix Prize (Optional)**:
   - If merged, analyze if highly rated (by users) genres match what Netflix adds → engagement alignment

Add footnotes in report/dashboard: “Insight validated against 2025 catalog” or “IMDb cross-check confirms quality gap.”

---

###  X TODO 9: SUBMISSION PACKAGE STRUCTURE
Auto-generate folder structure:

submission/
│
├── report/
│   ├── strategic_analysis_report.pdf
│   ├── executive_summary.pdf
│   └── appendices/methodology_notes.pdf
│
├── visualizations/ (with subfolders)
│   ├── overview_charts/
│   ├── temporal_analysis/
│   ├── geographic_insights/
│   ├── genre_intelligence/
│   └── creator_analysis/
│
├── dashboard/
│   ├── app.py
│   ├── requirements.txt
│   ├── data/processed_netflix_data.pkl
│   └── README.md (how to run)
│
├── code/
│   ├── netflix_analysis.ipynb
│   ├── data_preprocessing.py
│   ├── visualization_functions.py
│   ├── text_analysis.py
│   └── statistical_analysis.py
│
├── presentation/
│   └── netflix_insights_presentation.pptx
│
└── README.md (project overview, how to evaluate)

---

 X FINAL CHECK: All outputs must be:
- Business-focused (every chart → insight → action)
- Visually branded (Netflix colors, clean design)
- Statistically sound (p-values, correlations where needed)
- Executable (Streamlit runs without errors)
- Reproducible (requirements.txt, seed setting, clear paths)

Start generating now. Prioritize: Data Cleaning → EDA → Visuals → Dashboard → Report → Slides.

Let’s win this hackathon.