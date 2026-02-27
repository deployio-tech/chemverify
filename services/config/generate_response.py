import os
from dotenv import load_dotenv

# Load variables from the .env file
load_dotenv()

# PHI_API_KEY = os.getenv("PHI_API_KEY")
# PHI_API_URL = os.getenv("PHI_API_URL")

from groq import Groq
import os

client = Groq(api_key=os.getenv("GROQ_API_KEY"))
# headers = {
#     "Authorization": f"Bearer {PHI_API_KEY}",
#     "Content-Type": "application/json"
# }
def generate_response(results, query):
    prompt = f"""
You are a certified chemical dermatologist and cosmetic chemist specializing in skincare product safety and ingredient analysis.

You have been given a list of product ingredients and the user's skin type. Your job is to verify whether these ingredients are safe, suitable, and beneficial for the specified skin type.

Product Ingredients:
{results}

Skin Type: {query}

Task:
Analyze the product ingredients for the given skin type.
For each ingredient:
- Determine if it is beneficial, neutral, or potentially harmful for the specified skin type
- Provide a one-line explanation of its effect on this skin type

Return the response strictly in the following JSON format and nothing else. Replace the example values with actual data:

Example response format:
{{
  "skin_type": "oily",
  "product_verdict": "Mostly Safe",
  "total_ingredients_analyzed": 5,
  "beneficial_ingredients": [
    {{
      "ingredient_name": "Niacinamide",
      "benefit": "Regulates sebum production and minimizes pore appearance, ideal for oily skin."
    }},
    {{
      "ingredient_name": "Hyaluronic Acid",
      "benefit": "Provides lightweight hydration without adding oiliness to the skin."
    }}
  ],
  "harmful_or_unsuitable_ingredients": [
    {{
      "ingredient_name": "Coconut Oil",
      "concern": "Highly comedogenic and can clog pores, worsening oily and acne-prone skin."
    }}
  ],
  "summary": "This product contains mostly beneficial ingredients for oily skin, but Coconut Oil may cause breakouts. Use with caution."
}}

Now provide the actual verification response for skin type "{query}" using the product ingredients listed above:
"""
    return ask_llm(prompt)

def ask_llm(prompt):
    completion = client.chat.completions.create(
        model="openai/gpt-oss-20b",
        messages=[
            {"role": "system", "content": "You are a certified dermatologist and cosmetic chemist who verifies skincare product ingredients for safety and suitability."},
            {"role": "user", "content": prompt}
        ],
        temperature=0.3,
        max_tokens=1024
    )
    return completion.choices[0].message.content

