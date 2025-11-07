# Open IIT Data Analytics Hackathon: Netflix Content Strategy

This project is a submission for the Open IIT Data Analytics Hackathon (Problem Statement 3). It provides a comprehensive analysis of the Netflix content catalog, identifies strategic insights, and presents recommendations for the company's content acquisition and scheduling strategy.

## Project Objective

The goal is to analyze the Netflix dataset to understand the composition of its content library, identify trends in content production and acquisition, and provide actionable, data-driven recommendations to guide Netflix's future content strategy.

## How to Run

### Prerequisites
- Python 3.8+
- Node.js and npm (for the React dashboard)

### 1. Setup Python Environment and Install Dependencies
It is recommended to use a virtual environment.
```bash
python -m venv venv
source venv/bin/activate  # On Windows, use `venv\Scripts\activate`
pip install -r requirements.txt
```

### 2. Run the Data Processing and Analysis Pipeline
The main analysis is performed in a Jupyter Notebook. This will preprocess the data, run statistical analyses, and generate all visualizations.

```bash
# Ensure you have the raw data CSVs in the `data/` directory.
# The notebook will handle the rest.
jupyter notebook analytics_code/netflix_analysis.ipynb
```
Run all cells in the `netflix_analysis.ipynb` notebook. This will:
1.  Preprocess the raw data and save it in `artifacts/processed/`.
2.  Perform exploratory data analysis and statistical tests.
3.  Generate over 30 visualizations and save them in the `visualizations/` directory.
4.  Create the data payload for the React dashboard.

### 3. Run the Interactive Dashboard
The dashboard is a React application.

```bash
cd dashboard-react
npm install
npm start
```
This will open the interactive dashboard in your web browser at `http://localhost:3000`.

## Dataset Sources
- **Primary**: [Netflix Shows on Kaggle](https://www.kaggle.com/datasets/shivamb/netflix-shows) (`netflix_titles.csv`)
- **Supplementary**:
    - Netflix Movies and TV Shows (Updated 2025) - For trend validation.
    - IMDb & The Movies Dataset - For external ratings, budget, and revenue data.

### Merge Logic
- The primary Netflix dataset is cleaned and standardized.
- Supplementary datasets are merged based on a normalized `title` key.
- Features like `content_age`, `is_multicountry`, and sentiment scores are engineered.
- The final processed data is stored in multiple related tables (titles, genres, countries, people) in Parquet format.

## Project Structure
```
.
├── analytics_code/         # Python scripts and notebooks for analysis
│   ├── data_preprocessing.py
│   ├── statistical_analysis.py
│   ├── text_analysis.py
│   ├── visualization_functions.py
│   └── netflix_analysis.ipynb
├── dashboard-react/        # React-based interactive dashboard
├── data/                   # Raw data files (CSVs)
├── submission/             # Final deliverable documents
│   ├── report/
│   └── presentation/
├── visualizations/         # Generated charts and graphs
└── README.md               # This file
```

## Known Issues & Workarounds
- **Missing Data**: The dataset has missing values for `director`, `cast`, and `country`. These are imputed with "Unknown" to allow for complete analysis, though this may skew creator/country-specific insights.
- **"Originals" Proxy**: The term "Netflix Original" is not a field in the dataset. A proxy is used: content produced in the "United States" and added to Netflix in the same year it was released. This is an approximation.
- **Title Matching for Merges**: Merging with external datasets is done via normalized titles, which may lead to occasional mismatches for shows or movies with similar names.
