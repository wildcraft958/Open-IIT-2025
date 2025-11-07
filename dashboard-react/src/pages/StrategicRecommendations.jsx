import React from 'react';
import { Box, Paper, Typography, Grid, Card, CardContent } from '@mui/material';
import { CheckCircle, Lightbulb, TrendingUp } from '@mui/icons-material';

const StrategicRecommendations = ({ data }) => {
  const recommendations = [
    {
      category: 'Content Strategy',
      icon: <Lightbulb sx={{ color: '#E50914', fontSize: 40 }} />,
      items: [
        'Diversify genre portfolio to capture underrepresented categories',
        'Increase investment in high-performing genres',
        'Balance between blockbuster releases and niche content',
        'Expand original content production',
      ],
    },
    {
      category: 'Geographic Expansion',
      icon: <TrendingUp sx={{ color: '#E50914', fontSize: 40 }} />,
      items: [
        'Focus on emerging content producers in Asia-Pacific region',
        'Strengthen partnerships with European production studios',
        'Increase investment in Latin American content',
        'Develop localized content strategies for key markets',
      ],
    },
    {
      category: 'Audience Targeting',
      icon: <CheckCircle sx={{ color: '#E50914', fontSize: 40 }} />,
      items: [
        'Create genre-specific recommendation algorithms',
        'Develop targeted marketing campaigns by region',
        'Balance family-friendly and mature content offerings',
        'Personalize content discovery experience',
      ],
    },
  ];

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h3" gutterBottom sx={{ color: '#E50914', mb: 4 }}>
        Strategic Recommendations
      </Typography>

      {/* Executive Summary */}
      <Paper sx={{ p: 3, mb: 4, backgroundColor: '#1f1f1f', borderLeft: '4px solid #E50914' }}>
        <Typography variant="h5" sx={{ color: '#E50914', mb: 2 }}>
          Executive Summary
        </Typography>
        <Typography variant="body1" paragraph>
          Based on comprehensive analysis of Netflix's content catalog, the following strategic
          recommendations are prioritized to enhance platform competitiveness, maximize subscriber
          engagement, and optimize content investment ROI.
        </Typography>
      </Paper>

      {/* Recommendations by Category */}
      {recommendations.map((rec, index) => (
        <Grid key={index} container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
              {rec.icon}
              <Typography variant="h5" sx={{ color: '#E50914' }}>
                {rec.category}
              </Typography>
            </Box>
            <Grid container spacing={2}>
              {rec.items.map((item, itemIndex) => (
                <Grid item xs={12} md={6} key={itemIndex}>
                  <Card sx={{ backgroundColor: '#2a2a2a', height: '100%' }}>
                    <CardContent>
                      <Box sx={{ display: 'flex', gap: 2 }}>
                        <CheckCircle sx={{ color: '#E50914', flexShrink: 0 }} />
                        <Typography variant="body2">{item}</Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Grid>
        </Grid>
      ))}

      {/* Implementation Roadmap */}
      <Paper sx={{ p: 3, backgroundColor: '#1f1f1f' }}>
        <Typography variant="h5" sx={{ color: '#E50914', mb: 3 }}>
          Implementation Roadmap
        </Typography>
        <Grid container spacing={2}>
          {[
            { phase: 'Phase 1: Q1-Q2', title: 'Analysis & Planning', color: '#E50914' },
            { phase: 'Phase 2: Q3-Q4', title: 'Strategy Development', color: '#831010' },
            { phase: 'Phase 3: Year 2', title: 'Execution & Optimization', color: '#B20710' },
          ].map((phase, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Box sx={{ p: 2, backgroundColor: '#2a2a2a', borderLeft: `4px solid ${phase.color}` }}>
                <Typography variant="subtitle2" sx={{ color: phase.color }}>
                  {phase.phase}
                </Typography>
                <Typography variant="h6" sx={{ mt: 1 }}>
                  {phase.title}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Paper>
    </Box>
  );
};

export default StrategicRecommendations;
