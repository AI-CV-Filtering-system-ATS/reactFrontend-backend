from fastapi import FastAPI
from pymongo import MongoClient
import matplotlib.pyplot as plt
import io
import base64
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

app = FastAPI()

# CORS middleware setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Or specify allowed origins like: ["http://localhost:3000"]
    allow_credentials=True,
    allow_methods=["*"],  # Allow all methods (GET, POST, etc.)
    allow_headers=["*"],  # Allow all headers
)

# MongoDB connection setup
MONGO_URI = "mongodb+srv://esandu123:hello12345hello@cluster1.wer9edk.mongodb.net/?retryWrites=true&w=majority&appName=Cluster1"  # Replace with your MongoDB URI
client = MongoClient(MONGO_URI)
db = client["sltcvproject"]
collection = db["cvText"]

# Helper function to calculate job role percentages from MongoDB data
def calculate_job_role_percentages():
    # Fetch job role counts from MongoDB
    job_role_counts = {}

    # Query to fetch all documents from the collection
    documents = collection.find({})

    for doc in documents:
        job_roles = doc.get("Possible Job Roles", [])
        
        for role in job_roles:  # Consider all job roles in each document
            # Extract job role name and keyword count
            role_name, keyword_count = role.split(" (Matched Keywords: ")
            keyword_count = int(keyword_count.split(")")[0])  # Get the matched keyword count

            if role_name in job_role_counts:
                job_role_counts[role_name] += keyword_count
            else:
                job_role_counts[role_name] = keyword_count

    # Total count of keywords for all roles
    total_keywords = sum(job_role_counts.values())

    # Calculate percentages
    percentages = {
        role: (count / total_keywords) * 100 for role, count in job_role_counts.items()
    }

    return percentages, job_role_counts  # Return both percentages and job role counts

# Helper function to calculate job role counts from MongoDB data
def calculate_job_role_counts():
    job_role_counts = {}

    # Query to fetch all documents from the collection
    documents = collection.find({})

    for doc in documents:
        job_roles = doc.get("Possible Job Roles", [])
        
        # Consider all job roles in each document
        for role in job_roles:  # No limit on the number of roles considered
            role_name, _ = role.split(" (Matched Keywords: ")  # Only extract the role name

            # Increment the job role count
            if role_name in job_role_counts:
                job_role_counts[role_name] += 1
            else:
                job_role_counts[role_name] = 1

    return job_role_counts  

@app.get("/api/job_roles/pie_chart")
async def get_job_roles_pie_chart():
    percentages, _ = calculate_job_role_percentages()

    # Generate the pie chart
    labels = list(percentages.keys())
    sizes = list(percentages.values())
    
    fig, ax = plt.subplots()
    ax.pie(sizes, labels=labels, autopct='%1.1f%%', startangle=90)
    ax.axis('equal')  
    img_buf = io.BytesIO()
    plt.savefig(img_buf, format='png')
    img_buf.seek(0)

    img_base64 = base64.b64encode(img_buf.read()).decode('utf-8')

    return JSONResponse(content={"image": img_base64})

@app.get("/api/job_roles")
async def get_job_roles():
    percentages, _ = calculate_job_role_percentages()
    return percentages

@app.get("/api/job_roles/counts")
async def get_job_role_counts():
    job_role_counts = calculate_job_role_counts() 
    return job_role_counts


@app.get("/api/dashboard")
async def get_dashboard_data():
    total_cvs = collection.count_documents({})
    return {"total_cvs": total_cvs}

