from flask import Flask, render_template
from flask_cors import CORS
from routes.assistant import assistant_bp
from routes.auth import auth_bp
from routes.generator import generator_bp
from routes.intonation import intonation_bp
from routes.posts import posts_bp
from routes.settings import settings_bp
from utils.login_manager import login_manager
import os

app = Flask(__name__)
app.secret_key = os.getenv("SECRET_KEY", "secret_key_here")
CORS(
    app,
    resources={r"/*": {"origins": "http://localhost:3000"}},
    supports_credentials=True,
)

login_manager.init_app(app)

app.register_blueprint(assistant_bp)
app.register_blueprint(auth_bp)
app.register_blueprint(generator_bp)
app.register_blueprint(intonation_bp)
app.register_blueprint(posts_bp)
app.register_blueprint(settings_bp)


@app.route("/")
def index():
    return render_template("index.html")


if __name__ == "__main__":
    app.run(debug=True)
