import React, { useMemo } from 'react';
import { Box, Paper, Typography, Grid } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { processCreatorData } from '../utils/dataProcessing';

const CreatorHub = ({ data }) => {
  const creatorData = useMemo(() => processCreatorData(data), [data]);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h3" gutterBottom sx={{ color: '#E50914', mb: 4 }}>
        Creator Hub
      </Typography>

      {/* Top Directors and Actors */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, backgroundColor: '#1f1f1f' }}>
            <Typography variant="h5" gutterBottom>
              Top Directors
            </Typography>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart
                data={creatorData.topDirectors || []}
                layout="vertical"
                margin={{ top: 5, right: 30, left: 150, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis type="number" stroke="#fff" />
                <YAxis dataKey="name" type="category" stroke="#fff" width={140} />
                <Tooltip />
                <Bar dataKey="count" fill="#E50914" />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, backgroundColor: '#1f1f1f' }}>
            <Typography variant="h5" gutterBottom>
              Top Actors/Cast Members
            </Typography>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart
                data={creatorData.topActors || []}
                layout="vertical"
                margin={{ top: 5, right: 30, left: 150, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis type="number" stroke="#fff" />
                <YAxis dataKey="name" type="category" stroke="#fff" width={140} />
                <Tooltip />
                <Bar dataKey="count" fill="#831010" />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>

      {/* Creator Statistics */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
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
        </Grid>
        <Grid item xs={12} md={6}>
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
        </Grid>
      </Grid>
    </Box>
  );
};

export default CreatorHub;
