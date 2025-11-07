import { format, getYear, getMonth } from 'date-fns';
import _ from 'lodash';

export const processExecutiveMetrics = (data) => {
  if (!data || data.length === 0) return {};

  const totalTitles = data.length;
  const uniqueCountries = new Set(data.flatMap(d => d.countries || []));
  const uniqueGenres = new Set(data.flatMap(d => d.genres || []));
  
  // Content type distribution
  const contentTypeCounts = _.countBy(data, 'type');
  const contentTypeDistribution = Object.entries(contentTypeCounts).map(([name, value]) => ({
    name,
    value,
  }));

  // Growth over time
  const dataByYear = _.groupBy(data.filter(d => d.date_added), d => 
    getYear(d.date_added)
  );
  const growthOverTime = Object.entries(dataByYear)
    .map(([year, items]) => ({
      year: parseInt(year),
      titles: items.length,
    }))
    .sort((a, b) => a.year - b.year);

  // Top genres
  const genreCounts = {};
  data.forEach(item => {
    (item.genres || []).forEach(genre => {
      genreCounts[genre] = (genreCounts[genre] || 0) + 1;
    });
  });
  
  const topGenres = Object.entries(genreCounts)
    .map(([genre, count]) => ({ genre, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  // Rating distribution
  const ratingCounts = _.countBy(data, 'rating');
  const mostCommonRating = Object.entries(ratingCounts)
    .sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A';

  // Key insights
  const keyInsights = [
    {
      title: 'Content Growth Acceleration',
      description: 'Netflix has increased content additions significantly over the years',
      impact: 'High',
    },
    {
      title: 'International Expansion',
      description: `International content represents ${(((data.filter(d => d.countries && d.countries.some(c => c !== 'United States')).length / data.length) * 100).toFixed(1))}% of catalog`,
      impact: 'High',
    },
    {
      title: 'Genre Diversity',
      description: `Netflix offers ${uniqueGenres.size} different genres in its catalog`,
      impact: 'Medium',
    },
    {
      title: 'Global Reach',
      description: `Content from ${uniqueCountries.size} countries in Netflix library`,
      impact: 'High',
    },
  ];

  return {
    totalTitles,
    totalCountries: uniqueCountries.size,
    totalGenres: uniqueGenres.size,
    avgContentAge: mostCommonRating,
    contentTypeDistribution,
    growthOverTime,
    topGenres,
    keyInsights,
    ratingDistribution: ratingCounts,
  };
};

export const processTrendData = (data, filters = {}) => {
  if (!data || data.length === 0) return {};

  let filteredData = [...data];

  // Apply filters
  if (filters.contentType && filters.contentType !== 'all') {
    filteredData = filteredData.filter(d => 
      d.type === (filters.contentType === 'movie' ? 'Movie' : 'TV Show')
    );
  }

  // Process addition timeline
  const timelineData = {};
  filteredData.forEach(item => {
    if (item.date_added) {
      const key = format(item.date_added, 'yyyy-MM');
      if (!timelineData[key]) {
        timelineData[key] = { movies: 0, tvShows: 0 };
      }
      if (item.type === 'Movie') {
        timelineData[key].movies++;
      } else {
        timelineData[key].tvShows++;
      }
    }
  });

  const additionTimeline = Object.entries(timelineData)
    .map(([date, counts]) => ({
      date,
      ...counts,
      total: counts.movies + counts.tvShows,
    }))
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(-36); // Last 36 months

  // Content age analysis
  const contentAgeByYear = {};
  filteredData.forEach(item => {
    if (item.date_added && item.release_year) {
      const yearAdded = getYear(item.date_added);
      const age = yearAdded - item.release_year;
      if (!contentAgeByYear[yearAdded]) {
        contentAgeByYear[yearAdded] = [];
      }
      contentAgeByYear[yearAdded].push(age);
    }
  });

  const contentAge = Object.entries(contentAgeByYear)
    .map(([year, ages]) => ({
      year: parseInt(year),
      avgAge: Math.round(_.mean(ages)),
    }))
    .sort((a, b) => a.year - b.year);

  // Growth rate calculation
  const yearlyTotals = _.countBy(
    filteredData.filter(d => d.date_added),
    d => getYear(d.date_added)
  );
  
  const growthRate = Object.keys(yearlyTotals)
    .sort()
    .map((year, index, arr) => {
      if (index === 0) return null;
      const prevYear = arr[index - 1];
      const growth = ((yearlyTotals[year] - yearlyTotals[prevYear]) / yearlyTotals[prevYear]) * 100;
      return {
        year: parseInt(year),
        growthRate: Math.round(growth * 10) / 10,
      };
    })
    .filter(Boolean);

  return {
    additionTimeline,
    contentAge,
    growthRate,
  };
};

export const processGeographicData = (data) => {
  if (!data || data.length === 0) return {};

  // Country production counts
  const countryCounts = {};
  data.forEach(item => {
    (item.countries || []).forEach(country => {
      countryCounts[country] = (countryCounts[country] || 0) + 1;
    });
  });

  const topCountries = Object.entries(countryCounts)
    .map(([country, count]) => ({ country, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 15);

  // Regional classification
  const regions = {
    'North America': ['United States', 'Canada', 'Mexico'],
    'Europe': ['United Kingdom', 'France', 'Germany', 'Spain', 'Italy', 'Netherlands', 'Sweden'],
    'Asia': ['India', 'Japan', 'South Korea', 'China', 'Thailand', 'Philippines'],
    'Latin America': ['Brazil', 'Argentina', 'Colombia', 'Chile', 'Peru'],
  };

  const regionalDistribution = {};
  Object.entries(countryCounts).forEach(([country, count]) => {
    let assigned = false;
    for (const [region, countries] of Object.entries(regions)) {
      if (countries.includes(country)) {
        regionalDistribution[region] = (regionalDistribution[region] || 0) + count;
        assigned = true;
        break;
      }
    }
    if (!assigned) {
      regionalDistribution['Others'] = (regionalDistribution['Others'] || 0) + count;
    }
  });

  return {
    topCountries,
    regionalDistribution: Object.entries(regionalDistribution).map(([region, count]) => ({
      region,
      count,
    })),
  };
};

export const processGenreData = (data) => {
  if (!data || data.length === 0) return {};

  const genreCounts = {};
  const genreByYear = {};
  
  data.forEach(item => {
    const year = item.date_added ? getYear(item.date_added) : null;
    
    (item.genres || []).forEach(genre => {
      genreCounts[genre] = (genreCounts[genre] || 0) + 1;
      
      if (year) {
        if (!genreByYear[year]) genreByYear[year] = {};
        genreByYear[year][genre] = (genreByYear[year][genre] || 0) + 1;
      }
    });
  });

  const topGenres = Object.entries(genreCounts)
    .map(([genre, count]) => ({ genre, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 15);

  // Genre co-occurrence
  const coOccurrence = {};
  data.forEach(item => {
    const genres = item.genres || [];
    genres.forEach((genre1, i) => {
      genres.forEach((genre2, j) => {
        if (i < j) {
          const pair = [genre1, genre2].sort().join(' & ');
          coOccurrence[pair] = (coOccurrence[pair] || 0) + 1;
        }
      });
    });
  });

  const topGenrePairs = Object.entries(coOccurrence)
    .map(([pair, count]) => ({ pair, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  return {
    topGenres,
    topGenrePairs,
  };
};

export const processCreatorData = (data) => {
  if (!data || data.length === 0) return {};

  const directorCounts = {};
  const actorCounts = {};
  
  data.forEach(item => {
    (item.directors || []).forEach(director => {
      if (director && director !== 'Not Given') {
        directorCounts[director] = (directorCounts[director] || 0) + 1;
      }
    });
    
    (item.cast || []).forEach(actor => {
      if (actor) {
        actorCounts[actor] = (actorCounts[actor] || 0) + 1;
      }
    });
  });

  const topDirectors = Object.entries(directorCounts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 15);

  const topActors = Object.entries(actorCounts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 15);

  return {
    topDirectors,
    topActors,
  };
};
