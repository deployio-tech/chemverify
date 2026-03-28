"""
Vector search helpers for the three recommendation databases:
  - ingredient_mapping  (collection: "ingredients")
  - skintype_mapping    (collection: "skintypes")
  - concentration_mapping (collection: "concentrations")

Each DB is expected to have a MongoDB Atlas Vector Search index named
"vector_index" on the field "vector" with 384 dimensions (MiniLM-L6-v2).
"""


def _vector_search(collection, query_embedding, index_name="vector_index",
                   path="vector", limit=5, project_fields=None):
    """Generic vector search on any collection."""
    pipeline = [
        {
            "$vectorSearch": {
                "index": index_name,
                "queryVector": query_embedding,
                "path": path,
                "numCandidates": 100,
                "limit": limit,
            }
        },
        {
            "$project": {
                "_id": 0,
                **(project_fields or {"text": 1}),
                "score": {"$meta": "vectorSearchScore"},
            }
        },
    ]
    return list(collection.aggregate(pipeline))


def search_ingredients(db, query_embedding, limit=5):
    """Search the ingredient_mapping DB for relevant ingredients."""
    collection = db["vectors"]
    return _vector_search(
        collection,
        query_embedding,
        limit=limit,
        project_fields={
            "text": 1,
            "ingredient": 1,
            "skin_conditions": 1,
            "functions": 1,
        },
    )


def search_product_formulation(db, query_embedding, limit=5):
    """Search the skintype_mapping DB for skin-type knowledge."""
    collection = db["vectors"]
    return _vector_search(
        collection,
        query_embedding,
        limit=limit,
        project_fields={
            "text": 1,
            "skin_type": 1,
            "characteristics": 1,
            "recommended_ingredients": 1,
        },
    )


def search_concentrations(db, query_embedding, limit=5):
    """Search the concentration_mapping DB for concentration data."""
    collection = db["vectors"]
    return _vector_search(
        collection,
        query_embedding,
        limit=limit,
        project_fields={
            "text": 1,
            "ingredient": 1,
            "concentration": 1,
            "usage_notes": 1,
        },
    )
