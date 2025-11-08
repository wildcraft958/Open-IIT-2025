import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
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
  Assessment,
  Lightbulb,
} from '@mui/icons-material';
import Logo from '../assets/netflix.svg';

const Navigation = () => {
  const location = useLocation();

  const tabs = [
    { label: 'Executive Overview', path: '/', icon: <Dashboard /> },
    { label: 'Content Explorer', path: '/content', icon: <Search /> },
    { label: 'Trend Intelligence', path: '/trends', icon: <TrendingUp /> },
    { label: 'Geographic Insights', path: '/geographic', icon: <Map /> },
    { label: 'Genre Intelligence', path: '/genre', icon: <Category /> },
    { label: 'Creator Hub', path: '/creators', icon: <People /> },
    { label: 'Performance Analysis', path: '/performance', icon: <Assessment /> },
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
      <Toolbar
        sx={{
          minHeight: '68px !important',
          px: { xs: 1.5, md: 2 },
          gap: 2,
        }}
      >
        <Box
          component={Link}
          to="/"
          sx={{
            display: 'flex',
            alignItems: 'center',
            textDecoration: 'none',
            mr: { xs: 1, md: 2 },
            ml: 0.5,
            '&:hover img': { filter: 'brightness(1.2)' },
          }}
        >
          <img
            src={Logo}
            alt="Netflix"
            height="40"
            style={{ display: 'block' }}
          />
        </Box>
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
            minHeight: '100%',
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
                minHeight: '68px',
                px: { xs: 1.5, md: 2.25 },
                transition: 'all 0.25s ease',
                '&:hover': {
                  color: '#ffffff',
                  backgroundColor: 'rgba(229, 9, 20, 0.08)',
                },
                '&.Mui-selected': {
                  color: '#E50914',
                  backgroundColor: 'rgba(229, 9, 20, 0.18)',
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
