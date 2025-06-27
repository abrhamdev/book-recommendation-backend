from flask import Flask, request, jsonify
import pandas as pd
import numpy as np
import pickle
import json
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.preprocessing import MinMaxScaler
from sklearn.neighbors import NearestNeighbors

app = Flask(__name__)

# Load pre-trained models and data
df = pd.read_csv("data/processed/books_cleaned.csv")
with open("models/knn_model.pkl", 'rb') as f:
    knn = pickle.load(f)
with open("models/tfidf_matrix.pkl", 'rb') as f:
    tfidf_matrix = pickle.load(f)
with open("models/tfidf_vectorizer.pkl", 'rb') as f:
    tfidf = pickle.load(f)
with open("models/scaler.pkl", 'rb') as f:
    scaler = pickle.load(f)

def parse_json_list_field(field):
    """Parse a JSON-encoded list if it's a string, or return an empty list."""
    if isinstance(field, list):
        return field
    if isinstance(field, str):
        try:
            return json.loads(field)
        except json.JSONDecodeError:
            return []
    return []

def vectorize_preferences(preferences):
    # Parse JSON strings into lists
    languages = parse_json_list_field(preferences.get('languages', '[]'))
    genres = parse_json_list_field(preferences.get('genres', '[]'))
    authors = parse_json_list_field(preferences.get('authors', '[]'))
    book_length = preferences.get('book_length', '')
    age_group = preferences.get('age_group', '')

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
    # numerical_features = scaler.transform([[rating, df['voters'].median(), page_count]])
    numerical_df = pd.DataFrame([[rating, df['voters'].median(), page_count]], columns=["rating", "voters", "page_count"])
    numerical_features = scaler.transform(numerical_df)

    # Combine features
    feature_vector = np.hstack([tfidf_vector, numerical_features])
    return feature_vector

@app.route('/recommend', methods=['POST'])
def recommend_books():
    try:
        preferences = request.get_json()
        # Validate expected keys in the request
        expected_keys = {'id', 'user_id', 'age_group', 'book_length', 'languages', 'genres', 'authors', 'created_at'}
        if not preferences:
            return jsonify({'error': 'No preferences provided'}), 400
        if not expected_keys.issubset(preferences.keys()):
            return jsonify({'error': f'Missing keys in preferences. Required keys: {expected_keys}'}), 400

        # Vectorize user preferences
        feature_vector = vectorize_preferences(preferences)

        # Find nearest neighbors
        distances, indices = knn.kneighbors(feature_vector, n_neighbors=40)

        # Get book IDs (using index as ID, or use ISBN if preferred)
        book_ids = df.iloc[indices[0]]['ISBN'].tolist()
        # Filter: only keep valid ISBNs (10-13 digits) and remove duplicates
        book_ids = [isbn for isbn in book_ids if isbn.isdigit() and 10 <= len(isbn) <= 13]
        book_ids = list(dict.fromkeys(book_ids))
        return jsonify({
            'message': 'Recommendations generated successfully',
            'books': book_ids
        }), 200

    except Exception as e:
            print(f"Error in recommendation: {e}")
            return jsonify({'error': 'Internal server error'}), 500
            
if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
