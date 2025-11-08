#!/usr/bin/env python3
import pandas as pd

df = pd.read_csv('data/netflix_combined_dataset.csv', low_memory=False)
print(f'Pandas records: {len(df)}')
print(f'\nColumns: {list(df.columns)}')
print(f'\nFirst 3 title values:')
for i in range(min(3, len(df))):
    print(f'{i+1}. {df.iloc[i]["title"] if "title" in df.columns else "N/A"}')

# Check if description has newlines
if 'description' in df.columns:
    multiline = df['description'].astype(str).str.contains('\n').sum()
    print(f'\nRows with newlines in description: {multiline}')
