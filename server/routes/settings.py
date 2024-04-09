# server/settings_bp.py

from flask import Blueprint, jsonify, request
from utils.auth import get_users, save_users

settings_bp = Blueprint('settings', __name__)


@settings_bp.route("/get_user_settings", methods=["POST"])
def get_user_settings():
    data = request.json
    username = data.get("username")
    if not username:
        return jsonify({"error": "Username is required"}), 400

    users = get_users()
    if username not in users:
        return jsonify({"error": "User not found"}), 404

    user_settings = users[username].get("settings", {})
    return jsonify(user_settings)


@settings_bp.route("/save_personalization_settings", methods=["POST"])
def save_personalization_settings():
    data = request.json
    username = data.get("username")
    if not username:
        return jsonify({"error": "Username is required"}), 400

    users = get_users()
    if username not in users:
        return jsonify({"error": "User not found"}), 404

    users[username]["settings"] = data.get("settings", {})
    save_users(users)
    return jsonify({"message": "Settings updated successfully"})


@settings_bp.route("/get_statistics", methods=["POST"])
def get_statistics():
    data = request.get_json()
    username = data["username"]
    users = get_users()
    user_info = users.get(username, {})
    stats = user_info.get("stats", {})
    return jsonify(stats)
