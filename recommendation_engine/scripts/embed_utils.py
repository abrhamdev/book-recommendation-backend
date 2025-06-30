import mysql.connector
import numpy as np
import faiss
import json
from dotenv import load_dotenv
import os

load_dotenv()

DB_HOST = os.getenv("DB_HOST")
DB_USER = os.getenv("DB_USER")
DB_PASSWORD = os.getenv("DB_PASSWORD")
DB_NAME = os.getenv("DB_NAME")

def load_embeddings_from_mysql():
    conn = mysql.connector.connect(
        host=DB_HOST,
        user=DB_USER,
        password=DB_PASSWORD,
        database=DB_NAME
    )
    cursor = conn.cursor(dictionary=True)
    cursor.execute('SELECT bookId, Author, Publisher, Language, PublicationYear, Genre, coverImage, Description, pageCount, path, embedding, Title FROM ethbooks')
    rows = cursor.fetchall()
    cursor.close()
    conn.close()

    embeddings = []
    metadata = []
    for row in rows:
        emb = json.loads(row['embedding'])
        embeddings.append(emb)
        metadata.append({'id': row['bookId'], 'title': row['Title'], 'authors': row['Author'], 'publisher': row['Publisher'], 'language': row['Language'], 
                         'publicationyear': row['PublicationYear'], 'genre': row['Genre'], 'coverImage': row['coverImage'], 'description': row['Description'],
                         'pageCount': row['pageCount'], 'path': row['path']})

    return np.array(embeddings, dtype='float32'), metadata

def load_faiss_index():
    xb, metadata = load_embeddings_from_mysql()
    d = xb.shape[1]
    idx = faiss.IndexFlatL2(d)
    idx.add(xb)
    return idx, metadata

def get_embeddings_for_ids(ids):
    """Fetch embeddings for a list of book IDs from MySQL."""
    if not ids:
        return []
    conn = mysql.connector.connect(
        host=DB_HOST,
        user=DB_USER,
        password=DB_PASSWORD,
        database=DB_NAME
    )
    cursor = conn.cursor(dictionary=True)
    format_strings = ','.join(['%s'] * len(ids))
    cursor.execute(f"SELECT bookId, Author, Publisher, Language, PublicationYear, Genre, coverImage, Description, pageCount, path, embedding, Title FROM ethbooks WHERE bookId IN ({format_strings})", tuple(ids))
    rows = cursor.fetchall()
    cursor.close()
    conn.close()
    # Map bookId to embedding
    id_to_emb = {row['bookId']: np.array(json.loads(row['embedding']), dtype='float32') for row in rows}
    return [id_to_emb.get(i) for i in ids if i in id_to_emb]