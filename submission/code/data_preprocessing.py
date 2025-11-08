"""Data ingestion and feature engineering pipeline for Netflix analytics."""

from __future__ import annotations

import json
import logging
from pathlib import Path
from typing import Iterable

import country_converter as coco
import pandas as pd

from .utils import clean_list_field, ensure_dir, parse_duration_to_minutes

LOGGER = logging.getLogger(__name__)

BASE_DIR = Path(__file__).resolve().parents[1]
RAW_DIR = BASE_DIR / 'data'
ARTIFACTS_DIR = BASE_DIR / 'artifacts'
PROCESSED_DIR = ARTIFACTS_DIR / 'processed'
PICKLE_PATH = ARTIFACTS_DIR / 'processed_netflix_data.pkl'
REACT_PUBLIC_DIR = BASE_DIR / 'dashboard-react' / 'public'
REACT_DATA_PATH = REACT_PUBLIC_DIR / 'netflix_data.json'

RATING_MAP = {
    'G': 'Kids',
    'TV-Y': 'Kids',
    'TV-Y7': 'Kids',
    'TV-G': 'Kids',
    'PG': 'Family',
    'TV-PG': 'Family',
    'TV-Y7-FV': 'Kids',
    'PG-13': 'Teen',
    'TV-14': 'Teen',
    'R': 'Mature',
    'NC-17': 'Mature',
    'TV-MA': 'Mature',
    'UR': 'Mature',
    'NR': 'Mature',
    'UNRATED': 'Mature',
    'NOT RATED': 'Mature',
}

SOURCE_HINTS = {
    'netflix_titles': ('**/*netflix_titles*.csv',),
    'netflix_2025': ('**/*netflix_movies_detailed_up_to_2025*.csv',),
    'ratings': ('**/*ratings*.csv',),
}

COUNTRY_CONVERTER = coco.CountryConverter()
COUNTRY_ALIASES = {
    'west germany': 'Germany',
    'east germany': 'Germany',
    'soviet union': 'Russia',
}


def _resolve_first(patterns: Iterable[str]) -> Path | None:
    """Return the first path from *RAW_DIR* matching any glob pattern."""

    for pattern in patterns:
        matches = sorted(RAW_DIR.glob(pattern))
        if matches:
            return matches[0]
    return None


def _load_csv(path: Path, **kwargs) -> pd.DataFrame:
    """Load CSV with fallback encodings."""

    try:
        return pd.read_csv(path, **kwargs)
    except UnicodeDecodeError:
        return pd.read_csv(path, encoding='latin1', **kwargs)


def standardize_country_name(cname: str) -> str:
    """Convert country values to short names when possible."""

    if cname is None:
        return 'Unknown'
    value = str(cname).strip()
    if value == '' or value.lower() in {'nan', 'none', 'unknown'}:
        return 'Unknown'
    if value.lower() in COUNTRY_ALIASES:
        value = COUNTRY_ALIASES[value.lower()]
    try:
        converted = COUNTRY_CONVERTER.convert(names=value, to='name_short')
        if isinstance(converted, list):
            converted = converted[0]
        if converted in (None, 'not found'):
            return value
        return converted
    except Exception:  # noqa: BLE001
        LOGGER.debug('Falling back to original country for %s', value)
        return value


def add_temporal_columns(df: pd.DataFrame) -> pd.DataFrame:
    """Add derived temporal columns from the `date_added` field."""

    df['date_added'] = pd.to_datetime(df['date_added'], errors='coerce')
    df['year_added'] = df['date_added'].dt.year
    df['month_added'] = df['date_added'].dt.month
    df['quarter_added'] = df['date_added'].dt.quarter
    df['month_name_added'] = df['date_added'].dt.month_name()
    df['weekday_added'] = df['date_added'].dt.day_name()
    df['add_year'] = df['year_added']  # backward compatibility
    df['add_month'] = df['month_added']
    df['add_quarter'] = df['quarter_added']
    return df


def derive_duration(df: pd.DataFrame) -> pd.DataFrame:
    """Split duration strings into minute and season features."""

    mins_seasons = df['duration'].apply(parse_duration_to_minutes)
    df['duration_min'] = [mins for mins, _ in mins_seasons]
    df['seasons_count'] = [seasons for _, seasons in mins_seasons]
    return df


def map_ratings(df: pd.DataFrame) -> pd.DataFrame:
    """Normalize ratings into strategic buckets."""

    df['rating'] = df['rating'].astype(str).str.strip().str.upper()
    df['rating_bucket'] = df['rating'].map(RATING_MAP).fillna('Other')
    return df


def load_netflix(path: Path) -> pd.DataFrame:
    """Load and standardize the core Netflix title catalog."""

    df = _load_csv(path)
    df.columns = [col.strip().lower() for col in df.columns]
    df['type'] = df['type'].astype(str).str.strip().str.title()
    df['director'] = df['director'].fillna('Unknown')
    df['cast'] = df['cast'].fillna('Unknown')
    df['country'] = df['country'].fillna('Unknown')
    df['release_year'] = pd.to_numeric(df['release_year'], errors='coerce').astype('Int64')
    df['description'] = df['description'].astype(str)
    return df


