from flask import Blueprint, request, jsonify
from config.db import get_db
from models.vector_model import vector_search
from config.get_embeddings import get_embedding
from config.generate_response import generate_response
search_bp = Blueprint("search", __name__)

db = get_db()
collection = db["vectors"]


@search_bp.route("/ask", methods=["POST"])
def search():
    data = request.json

    if not data or "ingredients" not in data or "skinType" not in data:
        return jsonify({"error": "ingredients and skinType are required"}), 400

    ingredients = data["ingredients"]  # array of ingredient strings
    skin_type = data["skinType"]

    # Join ingredients into a single string for embedding generation
    ingredients_text = ", ".join(ingredients)
    print("Ingredients text for embedding:", ingredients_text)

    query_embedding = get_embedding(ingredients_text)

    try:
        print("query embedding generated")
        results = vector_search(collection, query_embedding)
        print("vector searched with results", results)
        response = generate_response(results, ingredients_text, skin_type)
        return jsonify({
            "response": response
        }), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
