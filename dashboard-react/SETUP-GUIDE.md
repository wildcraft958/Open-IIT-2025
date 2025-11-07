# Netflix Content Analytics Dashboard - Complete Setup Guide

## Overview

This is a fully functional React-based interactive dashboard built specifically for the Open IIT Data Analytics Hackathon Problem Statement 3 (Netflix Content Analytics & Strategic Insights Dashboard). The dashboard fetches data from a JSON file and provides comprehensive visualizations, analytics, and strategic insights.

## 🚀 Quick Start

### Step 1: Create React Application

```bash
# Create a new React app
npx create-react-app netflix-analytics-dashboard
cd netflix-analytics-dashboard
```

### Step 2: Install Required Dependencies

```bash
npm install react-router-dom recharts @mui/material @emotion/react @emotion/styled @mui/icons-material date-fns lodash axios
```

### Step 3: Project Structure Setup

Create the following folder structure in `src/`:

```
src/
├── components/
│   ├── Navigation.jsx
│   └── KPICard.jsx
├── pages/
│   ├── ExecutiveOverview.jsx
│   ├── ContentExplorer.jsx
│   ├── TrendIntelligence.jsx
│   ├── GeographicInsights.jsx
│   ├── GenreIntelligence.jsx
│   ├── CreatorHub.jsx
│   └── StrategicRecommendations.jsx
├── utils/
│   ├── dataLoader.js
│   └── dataProcessing.js
├── App.jsx
├── App.css
└── index.js
```

### Step 4: Copy Component Files

Copy all the provided component files (`.jsx` files) to their respective directories in `src/`.

### Step 5: Copy Utility Files

- Copy `dataLoader.js` to `src/utils/`
- Copy `dataProcessing.js` to `src/utils/`

### Step 6: Copy App Files

- Copy `App.jsx` to `src/`
- Copy `App.css` to `src/`

### Step 7: Update package.json

Replace your `package.json` with the provided version, which includes all necessary dependencies and scripts.

### Step 8: Prepare Data File

Create `public/netflix_data.json` with your Netflix dataset in the following format:

```json
[
  {
    "show_id": "s1",
    "type": "Movie",
    "title": "Example Title",
    "director": "Director Name",
    "cast": "Actor 1, Actor 2, Actor 3",
    "country": "United States, India",
    "date_added": "2021-01-15",
    "release_year": 2020,
    "rating": "TV-MA",
    "duration": "120 min",
    "listed_in": "Drama, Action, Thriller",
    "description": "Content description"
  }
]
```

**Data Format Notes:**
- `type`: Must be "Movie" or "TV Show"
- `cast`, `country`, `listed_in`: Use comma-separated values
- `date_added`: Use YYYY-MM-DD format
- `duration`: Use "XXX min" for movies, "X Season(s)" for TV shows

### Step 9: Start the Dashboard

```bash
npm start
```

The dashboard will open at `http://localhost:3000`

## 📊 Dashboard Features

### Tab 1: Executive Overview
- **KPI Cards**: Total titles, countries, genres, ratings
- **Content Distribution**: Pie chart showing Movie vs TV Show split
- **Growth Timeline**: Line chart of catalog expansion
- **Top Genres**: Bar chart ranking genres
- **Strategic Insights**: Key findings cards

### Tab 2: Content Explorer
- **Advanced Search**: Filter by title and genre
- **Content Type Filter**: Movies or TV Shows
- **Sorting Options**: By title, release year, or rating
- **Content Table**: Searchable, sortable content listing
- **Load More**: Pagination support

### Tab 3: Trend Intelligence
- **Addition Timeline**: Stacked area chart of yearly additions
- **Content Age Analysis**: Track how old content is when added
- **Growth Rate**: Year-over-year growth percentages
- **Trend Insights**: Strategic findings

### Tab 4: Geographic Insights
- **Top Countries**: Horizontal bar chart of production countries
- **Regional Distribution**: Bar chart by region (North America, Europe, Asia, etc.)
- **Geographic Statistics**: Summary cards with key metrics

### Tab 5: Genre Intelligence
- **Top Genres**: Bar chart of most common genres
- **Genre Combinations**: Most common genre pairings
- **Genre Statistics**: Total genres and diversity metrics

### Tab 6: Creator Hub
- **Top Directors**: Ranking of most prolific directors
- **Top Actors**: Most frequent cast members
- **Creator Statistics**: Summary metrics

### Tab 7: Strategic Recommendations
- **Content Strategy**: Recommendations for content acquisition
- **Geographic Expansion**: Market opportunities
- **Audience Targeting**: Demographic strategies
- **Implementation Roadmap**: Phased approach

## 🎨 Netflix Theme

The dashboard uses Netflix's official brand colors:
- **Primary Red**: `#E50914`
- **Dark Background**: `#141414`
- **Surface**: `#1f1f1f`
- **Secondary Red**: `#831010`
- **Accent Red**: `#B20710`

All components are styled with Netflix's dark theme aesthetic.

## 📁 Data Processing

### What Gets Processed:

1. **Date Fields**: Automatically converted to Date objects
2. **Comma-Separated Fields**: Split into arrays (country, genres, cast, directors)
3. **Calculations**:
   - Unique countries and genres
   - Content type distributions
   - Year-over-year growth rates
   - Geographic regions
   - Genre combinations

### Processing Functions:

