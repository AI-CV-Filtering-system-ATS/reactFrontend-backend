from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pymongo import MongoClient
import os

app = FastAPI()

# Enable CORS for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# MongoDB Connection
MONGO_URI = "mongodb+srv://ramanayakepavithra2000:ramanayakepavithra2000@cluster0.yishj.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
client = MongoClient(MONGO_URI)
db = client["CvPdf"]  # Replace with your actual database name
collection = db["Cv-slt"]  # Replace with your actual collection name

@app.get("/api/dashboard")
def get_dashboard_data():
    total_cvs = collection.count_documents({})  # Get total CV count from MongoDB
    
    return {
        "total_cvs": total_cvs,  # Dynamically fetched from MongoDB
        "bar_chart": [
            {"name": "Jan", "AI": 20, "SE": 40, "QA": 10, "Other": 5},
            {"name": "Feb", "AI": 25, "SE": 35, "QA": 15, "Other": 2},
            {"name": "Mar", "AI": 30, "SE": 30, "QA": 20, "Other": 15},
            {"name": "Apr", "AI": 40, "SE": 20, "QA": 25, "Other": 25},
            {"name": "May", "AI": 50, "SE": 10, "QA": 30, "Other": 5},
        ],
        "pie_chart": {
            "AI": {"filled": 55, "unfilled": 45},
            "SE": {"filled": 45, "unfilled": 55},
            "QA": {"filled": 65, "unfilled": 35},
            "Other": {"filled": 25, "unfilled": 75},
        }
    }
