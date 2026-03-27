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

    prompt = f"""
You are a board-certified dermatologist and cosmetic chemist helping a
pharmacist formulate a custom skincare product.

PRODUCT TO FORMULATE: {product_type}

TARGET PATIENT PROFILE:
- Skin Type      : {skin_type}
- Skin Condition  : {skin_condition}
- Weather/Climate : {weather}
- Skin Color/Tone : {skin_color}

Use the retrieved knowledge below to build a scientifically-backed formulation.

=== INGREDIENT KNOWLEDGE ===
{json.dumps(ingredient_results, indent=2, default=str)}

=== PRODUCT FORMULATION KNOWLEDGE ===
{json.dumps(product_formulation_results, indent=2, default=str)}

=== CONCENTRATION GUIDELINES ===
{json.dumps(concentration_results, indent=2, default=str)}

INSTRUCTIONS:
1. Provide a complete formulation for a "{product_type}" tailored to the
   patient profile above.
2. Include 8-10 ingredients. For EACH ingredient provide:
   - name: the INCI / chemical name of the ingredient
   - recommended_concentration: the safe & effective percentage or range
     (e.g. "2-5%", "0.5%", "q.s.")
   - role_in_product: its functional role in this specific product type
     (e.g. Humectant, Emollient, Active, Emulsifier, Preservative,
      Thickener, Solvent, pH Adjuster, Sunscreen Filter, Antioxidant, etc.)
   - reason: why this ingredient suits this patient (under 15 words)
   - caution: any warnings for this profile, or null if none
3. Also provide:
   - product_name_suggestion: a professional product name suggestion
   - formulation_type: the vehicle/base type (e.g. "oil-in-water emulsion",
     "gel-cream", "anhydrous balm", "aqueous gel", "water-in-oil emulsion")
   - target_pH: recommended pH range for the final product
   - shelf_life_estimate: estimated shelf life with proper preservation
   - application_instructions: 2-3 sentences on how the patient should apply
   - climate_considerations: special formulation notes for the given weather
   - formulation_notes: 2-3 sentences of overall advice for the pharmacist
     about this formulation (e.g. order of mixing, temperature sensitivity)
4. Return ONLY valid JSON, no markdown, no extra text.

Output format:

{{
  "product_type": "{product_type}",
  "product_name_suggestion": "",
  "formulation_type": "",
  "target_pH": "",
  "shelf_life_estimate": "",
  "patient_profile": {{
    "skin_type": "{skin_type}",
    "skin_condition": "{skin_condition}",
    "weather": "{weather}",
    "skin_color": "{skin_color}"
  }},
  "formulation": [
    {{
      "name": "",
      "recommended_concentration": "",
      "role_in_product": "",
      "reason": "",
      "caution": null
    }}
  ],
  "application_instructions": "",
  "climate_considerations": "",
  "formulation_notes": ""
}}
"""

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
        max_tokens=8192,
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
