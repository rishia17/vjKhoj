from fastapi import APIRouter, HTTPException
from passlib.context import CryptContext
from pydantic import BaseModel
from db import user_collection
import jwt
import os
from dotenv import load_dotenv

load_dotenv()

router = APIRouter(prefix="/user-api")
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
SECRET_KEY = os.getenv("SECRET_KEY")

class User(BaseModel):
    username: str
    email: str
    password: str

class LoginUser(BaseModel):
    username: str
    password: str


@router.post("/user")
async def register(user: User):
    print("HI")
    existing = await user_collection.find_one({"username": user.username})
    if existing:
        raise HTTPException(status_code=400, detail="User already exists")

    hashed = pwd_context.hash(user.password)
    user_dict = user.dict()
    user_dict["password"] = hashed
    await user_collection.insert_one(user_dict)
    return {"message": "User created"}

@router.post("/login")
async def login(user: LoginUser):
    db_user = await user_collection.find_one({"username": user.username})
    if not db_user:
        raise HTTPException(status_code=400, detail="Invalid username")

    if not pwd_context.verify(user.password, db_user["password"]):
        raise HTTPException(status_code=400, detail="Invalid password")

    token = jwt.encode({"username": db_user["username"]}, SECRET_KEY, algorithm="HS256")
    db_user.pop("password")
    db_user.pop("_id", None)
    return {"message": "Login successful", "token": token, "user": db_user}
