import pandas as pd
import numpy as np
import os

# Load the raw dataset
RAW_PATH = "data/raw/google_books_1299.csv"
PROCESSED_PATH = "data/processed/books_cleaned.csv"

def clean_genres(genre_str):
    if pd.isna(genre_str) or genre_str.lower() == "none":
        return []
    return [g.strip() for g in genre_str.replace("&amp;", "&").split(",")]

def preprocess_books():
    # Read CSV
    df = pd.read_csv(RAW_PATH)

    # Replace "none" strings and blank strings with NaN
    df.replace("none", np.nan, inplace=True)
    df.replace("", np.nan, inplace=True)

    # Clean genres
    df['generes'] = df['generes'].apply(clean_genres)

    # Convert published_date to datetime
    df['published_date'] = pd.to_datetime(df['published_date'], errors='coerce')

    # Clean text columns
    text_columns = ['title', 'author', 'description', 'publisher', 'language', 'currency']
    for col in text_columns:
        df[col] = df[col].astype(str).str.strip()

    # Convert rating, voters, price, page_count to appropriate types
    df['rating'] = pd.to_numeric(df['rating'], errors='coerce')
    df['voters'] = pd.to_numeric(df['voters'], errors='coerce')
    df['price'] = pd.to_numeric(df['price'], errors='coerce')
    df['page_count'] = pd.to_numeric(df['page_count'], errors='coerce')

    # Save cleaned dataset
    os.makedirs(os.path.dirname(PROCESSED_PATH), exist_ok=True)
    df.to_csv(PROCESSED_PATH, index=False)
    print(f"✅ Saved cleaned dataset to {PROCESSED_PATH}")

if __name__ == "__main__":
    preprocess_books()
