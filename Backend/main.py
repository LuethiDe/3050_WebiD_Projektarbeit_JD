from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,        # hier genau die Origins eintragen
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

data = {
    "message": "Hier kommt das Backend",
    "version": 1,
    "status": "running"
}

@app.get("/")
def root():
    return {"message": "Root ist da!"}

@app.get("/v1.0")
def version_info():
    return {"version": "1.0"}

@app.get("/v1.0/info")
def info():
    return data