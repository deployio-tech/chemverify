



def extract_skin_mapping(text):
    prompt = f"""
You are a dermatology and cosmetic chemistry expert.

From the given text, extract structured information about skincare ingredients.

Text:
{text}

Extract:
- ingredient name
- skin conditions it is used for
- functional roles (like anti-inflammatory, antioxidant, exfoliant)

Rules:
- Only include medically relevant skin conditions (e.g., acne, pigmentation, dryness)
- Ignore vague terms like "good for skin"
- Return ONLY valid JSON
- Do not add explanations

Output format:

[
  {{
    "ingredient": "",
    "skin_conditions": [],
    "functions": []
  }}
]
"""
    return ask_llm(prompt)