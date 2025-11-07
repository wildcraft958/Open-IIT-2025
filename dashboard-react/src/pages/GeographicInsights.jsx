import React, { useMemo } from 'react';
import { Box, Paper, Typography, Grid } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { processGeographicData } from '../utils/dataProcessing';

const GeographicInsights = ({ data }) => {
  const geoData = useMemo(() => processGeographicData(data), [data]);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h3" gutterBottom sx={{ color: '#E50914', mb: 4 }}>
        Geographic Insights
      </Typography>

      {/* Top Countries */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, backgroundColor: '#1f1f1f' }}>
            <Typography variant="h5" gutterBottom>
              Top Content-Producing Countries
            </Typography>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart
                data={geoData.topCountries || []}
                layout="vertical"
                margin={{ top: 5, right: 30, left: 150, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis type="number" stroke="#fff" />
                <YAxis dataKey="country" type="category" stroke="#fff" width={140} />
                <Tooltip />
                <Bar dataKey="count" fill="#E50914" />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Regional Distribution */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, backgroundColor: '#1f1f1f' }}>
            <Typography variant="h5" gutterBottom>
              Regional Distribution
            </Typography>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={geoData.regionalDistribution || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis dataKey="region" stroke="#fff" angle={-45} textAnchor="end" height={80} />
                <YAxis stroke="#fff" />
                <Tooltip />
                <Bar dataKey="count" fill="#831010" />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>

      {/* Geographic Insights Cards */}
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper sx={{ p: 3, backgroundColor: '#1f1f1f' }}>
            <Typography variant="h5" gutterBottom sx={{ color: '#E50914' }}>
              Geographic Analysis
            </Typography>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12} md={4}>
                <Box sx={{ p: 2, backgroundColor: '#2a2a2a', borderLeft: '4px solid #E50914' }}>
                  <Typography variant="h6" sx={{ color: '#E50914' }}>
                    Total Countries
                  </Typography>
                  <Typography variant="h4" sx={{ mt: 1, color: '#fff' }}>
                    {geoData.topCountries?.length || 0}
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#888' }}>
                    Represented in catalog
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={4}>
                <Box sx={{ p: 2, backgroundColor: '#2a2a2a', borderLeft: '4px solid #E50914' }}>
                  <Typography variant="h6" sx={{ color: '#E50914' }}>
                    Top Region
                  </Typography>
                  <Typography variant="h4" sx={{ mt: 1, color: '#fff' }}>
                    {geoData.regionalDistribution?.sort((a, b) => b.count - a.count)[0]?.region || 'N/A'}
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#888' }}>
                    Leading content source
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={4}>
                <Box sx={{ p: 2, backgroundColor: '#2a2a2a', borderLeft: '4px solid #E50914' }}>
                  <Typography variant="h6" sx={{ color: '#E50914' }}>
                    Top Country
                  </Typography>
                  <Typography variant="h4" sx={{ mt: 1, color: '#fff' }}>
                    {geoData.topCountries?.[0]?.country || 'N/A'}
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#888' }}>
                    Most represented
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default GeographicInsights;
