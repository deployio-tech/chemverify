import os
from dotenv import load_dotenv
from pymongo import MongoClient

# Load environment variables from .env file
load_dotenv()

MONGO_URI = os.getenv("MONGO_URI")
MONGO_URI_2 = os.getenv("MONGO_URI_2")

client = MongoClient(MONGO_URI)

client2 = MongoClient(MONGO_URI_2)

def get_db():
    return client["rag_db"]

def get_ingredient_db():
    return client2["ingredient_mapping"]

def get_product_formulation_db():
    return client2["product_formulation"]

def get_concentration_db():
    return client2["concentration_mapping"]
