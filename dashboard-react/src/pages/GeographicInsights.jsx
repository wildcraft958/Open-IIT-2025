import React, { useMemo } from 'react';
import { Box, Paper, Typography, Grid } from '@mui/material';
import { ComposableMap, Geographies, Geography } from 'react-simple-maps';
import { scaleQuantize } from 'd3-scale';
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
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1e1e1e',
                  border: '1px solid #E50914',
                  borderRadius: '8px',
                  color: '#fff',
                }}
                cursor={{ fill: 'rgba(229, 9, 20, 0.1)' }}
              />
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
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1e1e1e',
                  border: '1px solid #E50914',
                  borderRadius: '8px',
                  color: '#fff',
                }}
                cursor={{ fill: 'rgba(229, 9, 20, 0.1)' }}
              />
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
          <Typography variant="h5" gutterBottom sx={{ color: '#E50914' }}>
            Global Production Footprint
          </Typography>
          <Typography variant="body2" sx={{ mb: 2, color: '#bbb' }}>
            Choropleth highlights breadth of Netflix catalog production origins. Darker red indicates higher title count.
          </Typography>
          <Box sx={{ position: 'relative', width: '100%', height: { xs: 420, md: 560 }, borderRadius: 1, overflow: 'hidden', border: '1px solid #333', mb: 4 }}>
            <ComposableMap
              projectionConfig={{ scale: 145 }}
              style={{ width: '100%', height: '100%', background: 'transparent' }}
            >
              <Geographies geography="https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json">
                {({ geographies }) => {
                  const counts = geoData.countryCounts || {};
                  const aliases = {
                    'United States': 'United States of America',
                    'Russia': 'Russian Federation',
                    'Iran': 'Iran, Islamic Republic of',
                    'South Korea': 'Korea, Republic of',
                    'North Korea': "Korea, Democratic People's Republic of",
                    'Vietnam': 'Viet Nam',
                    'Syria': 'Syrian Arab Republic',
                    'Türkiye': 'Turkey',
                    'Congo': 'Congo, Republic of the',
                    'Congo (Democratic Republic of the)': 'Congo, the Democratic Republic of the',
                    'Tanzania': 'Tanzania, United Republic of',
                    'Bolivia': 'Bolivia, Plurinational State of',
                    'Venezuela': 'Venezuela, Bolivarian Republic of',
                    'Laos': "Lao People's Democratic Republic",
                    'Moldova': 'Moldova, Republic of',
                    'Brunei': 'Brunei Darussalam',
                    'Cape Verde': 'Cabo Verde',
                    'Czechia': 'Czech Republic',
                    'Eswatini': 'Swaziland',
                    'Micronesia': 'Micronesia, Federated States of',
                    'Palestine': 'Palestine, State of',
                    'São Tomé and Príncipe': 'Sao Tome and Principe',
                  };
                  const getCountByGeoName = (geoName) => {
                    // try direct match
                    if (counts[geoName] != null) return counts[geoName];
                    // try reverse alias: when atlas uses formal name
                    const alt = Object.keys(aliases).find(k => aliases[k] === geoName);
                    if (alt && counts[alt] != null) return counts[alt];
                    // try alias where input used formal but counts have common
                    const common = aliases[geoName];
                    if (common && counts[common] != null) return counts[common];
                    return 0;
                  };
                  const max = Math.max(1, ...Object.values(counts));
                  const colorScale = scaleQuantize().domain([0, max]).range([
                    '#fff5f0', '#fee0d2', '#fcbba1', '#fc9272', '#fb6a4a', '#ef3b2c', '#cb181d', '#99000d'
                  ]);

                  return geographies.map(geo => {
                    const name = geo.properties.name || geo.properties.NAME || '';
                    const value = getCountByGeoName(name);
                    const fill = value ? colorScale(value) : '#1e1e1e';
                    return (
                      <Geography
                        key={geo.rsmKey}
                        geography={geo}
                        fill={fill}
                        stroke="#333"
                        style={{ default: { outline: 'none' }, hover: { outline: 'none' }, pressed: { outline: 'none' } }}
                        tabIndex={-1}
                      >
                      </Geography>
                    );
                  });
                }}
              </Geographies>
            </ComposableMap>
          </Box>
          {/* Removed redundant external Plotly embed; Recharts bar above already shows top countries */}
        </Paper>
      </Box>
    </Box>
  );
};

export default GeographicInsights;
