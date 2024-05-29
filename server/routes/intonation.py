# server/intonation_routes.py

from flask import Blueprint, jsonify, request
import random
from utils.generation import word_with_intonation
from utils.intonation import classify_emotion, detect_emotion_parameters

intonation_bp = Blueprint('intonation', __name__)

@intonation_bp.route("/get_intonation_word", methods=["GET"])
def get_intonation_word():
    return jsonify(word_with_intonation())

@intonation_bp.route("/evaluate_intonation", methods=["POST"])
def evaluate_intonation():
    audio_file = request.files["audio"]
    audio_file.save("uploads/intonation.webm")
    params = detect_emotion_parameters("uploads/intonation.webm")
    emotion, distances = classify_emotion(params[2]["score"], params[1]["score"], params[0]["score"])
    print(params, emotion, distances)
    return jsonify({"emotion": emotion, "distances": distances})
