import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Tabs,
  Tab,
  Box,
} from '@mui/material';
import {
  Dashboard,
  Search,
  TrendingUp,
  Map,
  Category,
  People,
  Lightbulb,
} from '@mui/icons-material';

const Navigation = () => {
  const location = useLocation();

  const tabs = [
    { label: 'Executive Overview', path: '/', icon: <Dashboard /> },
    { label: 'Content Explorer', path: '/content', icon: <Search /> },
    { label: 'Trend Intelligence', path: '/trends', icon: <TrendingUp /> },
    { label: 'Geographic Insights', path: '/geographic', icon: <Map /> },
    { label: 'Genre Intelligence', path: '/genre', icon: <Category /> },
    { label: 'Creator Hub', path: '/creators', icon: <People /> },
    { label: 'Recommendations', path: '/recommendations', icon: <Lightbulb /> },
  ];

  return (
    <AppBar 
      position="sticky" 
      sx={{ 
        background: 'linear-gradient(135deg, #000000 0%, #1a0000 100%)',
        boxShadow: '0 4px 20px rgba(229, 9, 20, 0.3)',
        borderBottom: '2px solid rgba(229, 9, 20, 0.3)',
      }}
    >
      <Toolbar sx={{ minHeight: '72px !important', px: 3 }}>
        <Typography 
          variant="h4" 
          sx={{ 
            color: '#E50914', 
            fontWeight: 900,
            mr: 6,
            textShadow: '0 0 20px rgba(229, 9, 20, 0.6)',
            letterSpacing: '1px',
          }}
        >
          NETFLIX ANALYTICS
        </Typography>
        <Tabs
          value={location.pathname}
          variant="scrollable"
          scrollButtons="auto"
          sx={{ 
            flexGrow: 1,
            '& .MuiTabs-indicator': {
              height: '4px',
              backgroundColor: '#E50914',
              borderRadius: '4px 4px 0 0',
              boxShadow: '0 0 10px rgba(229, 9, 20, 0.8)',
            },
          }}
        >
          {tabs.map((tab) => (
            <Tab
              key={tab.path}
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  {React.cloneElement(tab.icon, { fontSize: 'small' })}
                  <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{tab.label}</span>
                </Box>
              }
              value={tab.path}
              component={Link}
              to={tab.path}
              sx={{ 
                color: '#b3b3b3',
                minHeight: '72px',
                px: 3,
                transition: 'all 0.3s ease',
                '&:hover': {
                  color: '#ffffff',
                  backgroundColor: 'rgba(229, 9, 20, 0.1)',
                },
                '&.Mui-selected': {
                  color: '#E50914',
                  backgroundColor: 'rgba(229, 9, 20, 0.15)',
                },
              }}
            />
          ))}
        </Tabs>
      </Toolbar>
    </AppBar>
  );
};

export default Navigation;
