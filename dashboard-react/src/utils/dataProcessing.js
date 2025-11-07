import { format, getYear } from 'date-fns';
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
  const ratingMix = Object.entries(ratingCounts)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 8);

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
    ratingMix,
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
    countryCounts,
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

/**
 * Comprehensive breakdown functions for advanced analytics
 */

export const additionsByReleaseDecade = (data) => {
  if (!data || data.length === 0) return [];

  const decadeCounts = {};
  data.forEach(item => {
    if (item.release_year) {
      const decade = Math.floor(item.release_year / 10) * 10;
      decadeCounts[decade] = (decadeCounts[decade] || 0) + 1;
    }
  });

  return Object.entries(decadeCounts)
    .map(([decade, count]) => ({
      decade: `${decade}s`,
      count,
      label: `${decade}–${decade + 9}`,
    }))
    .sort((a, b) => parseInt(a.decade) - parseInt(b.decade));
};

export const ageByAddedYear = (data) => {
  if (!data || data.length === 0) return [];

  const ageByYear = {};
  data.forEach(item => {
    if (item.date_added && item.release_year) {
      const yearAdded = getYear(item.date_added);
      if (!ageByYear[yearAdded]) ageByYear[yearAdded] = [];
      const age = yearAdded - item.release_year;
      ageByYear[yearAdded].push(Math.max(0, age));
    }
  });

  return Object.entries(ageByYear)
    .map(([year, ages]) => ({
      year: parseInt(year),
      avgAge: Math.round(_.mean(ages) * 10) / 10,
      maxAge: Math.max(...ages),
      minAge: Math.min(...ages),
    }))
    .sort((a, b) => a.year - b.year)
    .slice(-15); // Last 15 years
};

export const regionalDistributionWithDeltas = (data) => {
  if (!data || data.length === 0) return {};

  const regions = {
    'North America': ['United States', 'Canada', 'Mexico'],
    'Europe': ['United Kingdom', 'France', 'Germany', 'Spain', 'Italy', 'Netherlands', 'Sweden', 'Belgium', 'Poland', 'Portugal'],
    'Asia': ['India', 'Japan', 'South Korea', 'China', 'Thailand', 'Philippines', 'Taiwan', 'Indonesia', 'Vietnam'],
    'Latin America': ['Brazil', 'Argentina', 'Colombia', 'Chile', 'Peru', 'Mexico', 'Venezuela'],
    'Middle East & Africa': ['Nigeria', 'Egypt', 'South Africa', 'Israel', 'United Arab Emirates'],
    'Oceania': ['Australia', 'New Zealand'],
  };

  const regionCounts = {};
  const regionYearly = {};
  
  data.forEach(item => {
    const year = item.date_added ? getYear(item.date_added) : null;
    (item.countries || []).forEach(country => {
      let assigned = false;
      for (const [region, countries] of Object.entries(regions)) {
        if (countries.includes(country)) {
          regionCounts[region] = (regionCounts[region] || 0) + 1;
          if (year) {
            if (!regionYearly[year]) regionYearly[year] = {};
            regionYearly[year][region] = (regionYearly[year][region] || 0) + 1;
          }
          assigned = true;
          break;
        }
      }
      if (!assigned) {
        regionCounts['Others'] = (regionCounts['Others'] || 0) + 1;
        if (year) {
          if (!regionYearly[year]) regionYearly[year] = {};
          regionYearly[year]['Others'] = (regionYearly[year]['Others'] || 0) + 1;
        }
      }
    });
  });

  const regionList = Object.entries(regionCounts)
    .map(([region, count]) => ({ region, count }))
    .sort((a, b) => b.count - a.count);

  return { regionList, regionYearly };
};

