import React, { useState, useMemo } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  TextField,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  Button,
} from '@mui/material';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const ContentExplorer = ({ data }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [contentType, setContentType] = useState('all');
  const [sortBy, setSortBy] = useState('title');
  const [displayCount, setDisplayCount] = useState(10);

  const filteredData = useMemo(() => {
    let filtered = [...(data || [])];

    if (contentType !== 'all') {
      filtered = filtered.filter(d => d.type === contentType);
    }

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(d => 
        d.title?.toLowerCase().includes(term) ||
        d.genres?.some(g => g.toLowerCase().includes(term))
      );
    }

    if (sortBy === 'rating') {
      filtered.sort((a, b) => (b.rating || '').localeCompare(a.rating || ''));
    } else if (sortBy === 'release_year') {
      filtered.sort((a, b) => (b.release_year || 0) - (a.release_year || 0));
    } else {
      filtered.sort((a, b) => (a.title || '').localeCompare(b.title || ''));
    }

    return filtered;
  }, [data, searchTerm, contentType, sortBy]);

  // Rating distribution
  const ratingDistribution = useMemo(() => {
    const counts = {};
    (data || []).forEach(item => {
      const rating = item.rating || 'Not Rated';
      counts[rating] = (counts[rating] || 0) + 1;
    });
    return Object.entries(counts)
      .map(([rating, count]) => ({ rating, count }))
      .sort((a, b) => b.count - a.count);
  }, [data]);

  // Type distribution
  const typeData = useMemo(() => {
    const counts = {};
    (data || []).forEach(item => {
      counts[item.type] = (counts[item.type] || 0) + 1;
    });
    return Object.entries(counts).map(([type, count]) => ({ type, count }));
  }, [data]);

  return (
    <Box sx={{ width: '100%', maxWidth: '100%', px: 0 }}>
      <Typography variant="h3" gutterBottom sx={{ color: '#E50914', mb: 3, px: 2 }}>
        Content Explorer
      </Typography>

      {/* Filters full width */}
      <Box sx={{ px: 2, mb: 3 }}>
        <Paper sx={{ p: 3, backgroundColor: '#1f1f1f', width: '100%' }}>
          <Box
            sx={{
              display: 'grid',
              gap: 16,
              gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
              alignItems: 'stretch',
            }}
          >
            <TextField
              placeholder="Search by title or genre..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              sx={{ '& .MuiOutlinedInput-root': { color: '#fff' } }}
            />
            <FormControl>
              <InputLabel>Content Type</InputLabel>
              <Select value={contentType} label="Content Type" onChange={(e) => setContentType(e.target.value)}>
                <MenuItem value="all">All Content</MenuItem>
                <MenuItem value="Movie">Movies</MenuItem>
                <MenuItem value="TV Show">TV Shows</MenuItem>
              </Select>
            </FormControl>
            <FormControl>
              <InputLabel>Sort By</InputLabel>
              <Select value={sortBy} label="Sort By" onChange={(e) => setSortBy(e.target.value)}>
                <MenuItem value="title">Title (A-Z)</MenuItem>
                <MenuItem value="release_year">Release Year</MenuItem>
                <MenuItem value="rating">Rating</MenuItem>
              </Select>
            </FormControl>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography variant="caption" sx={{ color: '#888' }}>
                Found: {filteredData.length} titles
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Box>

      {/* Charts Overview responsive grid */}
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
        <Paper sx={{ p: 3, backgroundColor: '#1f1f1f', width: '100%' }}>
          <Typography variant="h6" gutterBottom>
            Content Type Distribution
          </Typography>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={typeData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis dataKey="type" stroke="#fff" />
              <YAxis stroke="#fff" />
              <Tooltip />
              <Bar dataKey="count" fill="#E50914" />
            </BarChart>
          </ResponsiveContainer>
        </Paper>
        <Paper sx={{ p: 3, backgroundColor: '#1f1f1f', width: '100%' }}>
          <Typography variant="h6" gutterBottom>
            Top Ratings
          </Typography>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={ratingDistribution.slice(0, 8)}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis dataKey="rating" stroke="#fff" />
              <YAxis stroke="#fff" />
              <Tooltip />
              <Bar dataKey="count" fill="#831010" />
            </BarChart>
          </ResponsiveContainer>
        </Paper>
      </Box>

      {/* Content List full width */}
      <Box sx={{ px: 2 }}>
        <Paper sx={{ p: 3, backgroundColor: '#1f1f1f', width: '100%' }}>
        <Typography variant="h6" gutterBottom>
          Content List ({filteredData.length} results)
        </Typography>
        <Box sx={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #333' }}>
                <th style={{ textAlign: 'left', padding: '12px', color: '#E50914' }}>Title</th>
                <th style={{ textAlign: 'left', padding: '12px', color: '#E50914' }}>Type</th>
                <th style={{ textAlign: 'left', padding: '12px', color: '#E50914' }}>Rating</th>
                <th style={{ textAlign: 'left', padding: '12px', color: '#E50914' }}>Release Year</th>
                <th style={{ textAlign: 'left', padding: '12px', color: '#E50914' }}>Genres</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.slice(0, displayCount).map((item, index) => (
                <tr key={index} style={{ borderBottom: '1px solid #333' }}>
                  <td style={{ padding: '12px', color: '#fff' }}>{item.title}</td>
                  <td style={{ padding: '12px', color: '#ccc' }}>{item.type}</td>
                  <td style={{ padding: '12px', color: '#ccc' }}>{item.rating || 'N/A'}</td>
                  <td style={{ padding: '12px', color: '#ccc' }}>{item.release_year || 'N/A'}</td>
                  <td style={{ padding: '12px', color: '#ccc' }}>
                    {item.genres?.slice(0, 2).join(', ') || 'N/A'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Box>
        {displayCount < filteredData.length && (
          <Box sx={{ mt: 2, textAlign: 'center' }}>
            <Button
              variant="outlined"
              sx={{ color: '#E50914', borderColor: '#E50914' }}
              onClick={() => setDisplayCount(displayCount + 10)}
            >
              Load More
            </Button>
          </Box>
        )}
        </Paper>
      </Box>
    </Box>
  );
};

export default ContentExplorer;
