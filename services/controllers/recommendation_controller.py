"""
/recommend endpoint

A pharmacist or dermatologist sends a product type + patient skin profile →
queries 3 vector DBs → combines results → LLM → returns a full product
formulation with ingredients, concentrations & reasoning.
"""

from flask import Blueprint, request, jsonify

from config.db import get_ingredient_db, get_product_formulation_db, get_concentration_db
from config.get_embeddings import get_embedding
from config.generate_recommendation import generate_recommendation
from models.recommendation_model import (
    search_ingredients,
    search_product_formulation,
    search_concentrations,
)

recommend_bp = Blueprint("recommend", __name__)


@recommend_bp.route("/recommend", methods=["POST"])
def recommend():
    """
    POST /recommend
    Body (JSON):
    {
        "productType":   "moisturizer",
        "skinType":      "oily",
        "skinCondition": "acne",
        "weather":       "hot and humid",
        "skinColor":     "medium / brown"
    }
    """
    data = request.json

    # ── validate input ───────────────────────────────────────────────────
    required = ["productType", "skinType", "skinCondition", "weather", "skinColor"]
    missing = [f for f in required if not data or not data.get(f)]
    if missing:
        return jsonify({
            "error": f"Missing required fields: {', '.join(missing)}"
        }), 400

    product_type = data["productType"]
    skin_type = data["skinType"]
    skin_condition = data["skinCondition"]
    weather = data["weather"]
    skin_color = data["skinColor"]

    # ── build a rich query string for embedding ──────────────────────────
    query_text = (
        f"Formulate a {product_type} for {skin_type} skin "
        f"with {skin_condition} condition "
        f"in {weather} climate "
        f"for {skin_color} skin tone "
        f"ingredients concentration formulation"
    )
    print(f"[recommend] query text: {query_text}")

    try:
        query_embedding = get_embedding(query_text)
        print("[recommend] embedding generated")

        # ── search all three vector DBs ──────────────────────────────────
        ingredient_db = get_ingredient_db()
        product_formulation_db = get_product_formulation_db()
        concentration_db = get_concentration_db()

        ingredient_results = search_ingredients(ingredient_db, query_embedding)
        product_formulation_results = search_product_formulation(product_formulation_db, query_embedding)
        concentration_results = search_concentrations(concentration_db, query_embedding)

        print(f"[recommend] ingredient hits : {len(ingredient_results)}")
        print(f"[recommend] product formulation hits   : {len(product_formulation_results)}")
        print(f"[recommend] concentration hits: {len(concentration_results)}")

        # ── combine & send to LLM ───────────────────────────────────────
        response = generate_recommendation(
            ingredient_results=ingredient_results,
            product_formulation_results=product_formulation_results,
            concentration_results=concentration_results,
            product_type=product_type,
            skin_type=skin_type,
            skin_condition=skin_condition,
            weather=weather,
            skin_color=skin_color,
        )

        return jsonify({"response": response}), 200

    except Exception as e:
        print(f"[recommend] error: {e}")
        return jsonify({"error": str(e)}), 500
