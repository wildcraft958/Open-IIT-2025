"""Statistical helper functions powering executive analytics."""

from __future__ import annotations

from math import log
from typing import Any

import pandas as pd
from scipy.stats import chi2_contingency, spearmanr


def yoy_growth(
    df: pd.DataFrame,
    date_col: str = 'year_added',
    value_col: str = 'show_id',
) -> pd.DataFrame:
    """Calculate year-over-year counts and CAGR for the catalog."""

    agg = df.groupby(date_col)[value_col].nunique().sort_index().rename('count').reset_index()
    agg['yoy'] = agg['count'].pct_change().round(3)
    if len(agg) > 1:
        agg['cagr'] = (agg['count'] / agg['count'].iloc[0]) ** (1 / (len(agg) - 1)) - 1
    else:
        agg['cagr'] = 0.0
    return agg


def shannon_diversity(series: pd.Series) -> float:
    """Shannon diversity index for categorical fields."""

    counts = series.value_counts(dropna=True)
    total = counts.sum()
    if total == 0:
        return 0.0
    probs = counts / total
    return -sum(prob * log(prob) for prob in probs if prob > 0)


def gini_simpson_diversity(series: pd.Series) -> float:
    """Gini-Simpson diversity index."""

    counts = series.value_counts(dropna=True)
    total = counts.sum()
    if total == 0:
        return 0.0
    probs = counts / total
    return 1 - sum(prob**2 for prob in probs)


def chi_square_test(df: pd.DataFrame, row_col: str, col_col: str) -> dict[str, Any]:
    """Run a chi-square test for independence on two categorical columns."""

    contingency = pd.crosstab(df[row_col], df[col_col])
    chi2, p_value, dof, expected = chi2_contingency(contingency)
    return {
        'chi2': chi2,
        'p_value': p_value,
        'dof': dof,
        'expected': expected,
        'table': contingency,
    }


def compare_durations_by_genre(titles: pd.DataFrame, genres: pd.DataFrame) -> pd.DataFrame:
    """Summarise movie minutes and TV seasons by genre."""

    merged = titles[['show_id', 'type', 'duration_min', 'seasons_count']].merge(
        genres[['show_id', 'genre']],
        on='show_id',
        how='inner',
    )
    movies = (
        merged[merged['type'] == 'Movie']
        .groupby('genre')['duration_min']
        .describe(percentiles=[0.25, 0.5, 0.75])
        .rename(columns=lambda col: f'movie_{col}')
    )
    tv = (
        merged[merged['type'] == 'Tv Show']
        .groupby('genre')['seasons_count']
        .describe(percentiles=[0.25, 0.5, 0.75])
        .rename(columns=lambda col: f'tv_{col}')
    )
    return movies.join(tv, how='outer').reset_index()


def inflection_points(series: pd.Series, order: int = 3, top_k: int = 3) -> list[int]:
    """Return index candidates where the moving derivative spikes."""

    cleaned = series.dropna().astype(float)
    derivative = cleaned.diff().rolling(order, min_periods=1).mean().abs()
    return derivative.sort_values(ascending=False).head(top_k).index.to_list()


def lag_correlation(titles: pd.DataFrame) -> dict[str, float] | None:
    """Spearman correlation between release year and addition lag."""

    valid = titles[['release_year', 'addition_lag_months']].dropna()
    if len(valid) < 10:
        return None
    rho, p_value = spearmanr(valid['release_year'], valid['addition_lag_months'])
    return {'spearman_rho': rho, 'p_value': p_value}
