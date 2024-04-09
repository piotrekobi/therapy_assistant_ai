from flask import Blueprint, jsonify, request
from flask_login import (
    UserMixin,
    login_user,
    login_required,
    logout_user,
)
from werkzeug.security import generate_password_hash, check_password_hash
from utils.auth import get_users, save_users
from utils.login_manager import login_manager


auth_bp = Blueprint('auth', __name__)

class User(UserMixin):
    def __init__(self, username, password_hash, stats):
        self.id = username
        self.username = username
        self.password_hash = password_hash
        self.stats = stats



@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.json
    users = get_users()
    username = data["username"]
    password = data["password"]
    if username in users and check_password_hash(
        users[username]["password_hash"], password
    ):
        user_obj = User(
            username, users[username]["password_hash"], users[username].get("stats", {})
        )
        login_user(user_obj)
        return jsonify({"message": "Logged in successfully"}), 200
    return jsonify({"message": "Invalid username or password"}), 401


@auth_bp.route("/register", methods=["POST"])
def register():
    data = request.json
    users = get_users()
    username = data["username"]
    password = data["password"]
    if username in users:
        return jsonify({"message": "Username already exists"}), 400
    password_hash = generate_password_hash(password)
    users[username] = {
        "password_hash": password_hash,
        "stats": {"vowels": 0, "words": 0, "sentences": 0, "recordings": 0, "days": 0},
    }
    save_users(users)
    return jsonify({"message": "User successfully registered"}), 201


@auth_bp.route("/logout", methods=["GET"])
@login_required
def logout():
    logout_user()
    return jsonify({"message": "Logged out"}), 200


@login_manager.user_loader
def load_user(username):
    users = get_users()
    if username in users:
        user_info = users[username]
        return User(username, user_info["password_hash"], user_info.get("stats", {}))
    return None