def explode_multivalues(df: pd.DataFrame) -> dict[str, pd.DataFrame]:
    """Explode multi-value columns into relational tables for analysis."""

    base_cols = [
        'show_id',
        'title',
        'type',
        'director',
        'cast',
        'country',
        'listed_in',
        'description',
        'date_added',
        'year_added',
        'month_added',
        'quarter_added',
        'month_name_added',
        'weekday_added',
        'release_year',
        'rating',
        'rating_bucket',
        'duration',
        'duration_min',
        'seasons_count',
    ]
    base = df[base_cols].drop_duplicates().reset_index(drop=True)

    df['country_list'] = df['country'].apply(clean_list_field)
    countries = df[['show_id', 'country_list']].explode('country_list')
    countries['country'] = countries['country_list'].astype(str).str.strip()
    countries = countries.drop(columns=['country_list'])
    countries = countries[countries['country'].notna() & (countries['country'].str.len() > 0)]
    countries['country_std'] = countries['country'].apply(standardize_country_name)
    try:
        valid_mask = countries['country_std'] != 'Unknown'
        countries.loc[valid_mask, 'iso3'] = COUNTRY_CONVERTER.convert(
            names=countries.loc[valid_mask, 'country_std'],
            to='ISO3',
        )
        countries.loc[valid_mask, 'region'] = COUNTRY_CONVERTER.convert(
            names=countries.loc[valid_mask, 'country_std'],
            to='continent',
        )
        countries['iso3'] = countries['iso3'].fillna('UNK')
        countries['region'] = countries['region'].fillna('Unknown')
    except Exception:  # noqa: BLE001
        LOGGER.warning('Could not map ISO3/region for all countries, defaulting to raw values.')
        countries['iso3'] = countries['country_std']
        countries['region'] = 'Unknown'

    df['genre_list'] = df.get('listed_in', '').apply(clean_list_field)
    genres = df[['show_id', 'genre_list']].explode('genre_list').rename(columns={'genre_list': 'genre'})
    genres['genre'] = genres['genre'].astype(str).str.strip()
    genres = genres[genres['genre'].notna() & (genres['genre'].str.len() > 0)]

    df['cast_list'] = df['cast'].apply(clean_list_field)
    df['director_list'] = df['director'].apply(clean_list_field)

    cast = df[['show_id', 'cast_list']].explode('cast_list').rename(columns={'cast_list': 'person'})
    cast['person'] = cast['person'].astype(str).str.strip()
    cast = cast[cast['person'].notna() & (cast['person'].str.len() > 0)]
    cast['role'] = 'cast'

    directors = df[['show_id', 'director_list']].explode('director_list').rename(columns={'director_list': 'person'})
    directors['person'] = directors['person'].astype(str).str.strip()
    directors = directors[directors['person'].notna() & (directors['person'].str.len() > 0)]
    directors['role'] = 'director'

    people = pd.concat([cast, directors], ignore_index=True)

    return {
        'titles': base,
        'countries': countries.reset_index(drop=True),
        'genres': genres.reset_index(drop=True),
        'people': people.reset_index(drop=True),
    }


def compute_derived_metrics(tables: dict[str, pd.DataFrame]) -> dict[str, pd.DataFrame]:
    """Aggregate relational tables back into feature-rich title records."""

    titles = tables['titles']
    countries = tables['countries']
    genres = tables['genres']
    people = tables['people']

    country_counts = countries.groupby('show_id').size().rename('country_count')
    genre_counts = genres.groupby('show_id').size().rename('genre_count')
    cast_counts = people[people['role'] == 'cast'].groupby('show_id').size().rename('cast_count')
    director_counts = people[people['role'] == 'director'].groupby('show_id').size().rename('director_count')

    titles = titles.merge(country_counts, on='show_id', how='left')
    titles = titles.merge(genre_counts, on='show_id', how='left')
    titles = titles.merge(cast_counts, on='show_id', how='left')
    titles = titles.merge(director_counts, on='show_id', how='left')
    for col in ['country_count', 'genre_count', 'cast_count', 'director_count']:
        titles[col] = titles[col].fillna(0).astype(int)

    titles['is_movie'] = (titles['type'] == 'Movie').astype(int)
    titles['is_tv'] = (titles['type'] == 'Tv Show').astype(int)

    approx_release = pd.to_datetime(titles['release_year'].astype('float'), errors='coerce')
    addition_dates = pd.to_datetime(titles['date_added'], errors='coerce')
    lag_days = (addition_dates - approx_release).dt.days
    titles['addition_lag_days'] = lag_days
    titles['addition_lag_months'] = (lag_days / 30.44).round(1)
    titles['addition_lag_years'] = (lag_days / 365.25).round(2)

    titles['content_age'] = (titles['year_added'].astype('float') - titles['release_year'].astype('float')).round(1)
    titles['is_multicountry'] = (titles['country_count'] > 1).astype(int)

    us_titles = countries[countries['country_std'] == 'United States']['show_id'].unique()
    titles['is_original_proxy'] = (
        titles['show_id'].isin(us_titles)
        & (titles['year_added'].astype('float') == titles['release_year'].astype('float'))
    ).astype(int)

    return {'titles': titles, 'countries': countries, 'genres': genres, 'people': people}


