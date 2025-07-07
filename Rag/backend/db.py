from motor.motor_asyncio import AsyncIOMotorClient
import os
from dotenv import load_dotenv

load_dotenv()

MONGO_URL = os.getenv("DB_URL")
client = AsyncIOMotorClient(MONGO_URL)
db = client.vjKhoj  # your DB name
user_collection = db["user"]