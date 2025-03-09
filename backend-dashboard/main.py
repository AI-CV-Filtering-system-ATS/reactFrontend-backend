from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from Dashboard import router as member1_router
from Upload import router as member2_router
from Ranking import router as member3_router
 
app = FastAPI()
 
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],   
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
 
app.include_router(member1_router, prefix="/Pavithra", tags=["Pavithra"])
app.include_router(member2_router, prefix="/Esandu", tags=["Esandu"])
app.include_router(member3_router, prefix="/Sewmini", tags=["Sewmini"])



@app.get("/")
def read_root():
    return {"message": "Welcome to the merged FastAPI application!"}
