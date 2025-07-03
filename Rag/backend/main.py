# main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes.main_chat import router as chat_router  # ✅ Only this remains

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Your React frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(chat_router)
