# server/generator_bp.py

from flask import Blueprint, jsonify, request
import random
from utils.generation import (
    generate_vowels,
    generate_words,
    divide_sentence,
    random_word_with_chars
)
from utils.settings import increment_stat

import random
import json


generator_bp = Blueprint('generator', __name__)

with open("files/polish/sentences.json", "r", encoding="utf-8") as json_file:
    pl_word_count_ranges = json.load(json_file)

with open("files/english/sentences.json", "r", encoding="utf-8") as json_file:
    en_word_count_ranges = json.load(json_file)

@generator_bp.route("/generate_vowels", methods=["POST"])
def generate_vowels_route():
    data = request.get_json()
    username = data.get("username")
    increment_stat(username, "vowels")
    return jsonify({"text": generate_vowels()})


@generator_bp.route("/generate_words", methods=["POST"])
def generate_words_route():
    data = request.get_json()
    username = data.get("username")
    lang = request.args.get("lang", "pl")
    increment_stat(username, "words")
    return jsonify({"text": generate_words(lang)})


@generator_bp.route("/generate_sentence", methods=["POST"])
def generate_sentence_route():
    selected_tempo = int(request.form["tempo"])
    selected_range = request.form.get("range", None)
    sentence = request.form.get("sentence", None)
    source = request.form.get("source", None)
    lang = request.form.get("lang", "pl")
    word_count_ranges = pl_word_count_ranges if lang == "pl" else en_word_count_ranges
    if sentence is None or source is None:
        username = request.form.get("username", None)
        increment_stat(username, "sentences")
        selected_quote = random.choice(word_count_ranges[selected_range])
        sentence, source = selected_quote[0], selected_quote[1]
    divided_sentence = divide_sentence(sentence, selected_tempo, lang)

    return jsonify({"text": divided_sentence, "source": source, "sentence": sentence})


@generator_bp.route("/generate_random_word", methods=["GET"])
def generate_random_word_route():
    characters = request.args.get("characters", "")
    starts_with = request.args.get("startsWith", "false").lower() == "true"
    ends_with = request.args.get("endsWith", "false").lower() == "true"
    lang = request.args.get("lang", "pl")

    word = random_word_with_chars(characters, starts_with, ends_with, lang)
    return jsonify({"text": word})