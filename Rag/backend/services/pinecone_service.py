# services/pinecone_service.py

import os
from pinecone import Pinecone,ServerlessSpec
from dotenv import load_dotenv

load_dotenv()

pc = Pinecone(api_key=os.getenv("PINECONE_API_KEY"))
index = pc.Index(os.getenv("PINECONE_INDEX_NAME"))

def search_similar_vectors(vector, top_k=5):
    return index.query(vector=vector, top_k=top_k, include_metadata=True)
