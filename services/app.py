from flask import Flask
from flask_cors import CORS
from controllers.search_controller import search_bp
from controllers.recommendation_controller import recommend_bp
from config.db import client, client2

app = Flask(__name__)
CORS(app)
app.register_blueprint(search_bp)
app.register_blueprint(recommend_bp)


@app.route("/health", methods=["GET"])
def health():
    client.admin.command("ping")
    response = client2.admin.command("ping")

    return {"status": "MongoDB connected","response":response}

# if __name__ == "__main__":
#     app.run(debug=True)
