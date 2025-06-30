from flask import Flask, request, jsonify
import numpy as np
import faiss
from scripts.embed_utils import load_faiss_index, get_embeddings_for_ids, load_embeddings_from_mysql

app = Flask(__name__)

print("🔄 Loading FAISS index from MySQL...")

# Load index and metadata once
index, metadata = load_faiss_index()

@app.route('/recommend', methods=['POST'])
def recommend():
    data = request.get_json()
    read_ids = data.get('read_ids', [])
    k = data.get('k', 5)

    if not read_ids or not isinstance(read_ids, list):
        return jsonify({'error': 'read_ids must be a non-empty list'}), 400

    # Fetch embeddings for read_ids
    embs = get_embeddings_for_ids(read_ids)
    embs = [e for e in embs if e is not None]
    if not embs:
        return jsonify({'error': 'No embeddings found for provided read_ids'}), 400

    # Average embedding
    avg_vec = np.mean(np.stack(embs), axis=0).astype('float32').reshape(1, -1)

    # Search FAISS
    D, I = index.search(avg_vec, k + len(read_ids))

    # Build results excluding read_ids
    recs = []
    for dist, idx in zip(D[0], I[0]):
        book = metadata[idx]
        if book['id'] in read_ids:
            continue
        recs.append(
        {
            'title': book.get('title', ''),
            'authors': [book.get('authors', [])] or [],
            'description': book.get('description', '') or '',
            'publisher': book.get('publisher', '') or '',
            'publishedDate': book.get('publicationyear', '') or '',
            'pageCount': book.get('pageCount', None),
            'categories': book.get('genre', []) or [],
            'language': book.get('language', '') or '',
            'thumbnail': book.get('coverImage', '') or '',
            'previewLink': book.get('path', '') or '',
            'isbn': None,
        }        
        )
        if len(recs) >= k:
            break

    return jsonify(recs)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5005)