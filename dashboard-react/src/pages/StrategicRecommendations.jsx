import React, { useMemo } from 'react';
import { Box, Paper, Typography, Grid, Card, CardContent, Chip } from '@mui/material';
import { CheckCircle, Lightbulb, TrendingUp, Warning, Star } from '@mui/icons-material';
import { 
  computeFreshness, 
  genreMomentum, 
  regionalDistributionWithDeltas,
  qualityReport
} from '../utils/dataProcessing';

const StrategicRecommendations = ({ data }) => {
  const freshness = useMemo(() => computeFreshness(data), [data]);
  const momentum = useMemo(() => genreMomentum(data, 24), [data]);
  const regionalDeltas = useMemo(() => regionalDistributionWithDeltas(data), [data]);
  const quality = useMemo(() => qualityReport(data), [data]);

  // Generate data-driven insights
  const topGrowthGenres = momentum.length > 0 ? momentum.slice(0, 3).filter(g => g.delta > 0) : [];
  const topRegions = regionalDeltas.regionList.slice(0, 3);
  
  // Fallback: use most popular genres if momentum data unavailable
  const genreDistribution = useMemo(() => {
    if (!data || data.length === 0) return [];
    const genreCounts = {};
    data.forEach(item => {
      (item.genres || []).forEach(genre => {
        genreCounts[genre] = (genreCounts[genre] || 0) + 1;
      });
    });
    return Object.entries(genreCounts)
      .map(([genre, count]) => ({ genre, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }, [data]);

  const recommendations = [
    {
      category: '1. Invest in African & Southeast Asian Content Hubs',
      priority: 'HIGH',
      icon: <TrendingUp sx={{ color: '#E50914', fontSize: 40 }} />,
      rationale: 'Content production from Africa and Southeast Asia is critically underrepresented, signaling a "blue ocean" opportunity.',
      items: [
        'Earmark $100M strategic fund for co-productions in Nigeria, South Africa, and Indonesia',
        'Establish regional production offices in Lagos, Jakarta, and Cape Town',
        'Partner with local studios and filmmakers to create authentic regional content',
        'Target first-mover advantage in underserved markets with high growth potential',
      ],
      timeline: 'Q2 2026 - Q4 2027',
    },
    {
      category: '2. Rebalance the Ratings Portfolio',
      priority: 'HIGH',
      icon: <Star sx={{ color: '#E50914', fontSize: 40 }} />,
      rationale: 'Large portion of catalog is TV-MA rated, presenting opportunity to capture underserved family and teen demographics.',
      items: [
        'Launch dedicated initiative for high-quality "Family" (PG, TV-PG) content',
        'Greenlight 10 new "TV-PG" or "TV-14" series targeting teen audiences',
        'Acquire proven family franchises and award-winning children\'s programming',
        'Create family-friendly content blocks in UI to improve discoverability',
      ],
      timeline: 'Q1 2026 onwards',
    },
    {
      category: '3. Shift Content Additions to Q1',
      priority: 'MEDIUM',
      icon: <Lightbulb sx={{ color: '#E50914', fontSize: 40 }} />,
      rationale: 'Q4 content loading creates market saturation. Counter-programming with Q1 releases captures post-holiday audiences.',
      items: [
        'Move two tentpole releases from October/November to January/February',
        'Reduce marketing noise by avoiding Q4 clustering of major launches',
        'Capture captive post-holiday audience with premium content drops',
        'Analyze Q1 performance to refine future release strategies',
      ],
      timeline: 'Q1 2027',
    },
    {
      category: '4. Diversify the Creator Pool',
      priority: 'HIGH',
      icon: <CheckCircle sx={{ color: '#E50914', fontSize: 40 }} />,
      rationale: 'Dense collaboration clusters indicate over-reliance on small talent pool. Diversification brings fresh perspectives.',
      items: [
        'Implement "New Voices" program funding first-time directors and writers',
        'Target 20% of new productions from emerging talent by 2027',
        'Mentor underrepresented creators from diverse regions and backgrounds',
        'Create accelerator programs for indie filmmakers in emerging markets',
      ],
      timeline: 'Q2 2026 - Ongoing',
    },
    {
      category: '5. Acquire High-Performing Niche Genres',
      priority: 'MEDIUM',
      icon: <Warning sx={{ color: '#E50914', fontSize: 40 }} />,
      rationale: 'Genres like Documentaries and Stand-Up show high engagement but lower volume. High-revenue genres underrepresented.',
      items: [
        'Actively pursue award-winning documentaries and premium stand-up specials',
        'Increase investment in Musicals and high-concept Sci-Fi (underrepresented high-revenue genres)',
        'Create exclusive deals with top documentary filmmakers and comedians',
        'Satisfy engaged niche audiences while diversifying content portfolio',
      ],
      timeline: 'Q3 2026 onwards',
    },
    {
      category: 'Data Quality Improvements',
      priority: 'LOW',
      icon: <Warning sx={{ color: '#E50914', fontSize: 40 }} />,
      rationale: 'Missing metadata (30% directors, 10% cast, 7% country) limits analysis and content discovery.',
      items: [
        `Current data completeness: ${quality.completeness}% - Target 95%+ by end of 2026`,
        `Backfill ${quality.withoutRating} titles missing rating information`,
        `Update ${quality.withoutGenre} titles without genre tags for better discovery`,
        'Implement automated metadata enrichment pipelines using TMDB/IMDB APIs',
      ],
      timeline: 'Q4 2025 - Q2 2026',
    },
  ];

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h3" gutterBottom sx={{ color: '#E50914', mb: 4 }}>
        Strategic Recommendations
      </Typography>

      {/* Key Metrics Dashboard */}
      <Box sx={{ mb: 4 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ backgroundColor: '#1f1f1f', borderLeft: '4px solid #E50914' }}>
              <CardContent>
                <Typography variant="caption" sx={{ color: '#999' }}>Freshness Score</Typography>
                <Typography variant="h4" sx={{ color: '#E50914', mt: 1 }}>{freshness.score}%</Typography>
                <Chip 
                  label={freshness.category} 
                  size="small" 
                  sx={{ 
                    mt: 1, 
                    backgroundColor: freshness.score >= 20 ? '#2e7d32' : '#ed6c02',
                    color: '#fff'
                  }} 
                />
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ backgroundColor: '#1f1f1f', borderLeft: '4px solid #831010' }}>
              <CardContent>
                <Typography variant="caption" sx={{ color: '#999' }}>Data Quality</Typography>
                <Typography variant="h4" sx={{ color: '#831010', mt: 1 }}>{quality.completeness}%</Typography>
                <Typography variant="caption" sx={{ color: '#666', mt: 1, display: 'block' }}>
                  {quality.completeRecords} complete records
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ backgroundColor: '#1f1f1f', borderLeft: '4px solid #B20710' }}>
              <CardContent>
                <Typography variant="caption" sx={{ color: '#999' }}>
                  {topGrowthGenres.length > 0 ? 'Top Growth Genre' : 'Most Popular Genre'}
                </Typography>
                <Typography variant="h6" sx={{ color: '#B20710', mt: 1 }}>
                  {topGrowthGenres[0]?.genre || genreDistribution[0]?.genre || 'N/A'}
                </Typography>
                <Typography variant="caption" sx={{ color: topGrowthGenres.length > 0 ? '#4caf50' : '#666', mt: 1, display: 'block' }}>
                  {topGrowthGenres.length > 0 
                    ? `+${topGrowthGenres[0]?.delta}% momentum`
                    : `${genreDistribution[0]?.count?.toLocaleString() || 0} titles`
                  }
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ backgroundColor: '#1f1f1f', borderLeft: '4px solid #FF0000' }}>
              <CardContent>
                <Typography variant="caption" sx={{ color: '#999' }}>Leading Region</Typography>
                <Typography variant="h6" sx={{ color: '#FF0000', mt: 1 }}>
                  {topRegions[0]?.region || 'N/A'}
                </Typography>
                <Typography variant="caption" sx={{ color: '#666', mt: 1, display: 'block' }}>
                  {topRegions[0]?.count || 0} titles
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>

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
        <Typography variant="body2" sx={{ color: '#999' }}>
          Analysis covers {quality.total} titles with {quality.completeness}% data completeness. 
          Current content freshness rated as <strong>{freshness.category}</strong> with {freshness.recentCount} recent additions.
        </Typography>
      </Paper>

      {/* Recommendations by Category */}
      {recommendations.map((rec, index) => (
        <Paper key={index} sx={{ p: 3, mb: 3, backgroundColor: '#1f1f1f', borderLeft: '4px solid #E50914' }}>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, mb: 2 }}>
            {rec.icon}
            <Box sx={{ flex: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                <Typography variant="h5" sx={{ color: '#E50914' }}>
                  {rec.category}
                </Typography>
                {rec.priority && (
                  <Chip 
                    label={rec.priority} 
                    size="small"
                    sx={{ 
                      backgroundColor: rec.priority === 'HIGH' ? '#d32f2f' : rec.priority === 'MEDIUM' ? '#ff9800' : '#757575',
                      color: '#fff',
                      fontWeight: 600
                    }}
                  />
                )}
              </Box>
              {rec.rationale && (
                <Typography variant="body2" sx={{ color: '#aaa', mb: 2, fontStyle: 'italic' }}>
                  <strong>Rationale:</strong> {rec.rationale}
                </Typography>
              )}
              {rec.timeline && (
                <Chip 
                  label={`Timeline: ${rec.timeline}`} 
                  size="small"
                  variant="outlined"
                  sx={{ mb: 2, borderColor: '#E50914', color: '#E50914' }}
                />
              )}
            </Box>
          </Box>
          <Grid container spacing={2}>
            {rec.items.map((item, itemIndex) => (
              <Grid item xs={12} md={6} key={itemIndex}>
                <Card sx={{ backgroundColor: '#2a2a2a', height: '100%', border: '1px solid #333' }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', gap: 2 }}>
                      <CheckCircle sx={{ color: '#4caf50', flexShrink: 0, mt: 0.5 }} />
                      <Typography variant="body2" sx={{ lineHeight: 1.6 }}>{item}</Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Paper>
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
