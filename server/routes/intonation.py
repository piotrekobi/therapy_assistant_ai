# server/intonation_routes.py

from flask import Blueprint, jsonify
import random
from utils.generation import word_with_intonation

intonation_bp = Blueprint('intonation', __name__)

@intonation_bp.route("/get_intonation_word", methods=["GET"])
def get_intonation_word():
    return jsonify(word_with_intonation())

@intonation_bp.route("/evaluate_intonation", methods=["POST"])
def evaluate_intonation():
    feedback_options = ["Dobrze", "Poprawnie", "Niepoprawnie"]
    feedback = random.choice(feedback_options)
    return jsonify({"feedback": feedback})
