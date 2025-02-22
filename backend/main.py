from fastapi import FastAPI, UploadFile, File
from pymongo import MongoClient
import pdfplumber
import shutil
import os

app = FastAPI()

# MongoDB Connection
client = MongoClient("mongodb://localhost:27017/")
db = client["cv_database"]
collection = db["cvs"]

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
    
    for file in files:
        file_path = os.path.join(upload_dir, file.filename)
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        if file.filename.endswith(".pdf"):
            text = extract_text_from_pdf(file_path)
            collection.insert_one({"filename": file.filename, "content": text})

    return {"message": "Files uploaded and processed successfully"}