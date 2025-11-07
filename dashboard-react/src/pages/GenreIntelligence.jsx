import React, { useMemo } from 'react';
import { Box, Paper, Typography, Grid } from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { processGenreData } from '../utils/dataProcessing';

const GenreIntelligence = ({ data }) => {
  const genreData = useMemo(() => processGenreData(data), [data]);

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
