from fastapi import APIRouter
from pymongo import MongoClient
import matplotlib.pyplot as plt
import io
import base64
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
 
router = APIRouter()
 
MONGO_URI = "mongodb+srv://esandu123:hello12345hello@cluster1.wer9edk.mongodb.net/?retryWrites=true&w=majority&appName=Cluster1"  # Replace with your MongoDB URI
client = MongoClient(MONGO_URI)
db = client["sltcvproject"]
collection = db["cvText"]

def calculate_job_role_percentages():
    job_role_counts = {}

    documents = collection.find({})

    for doc in documents:
        job_roles = doc.get("Possible Job Roles", [])
        
        for role in job_roles:  
            
            role_name, keyword_count = role.split(" (Matched Keywords: ")
            keyword_count = int(keyword_count.split(")")[0])  
            

            if role_name in job_role_counts:
                job_role_counts[role_name] += keyword_count
            else:
                job_role_counts[role_name] = keyword_count


    total_keywords = sum(job_role_counts.values())


    percentages = {
        role: (count / total_keywords) * 100 for role, count in job_role_counts.items()
    }

    return percentages, job_role_counts  



def calculate_job_role_counts():
    job_role_counts = {}


    documents = collection.find({})

    for doc in documents:
        job_roles = doc.get("Possible Job Roles", [])
        
       
       
        for role in job_roles: 
            
            role_name, _ = role.split(" (Matched Keywords: ")   


            if role_name in job_role_counts:
                job_role_counts[role_name] += 1
            else:
                job_role_counts[role_name] = 1

    return job_role_counts  

@router.get("/api/job_roles/pie_chart")
async def get_job_roles_pie_chart():
    percentages, _ = calculate_job_role_percentages()


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

@router.get("/api/job_roles")
async def get_job_roles():
    percentages, _ = calculate_job_role_percentages()
    return percentages

@router.get("/api/job_roles/counts")
async def get_job_role_counts():
    job_role_counts = calculate_job_role_counts() 
    return job_role_counts


@router.get("/api/dashboard")
async def get_dashboard_data():
    total_cvs = collection.count_documents({})
    return {"total_cvs": total_cvs}

