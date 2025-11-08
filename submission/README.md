# Netflix Data Analytics - Submission

This submission follows the prescribed structure for the Open IIT Data Analytics Hackathon.

## Directory Structure

```
submission/
│
├── report/
│   ├── strategic_analysis_report.md
│   └── appendices/
│
├── visualizations/
│   └── overview_charts/
│
├── dashboard/
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── requirements.txt
│   ├── data/
│   │   ├── netflix_combined_dataset.csv
│   │   └── netflix_data.json
│   ├── assets/
│   ├── src/
│   ├── public/
│   └── README.md
│
├── code/
│   ├── netflix_analysis.ipynb
│   ├── data_preprocessing.py
│   ├── visualization_functions.py
│   ├── text_analysis.py
│   └── statistical_analysis.py
│
└── presentation/
    └── executive_slide_deck.md
```

## Quick Start

### Dashboard
The dashboard is built with React + Vite.

```bash
cd dashboard
npm install
npm run dev
```

### Code Analysis
The analysis code is in Jupyter notebooks and Python scripts.

```bash
cd code
jupyter notebook netflix_analysis.ipynb
```

## Contents

- **report/**: Strategic analysis report and appendices
- **visualizations/**: All generated charts and visualizations
- **dashboard/**: Interactive dashboard application
- **code/**: Analysis notebooks and Python scripts
- **presentation/**: Executive presentation slides

## Notes

- All processed data is located in `dashboard/data/`
- Python dependencies are listed in `dashboard/requirements.txt`
- Dashboard dependencies are listed in `dashboard/package.json`
