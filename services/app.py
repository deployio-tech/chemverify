from flask import Flask, jsonify, request
from flask_cors import CORS
from controllers.search_controller import search_bp
from controllers.recommendation_controller import recommend_bp
from config.cors_config import ALLOWED_ORIGINS, CORS_OPTIONS, register_cors_handlers
from config.db import client, client2

app = Flask(__name__)
CORS(app, **CORS_OPTIONS)
register_cors_handlers(app)
app.register_blueprint(search_bp)
app.register_blueprint(recommend_bp)

@app.route("/", methods=["GET"])
def index():
    client.admin.command("ping")
    response = client2.admin.command("ping")
    return {"status": "MongoDB connected", "response": response}

@app.route("/health", methods=["GET"])
def health():
    client.admin.command("ping")
    response = client2.admin.command("ping")
    return {"status": "MongoDB connected", "response": response}


@app.errorhandler(403)
def cors_forbidden(error):
    origin = request.headers.get("Origin")
    if origin and origin not in ALLOWED_ORIGINS:
        return (
            jsonify(
                {
                    "error": "CORS policy violation",
                    "message": f"Origin '{origin}' is not allowed",
                }
            ),
            403,
        )
    return jsonify({"error": "Forbidden", "message": str(error)}), 403
