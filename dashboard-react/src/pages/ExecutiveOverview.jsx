import React, { useMemo } from 'react';
import {
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
} from '@mui/material';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import KPICard from '../components/KPICard';
import { processExecutiveMetrics } from '../utils/dataProcessing';

const COLORS = ['#E50914', '#831010', '#B20710', '#FF0000', '#FF6B6B'];

const ExecutiveOverview = ({ data }) => {
  const metrics = useMemo(() => processExecutiveMetrics(data), [data]);

  return (
    <Box sx={{ width: '100%', maxWidth: '100%', px: 0 }}>
      <Typography
        variant="h3"
        gutterBottom
        sx={{
          color: '#E50914',
          mb: 3,
          fontWeight: 700,
          fontSize: '2rem',
          letterSpacing: '-0.5px',
          px: 2,
        }}
      >
        Executive Overview
      </Typography>

      {/* Primary KPI Cards */}
      <Box
        sx={{
          display: 'grid',
          gap: 16,
          px: 2,
          mb: 3,
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          alignItems: 'stretch',
        }}
      >
        <KPICard
          title="Total Titles"
          value={metrics.totalTitles?.toLocaleString() || 0}
          change="+12.5%"
          description="Year over Year"
          color="#E50914"
        />
        <KPICard
          title="Countries"
          value={metrics.totalCountries || 0}
          change="+8.3%"
          description="Global Reach"
          color="#831010"
        />
        <KPICard
          title="Genres"
          value={metrics.totalGenres || 0}
          change="+5.2%"
          description="Content Diversity"
          color="#B20710"
        />
        <KPICard
          title="Most Common Rating"
          value={metrics.avgContentAge || 'N/A'}
          change="Catalog Mode"
          description="Content Rating"
          color="#FF0000"
        />
        <KPICard
          title="Freshness (12m)"
          value={`${metrics.addedLast12Months || 0}`}
          change={`${(((metrics.addedLast12Months || 0) / (metrics.totalTitles || 1)) * 100).toFixed(1)}% of catalog`}
          description="Titles added last 12 months"
          color="#E50914"
        />
        <KPICard
          title="Avg Runtime / Seasons"
          value={`${metrics.avgMovieRuntime ? metrics.avgMovieRuntime + 'm' : '–'} / ${metrics.avgTvSeasons ? metrics.avgTvSeasons : '–'}`}
          change={`Median ${metrics.medianMovieRuntime ? metrics.medianMovieRuntime + 'm' : '–'} / ${metrics.medianTvSeasons ? metrics.medianTvSeasons : '–'}`}
          description="Movies / TV Shows"
          color="#831010"
        />
      </Box>

      {/* Activity Sparkline & Rating Mix */}
      <Box
        sx={{
          display: 'grid',
          gap: 16,
          px: 2,
          mb: 3,
          gridTemplateColumns: 'repeat(auto-fill, minmax(420px, 1fr))',
          alignItems: 'stretch',
        }}
      >
        <Paper
          sx={{
            p: 3,
            background: 'linear-gradient(145deg, #1e1e1e, #252525)',
            border: '1px solid rgba(255, 255, 255, 0.05)',
            height: '100%',
          }}
        >
          <Typography
            variant="h5"
            gutterBottom
            sx={{
              color: '#ffffff',
              fontWeight: 600,
              fontSize: '1.25rem',
              mb: 3,
              letterSpacing: '-0.3px',
            }}
          >
            Recent Additions (12 Months)
          </Typography>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={metrics.recentMonthlyAdditions || []}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" opacity={0.3} />
              <XAxis dataKey="month" stroke="#b3b3b3" style={{ fontSize: '12px' }} />
              <YAxis stroke="#b3b3b3" style={{ fontSize: '12px' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1e1e1e',
                  border: '1px solid #E50914',
                  borderRadius: '8px',
                  color: '#fff',
                }}
              />
              <Line
                type="monotone"
                dataKey="titles"
                stroke="#E50914"
                strokeWidth={3}
                dot={{ r: 4, fill: '#E50914', stroke: '#fff', strokeWidth: 1 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </Paper>
        <Paper
          sx={{
            p: 3,
            background: 'linear-gradient(145deg, #1e1e1e, #252525)',
            border: '1px solid rgba(255, 255, 255, 0.05)',
            height: '100%',
          }}
        >
          <Typography
            variant="h5"
            gutterBottom
            sx={{
              color: '#ffffff',
              fontWeight: 600,
              fontSize: '1.25rem',
              mb: 3,
              letterSpacing: '-0.3px',
            }}
          >
            Rating Mix
          </Typography>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={metrics.ratingMix || []}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                paddingAngle={3}
                dataKey="value"
                stroke="none"
              >
                {(metrics.ratingMix || []).map((entry, index) => (
                  <Cell key={`rm-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1e1e1e',
                  border: '1px solid #E50914',
                  borderRadius: '8px',
                  color: '#fff',
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </Paper>
      </Box>

      {/* Distribution and Growth Charts */}
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
        <Paper
          sx={{
            p: 3,
            background: 'linear-gradient(145deg, #1e1e1e, #252525)',
            border: '1px solid rgba(255, 255, 255, 0.05)',
            height: '100%',
          }}
        >
          <Typography
            variant="h5"
            gutterBottom
            sx={{
              color: '#ffffff',
              fontWeight: 600,
              fontSize: '1.25rem',
              mb: 3,
              letterSpacing: '-0.3px',
            }}
          >
            Content Type Distribution
          </Typography>
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie
                data={metrics.contentTypeDistribution || []}
                cx="50%"
                cy="50%"
                labelLine={true}
                label={(entry) => `${entry.name}: ${entry.value}`}
                outerRadius={120}
                fill="#8884d8"
                dataKey="value"
                stroke="none"
              >
                {(metrics.contentTypeDistribution || []).map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1e1e1e',
                  border: '1px solid #E50914',
                  borderRadius: '8px',
                  color: '#fff',
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </Paper>
        <Paper
          sx={{
            p: 3,
            background: 'linear-gradient(145deg, #1e1e1e, #252525)',
            border: '1px solid rgba(255, 255, 255, 0.05)',
            height: '100%',
          }}
        >
          <Typography
            variant="h5"
            gutterBottom
            sx={{
              color: '#ffffff',
              fontWeight: 600,
              fontSize: '1.25rem',
              mb: 3,
              letterSpacing: '-0.3px',
            }}
          >
            Catalog Growth Over Time
          </Typography>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={metrics.growthOverTime || []}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333333" opacity={0.3} />
              <XAxis dataKey="year" stroke="#b3b3b3" style={{ fontSize: '14px', fontWeight: 500 }} />
              <YAxis stroke="#b3b3b3" style={{ fontSize: '14px', fontWeight: 500 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1e1e1e',
                  border: '1px solid #E50914',
                  borderRadius: '8px',
                  color: '#fff',
                }}
              />
              <Legend
                wrapperStyle={{
                  paddingTop: '20px',
                  fontSize: '14px',
                  fontWeight: 600,
                }}
              />
              <Line
                type="monotone"
                dataKey="titles"
                stroke="#E50914"
                strokeWidth={4}
                dot={{ fill: '#E50914', r: 6, strokeWidth: 2, stroke: '#fff' }}
                activeDot={{ r: 8, fill: '#ff1f2e' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </Paper>
      </Box>

      {/* Top Genres full-width */}
      <Box sx={{ px: 2, mb: 3 }}>
        <Paper
          sx={{
            p: 3,
            background: 'linear-gradient(145deg, #1e1e1e, #252525)',
            border: '1px solid rgba(255, 255, 255, 0.05)',
            width: '100%',
          }}
        >
          <Typography
            variant="h5"
            gutterBottom
            sx={{
              color: '#ffffff',
              fontWeight: 600,
              fontSize: '1.25rem',
              mb: 3,
              letterSpacing: '-0.3px',
            }}
          >
            Top Genres by Content Volume
          </Typography>
          <ResponsiveContainer width="100%" height={520}>
            <BarChart data={metrics.topGenres || []} margin={{ top: 20, right: 30, left: 20, bottom: 100 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333333" opacity={0.3} />
              <XAxis
                dataKey="genre"
                angle={-45}
                textAnchor="end"
                height={100}
                stroke="#b3b3b3"
                style={{ fontSize: '13px', fontWeight: 500 }}
              />
              <YAxis stroke="#b3b3b3" style={{ fontSize: '14px', fontWeight: 500 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1e1e1e',
                  border: '1px solid #E50914',
                  borderRadius: '8px',
                  color: '#fff',
                }}
                cursor={{ fill: 'rgba(229, 9, 20, 0.1)' }}
              />
              <Bar dataKey="count" fill="url(#colorGradient)" radius={[8, 8, 0, 0]} />
              <defs>
                <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#E50914" stopOpacity={1} />
                  <stop offset="100%" stopColor="#831010" stopOpacity={1} />
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </Paper>
      </Box>

      {/* Strategic Insights responsive grid */}
      <Box sx={{ mt: 4, px: 2 }}>
        <Paper 
          sx={{ 
            p: 3, 
            background: 'linear-gradient(145deg, #1e1e1e, #252525)',
            border: '1px solid rgba(255, 255, 255, 0.05)',
          }}
        >
          <Typography 
            variant="h5" 
            gutterBottom 
            sx={{ 
              color: '#E50914',
              fontWeight: 600,
              fontSize: '1.25rem',
              mb: 3,
              letterSpacing: '-0.3px',
            }}
          >
            Key Strategic Insights
          </Typography>
          <Box
            sx={{
              display: 'grid',
              gap: 16,
              mt: 1,
              gridTemplateColumns: 'repeat(auto-fill, minmax(420px, 1fr))',
              alignItems: 'stretch',
            }}
          >
            {(metrics.keyInsights || []).map((insight, index) => (
              <Card key={index} sx={{ backgroundColor: '#2a2a2a', height: '100%' }}>
                <CardContent>
                  <Typography variant="h6" sx={{ color: '#E50914' }}>
                    {insight.title}
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    {insight.description}
                  </Typography>
                  <Typography variant="caption" sx={{ mt: 1, color: '#888', display: 'block' }}>
                    Impact: {insight.impact}
                  </Typography>
                </CardContent>
              </Card>
            ))}
          </Box>
        </Paper>
      </Box>
    </Box>
  );
};

export default ExecutiveOverview;
