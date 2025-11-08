export const loadNetflixData = async () => {
  try {
    const response = await fetch('/netflix_data.json');
    if (!response.ok) {
      throw new Error(`Failed to load data: ${response.statusText}`);
    }
    const data = await response.json();
    return processRawData(data);
  } catch (error) {
    console.error('Error loading data:', error);
    throw error;
  }
};

// Keep backward compatibility
export const loadData = loadNetflixData;

const normalizeType = (val) => {
  if (!val) return 'Unknown';
  const t = String(val).trim().toLowerCase();
  if (['movie', 'movies', 'film'].includes(t)) return 'Movie';
  if (
    ['tv show', 'tv shows', 'tv-show', 'tv series', 'tv-series', 'series', 'show', 'tvshow'].includes(
      t
    )
  )
    return 'TV Show';
  return val; // fall back to original for visibility
};

const processRawData = (rawData) => {
  return rawData.map(row => {
    const toArray = (value) => {
      if (!value) return [];
      if (Array.isArray(value)) return value;
      return String(value)
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean);
    };

    return {
      ...row,
      type: normalizeType(row.type),
      date_added: row.date_added ? new Date(row.date_added) : null,
      countries: toArray(row.countries ?? row.country),
      genres: toArray(row.genres ?? row.listed_in),
      cast: toArray(row.cast),
      directors: toArray(row.directors ?? row.director),
      release_year: row.release_year || (row.date_added ? new Date(row.date_added).getFullYear() : null),
    };
  });
};
