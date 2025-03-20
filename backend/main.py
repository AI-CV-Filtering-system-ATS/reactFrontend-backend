from fastapi import FastAPI, UploadFile, File # type: ignore
from pymongo import MongoClient # type: ignore
import pdfplumber # type: ignore
import shutil
import os
from pymongo.server_api import ServerApi # type: ignore
from fastapi.middleware.cors import CORSMiddleware # type: ignore
import uuid
from process_cv import extract_text_from_pdf as process_extract_text, match_job_roles, job_role_keywords
from fastapi import FastAPI, UploadFile, File, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from pydantic import BaseModel
from passlib.context import CryptContext
from datetime import datetime, timedelta
from jose import JWTError, jwt
from typing import Optional

app = FastAPI()


# New models for authentication
class UserCreate(BaseModel):
    fullName: str
    email: str
    password: str

class UserResponse(BaseModel):
    id: str
    fullName: str
    email: str

class Token(BaseModel):
    access_token: str
    token_type: str
    user: UserResponse

# Configure password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Configure JWT
SECRET_KEY = "23423423"  # Change this to a secure random key
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24  # 24 hours

# OAuth2 setup
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Replace with your React app's URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

#uvicorn main:app --reload
   
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
users_collection = db["users"]


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


# Helper functions for authentication
def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=15))
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def get_user_by_email(email: str):
    return users_collection.find_one({"email": email})

def authenticate_user(email: str, password: str):
    user = get_user_by_email(email)
    if not user or not verify_password(password, user["password"]):
        return False
    return user

async def get_current_user(token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    
    user = users_collection.find_one({"_id": user_id})
    if user is None:
        raise credentials_exception
    return user

# Auth endpoints
@app.post("/signup", response_model=Token)
async def create_user(user: UserCreate):
    # Check if user already exists
    existing_user = get_user_by_email(user.email)
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Create new user
    user_id = str(uuid.uuid4())
    hashed_password = get_password_hash(user.password)
    user_data = {
        "_id": user_id,
        "fullName": user.fullName,
        "email": user.email,
        "password": hashed_password,
        "created_at": datetime.utcnow()
    }
    
    users_collection.insert_one(user_data)
    
    # Create access token
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user_id}, expires_delta=access_token_expires
    )
    
    # Return token and user info
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": user_id,
            "fullName": user.fullName,
            "email": user.email
        }
    }

@app.post("/login", response_model=Token)
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends()):
    user = authenticate_user(form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user["_id"]}, expires_delta=access_token_expires
    )
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": user["_id"],
            "fullName": user["fullName"],
            "email": user["email"]
        }
    }
