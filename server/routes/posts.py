# server/posts_routes.py

from flask import Blueprint, jsonify, request
from utils.posts import get_posts, save_posts


posts_bp = Blueprint('posts', __name__)

@posts_bp.route("/add_post", methods=["POST"])
def add_post():
    posts = get_posts()
    data = request.json
    new_post_id = str(max([int(x) for x in posts.keys()]) + 1 if posts else 1)
    posts[new_post_id] = {
        "title": data["title"],
        "content": data["content"],
        "comments": [],
    }
    save_posts(posts)
    return jsonify({"message": "Post dodany pomyślnie", "post_id": new_post_id}), 201


# Endpoint do dodawania komentarza do posta
@posts_bp.route("/add_comment/<post_id>", methods=["POST"])
def add_comment(post_id):
    posts = get_posts()
    if post_id in posts:
        data = request.json
        posts[post_id]["comments"].posts_bpend({"content": data["content"]})
        save_posts(posts)
        return jsonify({"message": "Komentarz dodany pomyślnie"}), 201
    else:
        return jsonify({"message": "Post nie istnieje"}), 404


# Endpoint do wczytywania wszystkich postów
@posts_bp.route("/get_posts", methods=["GET"])
def get_all_posts():
    posts = get_posts()
    return jsonify(posts)


# Endpoint do wczytywania konkretnego posta wraz z komentarzami
@posts_bp.route("/get_post/<post_id>", methods=["GET"])
def get_post(post_id):
    posts = get_posts()
    if post_id in posts:
        return jsonify(posts[post_id])
    else:
        return jsonify({"message": "Post nie istnieje"}), 404