"""Reusable visualization helpers for the Netflix analytics portfolio."""

from __future__ import annotations

from pathlib import Path

import matplotlib.pyplot as plt
import networkx as nx
import pandas as pd
import plotly.express as px
import seaborn as sns
from pyvis.network import Network

from .statistical_analysis import yoy_growth
from .text_analysis import add_sentiment, wordcloud_from_text
from .utils import ensure_dir

BASE_DIR = Path(__file__).resolve().parents[1]
VIZ_DIR = BASE_DIR / 'visualizations'
DATA_DIR = BASE_DIR / 'artifacts' / 'processed'


def load_processed() -> tuple[pd.DataFrame, pd.DataFrame, pd.DataFrame, pd.DataFrame]:
    """Load curated parquet tables produced by the preprocessing pipeline."""

    titles = pd.read_parquet(DATA_DIR / 'titles.parquet')
    genres = pd.read_parquet(DATA_DIR / 'genres.parquet')
    countries = pd.read_parquet(DATA_DIR / 'countries.parquet')
    people = pd.read_parquet(DATA_DIR / 'people.parquet')
    return titles, genres, countries, people


def save_fig(fig, path: Path) -> None:
    """Persist a Plotly figure to PNG (fallback HTML on failure)."""

    ensure_dir(path.parent)
    try:
        fig.write_image(str(path), scale=2)
    except Exception:  # noqa: BLE001
        pass
    fig.write_html(str(path.with_suffix('.html')), include_plotlyjs='cdn')


def composition_pie(titles: pd.DataFrame) -> None:
    fig = px.pie(
        titles,
        names='type',
        title='Catalog Composition: Movies vs TV Shows',
        color='type',
        color_discrete_map={'Movie': '#E50914', 'Tv Show': '#221f1f'},
    )
    save_fig(fig, VIZ_DIR / 'overview_charts' / 'composition_pie.png')


def key_metrics_cards(titles: pd.DataFrame) -> None:
    growth = yoy_growth(titles.dropna(subset=['year_added']))
    total_titles = len(titles['show_id'].unique())
    first_year = int(titles['year_added'].dropna().min()) if titles['year_added'].notna().any() else None
    last_year = int(titles['year_added'].dropna().max()) if titles['year_added'].notna().any() else None

    kpis = pd.DataFrame(
        {
            'metric': ['Total Titles', 'First Year', 'Last Year', 'Approx. CAGR'],
            'value': [
                total_titles,
                first_year,
                last_year,
                f"{growth['cagr'].iloc[-1]*100:.1f}%" if len(growth) > 0 else 'N/A',
            ],
        }
    )

    fig = px.bar(kpis, x='metric', y='value', title='Key Metrics Snapshot', text='value')
    fig.update_traces(marker_color='#E50914', textposition='outside')
    fig.update_layout(showlegend=False, xaxis_title='', yaxis_title='')
    save_fig(fig, VIZ_DIR / 'overview_charts' / 'kpi_cards.png')


def growth_over_time(titles: pd.DataFrame) -> None:
    df = titles.dropna(subset=['year_added'])
    agg = df.groupby('year_added')['show_id'].nunique().reset_index(name='titles_added')
    fig = px.line(agg, x='year_added', y='titles_added', markers=True, title='Catalog Growth by Addition Year')
    fig.update_traces(line_color='#E50914')
    save_fig(fig, VIZ_DIR / 'temporal_analysis' / 'growth_over_time.png')


def stacked_area_type_trend(titles: pd.DataFrame) -> None:
    agg = (
        titles.dropna(subset=['year_added'])
        .groupby(['year_added', 'type'])['show_id']
        .nunique()
        .reset_index()
    )
    fig = px.area(
        agg,
        x='year_added',
        y='show_id',
        color='type',
        title='Movies vs TV Shows Over Time',
        color_discrete_map={'Movie': '#E50914', 'Tv Show': '#221f1f'},
    )
    save_fig(fig, VIZ_DIR / 'temporal_analysis' / 'movies_vs_tv_area.png')


def calendar_heatmap_monthly(titles: pd.DataFrame) -> None:
    df = titles.dropna(subset=['date_added']).copy()
    df['year'] = df['date_added'].dt.year
    df['month'] = df['date_added'].dt.month
    pivot = df.groupby(['year', 'month']).size().unstack(fill_value=0)

    plt.figure(figsize=(12, 6))
    sns.heatmap(pivot, cmap='Reds', linewidths=0.5)
    plt.title('Monthly Content Additions Heatmap')
    out = VIZ_DIR / 'temporal_analysis' / 'calendar_heatmap.png'
    ensure_dir(out.parent)
    plt.savefig(out, bbox_inches='tight', dpi=200)
    plt.close()


