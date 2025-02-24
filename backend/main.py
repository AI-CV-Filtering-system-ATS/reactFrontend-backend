from fastapi import FastAPI, UploadFile, File
from pymongo import MongoClient
import pdfplumber
import shutil
import os
from pymongo.server_api import ServerApi
from fastapi.middleware.cors import CORSMiddleware # type: ignore
import uuid
from process_cv import extract_text_from_pdf as process_extract_text, match_job_roles, job_role_keywords

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Replace with your React app's URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

uri = "mongodb+srv://esandu123:hello12345hello@cluster1.wer9edk.mongodb.net/?retryWrites=true&w=majority&appName=Cluster1"
# Create a new client and connect to the server

client = MongoClient(uri, server_api=ServerApi('1'))
# Send a ping to confirm a successful connection
try:
    client.admin.command('ping')
    print("Pinged your deployment. You successfully connected to MongoDB!")
except Exception as e:
    print(e)


db = client["sltcvproject"]
collection = db["cvText"]

def extract_text_from_pdf(pdf_path):
    text = ""
    with pdfplumber.open(pdf_path) as pdf:
        for page in pdf.pages:
            text += page.extract_text() + "\n"
    return text.strip()

@app.post("/upload")
async def upload_files(files: list[UploadFile] = File(...)):
    upload_dir = "uploaded_cvs"
    os.makedirs(upload_dir, exist_ok=True)
    
    results = []
    
    for file in files:
        if not file.filename.endswith(".pdf"):
            continue
            
        file_path = os.path.join(upload_dir, file.filename)
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        # Use the process_cv.py functionality instead of simple text extraction
        try:
            # Extract text using the advanced OCR method from process_cv
            extracted_text = process_extract_text(file_path)
            
            # Match possible job roles
            possible_roles = match_job_roles(extracted_text, job_role_keywords)
            
            # Generate a unique ID for this CV
            cv_id = str(uuid.uuid4())
            
            # Create the document to insert
            cv_document = {
                "cv_id": cv_id,
                "file_name": file.filename,
                "Raw Text": extracted_text,
                "Possible Job Roles": possible_roles
            }
            
            # Insert into MongoDB
            result = collection.insert_one(cv_document)
            
            results.append({
                "filename": file.filename,
                "cv_id": cv_id,
                "mongodb_id": str(result.inserted_id),
                "possible_roles": possible_roles[:3] if possible_roles else []  # Return top 3 roles for preview
            })
            
        except Exception as e:
            print(f"Error processing {file.filename}: {str(e)}")
            results.append({
                "filename": file.filename,
                "error": str(e)
            })

    return {
        "message": f"{len(results)} files uploaded and processed successfully",
        "results": results
    }

@app.get("/cvs")
async def get_all_cvs():
    """Get a list of all processed CVs in the database"""
    cvs = list(collection.find({}, {"cv_id": 1, "file_name": 1, "Possible Job Roles": 1}))
    
    # Convert MongoDB ObjectIDs to strings for JSON serialization
    for cv in cvs:
        cv["_id"] = str(cv["_id"])
    
    return {"cvs": cvs}

@app.get("/cv/{cv_id}")
async def get_cv_details(cv_id: str):
    """Get detailed information about a specific CV"""
    cv = collection.find_one({"cv_id": cv_id})
    
    if not cv:
        return {"error": "CV not found"}
    
    # Convert MongoDB ObjectID to string for JSON serialization
    cv["_id"] = str(cv["_id"])
    
    return cv