import React, { useMemo } from 'react';
import { Box, Paper, Typography, Grid } from '@mui/material';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { getYear } from 'date-fns';
import { processTrendData } from '../utils/dataProcessing';

const TrendIntelligence = ({ data }) => {
  const trendData = useMemo(() => processTrendData(data), [data]);

  // Timeline data - group by year
  const yearlyTimeline = useMemo(() => {
    const yearly = {};
    (data || []).forEach(item => {
      if (item.date_added) {
        const year = getYear(item.date_added);
        if (!yearly[year]) yearly[year] = { movies: 0, tvShows: 0 };
        if (item.type === 'Movie') yearly[year].movies++;
        else yearly[year].tvShows++;
      }
    });
    return Object.entries(yearly)
      .map(([year, counts]) => ({
        year: parseInt(year),
        ...counts,
        total: counts.movies + counts.tvShows,
      }))
      .sort((a, b) => a.year - b.year);
  }, [data]);

  return (
    <Box sx={{ width: '100%', maxWidth: '100%', px: 0 }}>
      <Typography variant="h3" gutterBottom sx={{ color: '#E50914', mb: 3, px: 2 }}>
        Trend Intelligence
      </Typography>

      {/* Timeline Full Width */}
      <Box sx={{ width: '100%', mb: 3, px: 2 }}>
        <Paper sx={{ p: 3, backgroundColor: '#1f1f1f', width: '100%' }}>
          <Typography variant="h5" gutterBottom>
            Yearly Content Addition Timeline
          </Typography>
          <ResponsiveContainer width="100%" height={420}>
            <AreaChart data={yearlyTimeline}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis dataKey="year" stroke="#fff" />
              <YAxis stroke="#fff" />
              <Tooltip />
              <Legend />
              <Area
                type="monotone"
                dataKey="movies"
                stackId="1"
                stroke="#E50914"
                fill="#E50914"
              />
              <Area
                type="monotone"
                dataKey="tvShows"
                stackId="1"
                stroke="#831010"
                fill="#831010"
              />
            </AreaChart>
          </ResponsiveContainer>
        </Paper>
      </Box>

      {/* Smaller KPI Charts Grid */}
      <Box
        sx={{
          display: 'grid',
          gap: 16,
          px: 2,
          gridTemplateColumns: 'repeat(auto-fill, minmax(420px, 1fr))',
          alignItems: 'stretch',
          mb: 3,
        }}
      >
        <Paper sx={{ p: 3, backgroundColor: '#1f1f1f', width: '100%' }}>
          <Typography variant="h5" gutterBottom>
            Content Age Analysis
          </Typography>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={trendData.contentAge || []}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis dataKey="year" stroke="#fff" />
              <YAxis stroke="#fff" />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="avgAge"
                stroke="#E50914"
                strokeWidth={2}
                dot={{ fill: '#E50914' }}
                name="Average Age (years)"
              />
            </LineChart>
          </ResponsiveContainer>
        </Paper>
        <Paper sx={{ p: 3, backgroundColor: '#1f1f1f', width: '100%' }}>
          <Typography variant="h5" gutterBottom>
            Year-over-Year Growth Rate
          </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={trendData.growthRate || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis dataKey="year" stroke="#fff" />
                <YAxis stroke="#fff" tickFormatter={(value) => `${value}%`} />
                <Tooltip formatter={(value) => `${value}%`} />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="growthRate"
                  stroke="#E50914"
                  strokeWidth={3}
                  dot={{ fill: '#E50914', r: 4 }}
                  name="Growth Rate"
                />
              </LineChart>
            </ResponsiveContainer>
        </Paper>
      </Box>

      {/* Strategic Insights */}
      <Box sx={{ width: '100%', px: 2, mb: 4 }}>
        <Paper sx={{ p: 3, backgroundColor: '#1f1f1f', width: '100%' }}>
          <Typography variant="h5" gutterBottom sx={{ color: '#E50914' }}>
            Key Trend Insights
          </Typography>
          <Box
            sx={{
              display: 'grid',
              gap: 16,
              gridTemplateColumns: 'repeat(auto-fill, minmax(420px, 1fr))',
              mt: 1,
            }}
          >
            <Box sx={{ p: 2, backgroundColor: '#2a2a2a', borderLeft: '4px solid #E50914' }}>
              <Typography variant="h6" sx={{ color: '#E50914' }}>
                Recent Growth Acceleration
              </Typography>
              <Typography variant="body2">
                Netflix has shown consistent growth in content additions over the past years,
                indicating an aggressive expansion strategy.
              </Typography>
            </Box>
            <Box sx={{ p: 2, backgroundColor: '#2a2a2a', borderLeft: '4px solid #E50914' }}>
              <Typography variant="h6" sx={{ color: '#E50914' }}>
                Content Age Trends
              </Typography>
              <Typography variant="body2">
                The average age of added content shows how Netflix balances new releases
                with catalog additions.
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
};

export default TrendIntelligence;
