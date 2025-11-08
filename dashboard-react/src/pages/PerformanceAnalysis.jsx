import React, { useMemo, useState } from 'react';
import { Box, Paper, Typography, Grid, Card, CardContent, Chip, ToggleButtonGroup, ToggleButton } from '@mui/material';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  AreaChart,
  Area,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { TrendingUp, AttachMoney, Star, ThumbUp, MovieFilter, Tv } from '@mui/icons-material';
import {
  performanceMetrics,
  performanceByYear,
  topPerformers,
  financialMetrics,
  financialByYear,
  budgetRevenueDistribution,
  languageDistribution,
  languageByYear,
  languagePerformance,
} from '../utils/dataProcessing';

const COLORS = ['#E50914', '#831010', '#B20710', '#FF0000', '#FF6B6B', '#DC143C', '#8B0000', '#A52A2A'];

const PerformanceAnalysis = ({ data }) => {
  const [contentType, setContentType] = useState('all');

  // Filter data based on content type selection
  const filteredData = useMemo(() => {
    if (contentType === 'all') return data;
    return data.filter(d => d.type === contentType);
  }, [data, contentType]);

  const perfMetrics = useMemo(() => performanceMetrics(filteredData), [filteredData]);
  const perfByYear = useMemo(() => performanceByYear(filteredData), [filteredData]);
  const topByPopularity = useMemo(() => topPerformers(filteredData, 'popularity', 15), [filteredData]);
  const topByRating = useMemo(() => topPerformers(filteredData, 'vote_average', 15), [filteredData]);
  const topByVotes = useMemo(() => topPerformers(filteredData, 'vote_count', 15), [filteredData]);
  
  const finMetrics = useMemo(() => financialMetrics(filteredData), [filteredData]);
  const finByYear = useMemo(() => financialByYear(filteredData), [filteredData]);
  const distributions = useMemo(() => budgetRevenueDistribution(filteredData), [filteredData]);

  const langDist = useMemo(() => languageDistribution(filteredData, 15), [filteredData]);
  const langByYearData = useMemo(() => languageByYear(filteredData, 8), [filteredData]);
  const langPerf = useMemo(() => languagePerformance(filteredData, 12), [filteredData]);

  const formatCurrency = (value) => {
    if (value >= 1000000000) return `$${(value / 1000000000).toFixed(1)}B`;
    if (value >= 1000000) return `$${(value / 1000000).toFixed(0)}M`;
    return `$${value.toLocaleString()}`;
  };

  return (
    <Box sx={{ width: '100%', maxWidth: '100%', px: 0 }}>
      <Box sx={{ px: 2, mb: 2 }}>
        <Paper sx={{ p: 2.5, backgroundColor: 'rgba(220, 20, 60, 0.08)', border: '1px solid rgba(220, 20, 60, 0.25)' }}>
          <Typography variant="body2" sx={{ color: '#ddd', lineHeight: 1.6, mb: 1 }}>
            <strong style={{ color: '#E50914' }}>📊 Data Coverage Note:</strong> Performance metrics (popularity, ratings, votes) 
            are available for <strong>38% of the catalog</strong> (~16,000 titles from 2010-2025). Financial data (budget/revenue) 
            covers <strong>11% of titles</strong> (~4,800 titles). Use the filter below to scope analysis by content type for accurate insights.
          </Typography>
          <Typography variant="body2" sx={{ color: '#ddd', lineHeight: 1.6 }}>
            <strong style={{ color: '#FF6B6B' }}>🎯 Best Practice:</strong> For performance and financial analysis, filter by 
            "Movies" as they have significantly better data coverage. Language analysis works well for all content types (83% coverage).
          </Typography>
        </Paper>
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', px: 2, mb: 3 }}>
        <Typography variant="h3" sx={{ color: '#E50914', fontWeight: 700 }}>
          Performance & Financial Analysis
        </Typography>
        <ToggleButtonGroup
          value={contentType}
          exclusive
          onChange={(e, newType) => newType && setContentType(newType)}
          aria-label="content type filter"
          sx={{
            '& .MuiToggleButton-root': {
              color: '#f0eeeeff',
              borderColor: '#333',
              '&.Mui-selected': {
                color: '#f1e9eaff',
                backgroundColor: 'rgba(229, 9, 20, 0.1)',
                borderColor: '#E50914',
              },
            },
          }}
        >
          <ToggleButton value="all" aria-label="all content">
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="body2">All</Typography>
              <Chip label={data.length} size="small" sx={{ height: 20, fontSize: '0.7rem' }} />
            </Box>
          </ToggleButton>
          <ToggleButton value="Movie" aria-label="movies only">
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <MovieFilter fontSize="small" />
              <Typography variant="body2">Movies</Typography>
              <Chip label={data.filter(d => d.type === 'Movie').length} size="small" sx={{ height: 20, fontSize: '0.7rem' }} />
            </Box>
          </ToggleButton>
          <ToggleButton value="TV Show" aria-label="tv shows only">
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Tv fontSize="small" />
              <Typography variant="body2">TV Shows</Typography>
              <Chip label={data.filter(d => d.type === 'TV Show').length} size="small" sx={{ height: 20, fontSize: '0.7rem' }} />
            </Box>
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>

      {/* Performance Metrics KPI Cards */}
      <Box sx={{ px: 2, mb: 3 }}>
        <Typography variant="h5" sx={{ color: '#fff', mb: 2, fontWeight: 600 }}>
          Content Performance Metrics
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ backgroundColor: '#1f1f1f', borderLeft: '4px solid #E50914' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <TrendingUp sx={{ color: '#E50914' }} />
                  <Typography variant="caption" sx={{ color: '#999' }}>Avg Popularity</Typography>
                </Box>
                <Typography variant="h4" sx={{ color: '#E50914', fontWeight: 700 }}>
                  {perfMetrics.avgPopularity || 0}
                </Typography>
                <Typography variant="caption" sx={{ color: '#666' }}>
                  Median: {perfMetrics.medianPopularity || 0}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ backgroundColor: '#1f1f1f', borderLeft: '4px solid #831010' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <Star sx={{ color: '#FFD700' }} />
                  <Typography variant="caption" sx={{ color: '#999' }}>Avg Rating</Typography>
                </Box>
                <Typography variant="h4" sx={{ color: '#FFD700', fontWeight: 700 }}>
                  {perfMetrics.avgRating || 0}
                </Typography>
                <Typography variant="caption" sx={{ color: '#666' }}>
                  Median: {perfMetrics.medianRating || 0}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ backgroundColor: '#1f1f1f', borderLeft: '4px solid #B20710' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <ThumbUp sx={{ color: '#4caf50' }} />
                  <Typography variant="caption" sx={{ color: '#999' }}>Avg Vote Count</Typography>
                </Box>
                <Typography variant="h4" sx={{ color: '#4caf50', fontWeight: 700 }}>
                  {perfMetrics.avgVoteCount?.toLocaleString() || 0}
                </Typography>
                <Typography variant="caption" sx={{ color: '#666' }}>
                  Median: {perfMetrics.medianVoteCount?.toLocaleString() || 0}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ backgroundColor: '#1f1f1f', borderLeft: '4px solid #FF0000' }}>
              <CardContent>
                <Typography variant="caption" sx={{ color: '#999' }}>Titles w/ Metrics</Typography>
                <Typography variant="h4" sx={{ color: '#FF0000', fontWeight: 700, mt: 1 }}>
                  {perfMetrics.totalWithMetrics?.toLocaleString() || 0}
                </Typography>
                <Typography variant="caption" sx={{ color: '#666' }}>
                  {data.length > 0 ? Math.round((perfMetrics.totalWithMetrics / data.length) * 100) : 0}% of catalog
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>

      {/* Performance Trends Over Time */}
      <Box
        sx={{
          display: 'grid',
          gap: 16,
          px: 2,
          mb: 3,
          gridTemplateColumns: 'repeat(auto-fill, minmax(550px, 1fr))',
          alignItems: 'stretch',
        }}
      >
        <Paper sx={{ p: 3, backgroundColor: '#1f1f1f', width: '100%' }}>
          <Typography variant="h5" gutterBottom sx={{ color: '#fff', fontWeight: 600 }}>
            Popularity Trend by Release Year
          </Typography>
          <ResponsiveContainer width="100%" height={320}>
            <AreaChart data={perfByYear}>
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
              <Area
                type="monotone"
                dataKey="avgPopularity"
                stroke="#E50914"
                fill="url(#popGradient)"
                strokeWidth={2}
                name="Avg Popularity"
              />
              <defs>
                <linearGradient id="popGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#E50914" stopOpacity={0.8} />
                  <stop offset="100%" stopColor="#E50914" stopOpacity={0.1} />
                </linearGradient>
              </defs>
            </AreaChart>
          </ResponsiveContainer>
        </Paper>

        <Paper sx={{ p: 3, backgroundColor: '#1f1f1f', width: '100%' }}>
          <Typography variant="h5" gutterBottom sx={{ color: '#fff', fontWeight: 600 }}>
            Vote Count Trend by Release Year
          </Typography>
          <ResponsiveContainer width="100%" height={320}>
            <LineChart data={perfByYear}>
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
                dataKey="avgVoteCount"
                stroke="#4caf50"
                strokeWidth={3}
                dot={{ fill: '#4caf50', r: 4 }}
                name="Avg Vote Count"
              />
            </LineChart>
          </ResponsiveContainer>
        </Paper>
      </Box>

      {/* Top Performers */}
      <Box sx={{ px: 2, mb: 3 }}>
        <Typography variant="h5" sx={{ color: '#fff', mb: 2, fontWeight: 600 }}>
          Top Performing Content
        </Typography>
        <Box
          sx={{
            display: 'grid',
            gap: 16,
            gridTemplateColumns: 'repeat(auto-fill, minmax(480px, 1fr))',
            alignItems: 'stretch',
          }}
        >
          <Paper sx={{ p: 3, backgroundColor: '#1f1f1f', width: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Top 15 by Popularity Score
            </Typography>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={topByPopularity} layout="vertical" margin={{ left: 150 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis type="number" stroke="#fff" />
                <YAxis dataKey="title" type="category" stroke="#fff" width={140} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1e1e1e',
                    border: '1px solid #E50914',
                    borderRadius: '8px',
                    color: '#fff',
                  }}
                />
                <Bar dataKey="value" fill="#E50914" />
              </BarChart>
            </ResponsiveContainer>
          </Paper>

          <Paper sx={{ p: 3, backgroundColor: '#1f1f1f', width: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Top 15 by User Rating
            </Typography>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={topByRating} layout="vertical" margin={{ left: 150 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis type="number" stroke="#fff" domain={[0, 10]} />
                <YAxis dataKey="title" type="category" stroke="#fff" width={140} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1e1e1e',
                    border: '1px solid #E50914',
                    borderRadius: '8px',
                    color: '#fff',
                  }}
                />
                <Bar dataKey="value" fill="#FFD700" />
              </BarChart>
            </ResponsiveContainer>
          </Paper>

          <Paper sx={{ p: 3, backgroundColor: '#1f1f1f', width: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Top 15 by Vote Count
            </Typography>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={topByVotes} layout="vertical" margin={{ left: 150 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis type="number" stroke="#fff" />
                <YAxis dataKey="title" type="category" stroke="#fff" width={140} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1e1e1e',
                    border: '1px solid #E50914',
                    borderRadius: '8px',
                    color: '#fff',
                  }}
                  formatter={(value) => value.toLocaleString()}
                />
                <Bar dataKey="value" fill="#4caf50" />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Box>
      </Box>

      {/* Financial Analysis Section */}
      <Box sx={{ px: 2, mb: 3, mt: 5 }}>
        <Typography variant="h5" sx={{ color: '#E50914', mb: 2, fontWeight: 600 }}>
          Financial Analysis
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ backgroundColor: '#1f1f1f', borderLeft: '4px solid #4caf50' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <AttachMoney sx={{ color: '#4caf50' }} />
                  <Typography variant="caption" sx={{ color: '#999' }}>Total Revenue</Typography>
                </Box>
                <Typography variant="h5" sx={{ color: '#4caf50', fontWeight: 700 }}>
                  {formatCurrency(finMetrics.totalRevenue || 0)}
                </Typography>
                <Typography variant="caption" sx={{ color: '#666' }}>
                  Avg: {formatCurrency(finMetrics.avgRevenue || 0)}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ backgroundColor: '#1f1f1f', borderLeft: '4px solid #ff9800' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <AttachMoney sx={{ color: '#ff9800' }} />
                  <Typography variant="caption" sx={{ color: '#999' }}>Total Budget</Typography>
                </Box>
                <Typography variant="h5" sx={{ color: '#ff9800', fontWeight: 700 }}>
                  {formatCurrency(finMetrics.totalBudget || 0)}
                </Typography>
                <Typography variant="caption" sx={{ color: '#666' }}>
                  Avg: {formatCurrency(finMetrics.avgBudget || 0)}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ backgroundColor: '#1f1f1f', borderLeft: '4px solid #2196f3' }}>
              <CardContent>
                <Typography variant="caption" sx={{ color: '#999' }}>Average ROI</Typography>
                <Typography variant="h5" sx={{ color: '#2196f3', fontWeight: 700, mt: 1 }}>
                  {finMetrics.avgROI || 0}%
                </Typography>
                <Typography variant="caption" sx={{ color: '#666' }}>
                  Median: {finMetrics.medianROI || 0}%
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ backgroundColor: '#1f1f1f', borderLeft: '4px solid #9c27b0' }}>
              <CardContent>
                <Typography variant="caption" sx={{ color: '#999' }}>Profitable Titles</Typography>
                <Typography variant="h5" sx={{ color: '#9c27b0', fontWeight: 700, mt: 1 }}>
                  {finMetrics.profitableCount || 0}
                </Typography>
                <Typography variant="caption" sx={{ color: '#666' }}>
                  {finMetrics.totalWithFinancials > 0 
                    ? Math.round((finMetrics.profitableCount / finMetrics.totalWithFinancials) * 100) 
                    : 0}% success rate
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>

      {/* Financial Trends */}
      <Box sx={{ px: 2, mb: 3 }}>
        <Paper sx={{ p: 3, backgroundColor: '#1f1f1f', width: '100%' }}>
          <Typography variant="h5" gutterBottom sx={{ color: '#fff', fontWeight: 600 }}>
            Budget & Revenue Trends by Release Year
          </Typography>
          <ResponsiveContainer width="100%" height={400}>
            <AreaChart data={finByYear}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis dataKey="year" stroke="#fff" />
              <YAxis stroke="#fff" label={{ value: 'Millions ($)', angle: -90, position: 'insideLeft', fill: '#fff' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1e1e1e',
                  border: '1px solid #E50914',
                  borderRadius: '8px',
                  color: '#fff',
                }}
                formatter={(value) => `$${value}M`}
              />
              <Legend />
              <Area
                type="monotone"
                dataKey="avgRevenue"
                stackId="1"
                stroke="#4caf50"
                fill="#4caf50"
                fillOpacity={0.6}
                name="Avg Revenue"
              />
              <Area
                type="monotone"
                dataKey="avgBudget"
                stackId="2"
                stroke="#ff9800"
                fill="#ff9800"
                fillOpacity={0.6}
                name="Avg Budget"
              />
            </AreaChart>
          </ResponsiveContainer>
        </Paper>
      </Box>

      {/* Distribution Charts */}
      <Box
        sx={{
          display: 'grid',
          gap: 16,
          px: 2,
          mb: 4,
          gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))',
          alignItems: 'stretch',
        }}
      >
        <Paper sx={{ p: 3, backgroundColor: '#1f1f1f', width: '100%' }}>
          <Typography variant="h6" gutterBottom>
            Budget Distribution
          </Typography>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={distributions.budget}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis dataKey="range" stroke="#fff" angle={-15} textAnchor="end" height={80} />
              <YAxis stroke="#fff" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1e1e1e',
                  border: '1px solid #E50914',
                  borderRadius: '8px',
                  color: '#fff',
                }}
              />
              <Bar dataKey="count" fill="#ff9800" />
            </BarChart>
          </ResponsiveContainer>
        </Paper>

        <Paper sx={{ p: 3, backgroundColor: '#1f1f1f', width: '100%' }}>
          <Typography variant="h6" gutterBottom>
            Revenue Distribution
          </Typography>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={distributions.revenue}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis dataKey="range" stroke="#fff" angle={-15} textAnchor="end" height={80} />
              <YAxis stroke="#fff" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1e1e1e',
                  border: '1px solid #E50914',
                  borderRadius: '8px',
                  color: '#fff',
                }}
              />
              <Bar dataKey="count" fill="#4caf50" />
            </BarChart>
          </ResponsiveContainer>
        </Paper>

        <Paper sx={{ p: 3, backgroundColor: '#1f1f1f', width: '100%' }}>
          <Typography variant="h6" gutterBottom>
            ROI Distribution
          </Typography>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={distributions.roi}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis dataKey="range" stroke="#fff" angle={-15} textAnchor="end" height={80} />
              <YAxis stroke="#fff" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1e1e1e',
                  border: '1px solid #E50914',
                  borderRadius: '8px',
                  color: '#fff',
                }}
              />
              <Bar dataKey="count">
                {distributions.roi.map((entry, index) => (
                  <Cell key={`roi-${index}`} fill={index === 0 ? '#f44336' : COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Paper>
      </Box>

      {/* Language Analysis Section */}
      <Box sx={{ px: 2, mb: 3, mt: 5 , width: '100%'}}>
        <Typography variant="h5" sx={{ color: '#E50914', mb: 2, fontWeight: 600 }}>
          Language Analysis
        </Typography>
        <Box
          sx={{
            display: 'grid',
            gap: 16,
            gridTemplateColumns: 'repeat(auto-fill, minmax(480px, 1fr))',
            alignItems: 'stretch',
          }}
        >
          <Paper sx={{ p: 3, backgroundColor: '#1f1f1f', width: '120%' }}>
            <Typography variant="h6" gutterBottom>
              Top 15 Languages by Content Volume
            </Typography>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={langDist} layout="vertical" margin={{ left: 80 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis type="number" stroke="#fff" />
                <YAxis dataKey="language" type="category" stroke="#fff" width={70} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1e1e1e',
                    border: '1px solid #E50914',
                    borderRadius: '8px',
                    color: '#fff',
                  }}
                  formatter={(value, name, props) => [
                    `${value} titles (${props.payload.percentage}%)`,
                    'Count',
                  ]}
                />
                <Bar dataKey="count">
                  {langDist.map((entry, index) => (
                    <Cell key={`lang-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Paper>

          <Paper sx={{ p: 3, backgroundColor: '#1f1f1f', width: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Language Performance Comparison
            </Typography>
            <Typography variant="caption" sx={{ color: '#999', display: 'block', mb: 2 }}>
              Avg Popularity vs Avg Rating (min 5 titles per language)
            </Typography>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={langPerf.slice(0, 10)} layout="vertical" margin={{ left: 60 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis type="number" stroke="#fff" />
                <YAxis dataKey="language" type="category" stroke="#fff" width={50} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1e1e1e',
                    border: '1px solid #E50914',
                    borderRadius: '8px',
                    color: '#fff',
                  }}
                  formatter={(value, name) => [
                    name === 'avgPopularity' ? `${Math.round(value)} popularity` : `${value}/10 rating`,
                    name === 'avgPopularity' ? 'Avg Popularity' : 'Avg Rating'
                  ]}
                />
                <Legend />
                <Bar dataKey="avgPopularity" fill="#E50914" name="Avg Popularity" />
                <Bar dataKey="avgRating" fill="#FFD700" name="Avg Rating (×10)" />
              </BarChart>
            </ResponsiveContainer>
            <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {langPerf.slice(0, 10).map((lang, idx) => (
                <Chip
                  key={idx}
                  label={`${lang.language}: ${lang.count} titles, ${Math.round(lang.avgPopularity)} pop, ${lang.avgRating} rating`}
                  size="small"
                  sx={{ backgroundColor: COLORS[idx % COLORS.length], color: '#fff', fontSize: '0.7rem' }}
                />
              ))}
            </Box>
          </Paper>
        </Box>
      </Box>

      {/* Language Trends Over Time */}
      <Box sx={{ px: 2, mb: 4 }}>
        <Paper sx={{ p: 3, backgroundColor: '#1f1f1f', width: '100%' }}>
          <Typography variant="h6" gutterBottom>
            Language Evolution by Release Year (Top 8)
          </Typography>
          <ResponsiveContainer width="100%" height={400}>
            <AreaChart data={langByYearData.data}>
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
              {langByYearData.languages.map((lang, idx) => (
                <Area
                  key={lang}
                  type="monotone"
                  dataKey={lang}
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
    </Box>
  );
};

export default PerformanceAnalysis;
