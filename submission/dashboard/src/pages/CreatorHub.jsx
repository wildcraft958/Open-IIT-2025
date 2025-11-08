import React, { useMemo } from 'react';
import { Box, Paper, Typography, Grid } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Legend } from 'recharts';
import { Star } from '@mui/icons-material';
import { processCreatorData, newCreatorsByYear, topCreatorsByAvgRating } from '../utils/dataProcessing';

const CreatorHub = ({ data }) => {
  const creatorData = useMemo(() => processCreatorData(data), [data]);
  const newCreators = useMemo(() => newCreatorsByYear(data), [data]);
  const topDirectorsByRating = useMemo(() => topCreatorsByAvgRating(data, 'director', 3), [data]);
  const topActorsByRating = useMemo(() => topCreatorsByAvgRating(data, 'actor', 5), [data]);

  return (
    <Box sx={{ width: '100%', maxWidth: '100%', px: 0 }}>
      <Box sx={{ px: 2, mb: 3 }}>
        <Typography variant="h3" gutterBottom sx={{ color: '#E50914', mb: 2 }}>
          Creator Hub
        </Typography>
        <Paper sx={{ p: 2.5, backgroundColor: 'rgba(255, 107, 107, 0.08)', border: '1px solid rgba(255, 107, 107, 0.25)' }}>
          <Typography variant="body2" sx={{ color: '#ddd', lineHeight: 1.6, mb: 1 }}>
            <strong style={{ color: '#E50914' }}>🎬 Creator Network Concentration:</strong> Analysis reveals a small group of 
            directors and actors form dense collaboration clusters. While these relationships produce quality content, over-reliance 
            on established talent limits fresh perspectives.
          </Typography>
          <Typography variant="body2" sx={{ color: '#ddd', lineHeight: 1.6 }}>
            <strong style={{ color: '#FF6B6B' }}>🌟 Diversification Imperative:</strong> <em>Recommendation: Launch "New Voices" 
            program with dedicated funding for first-time directors and writers from underrepresented regions and backgrounds. 
            Target: 20% of new productions from emerging talent by 2027.</em>
          </Typography>
        </Paper>
      </Box>

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

      {/* New Creators & Rating Analysis */}
      <Box
        sx={{
          display: 'grid',
          gap: 16,
          px: 2,
          mb: 3,
          gridTemplateColumns: 'repeat(auto-fill, minmax(500px, 1fr))',
          alignItems: 'stretch',
        }}
      >
        {/* New Creators per Year */}
        <Paper sx={{ p: 3, backgroundColor: '#1f1f1f', width: '100%' }}>
          <Typography variant="h5" gutterBottom>
            New Directors Entering Netflix (by Year)
          </Typography>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={newCreators.directors || []}>
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
              <Line
                type="monotone"
                dataKey="newCreators"
                stroke="#E50914"
                strokeWidth={2}
                dot={{ fill: '#E50914', r: 4 }}
                name="New Directors"
              />
            </LineChart>
          </ResponsiveContainer>
        </Paper>

        {/* Top Directors by Avg Rating */}
        <Paper sx={{ p: 3, backgroundColor: '#1f1f1f', width: '100%' }}>
          <Typography variant="h5" gutterBottom>
            <Star sx={{ verticalAlign: 'middle', mr: 1, color: '#FFD700' }} />
            Top Directors by Avg Rating (Min 3 titles)
          </Typography>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={topDirectorsByRating.slice(0, 10)}
              layout="vertical"
              margin={{ top: 5, right: 30, left: 140, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis type="number" stroke="#fff" domain={[0, 6]} />
              <YAxis dataKey="name" type="category" stroke="#fff" width={130} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1e1e1e',
                  border: '1px solid #E50914',
                  borderRadius: '8px',
                  color: '#fff',
                }}
                formatter={(value, name, props) => [
                  `Avg Rating: ${value} (${props.payload.titles} titles)`,
                  '',
                ]}
              />
              <Bar dataKey="avgRating" fill="#FFD700" />
            </BarChart>
          </ResponsiveContainer>
        </Paper>
      </Box>

      {/* Top Actors by Rating */}
      <Box sx={{ px: 2, mb: 3 }}>
        <Paper sx={{ p: 3, backgroundColor: '#1f1f1f', width: '100%' }}>
          <Typography variant="h5" gutterBottom>
            <Star sx={{ verticalAlign: 'middle', mr: 1, color: '#FFD700' }} />
            Top Actors by Avg Rating (Min 5 titles)
          </Typography>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart
              data={topActorsByRating.slice(0, 15)}
              layout="vertical"
              margin={{ top: 5, right: 30, left: 150, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis type="number" stroke="#fff" domain={[0, 6]} />
              <YAxis dataKey="name" type="category" stroke="#fff" width={140} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1e1e1e',
                  border: '1px solid #E50914',
                  borderRadius: '8px',
                  color: '#fff',
                }}
                formatter={(value, name, props) => [
                  `Avg Rating: ${value} (${props.payload.titles} titles)`,
                  '',
                ]}
              />
              <Bar dataKey="avgRating" fill="#831010" />
            </BarChart>
          </ResponsiveContainer>
        </Paper>
      </Box>

      {/* Stats cards (flex layout) */}
      <Box
        sx={{
          display: 'flex',
          gap: 2,
          px: 2,
          mb: 4,
          width: '100%',
          alignItems: 'stretch',
          flexWrap: 'wrap',
        }}
      >
        <Paper sx={{ p: 2, backgroundColor: '#1f1f1f', flex: '1 1 0', minWidth: 300 }}>
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
        <Paper sx={{ p: 2, backgroundColor: '#1f1f1f', flex: '1 1 0', minWidth: 300 }}>
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