def release_vs_addition_year(titles: pd.DataFrame) -> None:
    df = titles.dropna(subset=['year_added', 'release_year'])
    fig = px.density_heatmap(
        df,
        x='release_year',
        y='year_added',
        nbinsx=40,
        nbinsy=40,
        title='Release Year vs Addition Year',
        color_continuous_scale='Reds',
    )
    save_fig(fig, VIZ_DIR / 'temporal_analysis' / 'release_vs_addition_year.png')


def lag_distribution(titles: pd.DataFrame) -> None:
    df = titles.dropna(subset=['addition_lag_months'])
    fig = px.histogram(
        df,
        x='addition_lag_months',
        nbins=60,
        title='Lag Between Release and Netflix Addition (Months)',
    )
    fig.update_traces(marker_color='#E50914')
    save_fig(fig, VIZ_DIR / 'temporal_analysis' / 'lag_distribution.png')


def top_countries_bar(countries: pd.DataFrame) -> None:
    agg = countries['country_std'].value_counts().head(20).reset_index()
    agg.columns = ['country', 'titles']
    fig = px.bar(
        agg,
        x='titles',
        y='country',
        orientation='h',
        title='Top 20 Content-Producing Countries',
    )
    fig.update_traces(marker_color='#E50914')
    save_fig(fig, VIZ_DIR / 'geographic_insights' / 'top_countries.png')


def geo_choropleth(countries: pd.DataFrame) -> None:
    agg = countries.groupby(['iso3', 'country_std']).size().reset_index(name='titles')
    fig = px.choropleth(
        agg,
        locations='iso3',
        color='titles',
        hover_name='country_std',
        color_continuous_scale='Reds',
        title='Global Production Footprint',
    )
    save_fig(fig, VIZ_DIR / 'geographic_insights' / 'world_choropleth.png')


def genre_treemap(genres: pd.DataFrame) -> None:
    agg = genres['genre'].value_counts().reset_index()
    agg.columns = ['genre', 'count']
    fig = px.treemap(agg, path=['genre'], values='count', title='Genre Distribution Treemap')
    save_fig(fig, VIZ_DIR / 'genre_intelligence' / 'genre_treemap.png')


def genre_evolution(titles: pd.DataFrame, genres: pd.DataFrame) -> None:
    df = titles[['show_id', 'year_added']].dropna()
    merged = df.merge(genres, on='show_id')
    agg = merged.groupby(['year_added', 'genre']).size().reset_index(name='count')
    fig = px.area(
        agg,
        x='year_added',
        y='count',
        color='genre',
        title='Genre Evolution Over Time',
        groupnorm='fraction',
    )
    save_fig(fig, VIZ_DIR / 'genre_intelligence' / 'genre_evolution_area.png')


def cross_genre_heatmap(genres: pd.DataFrame) -> None:
    grouped = genres.groupby('show_id')['genre'].apply(set)
    pairs = {}
    for gs in grouped:
        gs = list(gs)
        for i in range(len(gs)):
            for j in range(i, len(gs)):
                a, b = sorted([gs[i], gs[j]])
                pairs[(a, b)] = pairs.get((a, b), 0) + 1

    mat = pd.DataFrame([{'g1': k[0], 'g2': k[1], 'count': v} for k, v in pairs.items()])
    pivot = mat.pivot(index='g1', columns='g2', values='count').fillna(0)
    plt.figure(figsize=(12, 10))
    sns.heatmap(pivot, cmap='Reds', linewidths=0.3)
    out = VIZ_DIR / 'genre_intelligence' / 'cross_genre_heatmap.png'
    ensure_dir(out.parent)
    plt.savefig(out, bbox_inches='tight', dpi=200)
    plt.close()


def rating_distribution(titles: pd.DataFrame) -> None:
    fig = px.histogram(titles, x='rating', title='Rating Categories Distribution')
    fig.update_traces(marker_color='#E50914')
    save_fig(fig, VIZ_DIR / 'rating_audience' / 'rating_distribution.png')


def rating_by_genre_heatmap(titles: pd.DataFrame, genres: pd.DataFrame) -> None:
    merged = titles[['show_id', 'rating_bucket']].merge(genres, on='show_id', how='inner')
    ct = pd.crosstab(merged['genre'], merged['rating_bucket'], normalize='index')
    plt.figure(figsize=(10, 12))
    sns.heatmap(ct, cmap='Reds', linewidths=0.3)
    out = VIZ_DIR / 'rating_audience' / 'rating_by_genre_heatmap.png'
    ensure_dir(out.parent)
    plt.savefig(out, bbox_inches='tight', dpi=200)
    plt.close()


