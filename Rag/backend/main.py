# main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes.main_chat import router as chat_router 
from routes.user_routes import router as user_router 
app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(chat_router)
app.include_router(user_router)