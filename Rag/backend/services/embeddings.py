# services/embeddings.py

from sentence_transformers import SentenceTransformer

embedder = SentenceTransformer("all-MiniLM-L6-v2")

def get_query_vector(query: str):
    return embedder.encode(query).tolist()
