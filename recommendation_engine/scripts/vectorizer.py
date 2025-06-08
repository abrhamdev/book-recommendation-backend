import pandas as pd
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.preprocessing import MinMaxScaler
from sklearn.neighbors import NearestNeighbors
import pickle
import os

# Paths
PROCESSED_PATH = "data/processed/books_cleaned.csv"
MODEL_PATH = "models/knn_model.pkl"
TFIDF_MATRIX_PATH = "models/tfidf_matrix.pkl"
TFIDF_VECTORIZER_PATH = "models/tfidf_vectorizer.pkl"
SCALER_PATH = "models/scaler.pkl"

def preprocess_and_vectorize():
    # Load cleaned dataset
    df = pd.read_csv(PROCESSED_PATH)

    # Handle missing values
    df['description'] = df['description'].fillna('')
    df['generes'] = df['generes'].apply(lambda x: eval(x) if isinstance(x, str) else x)
    df['rating'] = df['rating'].fillna(df['rating'].mean())
    df['voters'] = df['voters'].fillna(df['voters'].median())
    df['page_count'] = df['page_count'].fillna(df['page_count'].median())

    # Combine text features
    df['genres_str'] = df['generes'].apply(lambda x: ' '.join(x))
    df['text_features'] = df['description'] + ' ' + df['genres_str'] + ' ' + df['author'] + ' ' + df['language']

    # TF-IDF vectorization for text features
    tfidf = TfidfVectorizer(max_features=5000, stop_words='english')
    tfidf_matrix = tfidf.fit_transform(df['text_features'])

    # Normalize numerical features
    scaler = MinMaxScaler()
    numerical_features = scaler.fit_transform(df[['rating', 'voters', 'page_count']])

    # Combine TF-IDF and numerical features
    feature_matrix = np.hstack([tfidf_matrix.toarray(), numerical_features])

    # Train KNN model
    knn = NearestNeighbors(n_neighbors=20, metric='cosine', algorithm='brute')
    knn.fit(feature_matrix)

    # Save models and vectorizer
    os.makedirs(os.path.dirname(MODEL_PATH), exist_ok=True)
    with open(MODEL_PATH, 'wb') as f:
        pickle.dump(knn, f)
    with open(TFIDF_MATRIX_PATH, 'wb') as f:
        pickle.dump(tfidf_matrix, f)
    with open(TFIDF_VECTORIZER_PATH, 'wb') as f:
        pickle.dump(tfidf, f)
    with open(SCALER_PATH, 'wb') as f:
        pickle.dump(scaler, f)

    print(f"Saved KNN model, TF-IDF matrix, vectorizer, and scaler to {MODEL_PATH}")
    return df, tfidf, tfidf_matrix, scaler, knn

def vectorize_preferences(preferences, tfidf, scaler, df):
    # Extract preferences
    languages = preferences.get('languages', [])
    genres = preferences.get('genres', [])
    authors = preferences.get('authors', [])
    book_length = preferences.get('bookLength', '')
    age_group = preferences.get('ageGroup', '')

    # Map book length to page count
    page_count_map = {'short': 100, 'medium': 225, 'long': 400}
    page_count = page_count_map.get(book_length, df['page_count'].median())

    # Map age group to rating (approximation)
    rating_map = {'kids': 4.0, 'teens': 4.2, 'young-adults': 4.3, 'adults': 4.4, 'older-adults': 4.5}
    rating = rating_map.get(age_group, df['rating'].mean())

    # Combine text features
    text_features = ' '.join(languages + genres + authors)

    # Vectorize text features
    tfidf_vector = tfidf.transform([text_features]).toarray()

    # Create numerical features
    numerical_features = scaler.transform([[rating, df['voters'].median(), page_count]])

    # Combine features
    feature_vector = np.hstack([tfidf_vector, numerical_features])
    return feature_vector

if __name__ == "__main__":
    df, tfidf, tfidf_matrix, scaler, knn = preprocess_and_vectorize()