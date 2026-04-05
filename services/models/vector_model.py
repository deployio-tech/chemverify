def vector_search(collection, query_embedding, limit=3):
    pipeline = [
        {
            "$vectorSearch": {
                "index": "vector_index",
                "queryVector": query_embedding,
                "path": "vector",
                "numCandidates": 100,
                "limit": limit
            }
        },
        {
            "$project": {
                "_id": 0,
                "text": 1,
                "score": {"$meta": "vectorSearchScore"}
            }
        }
    ]

    return list(collection.aggregate(pipeline))
