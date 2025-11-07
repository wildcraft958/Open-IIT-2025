"""Natural language helper functions for the Netflix analytics project."""

from __future__ import annotations

import re
from pathlib import Path
from typing import Iterable

import nltk
import numpy as np
import pandas as pd
from nltk.corpus import stopwords
from nltk.sentiment import SentimentIntensityAnalyzer
from sklearn.feature_extraction.text import TfidfVectorizer
from wordcloud import WordCloud

nltk.download('stopwords', quiet=True)
nltk.download('vader_lexicon', quiet=True)
STOP_WORDS = set(stopwords.words('english'))
SIA = SentimentIntensityAnalyzer()


def clean_text(raw: str) -> str:
    """Lower-case, strip punctuation, and remove stopwords from descriptions."""

    cleaned = raw.lower()
    cleaned = re.sub(r'[^a-z0-9\s]', ' ', cleaned)
    cleaned = re.sub(r'\s+', ' ', cleaned)
    tokens = [word for word in cleaned.split() if word not in STOP_WORDS and len(word) > 2]
    return ' '.join(tokens)


def add_sentiment(df: pd.DataFrame) -> pd.DataFrame:
    """Attach VADER sentiment scores to the `description` field."""

    enriched = df.copy()
    enriched['desc_clean'] = enriched['description'].astype(str).apply(clean_text)
    enriched['sentiment'] = enriched['desc_clean'].apply(lambda text: SIA.polarity_scores(text)['compound'])
    return enriched


def tfidf_top_terms(
    df: pd.DataFrame,
    group_col: str = 'genre',
    text_col: str = 'desc_clean',
    top_k: int = 15,
) -> pd.DataFrame:
    """Return top TF-IDF keywords per group (genre/rating/etc.)."""

    records: list[tuple[str, str, float]] = []
    for group, partition in df.groupby(group_col):
        corpus = partition[text_col].fillna('').tolist()
        if not corpus or not ''.join(corpus).strip():
            continue
        vectorizer = TfidfVectorizer(max_features=1000, ngram_range=(1, 2), min_df=2)
        matrix = vectorizer.fit_transform(corpus)
        scores = np.asarray(matrix.mean(axis=0)).ravel()
        terms = np.array(vectorizer.get_feature_names_out())
        top_indices = scores.argsort()[-top_k:][::-1]
        records.extend((str(group), terms[idx], float(scores[idx])) for idx in top_indices)
    return pd.DataFrame(records, columns=[group_col, 'term', 'tfidf'])


def wordcloud_from_text(texts: Iterable[str], out_path: Path) -> None:
    """Generate a static word cloud PNG for exploratory storytelling."""

    text = ' '.join(text for text in texts if isinstance(text, str))
    if len(text) < 30:
        return
    Path(out_path).parent.mkdir(parents=True, exist_ok=True)
    cloud = WordCloud(width=1600, height=900, background_color='white').generate(text)
    cloud.to_file(str(out_path))