def _merge_on_title(
    titles: pd.DataFrame,
    extra: pd.DataFrame | None,
    column_map: dict[str, str],
    source_name: str,
) -> pd.DataFrame:
    """Merge extra dataset onto titles using normalized title keys."""

    if extra is None:
        LOGGER.info('Skipping %s merge: dataset not available.', source_name)
        return titles

    missing = [col for col in column_map if col not in extra.columns]
    if missing:
        LOGGER.warning('Skipping %s merge: missing columns %s', source_name, missing)
        return titles

    working = titles.copy()
    working['title_key'] = working['title'].str.strip().str.lower()
    extra_work = extra.copy()
    extra_work['title_key'] = extra_work['title'].astype(str).str.strip().str.lower()
    extra_work = extra_work[['title_key', *column_map.keys()]].rename(columns=column_map)

    merged = working.merge(extra_work.drop_duplicates(subset='title_key'), on='title_key', how='left')
    merged = merged.drop(columns=['title_key'])
    return merged


def merge_supplementary_datasets(titles: pd.DataFrame) -> pd.DataFrame:
    """Augment titles with IMDb-style scores, revenue, and future validation flags."""

    netflix_2025_path = _resolve_first(SOURCE_HINTS['netflix_2025'])
    imdb_like = None
    future_flags: set[str] = set()

    if netflix_2025_path:
        netflix_2025 = _load_csv(netflix_2025_path)
        imdb_like = netflix_2025[['title', 'vote_average', 'vote_count', 'popularity', 'budget', 'revenue']]
        future_flags = set(netflix_2025.get('show_id', []))
    else:
        LOGGER.info('Netflix 2025 dataset not found; future validation features unavailable.')

    titles = _merge_on_title(
        titles,
        imdb_like,
        {
            'vote_average': 'imdb_rating_proxy',
            'vote_count': 'imdb_votes_proxy',
            'popularity': 'tmdb_popularity',
            'budget': 'production_budget',
            'revenue': 'box_office_revenue',
        },
        source_name='2025 enrichment',
    )

    if future_flags:
        titles['future_validation_flag'] = titles['show_id'].isin(future_flags).astype(int)
    else:
        titles['future_validation_flag'] = 0

    return titles


def run_all(netflix_csv: Path | None = None) -> None:
    """Execute the full preprocessing pipeline and persist artifacts."""

    ensure_dir(PROCESSED_DIR)
    ensure_dir(ARTIFACTS_DIR)
    ensure_dir(REACT_PUBLIC_DIR)

    if netflix_csv is None:
        netflix_csv = _resolve_first(SOURCE_HINTS['netflix_titles'])
        if netflix_csv is None:
            raise FileNotFoundError('Core Netflix titles CSV not found in data directory.')

    LOGGER.info('Loading Netflix catalog from %s', netflix_csv)
    df = load_netflix(netflix_csv)
    df = add_temporal_columns(df)
    df = derive_duration(df)
    df = map_ratings(df)

    tables = explode_multivalues(df)
    tables = compute_derived_metrics(tables)
    tables['titles'] = merge_supplementary_datasets(tables['titles'])

    for name, table in tables.items():
        out_path = PROCESSED_DIR / f'{name}.parquet'
        table.to_parquet(out_path, index=False)
        LOGGER.debug('Saved %s rows to %s', len(table), out_path)

    tables['titles'].to_pickle(PICKLE_PATH)
    LOGGER.info('Processed dataset saved to %s', PICKLE_PATH)

    # Prepare React dashboard JSON payload
    react_cols = [
        'show_id',
        'title',
        'type',
        'director',
        'cast',
        'country',
        'listed_in',
        'date_added',
        'release_year',
        'rating',
        'rating_bucket',
        'duration',
        'duration_min',
        'seasons_count',
        'description',
        'year_added',
        'content_age',
        'is_multicountry',
        'genre_count',
        'country_count',
        'is_original_proxy',
        'imdb_rating_proxy',
        'imdb_votes_proxy',
        'tmdb_popularity',
        'production_budget',
        'box_office_revenue',
        'future_validation_flag',
    ]
    react_frame = tables['titles'][react_cols].copy()
    react_frame['date_added'] = react_frame['date_added'].dt.strftime('%Y-%m-%d')
    react_frame = react_frame.where(pd.notnull(react_frame), None)
    payload = json.dumps(list(react_frame.to_dict(orient='records')), ensure_ascii=False)
    REACT_DATA_PATH.write_text(payload)
    LOGGER.info('React dashboard dataset saved to %s', REACT_DATA_PATH)


if __name__ == '__main__':
    logging.basicConfig(level=logging.INFO)
    run_all()
