from flask import Flask, request, jsonify
import pandas as pd
import numpy as np
import pickle
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

def vectorize_preferences(preferences):
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

@app.route('/recommend', methods=['POST'])
def recommend_books():
    try:
        preferences = request.get_json()
        if not preferences:
            return jsonify({'error': 'No preferences provided'}), 400

        # Vectorize user preferences
        feature_vector = vectorize_preferences(preferences)

        # Find nearest neighbors
        distances, indices = knn.kneighbors(feature_vector, n_neighbors=20)

        # Get book IDs (using index as ID, or use ISBN if preferred)
        book_ids = df.iloc[indices[0]]['ISBN'].tolist()

        return jsonify({
            'message': 'Recommendations generated successfully',
            'books': book_ids
        }), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)