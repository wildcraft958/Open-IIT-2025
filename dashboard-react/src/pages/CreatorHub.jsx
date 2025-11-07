import React, { useMemo } from 'react';
import { Box, Paper, Typography, Grid } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { processCreatorData } from '../utils/dataProcessing';

const CreatorHub = ({ data }) => {
  const creatorData = useMemo(() => processCreatorData(data), [data]);

  return (
    <Box sx={{ width: '100%', maxWidth: '100%', px: 0 }}>
      <Typography variant="h3" gutterBottom sx={{ color: '#E50914', mb: 3, px: 2 }}>
        Creator Hub
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
            Top Directors
          </Typography>
          <ResponsiveContainer width="100%" height={420}>
            <BarChart
              data={creatorData.topDirectors || []}
              layout="vertical"
              margin={{ top: 5, right: 30, left: 170, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis type="number" stroke="#fff" />
              <YAxis dataKey="name" type="category" stroke="#fff" width={160} />
              <Tooltip />
              <Bar dataKey="count" fill="#E50914" />
            </BarChart>
          </ResponsiveContainer>
        </Paper>
        <Paper sx={{ p: 3, backgroundColor: '#1f1f1f', width: '100%' }}>
          <Typography variant="h5" gutterBottom>
            Top Actors/Cast Members
          </Typography>
          <ResponsiveContainer width="100%" height={420}>
            <BarChart
              data={creatorData.topActors || []}
              layout="vertical"
              margin={{ top: 5, right: 30, left: 170, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis type="number" stroke="#fff" />
              <YAxis dataKey="name" type="category" stroke="#fff" width={160} />
              <Tooltip />
              <Bar dataKey="count" fill="#831010" />
            </BarChart>
          </ResponsiveContainer>
        </Paper>
      </Box>

      {/* Stats cards */}
      <Box
        sx={{
          display: 'grid',
          gap: 16,
          px: 2,
          mb: 4,
          gridTemplateColumns: 'repeat(auto-fill, minmax(420px, 1fr))',
        }}
      >
        <Paper sx={{ p: 3, backgroundColor: '#1f1f1f' }}>
          <Typography variant="h6" sx={{ color: '#E50914' }}>
            Most Prolific Director
          </Typography>
          <Typography variant="h4" sx={{ mt: 2, mb: 1 }}>
            {creatorData.topDirectors?.[0]?.name || 'N/A'}
          </Typography>
          <Typography variant="body2" sx={{ color: '#888' }}>
            {creatorData.topDirectors?.[0]?.count || 0} titles
          </Typography>
        </Paper>
        <Paper sx={{ p: 3, backgroundColor: '#1f1f1f' }}>
          <Typography variant="h6" sx={{ color: '#E50914' }}>
            Most Frequent Cast Member
          </Typography>
          <Typography variant="h4" sx={{ mt: 2, mb: 1 }}>
            {creatorData.topActors?.[0]?.name || 'N/A'}
          </Typography>
          <Typography variant="body2" sx={{ color: '#888' }}>
            {creatorData.topActors?.[0]?.count || 0} titles
          </Typography>
        </Paper>
      </Box>
    </Box>
  );
};

export default CreatorHub;