- `processExecutiveMetrics()`: KPI calculations
- `processTrendData()`: Timeline and growth analysis
- `processGeographicData()`: Country and region analysis
- `processGenreData()`: Genre analysis and combinations
- `processCreatorData()`: Director and actor statistics

## 🔧 How to Use Your Own Data

### Option 1: Direct JSON File
Place your `netflix_data.json` in the `public/` folder. The app will automatically load and process it.

### Option 2: CSV to JSON Conversion
If you have a CSV file, convert it to JSON using:

```bash
npm install papaparse
```

Then create a conversion script in `src/utils/csvConverter.js`:

```javascript
import Papa from 'papaparse';

export const convertCSVtoJSON = async (csvFile) => {
  return new Promise((resolve, reject) => {
    Papa.parse(csvFile, {
      header: true,
      complete: (results) => resolve(results.data),
      error: (error) => reject(error),
    });
  });
};
```

### Option 3: External API
Modify `dataLoader.js` to fetch from your backend:

```javascript
export const loadData = async () => {
  try {
    const response = await fetch('YOUR_API_ENDPOINT/netflix-data');
    const data = await response.json();
    return processRawData(data);
  } catch (error) {
    console.error('Error loading data:', error);
    throw error;
  }
};
```

## 🚀 Deployment

### Deploy to Netlify

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Deploy
netlify deploy
```

### Deploy to Vercel

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel
```

### Deploy to GitHub Pages

```bash
# Update package.json
npm install --save-dev gh-pages

# Add to package.json scripts:
# "predeploy": "npm run build",
# "deploy": "gh-pages -d build"

npm run deploy
```

## 🔍 Data Validation

The dashboard handles:
- Missing values gracefully
- Null/undefined fields
- Malformed data
- Empty datasets

If data fails to load, you'll see an error message in the UI.

## 📈 Performance Optimization

- **Memoization**: Uses `useMemo` to avoid unnecessary recalculations
- **Lazy Loading**: Routes loaded on demand
- **Efficient Rendering**: Optimized component re-renders
- **Chart Optimization**: Recharts efficiently renders large datasets

## 🐛 Troubleshooting

### Data Not Loading
**Problem**: "Error loading data" message appears

**Solutions**:
1. Check that `netflix_data.json` exists in `public/` folder
2. Verify JSON format is valid (use JSONLint)
3. Open browser console (F12) for error details
4. Check file size - very large files may need optimization

### Charts Not Displaying
**Problem**: Charts appear empty or frozen

**Solutions**:
1. Ensure date fields are properly formatted (YYYY-MM-DD)
2. Check that numeric fields are numbers, not strings
3. Verify comma-separated fields have no extra whitespace
4. Try with sample data first (provided sample file)

### Slow Performance
**Problem**: Dashboard loads slowly or freezes

**Solutions**:
1. Use a smaller dataset for testing (1,000-5,000 items)
2. Reduce number of items displayed in tables
3. Close other browser tabs
4. Clear browser cache
5. Use latest browser version

### Styling Issues
**Problem**: Colors or layout look incorrect

**Solutions**:
1. Clear browser cache (Ctrl+Shift+Del)
2. Hard refresh (Ctrl+Shift+R or Cmd+Shift+R)
3. Check that `App.css` is in `src/` folder
4. Verify MUI theme is correctly imported in App.jsx

## 📚 Project Structure Explanation

```
netflix-analytics-dashboard/
├── public/
│   ├── index.html           # Main HTML file
│   └── netflix_data.json    # Your Netflix dataset
│
├── src/
│   ├── components/
│   │   ├── Navigation.jsx   # Top navigation bar
│   │   └── KPICard.jsx      # Reusable metric card
│   │
│   ├── pages/               # Full page components (tabs)
│   │   ├── ExecutiveOverview.jsx
│   │   ├── ContentExplorer.jsx
│   │   ├── TrendIntelligence.jsx
│   │   ├── GeographicInsights.jsx
│   │   ├── GenreIntelligence.jsx
│   │   ├── CreatorHub.jsx
│   │   └── StrategicRecommendations.jsx
│   │
│   ├── utils/
│   │   ├── dataLoader.js        # Loads data from JSON
│   │   └── dataProcessing.js    # Processes and analyzes data
│   │
│   ├── App.jsx              # Main app component with routing
│   ├── App.css              # Styling
│   ├── index.js             # Entry point
│   └── index.css            # Global styles
│
├── package.json             # Dependencies and scripts
└── README.md               # Documentation
```

## 🎓 Learning Resources

- **React**: https://react.dev
- **Material-UI**: https://mui.com
- **Recharts**: https://recharts.org
- **React Router**: https://reactrouter.com

## 💡 Extension Ideas

1. **Add Export to PDF**: Use `react-pdf`
2. **Add Authentication**: Integrate with Auth0 or Firebase
3. **Add Real-time Updates**: Use WebSockets
4. **Add Filters**: More advanced filtering options
5. **Add Search**: Full-text search across dataset
6. **Add Comparisons**: Compare genres, countries, etc.
7. **Add Custom Reports**: User-defined report generation
8. **Add Bookmarks**: Save favorite views

## 📞 Support

For issues:
1. Check the troubleshooting section above
2. Review browser console for error messages
3. Verify data format with sample data first
4. Check that all files are in correct directories

## 📄 License

This dashboard is provided as-is for educational and analytical purposes.

---

**Version**: 1.0.0  
**Created**: November 2024  
**Compatible with**: React 18.2.0+, Node 14+
