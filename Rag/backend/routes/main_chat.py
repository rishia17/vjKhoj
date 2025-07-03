# routes/main_chat.py

from fastapi import APIRouter
from pydantic import BaseModel
import requests
from services.groq_service import generate_chat_response

router = APIRouter()

class ChatRequest(BaseModel):
    message: str

@router.post("/chat")
async def main_chat(req: ChatRequest):
    user_input = req.message
    response = generate_chat_response(user_input)
    return {"response": response}
