from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from Dashboard import router as member1_router
from Upload import router as member2_router

# Create the FastAPI app instance
app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # React app's URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include the routers from each member's project
app.include_router(member1_router, prefix="/member1", tags=["member1"])
app.include_router(member2_router, prefix="/member2", tags=["member2"])

@app.get("/")
def read_root():
    return {"message": "Welcome to the merged FastAPI application!"}
