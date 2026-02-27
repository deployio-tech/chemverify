import os
import json
from dotenv import load_dotenv

# Load variables from the .env file
load_dotenv()

from groq import Groq

client = Groq(api_key=os.getenv("GROQ_API_KEY"))


def generate_response(results, ingredients, skin_type):
    prompt = f"""
You are a certified chemical dermatologist and cosmetic chemist. Analyze the product ingredients below for the given skin type.

Product Ingredients: {ingredients}
Skin Type: {skin_type}
Knowledge Base Context: {results}

INSTRUCTIONS:
1. Analyze EVERY ingredient for this skin type
2. Keep each description under 15 words to be concise
3. Assign a safety_level: "safe", "caution", or "avoid" for each
4. Give an overall product safety_score from 1-10 (10 = perfectly safe)

Return ONLY valid JSON in this exact format, no extra text:

{{
  "skin_type": "{skin_type}",
  "safety_score": 8,
  "overall_rating": "Safe for use",
  "total_ingredients_analyzed": 0,
  "ingredients_analysis": [
    {{
      "name": "Ingredient Name",
      "category": "Moisturizer/Preservative/Emulsifier/Active/Surfactant/Solvent/pH Adjuster/Antioxidant/Humectant/Other",
      "function": "What it does in the product (under 10 words)",
      "safety_level": "safe",
      "comedogenic_rating": 0,
      "description": "Brief effect on this skin type (under 15 words)"
    }}
  ],
  "allergen_warnings": ["List any known common allergens found, or empty array"],
  "key_highlights": {{
    "best_ingredients": ["Top 3 most beneficial ingredient names for this skin type"],
    "ingredients_to_watch": ["Any ingredients that need caution for this skin type"]
  }},
  "product_summary": "2-3 sentence overall verdict about this product for the skin type.",
  "recommendations": ["1-2 actionable tips for using this product with this skin type"]
}}
"""
    raw_response = ask_llm(prompt)
    return clean_response(raw_response)


def clean_response(raw_response):
    """Parse the raw LLM JSON and return only clean, user-facing data."""
    try:
        # Strip markdown code fences if present
        text = raw_response.strip()
        if text.startswith("```"):
            text = text.split("\n", 1)[1]  # remove first line (```json)
            text = text.rsplit("```", 1)[0]  # remove trailing ```
            text = text.strip()

        data = json.loads(text)

        # Build a clean, simplified response for the frontend
        clean = {
            "skin_type": data.get("skin_type", ""),
            "safety_score": data.get("safety_score", 0),
            "overall_rating": data.get("overall_rating", ""),
            "ingredients": [],
            "best_ingredients": data.get("key_highlights", {}).get("best_ingredients", []),
            "ingredients_to_watch": data.get("key_highlights", {}).get("ingredients_to_watch", []),
            "allergen_warnings": data.get("allergen_warnings", []),
            "product_summary": data.get("product_summary", ""),
            "recommendations": data.get("recommendations", []),
        }

        # Extract only name, benefit, and safety_level per ingredient
        for ing in data.get("ingredients_analysis", []):
            clean["ingredients"].append({
                "name": ing.get("name", ""),
                "benefit": ing.get("description", ""),
                "safety_level": ing.get("safety_level", "safe"),
            })

        return clean

    except (json.JSONDecodeError, Exception) as e:
        print(f"Error parsing LLM response: {e}")
        # Return the raw string as fallback
        return {"raw_response": raw_response}


def ask_llm(prompt):
    completion = client.chat.completions.create(
        model="openai/gpt-oss-20b",
        messages=[
            {"role": "system", "content": "You are a certified dermatologist and cosmetic chemist. Always respond with valid JSON only, no markdown, no extra text."},
            {"role": "user", "content": prompt}
        ],
        temperature=0.3,
        max_tokens=4096
    )
    return completion.choices[0].message.content
