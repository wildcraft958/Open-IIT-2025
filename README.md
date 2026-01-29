<div align="center">

# 🏆 Netflix Content Analytics & Strategic Insights

### 🥇 **First Prize Winner** - Open IIT Data Analytics Hackathon 2025
**Team: Narrative Navigators**

[![Live Demo](https://img.shields.io/badge/Live-Dashboard-blue?logo=vercel&style=for-the-badge)](https://open-iit.vercel.app/)
[![Python](https://img.shields.io/badge/Python-3.8+-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://www.python.org/)
[![React](https://img.shields.io/badge/React-18+-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
[![Jupyter](https://img.shields.io/badge/Jupyter-Notebook-F37626?style=for-the-badge&logo=jupyter&logoColor=white)](https://jupyter.org/)

*Transforming raw data into actionable strategic insights for Netflix's global content strategy*

[Live Dashboard](https://open-iit.vercel.app/) • [Documentation](#documentation) • [Methodology](#methodology)

</div>

---

## 🎯 Project Overview

This award-winning project delivers a comprehensive data-driven analysis of Netflix's content catalog, uncovering strategic insights into global content production trends, audience preferences, and market opportunities. Our analysis synthesizes multiple datasets to provide actionable recommendations for content acquisition, regional expansion, and portfolio optimization.

### **Problem Statement**
Open IIT Data Analytics Hackathon - Problem Statement 3: Analyze Netflix's content library to identify trends, optimize content strategy, and recommend data-driven decisions for growth.

### **Key Achievements**
- 🥇 **First Prize** at Open IIT Data Analytics Hackathon 2025
- 📊 **30+ Interactive Visualizations** spanning temporal, geographic, and genre analyses
- 🌍 **Multi-Dataset Integration** combining Netflix, IMDb, and external movie data
- ⚡ **Production-Grade Dashboard** deployed on Vercel with real-time interactivity
- 🔬 **Advanced Analytics** including NLP sentiment analysis, network analysis, and statistical testing

---

## 🔑 Key Strategic Insights

| Insight | Strategic Implication |
|---------|----------------------|
| **🌏 Global Content Shift** | International markets (South Korea, India, Japan) are rapidly outpacing US content production—signaling a new growth engine |
| **📺 TV Show Dominance** | Episodic content has surpassed movies, indicating viewer preference for long-form serialized storytelling |
| **👨‍👩‍👧 Ratings Gap** | Heavy TV-MA focus leaves family (PG/TV-PG) and teen (PG-13/TV-14) demographics underserved |
| **🎬 Documentary Opportunity** | High engagement but low supply in documentary and stand-up comedy genres |
| **🌍 Geographic White Spaces** | Africa and Southeast Asia represent critical "blue ocean" expansion opportunities |
| **📅 Q4 Content Surge** | Strategic seasonal loading pattern creates opportunity for counter-programming in Q1 |

---

## 💼 Strategic Recommendations

<details>
<summary><b>1. Invest in Emerging Content Hubs (Africa & Southeast Asia)</b></summary>

- **Action**: Establish $100M fund for co-productions in Nigeria, South Africa, and Indonesia
- **Timeline**: Q2 2026 - Q4 2027
- **Expected Impact**: First-mover advantage in high-growth markets
</details>

<details>
<summary><b>2. Rebalance Ratings Portfolio</b></summary>

- **Action**: Greenlight 10+ high-quality family and teen-focused series
- **Timeline**: Q1 2026 onwards
- **Expected Impact**: Capture underserved demographics worth billions in market value
</details>

<details>
<summary><b>3. Q1 Counter-Programming Strategy</b></summary>

- **Action**: Shift 2 tentpole releases from Q4 to Q1 to own "New Year, New Show" conversation
- **Timeline**: Q1 2027
- **Expected Impact**: Reduce marketing noise, capture post-holiday audience
</details>

<details>
<summary><b>4. Diversify Creator Networks</b></summary>

- **Action**: Launch "New Voices" program for first-time directors from underrepresented regions
- **Timeline**: Ongoing
- **Expected Impact**: Fresh perspectives and reduced reliance on small talent cluster
</details>

<details>
<summary><b>5. Acquire High-Performing Niche Content</b></summary>

- **Action**: Actively pursue award-winning documentaries and stand-up specials
- **Timeline**: Q2 2026
- **Expected Impact**: Satisfy engaged niche audiences with premium content
</details>

---

## 🚀 Quick Start

### Prerequisites
- **Python** 3.8 or higher
- **Node.js** 16+ and npm
- **Jupyter Notebook**

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/wildcraft958/Open-IIT-2025.git
cd Open-IIT-2025
```

### 2️⃣ Run the Analysis Pipeline
```bash
# Create virtual environment
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Launch Jupyter notebook for analysis
jupyter notebook analytics_code/netflix_analysis.ipynb
```

**The notebook will:**
- Preprocess and clean raw Netflix data
- Perform exploratory data analysis (EDA)
- Generate 30+ visualizations
- Conduct statistical tests and sentiment analysis
- Create data payloads for the dashboard

### 3️⃣ Launch the Interactive Dashboard
```bash
cd dashboard-react
npm install
npm start
```

Access the dashboard at `http://localhost:3000`

### 🌐 Live Demo
**Experience the full interactive dashboard**: [https://open-iit.vercel.app/](https://open-iit.vercel.app/)

---

## 📊 Dataset & Methodology

### Data Sources
| Dataset | Source | Purpose |
|---------|--------|---------|
| **Netflix Titles** | [Kaggle](https://www.kaggle.com/datasets/shivamb/netflix-shows) | Primary content catalog data |
| **Netflix 2025 Update** | Supplementary dataset | Trend validation and recent additions |
| **IMDb Ratings** | The Movies Dataset | External quality metrics |
| **Box Office Data** | Movie revenue datasets | Financial performance analysis |

### Merge Strategy
- **Normalization**: Title-based fuzzy matching with 95% accuracy
- **Feature Engineering**: Created `content_age`, `is_multicountry`, `sentiment_score`, and `collaboration_network` features
- **Imputation**: Handled missing values (30% directors, 10% cast, 7% country) with statistical methods
- **Output**: Parquet-formatted relational tables for efficient querying

### Analytical Techniques
- **Temporal Analysis**: Time-series decomposition, seasonality detection
- **Geographic Analysis**: Choropleth mapping, multi-country production networks
- **Text Analytics**: VADER sentiment analysis, TF-IDF vectorization, word cloud generation
- **Network Analysis**: Actor-director collaboration graphs using NetworkX
- **Statistical Testing**: Chi-square, ANOVA, and correlation analyses

---

## 📁 Project Architecture

```
Open-IIT-2025/
│
├── 📊 analytics_code/              # Core analysis pipeline
│   ├── netflix_analysis.ipynb      # Main analysis notebook
│   ├── data_preprocessing.py       # Data cleaning & transformation
│   ├── statistical_analysis.py    # Hypothesis testing & correlations
│   ├── text_analysis.py            # NLP & sentiment analysis
│   └── visualization_functions.py  # Custom Plotly/Seaborn charts
│
├── 🎨 dashboard-react/             # Production React dashboard
│   ├── src/                        # React components
│   ├── public/                     # Static assets
│   ├── package.json                # Node dependencies
│   └── vite.config.js              # Build configuration
│
├── 📂 data/                        # Raw CSV datasets
│
├── 📈 visualizations/              # Generated charts (30+ files)
│   ├── overview_charts/
│   ├── temporal_analysis/
│   ├── geographic_insights/
│   ├── genre_intelligence/
│   └── creator_analysis/
│
├── 📝 submission/                  # Hackathon deliverables
│   ├── report/                     # Strategic analysis report
│   ├── presentation/               # Executive slide deck
│   ├── code/                       # Analysis scripts
│   └── dashboard/                  # Deployed dashboard code
│
└── 📋 README.md                    # This file
```

---

## 🛠️ Technology Stack

**Data Processing & Analysis**
- Python (Pandas, NumPy, Scikit-learn)
- Jupyter Notebook
- NLTK & VADER (Sentiment Analysis)
- NetworkX (Graph Analysis)

**Visualization**
- Plotly (Interactive charts)
- Seaborn & Matplotlib (Statistical plots)
- WordCloud (Text visualization)

**Dashboard**
- React 18 + Vite
- Recharts (Data visualization)
- TailwindCSS (Styling)
- Vercel (Deployment)

---

## 📖 Documentation

### Comprehensive Resources
- **[Strategic Analysis Report](submission/report/strategic_analysis_report.md)**: Deep-dive into insights and recommendations
- **[Executive Presentation](submission/presentation/executive_slide_deck.md)**: Slide deck structure and key takeaways
- **[Submission README](submission/README.md)**: Hackathon deliverable structure

### Key Visualizations
- **Catalog Composition**: Movie vs TV show distribution
- **Global Production Map**: Choropleth showing content origins
- **Genre Evolution**: Streamgraph of genre trends over time
- **Collaboration Network**: Actor-director relationship graph
- **Sentiment Analysis**: Rating distributions by genre
- **Calendar Heatmap**: Seasonal content addition patterns

---

## ⚠️ Data Limitations & Future Scope

### Known Limitations
- **Missing Data**: 30% of records lack director information, 10% missing cast details
- **"Originals" Proxy**: Netflix Original designation inferred via heuristics (US-produced content added within release year)
- **External Dataset Matching**: Title-based merges may introduce ~5% mismatch rate

### Future Enhancements
- Integration of user-level viewing data (Netflix Prize dataset)
- Predictive modeling for content success (ROI forecasting)
- Real-time streaming analytics pipeline
- A/B testing framework for recommendation algorithms

---

## 👥 Team Narrative Navigators

<div align="center">

### 🏆 Open IIT Data Analytics Hackathon 2025
**First Prize Winners**

*We transform data narratives into strategic business impact*

</div>

---

## 📜 License & Acknowledgments

**License**: MIT License (see LICENSE file)

**Data Sources**:
- Kaggle Netflix Shows Dataset
- The Movies Dataset (Kaggle)
- IMDb Non-Commercial Datasets

**Hackathon**: Open IIT Data Analytics Hackathon 2025 - Problem Statement 3

---

<div align="center">

### 🎓 Academic Excellence • 💡 Innovation • 📊 Data-Driven Insights

**Built with ❤️ by Team Narrative Navigators**

[![GitHub](https://img.shields.io/badge/GitHub-Repository-181717?style=for-the-badge&logo=github)](https://github.com/wildcraft958/Open-IIT-2025)
[![Dashboard](https://img.shields.io/badge/Live-Dashboard-00D9FF?style=for-the-badge&logo=vercel)](https://open-iit.vercel.app/)

</div>
