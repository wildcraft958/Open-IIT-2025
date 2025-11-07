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
  const topGrowthGenres = momentum.slice(0, 3).filter(g => g.delta > 0);
  const decliningGenres = momentum.slice(-3).filter(g => g.delta < 0);
  const topRegions = regionalDeltas.regionList.slice(0, 3);

  const recommendations = [
    {
      category: 'Content Freshness Strategy',
      icon: <Star sx={{ color: '#E50914', fontSize: 40 }} />,
      items: [
        `Current freshness score: ${freshness.score}% (${freshness.category}) - ${freshness.score < 20 ? 'Accelerate new content additions' : 'Maintain strong momentum'}`,
        `${freshness.recentCount} titles added in the last year - ${freshness.score >= 20 ? 'Strong pipeline' : 'Consider increasing acquisition rate'}`,
        `Average content age: ${freshness.avgDaysSinceAdded} days - Balance catalog freshness with evergreen content`,
        'Prioritize exclusive releases to boost freshness perception',
      ],
    },
    {
      category: 'Genre Portfolio Optimization',
      icon: <Lightbulb sx={{ color: '#E50914', fontSize: 40 }} />,
      items: [
        topGrowthGenres.length > 0 
          ? `High-momentum genres: ${topGrowthGenres.map(g => `${g.genre} (+${g.delta}%)`).join(', ')} - Double down on these categories`
          : 'Diversify genre portfolio to capture underrepresented categories',
        decliningGenres.length > 0
          ? `Declining genres: ${decliningGenres.map(g => `${g.genre} (${g.delta}%)`).join(', ')} - Re-evaluate investment or refresh content`
          : 'Monitor genre trends for early intervention opportunities',
        'Balance between blockbuster releases and niche content',
        'Expand original content production in high-growth genres',
      ],
    },
    {
      category: 'Geographic Expansion',
      icon: <TrendingUp sx={{ color: '#E50914', fontSize: 40 }} />,
      items: [
        topRegions.length > 0
          ? `Leading regions: ${topRegions.map(r => r.region).join(', ')} - Maintain strong presence`
          : 'Focus on emerging content producers in Asia-Pacific region',
        'Strengthen partnerships with European production studios',
        'Increase investment in Latin American content for growing market',
        'Develop localized content strategies for key markets',
      ],
    },
    {
      category: 'Quality & Completeness',
      icon: <Warning sx={{ color: '#E50914', fontSize: 40 }} />,
      items: [
        `Data completeness: ${quality.completeness}% - ${quality.completeness < 90 ? 'Improve metadata collection' : 'Excellent data quality'}`,
        `${quality.withoutRating} titles missing rating info - Update content classification`,
        `${quality.withoutGenre} titles without genres - Enhance categorization for better discovery`,
        `Catalog vintage: Avg release year ${quality.avgReleaseYear} - Balance classic and contemporary content`,
      ],
    },
    {
      category: 'Audience Targeting',
      icon: <CheckCircle sx={{ color: '#E50914', fontSize: 40 }} />,
      items: [
        'Create genre-specific recommendation algorithms based on momentum data',
        'Develop targeted marketing campaigns by region and genre performance',
        `Top rating: ${quality.topRatings?.[0]?.rating || 'N/A'} (${quality.topRatings?.[0]?.count || 0} titles) - Optimize content mix`,
        'Personalize content discovery experience using viewing patterns',
      ],
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
                <Typography variant="caption" sx={{ color: '#999' }}>Top Growth Genre</Typography>
                <Typography variant="h6" sx={{ color: '#B20710', mt: 1 }}>
                  {topGrowthGenres[0]?.genre || 'N/A'}
                </Typography>
                <Typography variant="caption" sx={{ color: '#4caf50', mt: 1, display: 'block' }}>
                  +{topGrowthGenres[0]?.delta || 0}% momentum
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
