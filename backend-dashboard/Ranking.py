from fastapi import APIRouter, HTTPException, Request
from pymongo import MongoClient
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np

router = APIRouter()

# MongoDB Connection
MONGO_URI = "mongodb+srv://esandu123:hello12345hello@cluster1.wer9edk.mongodb.net/?retryWrites=true&w=majority&appName=Cluster1"  # Replace with your MongoDB URI
client = MongoClient(MONGO_URI)
db = client["sltcvproject"]
collection = db["cvText"]

@router.post("/api/search_cvs")
async def search_cvs(request: Request):
    try:
        data = await request.json()  # Extract JSON body
        prompt = data.get("prompt")  # Get the 'prompt' key from JSON

        if not prompt:
            raise HTTPException(status_code=400, detail="Prompt is required.")

        # Fetch all CVs from MongoDB
        cvs = list(collection.find({}, {"_id": 1, "cv_id": 1, "file_name": 1, "Raw Text": 1}))

        if not cvs:
            raise HTTPException(status_code=404, detail="No CVs found in the database.")

        # Extract CV texts and metadata
        cv_texts = [cv["Raw Text"] for cv in cvs]
        cv_metadata = [{'_id': str(cv["_id"]), 'cv_id': cv["cv_id"], 'file_name': cv["file_name"]} for cv in cvs]

        # Vectorize CVs & Prompt using TF-IDF
        vectorizer = TfidfVectorizer(stop_words="english")
        tfidf_matrix = vectorizer.fit_transform(cv_texts + [prompt])  # Last vector is the prompt
        query_vector = tfidf_matrix[-1]  # Extract the last row (prompt vector)

        # Compute Cosine Similarity
        similarity_scores = cosine_similarity(query_vector, tfidf_matrix[:-1]).flatten()  # Compare with all CVs

        # Rank all CVs based on similarity scores
        ranked_indices = np.argsort(similarity_scores)[::-1]  # Sort in descending order

        # Prepare response with all ranked CVs
        ranked_cvs = [
            {
                "cv_id": cv_metadata[idx]["cv_id"],
                "file_name": cv_metadata[idx]["file_name"],
                "similarity_score": float(similarity_scores[idx])  # Convert to float for JSON compatibility
            }
            for idx in ranked_indices
        ]

        return {"ranked_cvs": ranked_cvs}  # Return all ranked CVs

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))