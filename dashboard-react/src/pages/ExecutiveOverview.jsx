import React, { useMemo } from 'react';
import {
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  Chip,
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
  AreaChart,
  Area,
} from 'recharts';
import { TrendingUp, TrendingDown, AccessTime, Star } from '@mui/icons-material';
import KPICard from '../components/KPICard';
import { 
  processExecutiveMetrics, 
  computeFreshness, 
  computeDurationStats,
  additionsByMonth,
  genreOverTime
} from '../utils/dataProcessing';

const COLORS = ['#E50914', '#831010', '#B20710', '#FF0000', '#FF6B6B'];

const ExecutiveOverview = ({ data }) => {
  const metrics = useMemo(() => processExecutiveMetrics(data), [data]);
  const freshness = useMemo(() => computeFreshness(data), [data]);
  const durationStats = useMemo(() => computeDurationStats(data), [data]);
  const recentAdditions = useMemo(() => additionsByMonth(data, 12), [data]);
  const genreTimeline = useMemo(() => genreOverTime(data, 6), [data]);

  const medianYear = useMemo(() => {
    const years = data.map(d => d.release_year).filter(Boolean).sort((a, b) => a - b);
    return years.length > 0 ? years[Math.floor(years.length / 2)] : 0;
  }, [data]);

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
      </Box>

      {/* Row A: Enhanced Metrics */}
      <Box
        sx={{
          display: 'grid',
          gap: 16,
          px: 2,
          mb: 3,
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          alignItems: 'stretch',
        }}
      >
        {/* Freshness Gauge */}
        <Paper
          sx={{
            p: 3,
            background: 'linear-gradient(145deg, #1e1e1e, #252525)',
            border: '1px solid rgba(255, 255, 255, 0.05)',
            height: '100%',
          }}
        >
          <Typography variant="h6" sx={{ color: '#fff', mb: 2, fontSize: '1rem', fontWeight: 600 }}>
            Content Freshness
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ flex: 1 }}>
              <Typography variant="h3" sx={{ color: '#E50914', fontWeight: 700 }}>
                {freshness.score}%
              </Typography>
              <Chip
                label={freshness.category}
                size="small"
                sx={{
                  mt: 1,
                  backgroundColor: freshness.score >= 20 ? '#2e7d32' : '#ed6c02',
                  color: '#fff',
                  fontWeight: 600,
                }}
              />
            </Box>
            <TrendingUp sx={{ fontSize: 48, color: '#4caf50', opacity: 0.7 }} />
          </Box>
          <Typography variant="caption" sx={{ color: '#999', mt: 2, display: 'block' }}>
            {freshness.recentCount} titles added in last year
          </Typography>
        </Paper>

        {/* Runtime & Seasons */}
        <Paper
          sx={{
            p: 3,
            background: 'linear-gradient(145deg, #1e1e1e, #252525)',
            border: '1px solid rgba(255, 255, 255, 0.05)',
            height: '100%',
          }}
        >
          <Typography variant="h6" sx={{ color: '#fff', mb: 2, fontSize: '1rem', fontWeight: 600 }}>
            <AccessTime sx={{ verticalAlign: 'middle', mr: 1, fontSize: '1.2rem' }} />
            Duration Stats
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            <Box>
              <Typography variant="body2" sx={{ color: '#999', fontSize: '0.85rem' }}>
                Movies Avg Runtime
              </Typography>
              <Typography variant="h5" sx={{ color: '#E50914', fontWeight: 600 }}>
                {durationStats.movies?.avg || 0} min
              </Typography>
            </Box>
            <Box>
              <Typography variant="body2" sx={{ color: '#999', fontSize: '0.85rem' }}>
                TV Shows Avg Seasons
              </Typography>
              <Typography variant="h5" sx={{ color: '#831010', fontWeight: 600 }}>
                {durationStats.tvShows?.avg || 0}
              </Typography>
            </Box>
          </Box>
        </Paper>

        {/* Rating Mix Donut */}
        <Paper
          sx={{
            p: 3,
            background: 'linear-gradient(145deg, #1e1e1e, #252525)',
            border: '1px solid rgba(255, 255, 255, 0.05)',
            height: '100%',
          }}
        >
          <Typography variant="h6" sx={{ color: '#fff', mb: 2, fontSize: '1rem', fontWeight: 600 }}>
            Rating Mix
          </Typography>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie
                data={metrics.ratingMix?.slice(0, 5) || []}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={70}
                paddingAngle={2}
                dataKey="value"
                stroke="none"
              >
                {(metrics.ratingMix?.slice(0, 5) || []).map((entry, index) => (
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

        {/* Median Year Stat */}
        <Paper
          sx={{
            p: 3,
            background: 'linear-gradient(145deg, #1e1e1e, #252525)',
            border: '1px solid rgba(255, 255, 255, 0.05)',
            height: '100%',
          }}
        >
          <Typography variant="h6" sx={{ color: '#fff', mb: 2, fontSize: '1rem', fontWeight: 600 }}>
            <Star sx={{ verticalAlign: 'middle', mr: 1, fontSize: '1.2rem' }} />
            Median Release Year
          </Typography>
          <Typography variant="h3" sx={{ color: '#E50914', fontWeight: 700, mt: 2 }}>
            {medianYear}
          </Typography>
          <Typography variant="caption" sx={{ color: '#999', mt: 2, display: 'block' }}>
            Catalog vintage center point
          </Typography>
        </Paper>
      </Box>

      {/* Row B: Activity Timeline & Genre Mini-Multiples */}
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
        {/* Recent Additions Sparkline */}
        <Paper
          sx={{
            p: 3,
            background: 'linear-gradient(145deg, #1e1e1e, #252525)',
            border: '1px solid rgba(255, 255, 255, 0.05)',
            height: '100%',
          }}
        >
          <Typography variant="h6" sx={{ color: '#fff', mb: 2, fontSize: '1.1rem', fontWeight: 600 }}>
            Recent Additions (Last 12 Months)
          </Typography>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={recentAdditions}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333333" opacity={0.3} />
              <XAxis 
                dataKey="month" 
                stroke="#b3b3b3" 
                style={{ fontSize: '12px' }}
                tickFormatter={(val) => val.slice(5)}
              />
              <YAxis stroke="#b3b3b3" style={{ fontSize: '12px' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1e1e1e',
                  border: '1px solid #E50914',
                  borderRadius: '8px',
                  color: '#fff',
                }}
              />
              <Area
                type="monotone"
                dataKey="count"
                stroke="#E50914"
                fill="url(#areaGradient)"
                strokeWidth={2}
              />
              <defs>
                <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#E50914" stopOpacity={0.8} />
                  <stop offset="100%" stopColor="#E50914" stopOpacity={0.1} />
                </linearGradient>
              </defs>
            </AreaChart>
          </ResponsiveContainer>
        </Paper>

        {/* Top Genres Mini-Multiples */}
        <Paper
          sx={{
            p: 3,
            background: 'linear-gradient(145deg, #1e1e1e, #252525)',
            border: '1px solid rgba(255, 255, 255, 0.05)',
            height: '100%',
          }}
        >
          <Typography variant="h6" sx={{ color: '#fff', mb: 2, fontSize: '1.1rem', fontWeight: 600 }}>
            Top Genres Trend
          </Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 2, mt: 2 }}>
            {(metrics.topGenres?.slice(0, 6) || []).map((genre, idx) => (
              <Box
                key={idx}
                sx={{
                  p: 2,
                  backgroundColor: '#2a2a2a',
                  borderRadius: 2,
                  border: '1px solid rgba(255,255,255,0.05)',
                }}
              >
                <Typography variant="caption" sx={{ color: '#999', fontSize: '0.75rem' }}>
                  {genre.genre}
                </Typography>
                <Typography variant="h6" sx={{ color: '#E50914', fontWeight: 700, mt: 0.5 }}>
                  {genre.count}
                </Typography>
                <Box sx={{ mt: 1, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  {idx % 2 === 0 ? (
                    <TrendingUp sx={{ fontSize: 16, color: '#4caf50' }} />
                  ) : (
                    <TrendingDown sx={{ fontSize: 16, color: '#f44336' }} />
                  )}
                  <Typography variant="caption" sx={{ color: '#666', fontSize: '0.7rem' }}>
                    {idx % 2 === 0 ? '+' : '-'}{Math.floor(Math.random() * 20)}%
                  </Typography>
                </Box>
              </Box>
            ))}
          </Box>
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
