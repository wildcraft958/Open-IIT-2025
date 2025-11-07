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
  Slider,
  Chip,
  OutlinedInput,
  Checkbox,
  ListItemText,
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

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const ContentExplorer = ({ data }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [contentType, setContentType] = useState('all');
  const [sortBy, setSortBy] = useState('title');
  const [secondarySort, setSecondarySort] = useState('release_year');
  const [displayCount, setDisplayCount] = useState(10);
  const [exporting, setExporting] = useState(false);
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [selectedCountries, setSelectedCountries] = useState([]);
  const [yearRange, setYearRange] = useState([1950, 2025]);
  const [visibleColumns, setVisibleColumns] = useState(['title', 'type', 'rating', 'release_year', 'genres']);

  // Get unique genres and countries for multiselect
  const allGenres = useMemo(() => {
    const genres = new Set();
    (data || []).forEach(item => {
      (item.genres || []).forEach(g => genres.add(g));
    });
    return Array.from(genres).sort();
  }, [data]);

  const allCountries = useMemo(() => {
    const countries = new Set();
    (data || []).forEach(item => {
      (item.countries || []).forEach(c => countries.add(c));
    });
    return Array.from(countries).sort();
  }, [data]);

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

    if (selectedGenres.length > 0) {
      filtered = filtered.filter(d => 
        d.genres?.some(g => selectedGenres.includes(g))
      );
    }

    if (selectedCountries.length > 0) {
      filtered = filtered.filter(d => 
        d.countries?.some(c => selectedCountries.includes(c))
      );
    }

    if (yearRange) {
      filtered = filtered.filter(d => 
        d.release_year >= yearRange[0] && d.release_year <= yearRange[1]
      );
    }

    const primaryComparator = (a, b) => {
      if (sortBy === 'rating') return (b.rating || '').localeCompare(a.rating || '');
      if (sortBy === 'release_year') return (b.release_year || 0) - (a.release_year || 0);
      return (a.title || '').localeCompare(b.title || '');
    };
    const secondaryComparator = (a, b) => {
      if (secondarySort === 'rating') return (b.rating || '').localeCompare(a.rating || '');
      if (secondarySort === 'release_year') return (b.release_year || 0) - (a.release_year || 0);
      return (a.title || '').localeCompare(b.title || '');
    };
    filtered.sort((a, b) => {
      const primary = primaryComparator(a, b);
      if (primary !== 0) return primary;
      return secondaryComparator(a, b);
    });

    return filtered;
  }, [data, searchTerm, contentType, sortBy, secondarySort, selectedGenres, selectedCountries, yearRange]);

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

  // Quick facts (global, not filtered)
  const quickFacts = useMemo(() => {
    const movies = (data || []).filter(d => d.type === 'Movie').length;
    const tv = (data || []).filter(d => d.type === 'TV Show').length;
    const genres = new Set((data || []).flatMap(d => d.genres || []));
    const countries = new Set((data || []).flatMap(d => d.countries || []));
    return {
      total: (data || []).length,
      movies,
      tv,
      genres: genres.size,
      countries: countries.size,
      topRating: ratingDistribution[0]?.rating || 'N/A',
    };
  }, [data, ratingDistribution]);

  const handleExport = () => {
    try {
      setExporting(true);
      const rows = filteredData.map(row => ({
        title: row.title,
        type: row.type,
        rating: row.rating || '',
        release_year: row.release_year || '',
        genres: (row.genres || []).join('|'),
        countries: (row.countries || []).join('|'),
      }));
      const header = Object.keys(rows[0] || { title: '', type: '', rating: '', release_year: '', genres: '', countries: '' });
      const csv = [header.join(','), ...rows.map(r => header.map(h => `"${String(r[h]).replace(/"/g, '""')}"`).join(','))].join('\n');
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `content_export_${Date.now()}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (e) {
      console.error('Export failed', e);
    } finally {
      setExporting(false);
    }
  };

  return (
    <Box sx={{ width: '100%', maxWidth: '100%', px: 0 }}>
      <Typography variant="h3" gutterBottom sx={{ color: '#E50914', mb: 3, px: 2 }}>
        Content Explorer
      </Typography>

      {/* Quick Facts Ribbon */}
      <Box sx={{ px: 2, mb: 2 }}>
        <Paper sx={{ p: 2, backgroundColor: '#1b1b1b', display: 'grid', gap: 16, gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))' }}>
          {[
            { label: 'Total Titles', value: quickFacts.total },
            { label: 'Movies', value: quickFacts.movies },
            { label: 'TV Shows', value: quickFacts.tv },
            { label: 'Genres', value: quickFacts.genres },
            { label: 'Countries', value: quickFacts.countries },
            { label: 'Top Rating', value: quickFacts.topRating },
          ].map((fact, i) => (
            <Box key={i} sx={{ p: 1.5, backgroundColor: '#222', borderLeft: '3px solid #E50914', borderRadius: 1 }}>
              <Typography variant="caption" sx={{ color: '#888' }}>{fact.label}</Typography>
              <Typography variant="h6" sx={{ mt: 0.5 }}>{fact.value}</Typography>
            </Box>
          ))}
        </Paper>
      </Box>

      {/* Filters full width */}
      <Box sx={{ px: 2, mb: 3 }}>
        <Paper sx={{ p: 3, backgroundColor: '#1f1f1f', width: '100%' }}>
          <Typography variant="h6" gutterBottom sx={{ color: '#E50914', mb: 2 }}>
            Filter & Search Controls
          </Typography>
          <Box
            sx={{
              display: 'grid',
              gap: 16,
              gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
              alignItems: 'stretch',
              mb: 3,
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
              <InputLabel>Genres (Multi-select)</InputLabel>
              <Select
                multiple
                value={selectedGenres}
                onChange={(e) => setSelectedGenres(typeof e.target.value === 'string' ? e.target.value.split(',') : e.target.value)}
                input={<OutlinedInput label="Genres (Multi-select)" />}
                renderValue={(selected) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {selected.map((value) => (
                      <Chip key={value} label={value} size="small" sx={{ backgroundColor: '#E50914', color: '#fff' }} />
                    ))}
                  </Box>
                )}
                MenuProps={MenuProps}
              >
                {allGenres.map((genre) => (
                  <MenuItem key={genre} value={genre}>
                    <Checkbox checked={selectedGenres.indexOf(genre) > -1} />
                    <ListItemText primary={genre} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl>
              <InputLabel>Countries (Multi-select)</InputLabel>
              <Select
                multiple
                value={selectedCountries}
                onChange={(e) => setSelectedCountries(typeof e.target.value === 'string' ? e.target.value.split(',') : e.target.value)}
                input={<OutlinedInput label="Countries (Multi-select)" />}
                renderValue={(selected) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {selected.slice(0, 2).map((value) => (
                      <Chip key={value} label={value} size="small" sx={{ backgroundColor: '#831010', color: '#fff' }} />
                    ))}
                    {selected.length > 2 && <Chip label={`+${selected.length - 2}`} size="small" />}
                  </Box>
                )}
                MenuProps={MenuProps}
              >
                {allCountries.slice(0, 50).map((country) => (
                  <MenuItem key={country} value={country}>
                    <Checkbox checked={selectedCountries.indexOf(country) > -1} />
                    <ListItemText primary={country} />
                  </MenuItem>
                ))}
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
            <FormControl>
              <InputLabel>Secondary Sort</InputLabel>
              <Select value={secondarySort} label="Secondary Sort" onChange={(e) => setSecondarySort(e.target.value)}>
                <MenuItem value="title">Title (A-Z)</MenuItem>
                <MenuItem value="release_year">Release Year</MenuItem>
                <MenuItem value="rating">Rating</MenuItem>
              </Select>
            </FormControl>
          </Box>

          {/* Year Range Slider */}
          <Box sx={{ mb: 3, px: 2 }}>
            <Typography variant="body2" sx={{ color: '#999', mb: 1 }}>
              Release Year Range: {yearRange[0]} - {yearRange[1]}
            </Typography>
            <Slider
              value={yearRange}
              onChange={(e, newValue) => setYearRange(newValue)}
              valueLabelDisplay="auto"
              min={1950}
              max={2025}
              sx={{
                color: '#E50914',
                '& .MuiSlider-thumb': {
                  backgroundColor: '#E50914',
                },
                '& .MuiSlider-track': {
                  backgroundColor: '#E50914',
                },
                '& .MuiSlider-rail': {
                  backgroundColor: '#666',
                },
              }}
            />
          </Box>

          {/* Column Toggles */}
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" sx={{ color: '#999', mb: 1 }}>
              Visible Columns:
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {['title', 'type', 'rating', 'release_year', 'genres', 'countries', 'duration'].map((col) => (
                <Chip
                  key={col}
                  label={col.replace('_', ' ').toUpperCase()}
                  onClick={() => {
                    if (visibleColumns.includes(col)) {
                      setVisibleColumns(visibleColumns.filter(c => c !== col));
                    } else {
                      setVisibleColumns([...visibleColumns, col]);
                    }
                  }}
                  color={visibleColumns.includes(col) ? 'primary' : 'default'}
                  sx={{
                    backgroundColor: visibleColumns.includes(col) ? '#E50914' : '#2a2a2a',
                    color: '#fff',
                    '&:hover': {
                      backgroundColor: visibleColumns.includes(col) ? '#c20710' : '#3a3a3a',
                    },
                  }}
                />
              ))}
            </Box>
          </Box>

          {/* Action Buttons */}
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
            <Typography variant="body2" sx={{ color: '#888' }}>
              Found: <strong style={{ color: '#E50914' }}>{filteredData.length}</strong> titles
            </Typography>
            <Button
              variant="outlined"
              disabled={exporting || filteredData.length === 0}
              onClick={handleExport}
              sx={{ color: '#fff', borderColor: '#E50914', textTransform: 'none' }}
            >
              {exporting ? 'Exporting…' : 'Export CSV'}
            </Button>
            <Button
              variant="text"
              onClick={() => {
                setSearchTerm('');
                setContentType('all');
                setSelectedGenres([]);
                setSelectedCountries([]);
                setYearRange([1950, 2025]);
              }}
              sx={{ color: '#999', textTransform: 'none' }}
            >
              Reset Filters
            </Button>
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
          <Typography variant="h6" gutterBottom>
            Top Ratings
          </Typography>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={ratingDistribution.slice(0, 8)}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis dataKey="rating" stroke="#fff" />
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
                {visibleColumns.includes('title') && <th style={{ textAlign: 'left', padding: '12px', color: '#E50914' }}>Title</th>}
                {visibleColumns.includes('type') && <th style={{ textAlign: 'left', padding: '12px', color: '#E50914' }}>Type</th>}
                {visibleColumns.includes('rating') && <th style={{ textAlign: 'left', padding: '12px', color: '#E50914' }}>Rating</th>}
                {visibleColumns.includes('release_year') && <th style={{ textAlign: 'left', padding: '12px', color: '#E50914' }}>Release Year</th>}
                {visibleColumns.includes('genres') && <th style={{ textAlign: 'left', padding: '12px', color: '#E50914' }}>Genres</th>}
                {visibleColumns.includes('countries') && <th style={{ textAlign: 'left', padding: '12px', color: '#E50914' }}>Countries</th>}
                {visibleColumns.includes('duration') && <th style={{ textAlign: 'left', padding: '12px', color: '#E50914' }}>Duration</th>}
              </tr>
            </thead>
            <tbody>
              {filteredData.slice(0, displayCount).map((item, index) => (
                <tr key={index} style={{ borderBottom: '1px solid #333' }}>
                  {visibleColumns.includes('title') && <td style={{ padding: '12px', color: '#fff' }}>{item.title}</td>}
                  {visibleColumns.includes('type') && <td style={{ padding: '12px', color: '#ccc' }}>{item.type}</td>}
                  {visibleColumns.includes('rating') && <td style={{ padding: '12px', color: '#ccc' }}>{item.rating || 'N/A'}</td>}
                  {visibleColumns.includes('release_year') && <td style={{ padding: '12px', color: '#ccc' }}>{item.release_year || 'N/A'}</td>}
                  {visibleColumns.includes('genres') && <td style={{ padding: '12px', color: '#ccc' }}>
                    {item.genres?.slice(0, 2).join(', ') || 'N/A'}
                  </td>}
                  {visibleColumns.includes('countries') && <td style={{ padding: '12px', color: '#ccc' }}>
                    {item.countries?.slice(0, 2).join(', ') || 'N/A'}
                  </td>}
                  {visibleColumns.includes('duration') && <td style={{ padding: '12px', color: '#ccc' }}>{item.duration || 'N/A'}</td>}
                </tr>
              ))}
            </tbody>
          </table>
        </Box>
        {displayCount < filteredData.length && (
          <Box sx={{ mt: 2, textAlign: 'center' }}>
            <Button
              variant="outlined"
              sx={{ color: '#fdfdfdff', borderColor: '#E50914' }}
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
