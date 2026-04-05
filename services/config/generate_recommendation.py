"""
LLM prompt builder & response parser for the product formulation flow.

A pharmacist / dermatologist wants to formulate a specific product type
(moisturizer, sunscreen, serum, etc.) for a patient's skin profile.
The LLM returns a complete formulation with ingredients, concentrations,
roles, and reasoning.
"""

import os
import json
from dotenv import load_dotenv

load_dotenv()

from groq import Groq

client = Groq(api_key=os.getenv("GROQ_API_KEY"))


def generate_recommendation(
    ingredient_results,
    product_formulation_results,
    concentration_results,
    product_type,
    skin_type,
    skin_condition,
    weather,
    skin_color,
):
    """Build a formulation prompt from all three DB results and call the LLM."""

    # ── truncate retrieved text to reduce token usage ───────────────────
    def _trim(results, max_chars=250):
        return [
            {**r, "text": r["text"][:max_chars] if isinstance(r.get("text"), str) else r.get("text", "")}
            for r in results
        ]

    ing_text     = "\n".join(f"- {r['text']}" for r in _trim(ingredient_results))
    prod_text    = "\n".join(f"- {r['text']}" for r in _trim(product_formulation_results))
    conc_text    = "\n".join(f"- {r['text']}" for r in _trim(concentration_results))

    prompt = f"""You are a dermatologist and cosmetic chemist helping formulate a custom skincare product.

PRODUCT: {product_type} | SKIN: {skin_type} | CONDITION: {skin_condition} | WEATHER: {weather} | TONE: {skin_color}

INGREDIENT KNOWLEDGE:
{ing_text}

FORMULATION KNOWLEDGE:
{prod_text}

CONCENTRATION GUIDELINES:
{conc_text}

Return ONLY valid JSON (no markdown) with this exact structure:
{{
  "product_type": "{product_type}",
  "product_name_suggestion": "",
  "formulation_type": "",
  "target_pH": "",
  "shelf_life_estimate": "",
  "patient_profile": {{"skin_type": "{skin_type}", "skin_condition": "{skin_condition}", "weather": "{weather}", "skin_color": "{skin_color}"}},
  "formulation": [
    {{"name": "", "recommended_concentration": "", "role_in_product": "", "reason": "", "caution": null}}
  ],
  "application_instructions": "",
  "climate_considerations": "",
  "formulation_notes": ""
}}
Include 8 ingredients. Keep reasons under 12 words each."""

    raw = _ask_llm(prompt)
    return _clean_recommendation(raw)


# ── helpers ──────────────────────────────────────────────────────────────

def _ask_llm(prompt: str) -> str:
    completion = client.chat.completions.create(
        model="openai/gpt-oss-20b",
        messages=[
            {
                "role": "system",
                "content": (
                    "You are a certified dermatologist and cosmetic chemist. "
                    "You help pharmacists formulate custom skincare products. "
                    "Always respond with valid JSON only, no markdown, no extra text."
                ),
            },
            {"role": "user", "content": prompt},
        ],
        temperature=0.3,
        max_tokens=2048,
    )
    return completion.choices[0].message.content


def _clean_recommendation(raw_response: str) -> dict:
    """Parse the raw LLM JSON and return clean formulation data."""
    try:
        text = raw_response.strip()
        # Strip markdown code fences if present
        if text.startswith("```"):
            text = text.split("\n", 1)[1]
            text = text.rsplit("```", 1)[0].strip()

        data = json.loads(text)

        clean = {
            "product_type": data.get("product_type", ""),
            "product_name_suggestion": data.get("product_name_suggestion", ""),
            "formulation_type": data.get("formulation_type", ""),
            "target_pH": data.get("target_pH", ""),
            "shelf_life_estimate": data.get("shelf_life_estimate", ""),
            "patient_profile": data.get("patient_profile", {}),
            "formulation": [],
            "application_instructions": data.get("application_instructions", ""),
            "climate_considerations": data.get("climate_considerations", ""),
            "formulation_notes": data.get("formulation_notes", ""),
        }

        for ing in data.get("formulation", []):
            clean["formulation"].append({
                "name": ing.get("name", ""),
                "recommended_concentration": ing.get("recommended_concentration", ""),
                "role_in_product": ing.get("role_in_product", ""),
                "reason": ing.get("reason", ""),
                "caution": ing.get("caution"),
            })

        return clean

    except (json.JSONDecodeError, Exception) as e:
        print(f"Error parsing recommendation response: {e}")
        return {"raw_response": raw_response}
