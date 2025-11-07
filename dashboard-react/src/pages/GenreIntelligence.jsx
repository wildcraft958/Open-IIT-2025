import React, { useMemo } from 'react';
import { Box, Paper, Typography, Grid, Chip } from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  Legend,
  Cell,
} from 'recharts';
import { TrendingUp, TrendingDown } from '@mui/icons-material';
import { processGenreData, genreMomentum, coOccurrenceMatrix, genreOverTime } from '../utils/dataProcessing';

const GenreIntelligence = ({ data }) => {
  const genreData = useMemo(() => processGenreData(data), [data]);
  const momentum = useMemo(() => genreMomentum(data, 24), [data]);
  const coOccur = useMemo(() => coOccurrenceMatrix(data, 15), [data]);
  const timeline = useMemo(() => genreOverTime(data, 8), [data]);

  const COLORS = ['#E50914', '#831010', '#B20710', '#FF0000', '#FF6B6B', '#DC143C', '#8B0000', '#A52A2A'];

  return (
    <Box sx={{ width: '100%', maxWidth: '100%', px: 0 }}>
      <Typography variant="h3" gutterBottom sx={{ color: '#E50914', mb: 3, px: 2 }}>
        Genre Intelligence
      </Typography>

      {/* Top Genres full width */}
      <Box sx={{ px: 2, mb: 3 }}>
        <Paper sx={{ p: 3, backgroundColor: '#1f1f1f', width: '100%' }}>
          <Typography variant="h5" gutterBottom>
            Top Genres by Content Volume
          </Typography>
          <ResponsiveContainer width="100%" height={440}>
            <BarChart data={genreData.topGenres || []}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis dataKey="genre" angle={-45} textAnchor="end" height={100} stroke="#fff" />
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
              <Bar dataKey="count" fill="#E50914" />
            </BarChart>
          </ResponsiveContainer>
        </Paper>
      </Box>

      {/* Genre Co-occurrence full width */}
      <Box sx={{ px: 2, mb: 3 }}>
        <Paper sx={{ p: 3, backgroundColor: '#1f1f1f', width: '100%' }}>
          <Typography variant="h5" gutterBottom>
            Genre Combinations (Most Common)
          </Typography>
          <ResponsiveContainer width="100%" height={360}>
            <BarChart data={genreData.topGenrePairs || []} layout="vertical" margin={{ top: 5, right: 30, left: 220, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis type="number" stroke="#fff" />
              <YAxis dataKey="pair" type="category" stroke="#fff" width={210} />
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

      {/* Genre Momentum & Co-occurrence */}
      <Box
        sx={{
          display: 'grid',
          gap: 16,
          px: 2,
          mb: 3,
          gridTemplateColumns: 'repeat(auto-fill, minmax(480px, 1fr))',
          alignItems: 'stretch',
        }}
      >
        {/* Momentum Bars */}
        <Paper sx={{ p: 3, backgroundColor: '#1f1f1f', width: '100%' }}>
          <Typography variant="h5" gutterBottom>
            Genre Momentum (Growth Trend)
          </Typography>
          <Typography variant="caption" sx={{ color: '#999', mb: 2, display: 'block' }}>
            Recent vs. previous 6-month comparison
          </Typography>
          <ResponsiveContainer width="100%" height={360}>
            <BarChart data={momentum} layout="vertical" margin={{ top: 5, right: 30, left: 120, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis type="number" stroke="#fff" tickFormatter={(val) => `${val}%`} />
              <YAxis dataKey="genre" type="category" stroke="#fff" width={110} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1e1e1e',
                  border: '1px solid #E50914',
                  borderRadius: '8px',
                  color: '#fff',
                }}
                formatter={(value) => [`${value}%`, 'Change']}
              />
              <Bar dataKey="delta" fill={(entry) => entry.delta >= 0 ? '#4caf50' : '#f44336'}>
                {momentum.map((entry, index) => (
                  <Cell key={`momentum-${index}`} fill={entry.delta >= 0 ? '#4caf50' : '#f44336'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Paper>

        {/* Co-occurrence Matrix Heatmap */}
        <Paper sx={{ p: 3, backgroundColor: '#1f1f1f', width: '100%' }}>
          <Typography variant="h5" gutterBottom>
            Genre Co-occurrence Network
          </Typography>
          <Typography variant="caption" sx={{ color: '#999', mb: 2, display: 'block' }}>
            Most frequently paired genres (bubble size = frequency)
          </Typography>
          <Box sx={{ maxHeight: 400, overflowY: 'auto', mt: 2 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {coOccur.map((item, idx) => (
                <Box
                  key={idx}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                    p: 1.5,
                    backgroundColor: '#2a2a2a',
                    borderRadius: 1,
                    border: '1px solid rgba(229,9,20,0.2)',
                  }}
                >
                  <Box
                    sx={{
                      width: Math.max(20, Math.min(60, item.weight)),
                      height: Math.max(20, Math.min(60, item.weight)),
                      borderRadius: '50%',
                      backgroundColor: '#E50914',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      flexShrink: 0,
                    }}
                  >
                    {item.count}
                  </Box>
                  <Typography variant="body2" sx={{ flex: 1, fontSize: '0.9rem' }}>
                    {item.pair}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>
        </Paper>
      </Box>

      {/* Stream Chart - Genre Over Time */}
      <Box sx={{ px: 2, mb: 3 }}>
        <Paper sx={{ p: 3, backgroundColor: '#1f1f1f', width: '100%' }}>
          <Typography variant="h5" gutterBottom>
            Genre Evolution Stream (Top 8 Genres Over Time)
          </Typography>
          <ResponsiveContainer width="100%" height={400}>
            <AreaChart data={timeline}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis dataKey="year" stroke="#fff" />
              <YAxis stroke="#fff" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1e1e1e',
                  border: '1px solid #E50914',
                  borderRadius: '8px',
                  color: '#fff',
                }}
              />
              <Legend />
              {Object.keys(timeline[0] || {})
                .filter(key => key !== 'year')
                .slice(0, 8)
                .map((genre, idx) => (
                  <Area
                    key={genre}
                    type="monotone"
                    dataKey={genre}
                    stackId="1"
                    stroke={COLORS[idx % COLORS.length]}
                    fill={COLORS[idx % COLORS.length]}
                    fillOpacity={0.7}
                  />
                ))}
            </AreaChart>
          </ResponsiveContainer>
        </Paper>
      </Box>

      {/* Genre Statistics responsive grid */}
      <Box
        sx={{
          display: 'grid',
          gap: 16,
          px: 2,
          mb: 4,
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
        }}
      >
        <Paper sx={{ p: 3, backgroundColor: '#1f1f1f' }}>
          <Typography variant="h6" sx={{ color: '#E50914' }}>
            Total Genres
          </Typography>
          <Typography variant="h3" sx={{ mt: 2, mb: 1 }}>
            {genreData.topGenres?.length || 0}
          </Typography>
          <Typography variant="body2" sx={{ color: '#888' }}>
            Unique genre categories in catalog
          </Typography>
        </Paper>
        <Paper sx={{ p: 3, backgroundColor: '#1f1f1f' }}>
          <Typography variant="h6" sx={{ color: '#E50914' }}>
            Most Popular Genre
          </Typography>
          <Typography variant="h3" sx={{ mt: 2, mb: 1 }}>
            {genreData.topGenres?.[0]?.genre || 'N/A'}
          </Typography>
          <Typography variant="body2" sx={{ color: '#888' }}>
            {genreData.topGenres?.[0]?.count || 0} titles
          </Typography>
        </Paper>
        <Paper sx={{ p: 3, backgroundColor: '#1f1f1f' }}>
          <Typography variant="h6" sx={{ color: '#E50914' }}>
            Genre Diversity
          </Typography>
          <Typography variant="h3" sx={{ mt: 2, mb: 1 }}>
            High
          </Typography>
          <Typography variant="body2" sx={{ color: '#888' }}>
            Wide range of content types
          </Typography>
        </Paper>
      </Box>
    </Box>
  );
};

export default GenreIntelligence;
