import React, { useMemo } from 'react';
import { Box, Paper, Typography, Grid } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { processGeographicData } from '../utils/dataProcessing';

const GeographicInsights = ({ data }) => {
  const geoData = useMemo(() => processGeographicData(data), [data]);

  return (
    <Box sx={{ width: '100%', maxWidth: '100%', px: 0 }}>
      <Typography variant="h3" gutterBottom sx={{ color: '#E50914', mb: 3, px: 2 }}>
        Geographic Insights
      </Typography>

      {/* Charts grid */}
      <Box
        sx={{
          display: 'grid',
          gap: 16,
          px: 2,
          mb: 3,
          gridTemplateColumns: 'repeat(auto-fill, minmax(520px, 1fr))',
          alignItems: 'stretch',
        }}
      >
        <Paper sx={{ p: 3, backgroundColor: '#1f1f1f', width: '100%' }}>
          <Typography variant="h5" gutterBottom>
            Top Content-Producing Countries
          </Typography>
          <ResponsiveContainer width="100%" height={420}>
            <BarChart
              data={geoData.topCountries || []}
              layout="vertical"
              margin={{ top: 5, right: 30, left: 170, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis type="number" stroke="#fff" />
              <YAxis dataKey="country" type="category" stroke="#fff" width={160} />
              <Tooltip />
              <Bar dataKey="count" fill="#E50914" />
            </BarChart>
          </ResponsiveContainer>
        </Paper>
        <Paper sx={{ p: 3, backgroundColor: '#1f1f1f', width: '100%' }}>
          <Typography variant="h5" gutterBottom>
            Regional Distribution
          </Typography>
          <ResponsiveContainer width="100%" height={420}>
            <BarChart data={geoData.regionalDistribution || []}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis dataKey="region" stroke="#fff" angle={-45} textAnchor="end" height={90} />
              <YAxis stroke="#fff" />
              <Tooltip />
              <Bar dataKey="count" fill="#831010" />
            </BarChart>
          </ResponsiveContainer>
        </Paper>
      </Box>

      {/* Geographic insight cards */}
      <Box sx={{ px: 2, mb: 4 }}>
        <Paper sx={{ p: 3, backgroundColor: '#1f1f1f', width: '100%' }}>
          <Typography variant="h5" gutterBottom sx={{ color: '#E50914' }}>
            Geographic Analysis
          </Typography>
          <Box
            sx={{
              display: 'grid',
              gap: 16,
              mt: 1,
              gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
              alignItems: 'stretch',
            }}
          >
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
          </Box>
        </Paper>
      </Box>

      {/* Interactive World Map (Choropleth) */}
      <Box sx={{ px: 2, mb: 6 }}>
        <Paper sx={{ p: 2, backgroundColor: '#1f1f1f', width: '100%' }}>
          <Typography variant="h5" gutterBottom>
            Interactive World Map
          </Typography>
          <Box sx={{ position: 'relative', width: '100%', height: { xs: 420, md: 560 }, borderRadius: 1, overflow: 'hidden', border: '1px solid #333' }}>
            <iframe
              title="World Choropleth"
              src="/world_choropleth.html"
              style={{ width: '100%', height: '100%', border: '0' }}
              loading="lazy"
            />
          </Box>
        </Paper>
      </Box>
    </Box>
  );
};

export default GeographicInsights;
