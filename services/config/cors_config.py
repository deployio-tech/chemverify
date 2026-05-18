import os

from flask import jsonify, request

ALLOWED_ORIGINS = [
    "http://localhost:5173",
    "http://localhost:8080",
    "https://fyp-chemai.vercel.app",
    "https://chemverify.deployio.tech",
    "https://chemverify-server.deployio.tech",
    "https://chemverify-service.deployio.tech",
    "https://chemverify-services.deployio.tech",
]

_extra = os.getenv("CORS_ALLOWED_ORIGINS", "")
if _extra:
    ALLOWED_ORIGINS.extend(
        origin.strip() for origin in _extra.split(",") if origin.strip()
    )

CORS_OPTIONS = {
    "origins": ALLOWED_ORIGINS,
    "supports_credentials": True,
    "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    "allow_headers": ["*"],
    "expose_headers": ["Content-Type", "Authorization"],
    "max_age": 3600,
}


def register_cors_handlers(app):
    @app.before_request
    def handle_preflight():
        if request.method != "OPTIONS":
            return None

        origin = request.headers.get("Origin")
        if origin and origin not in ALLOWED_ORIGINS:
            return (
                jsonify(
                    {
                        "error": "CORS policy violation",
                        "message": f"Origin '{origin}' is not allowed",
                        "allowedOrigins": ALLOWED_ORIGINS,
                    }
                ),
                403,
            )
        return None

    @app.after_request
    def apply_cors_headers(response):
        origin = request.headers.get("Origin")
        if origin and origin in ALLOWED_ORIGINS:
            response.headers["Access-Control-Allow-Origin"] = origin
            response.headers["Access-Control-Allow-Credentials"] = "true"
            response.headers.setdefault(
                "Access-Control-Allow-Methods",
                "GET, POST, PUT, DELETE, OPTIONS",
            )
            response.headers.setdefault(
                "Access-Control-Allow-Headers",
                request.headers.get(
                    "Access-Control-Request-Headers", "Authorization, Content-Type"
                ),
            )
        return response
