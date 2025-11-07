import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Navigation from './components/Navigation';
import ExecutiveOverview from './pages/ExecutiveOverview';
import ContentExplorer from './pages/ContentExplorer';
import TrendIntelligence from './pages/TrendIntelligence';
import GeographicInsights from './pages/GeographicInsights';
import GenreIntelligence from './pages/GenreIntelligence';
import CreatorHub from './pages/CreatorHub';
import StrategicRecommendations from './pages/StrategicRecommendations';
import { loadNetflixData } from './utils/dataLoader';
import './App.css';

// Create a dark theme with better visibility
const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#E50914',
      light: '#ff1f2e',
      dark: '#b00710',
    },
    secondary: {
      main: '#00d4ff',
    },
    background: {
      default: '#0a0a0a',
      paper: '#1e1e1e',
    },
    text: {
      primary: '#ffffff',
      secondary: '#b3b3b3',
    },
  },
  typography: {
    fontFamily: '-apple-system, BlinkMacSystemFont, "Inter", "SF Pro Display", "Segoe UI", "Roboto", "Helvetica Neue", Arial, sans-serif',
    h2: {
      fontWeight: 700,
      fontSize: '2.5rem',
      letterSpacing: '-0.5px',
    },
    h3: {
      fontWeight: 700,
      fontSize: '2rem',
      letterSpacing: '-0.5px',
    },
    h5: {
      fontWeight: 600,
      fontSize: '1.25rem',
      letterSpacing: '-0.3px',
      color: '#ffffff',
    },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'linear-gradient(145deg, #1e1e1e, #252525)',
          border: '1px solid rgba(255, 255, 255, 0.05)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.6)',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundImage: 'linear-gradient(145deg, #1e1e1e, #252525)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0 12px 48px rgba(229, 9, 20, 0.3)',
            borderColor: 'rgba(229, 9, 20, 0.3)',
          },
        },
      },
    },
  },
});

function App() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const netflixData = await loadNetflixData();
        setData(netflixData);
      } catch (error) {
        console.error('Error loading Netflix data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        <div className="loading">
          <div className="loading-spinner"></div>
          <div style={{ color: '#E50914', fontSize: '28px', fontWeight: 700 }}>Loading Netflix Analytics...</div>
        </div>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Router>
        <div className="App">
          <Navigation />
          <div className="content">
            <Routes>
              <Route path="/" element={<ExecutiveOverview data={data} />} />
              <Route path="/content" element={<ContentExplorer data={data} />} />
              <Route path="/trends" element={<TrendIntelligence data={data} />} />
              <Route path="/geographic" element={<GeographicInsights data={data} />} />
              <Route path="/genre" element={<GenreIntelligence data={data} />} />
              <Route path="/creators" element={<CreatorHub data={data} />} />
              <Route path="/recommendations" element={<StrategicRecommendations data={data} />} />
            </Routes>
          </div>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