export const countryGenreMatrix = (data, topCountries = 15, topGenres = 15) => {
  if (!data || data.length === 0) return [];

  const countryCounts = {};
  const genreCounts = {};
  const matrix = {};

  data.forEach(item => {
    (item.countries || []).forEach(country => {
      countryCounts[country] = (countryCounts[country] || 0) + 1;
      (item.genres || []).forEach(genre => {
        genreCounts[genre] = (genreCounts[genre] || 0) + 1;
        const key = `${country}|${genre}`;
        matrix[key] = (matrix[key] || 0) + 1;
      });
    });
  });

  const topCountriesList = Object.keys(countryCounts)
    .sort((a, b) => countryCounts[b] - countryCounts[a])
    .slice(0, topCountries);
  
  const topGenresList = Object.keys(genreCounts)
    .sort((a, b) => genreCounts[b] - genreCounts[a])
    .slice(0, topGenres);

  const result = topCountriesList.map(country => {
    const row = { country };
    topGenresList.forEach(genre => {
      row[genre] = matrix[`${country}|${genre}`] || 0;
    });
    return row;
  });

  return result;
};

export const genreMomentum = (data, window = 24) => {
  if (!data || data.length === 0) return [];

  const genreByMonth = {};

  data.forEach(item => {
    if (item.date_added) {
      const month = format(item.date_added, 'yyyy-MM');
      if (!genreByMonth[month]) genreByMonth[month] = {};
      (item.genres || []).forEach(genre => {
        genreByMonth[month][genre] = (genreByMonth[month][genre] || 0) + 1;
      });
    }
  });

  const months = Object.keys(genreByMonth).sort().slice(-window);
  const allGenres = new Set();
  months.forEach(m => {
    Object.keys(genreByMonth[m] || {}).forEach(g => allGenres.add(g));
  });

  const genreList = Array.from(allGenres);
  const momentum = {};

  genreList.forEach(genre => {
    const recent = months.slice(-6).reduce((sum, m) => sum + (genreByMonth[m]?.[genre] || 0), 0);
    const previous = months.slice(-12, -6).reduce((sum, m) => sum + (genreByMonth[m]?.[genre] || 0), 0);
    const delta = previous > 0 ? ((recent - previous) / previous * 100) : 0;
    momentum[genre] = { recent, previous, delta };
  });

  return Object.entries(momentum)
    .map(([genre, { recent, previous, delta }]) => ({ genre, recent, previous, delta: Math.round(delta) }))
    .sort((a, b) => b.delta - a.delta)
    .slice(0, 15);
};

export const coOccurrenceMatrix = (data, top = 20) => {
  if (!data || data.length === 0) return [];

  const coOccurrence = {};
  const genreCounts = {};

  data.forEach(item => {
    const genres = item.genres || [];
    genres.forEach(g => {
      genreCounts[g] = (genreCounts[g] || 0) + 1;
    });
    genres.forEach((g1, i) => {
      genres.forEach((g2, j) => {
        if (i < j) {
          const key = [g1, g2].sort().join(' & ');
          coOccurrence[key] = (coOccurrence[key] || 0) + 1;
        }
      });
    });
  });

  return Object.entries(coOccurrence)
    .map(([pair, count]) => {
      const [g1, g2] = pair.split(' & ');
      return {
        pair,
        g1,
        g2,
        count,
        weight: Math.min(100, Math.max(5, (count / 50) * 100)), // Normalized for visualization
      };
    })
    .sort((a, b) => b.count - a.count)
    .slice(0, top);
};

export const genreOverTime = (data, top = 10) => {
  if (!data || data.length === 0) return [];

  const genreByYear = {};
  data.forEach(item => {
    if (item.date_added) {
      const year = getYear(item.date_added);
      if (!genreByYear[year]) genreByYear[year] = {};
      (item.genres || []).forEach(genre => {
        genreByYear[year][genre] = (genreByYear[year][genre] || 0) + 1;
      });
    }
  });

  const genreCounts = {};
  Object.values(genreByYear).forEach(yearGenres => {
    Object.keys(yearGenres).forEach(genre => {
      genreCounts[genre] = (genreCounts[genre] || 0) + 1;
    });
  });

  const topGenres = Object.keys(genreCounts)
    .sort((a, b) => genreCounts[b] - genreCounts[a])
    .slice(0, top);

  const years = Object.keys(genreByYear).sort().map(Number);
  const result = years.map(year => {
    const row = { year };
    topGenres.forEach(genre => {
      row[genre] = genreByYear[year]?.[genre] || 0;
    });
    return row;
  });

  return result;
};

