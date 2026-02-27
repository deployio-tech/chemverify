from flask import Flask
from flask_cors import CORS
from controllers.search_controller import search_bp
from config.db import client

app = Flask(__name__)
CORS(app)
app.register_blueprint(search_bp)


@app.route("/health", methods=["GET"])
def health():
    client.admin.command("ping")
    return {"status": "MongoDB connected"}

# if __name__ == "__main__":
#     app.run(debug=True)