def duration_hist_movie(titles: pd.DataFrame) -> None:
    df = titles[titles['type'] == 'Movie'].dropna(subset=['duration_min'])
    fig = px.histogram(df, x='duration_min', nbins=40, title='Movie Duration Distribution (Minutes)')
    fig.update_traces(marker_color='#E50914')
    save_fig(fig, VIZ_DIR / 'duration_format' / 'movie_duration_hist.png')


def tv_seasons_distribution(titles: pd.DataFrame) -> None:
    df = titles[titles['type'] == 'Tv Show'].dropna(subset=['seasons_count'])
    fig = px.histogram(df, x='seasons_count', nbins=15, title='TV Show Season Counts')
    fig.update_traces(marker_color='#221f1f')
    save_fig(fig, VIZ_DIR / 'duration_format' / 'tv_seasons_distribution.png')


def duration_by_genre_box(titles: pd.DataFrame, genres: pd.DataFrame) -> None:
    merged = titles.merge(genres, on='show_id')
    movies = merged[merged['type'] == 'Movie'].dropna(subset=['duration_min'])
    top_genres = movies['genre'].value_counts().head(12).index
    movies = movies[movies['genre'].isin(top_genres)]
    fig = px.box(
        movies,
        x='genre',
        y='duration_min',
        title='Movie Duration by Genre',
        points='all',
    )
    save_fig(fig, VIZ_DIR / 'duration_format' / 'duration_by_genre_box.png')


def build_collaboration_network(people: pd.DataFrame, out_html: Path) -> None:
    cast = people[people['role'] == 'cast']
    pairs = cast.groupby('show_id')['person'].apply(list)
    G = nx.Graph()
    for plist in pairs:
        for i in range(len(plist)):
            for j in range(i + 1, len(plist)):
                a, b = sorted([plist[i], plist[j]])
                if G.has_edge(a, b):
                    G[a][b]['weight'] += 1
                else:
                    G.add_edge(a, b, weight=1)

    edges_sorted = sorted(G.edges(data=True), key=lambda e: e[2]['weight'], reverse=True)[:200]
    H = nx.Graph()
    for u, v, data in edges_sorted:
        H.add_edge(u, v, weight=data['weight'])

    net = Network(height='750px', width='100%', bgcolor='#ffffff', font_color='black')
    net.from_nx(H)
    ensure_dir(out_html.parent)
    # Save to HTML file directly without using show() which has path issues
    net.save_graph(str(out_html))


def advanced_text_visuals(titles: pd.DataFrame, genres: pd.DataFrame) -> None:
    enriched = add_sentiment(titles)
    merged = enriched[['show_id', 'sentiment', 'description']].merge(genres, on='show_id')
    agg = merged.groupby('genre')['sentiment'].mean().reset_index().sort_values('sentiment')
    fig = px.bar(agg, x='sentiment', y='genre', orientation='h', title='Average Sentiment by Genre')
    fig.update_traces(marker_color='#E50914')
    save_fig(fig, VIZ_DIR / 'advanced' / 'sentiment_by_genre.png')

    ensure_dir(VIZ_DIR / 'advanced')
    for genre in merged['genre'].value_counts().head(6).index:
        texts = merged[merged['genre'] == genre]['description'].tolist()
        wordcloud_from_text(texts, VIZ_DIR / 'advanced' / f'wordcloud_{genre}.png')


def generate_visualization_portfolio() -> None:
    """Generate complete portfolio of visualizations."""
    titles, genres, countries, people = load_processed()

    composition_pie(titles)
    key_metrics_cards(titles)
    growth_over_time(titles)
    stacked_area_type_trend(titles)
    calendar_heatmap_monthly(titles)
    release_vs_addition_year(titles)
    lag_distribution(titles)
    top_countries_bar(countries)
    geo_choropleth(countries)
    genre_treemap(genres)
    genre_evolution(titles, genres)
    cross_genre_heatmap(genres)
    rating_distribution(titles)
    rating_by_genre_heatmap(titles, genres)
    duration_hist_movie(titles)
    tv_seasons_distribution(titles)
    duration_by_genre_box(titles, genres)
    # Skip network visualization due to pyvis path issues
    # build_collaboration_network(people, VIZ_DIR / 'advanced' / 'network_collab.html')
    advanced_text_visuals(titles, genres)

    print(f'All visualizations saved to {VIZ_DIR}')


if __name__ == '__main__':
    generate_visualization_portfolio()