export const newCreatorsByYear = (data) => {
  if (!data || data.length === 0) return { directors: [], actors: [] };

  const directorFirstYear = {};
  const actorFirstYear = {};

  data.forEach(item => {
    const year = item.date_added ? getYear(item.date_added) : item.release_year;
    if (year) {
      (item.directors || []).forEach(director => {
        if (director && director !== 'Not Given') {
          if (!directorFirstYear[director]) directorFirstYear[director] = year;
        }
      });
      (item.cast || []).forEach(actor => {
        if (actor) {
          if (!actorFirstYear[actor]) actorFirstYear[actor] = year;
        }
      });
    }
  });

  const directorsByYear = _.countBy(Object.values(directorFirstYear));
  const actorsByYear = _.countBy(Object.values(actorFirstYear));

  const directors = Object.entries(directorsByYear)
    .map(([year, count]) => ({ year: parseInt(year), newCreators: count }))
    .sort((a, b) => a.year - b.year);

  const actors = Object.entries(actorsByYear)
    .map(([year, count]) => ({ year: parseInt(year), newCreators: count }))
    .sort((a, b) => a.year - b.year);

  return { directors, actors };
};

export const topCreatorsByAvgRating = (data, role = 'director', minTitles = 3) => {
  if (!data || data.length === 0) return [];

  const ratingMap = {
    'G': 1, 'TV-Y': 1, 'TV-Y7': 2,
    'PG': 3, 'TV-G': 3,
    'PG-13': 4, 'TV-PG': 4,
    'R': 5, 'TV-14': 5,
    'NC-17': 6, 'TV-MA': 6,
  };

  const creatorTitles = {};
  const creatorRatings = {};

  if (role === 'director') {
    data.forEach(item => {
      (item.directors || []).forEach(director => {
        if (director && director !== 'Not Given') {
          creatorTitles[director] = (creatorTitles[director] || 0) + 1;
          creatorRatings[director] = creatorRatings[director] || [];
          creatorRatings[director].push(ratingMap[item.rating] || 3);
        }
      });
    });
  } else if (role === 'actor') {
    data.forEach(item => {
      (item.cast || []).forEach(actor => {
        if (actor) {
          creatorTitles[actor] = (creatorTitles[actor] || 0) + 1;
          creatorRatings[actor] = creatorRatings[actor] || [];
          creatorRatings[actor].push(ratingMap[item.rating] || 3);
        }
      });
    });
  }

  return Object.entries(creatorTitles)
    .filter(([, count]) => count >= minTitles)
    .map(([name, count]) => ({
      name,
      titles: count,
      avgRating: Math.round(_.mean(creatorRatings[name]) * 10) / 10,
    }))
    .sort((a, b) => b.avgRating - a.avgRating)
    .slice(0, 15);
};

export const qualityReport = (data) => {
  if (!data || data.length === 0) return {};

  const movies = data.filter(d => d.type === 'Movie');
  const tvShows = data.filter(d => d.type === 'TV Show');

  const countComplete = (items) => items.filter(d => d.title && d.rating && d.release_year && d.countries?.length > 0 && d.genres?.length > 0).length;

  const moviesWithDuration = movies.filter(d => d.duration && /min/.test(d.duration)).length;
  const tvWithSeasons = tvShows.filter(d => d.duration && /season/.test(d.duration)).length;

  const ratingDistribution = _.countBy(data, 'rating');
  const topRatings = Object.entries(ratingDistribution)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([rating, count]) => ({ rating, count, pct: Math.round((count / data.length) * 100) }));

  return {
    total: data.length,
    movies: movies.length,
    tvShows: tvShows.length,
    completeRecords: countComplete(data),
    completeness: Math.round((countComplete(data) / data.length) * 100),
    moviesWithRuntime: moviesWithDuration,
    tvWithSeasons: tvWithSeasons,
    avgReleaseYear: Math.round(_.mean(data.map(d => d.release_year).filter(Boolean))),
    topRatings,
    withoutRating: data.filter(d => !d.rating).length,
    withoutCountry: data.filter(d => !d.countries?.length).length,
    withoutGenre: data.filter(d => !d.genres?.length).length,
  };
};

