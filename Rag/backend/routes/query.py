# routes/query.py

from fastapi import APIRouter
from pydantic import BaseModel
from services.query_faculty import generate_response

router = APIRouter()

class QueryRequest(BaseModel):
    query: str

@router.post("/query")
async def ask_faculty(req: QueryRequest):
    result = generate_response(req.query)
    return {"response": result}