/**
 * Additional utility functions for enhanced analytics
 */

export const computeFreshness = (data) => {
  if (!data || data.length === 0) return { score: 0, category: 'Unknown' };

  const now = new Date();
  const recentThreshold = 365; // 1 year
  const staleThreshold = 730; // 2 years

  const contentAges = data
    .filter(d => d.date_added)
    .map(d => Math.floor((now - d.date_added) / (1000 * 60 * 60 * 24))); // Days since added

  if (contentAges.length === 0) return { score: 0, category: 'Unknown' };

  const recentCount = contentAges.filter(age => age <= recentThreshold).length;
  const staleCount = contentAges.filter(age => age > staleThreshold).length;
  const avgAge = _.mean(contentAges);

  const freshnessScore = Math.round((recentCount / data.length) * 100);
  
  let category;
  if (freshnessScore >= 30) category = 'Very Fresh';
  else if (freshnessScore >= 20) category = 'Fresh';
  else if (freshnessScore >= 10) category = 'Moderate';
  else category = 'Stale';

  return {
    score: freshnessScore,
    category,
    avgDaysSinceAdded: Math.round(avgAge),
    recentCount,
    staleCount,
    totalAnalyzed: contentAges.length,
  };
};

export const computeDurationStats = (data) => {
  if (!data || data.length === 0) return {};

  const movies = data.filter(d => d.type === 'Movie' && d.duration && /min/.test(d.duration));
  const tvShows = data.filter(d => d.type === 'TV Show' && d.duration && /season/i.test(d.duration));

  const movieDurations = movies.map(m => {
    const match = m.duration.match(/(\d+)\s*min/);
    return match ? parseInt(match[1]) : null;
  }).filter(Boolean);

  const tvSeasons = tvShows.map(tv => {
    const match = tv.duration.match(/(\d+)\s*season/i);
    return match ? parseInt(match[1]) : null;
  }).filter(Boolean);

  return {
    movies: {
      count: movieDurations.length,
      avg: Math.round(_.mean(movieDurations) || 0),
      median: Math.round(movieDurations.length > 0 ? movieDurations.sort((a, b) => a - b)[Math.floor(movieDurations.length / 2)] : 0),
      min: Math.min(...movieDurations, Infinity) === Infinity ? 0 : Math.min(...movieDurations),
      max: Math.max(...movieDurations, -Infinity) === -Infinity ? 0 : Math.max(...movieDurations),
    },
    tvShows: {
      count: tvSeasons.length,
      avg: Math.round((_.mean(tvSeasons) || 0) * 10) / 10,
      median: tvSeasons.length > 0 ? tvSeasons.sort((a, b) => a - b)[Math.floor(tvSeasons.length / 2)] : 0,
      min: Math.min(...tvSeasons, Infinity) === Infinity ? 0 : Math.min(...tvSeasons),
      max: Math.max(...tvSeasons, -Infinity) === -Infinity ? 0 : Math.max(...tvSeasons),
    },
  };
};

export const additionsByMonth = (data, months = 12) => {
  if (!data || data.length === 0) return [];

  const monthlyData = {};
  data.forEach(item => {
    if (item.date_added) {
      const month = format(item.date_added, 'yyyy-MM');
      monthlyData[month] = (monthlyData[month] || 0) + 1;
    }
  });

  return Object.entries(monthlyData)
    .map(([month, count]) => ({ month, count }))
    .sort((a, b) => a.month.localeCompare(b.month))
    .slice(-months);
};

export const calendarGrid = (data) => {
  if (!data || data.length === 0) return [];

  const dailyCounts = {};
  data.forEach(item => {
    if (item.date_added) {
      const date = format(item.date_added, 'yyyy-MM-dd');
      dailyCounts[date] = (dailyCounts[date] || 0) + 1;
    }
  });

  return Object.entries(dailyCounts)
    .map(([date, count]) => {
      const [year, month, day] = date.split('-').map(Number);
      return {
        date,
        year,
        month,
        day,
        count,
        weekday: new Date(date).getDay(),
      };
    })
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(-365); // Last year
};
