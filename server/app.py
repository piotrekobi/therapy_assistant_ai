# server/app.py

from flask import Flask, render_template, jsonify, request
from flask_cors import CORS, cross_origin
from flask_login import (
    LoginManager,
    UserMixin,
    login_user,
    login_required,
    logout_user,
    current_user,
)
from werkzeug.security import generate_password_hash, check_password_hash
from dotenv import load_dotenv
import json
import random
from generation import (
    generate_vowels,
    generate_words,
    divide_sentence,
    random_word_with_chars,
)
from google.cloud import speech
from detect_speedup import (
    load_audio,
    adjust_speed,
    save_audio,
    detect_speech_segments,
    detect_syllables,
    calculate_speech_rate,
)
from openai import OpenAI
import os


load_dotenv()


app = Flask(__name__)

# os.getenv('SECRET_KEY', 'your_secret_key_here')
app.secret_key = "secret"

# Specify the origins you want to allow requests from
CORS(app, supports_credentials=True)

login_manager = LoginManager()
login_manager.init_app(app)

USERS_FILE = "files/users.json"

with open("files/polish/sentences.json", "r", encoding="utf-8") as json_file:
    pl_word_count_ranges = json.load(json_file)

with open("files/english/sentences.json", "r", encoding="utf-8") as json_file:
    en_word_count_ranges = json.load(json_file)


@app.route("/")
def index():
    return render_template("index.html")


def increment_stat(username, stat):
    with open("files/users.json", "r+") as file:
        users = json.load(file)
        user = users.get(username)
        if user:
            user['stats'][stat] += 1
            file.seek(0)
            json.dump(users, file, indent=4)
            file.truncate()

@app.route("/generate_vowels", methods=["POST"])
def generate_vowels_route():
    data = request.get_json()
    username = data.get('username')
    increment_stat(username, 'vowels')
    return jsonify({"text": generate_vowels()})

@app.route("/generate_words", methods=["POST"])
def generate_words_route():
    data = request.get_json() 
    username = data.get('username')
    lang = request.args.get("lang", "pl")
    increment_stat(username, 'words')
    return jsonify({"text": generate_words(lang)})


@app.route("/generate_sentence", methods=["POST"])
def generate_sentence_route():
    selected_tempo = int(request.form["tempo"])
    selected_range = request.form.get("range", None)
    sentence = request.form.get("sentence", None)
    source = request.form.get("source", None)
    lang = request.form.get("lang", "pl")
    word_count_ranges = pl_word_count_ranges if lang == "pl" else en_word_count_ranges
    if sentence is None or source is None:
        username = request.form.get("username", None)
        increment_stat(username, 'sentences') 
        selected_quote = random.choice(word_count_ranges[selected_range])
        sentence, source = selected_quote[0], selected_quote[1]
    divided_sentence = divide_sentence(sentence, selected_tempo, lang)

    return jsonify({"text": divided_sentence, "source": source, "sentence": sentence})


@app.route("/generate_random_word", methods=["GET"])
def generate_random_word_route():
    characters = request.args.get("characters", "")
    starts_with = request.args.get("startsWith", "false").lower() == "true"
    ends_with = request.args.get("endsWith", "false").lower() == "true"
    lang = request.args.get("lang", "pl")

    word = random_word_with_chars(characters, starts_with, ends_with, lang)
    return jsonify({"text": word})


@app.route("/transcribe_audio", methods=["POST"])
def transcribe_audio():
    # Save the uploaded audio file
    audio_file = request.files["audio"]
    file_path = "uploads/audio.webm"
    os.makedirs(os.path.dirname(file_path), exist_ok=True)
    audio_file.save(file_path)

    audio, sample_rate = load_audio(file_path)
    speech_segments = detect_speech_segments(audio)
    total_syllables = detect_syllables(audio, sample_rate)
    speech_rate = calculate_speech_rate(speech_segments, total_syllables)
    adjusted_audio = adjust_speed(audio, speech_rate)
    sped_up_file = "uploads/sped_up_audio.mp3"
    save_audio(adjusted_audio, sped_up_file)

    _, sped_up_sample_rate = load_audio(sped_up_file)

    # Transcribe the sped up audio using Google Cloud Speech-to-Text
    client = speech.SpeechClient()
    with open(sped_up_file, "rb") as f:
        content = f.read()

    audio = speech.RecognitionAudio(content=content)
    config = speech.RecognitionConfig(
        encoding=speech.RecognitionConfig.AudioEncoding.MP3,
        sample_rate_hertz=sped_up_sample_rate,
        language_code="pl-PL",
    )

    response = client.recognize(config=config, audio=audio)
    transcription = " ".join(
        [result.alternatives[0].transcript for result in response.results]
    )


    client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

    response = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[
            {
                "role": "system",
                "content": "Jesteś asystentem w pomagającym pacjentom w terapii jąkania.",
            },
            {"role": "user", "content": transcription},
        ],
        temperature=0.7,
        max_tokens=150,
    )
    llm_response = response.choices[0].message.content

    username = request.form.get("username", None)
    increment_stat(username, 'recordings')


    return jsonify({"transcribed_text": transcription, "llm_response": llm_response})

@app.route("/get_statistics", methods=["POST"])
def get_statistics():
    data = request.get_json()  # Get data from POST request
    username = data['username']
    users = get_users()
    user_info = users.get(username, {})
    stats = user_info.get("stats", {})
    return jsonify(stats)



class User(UserMixin):
    def __init__(self, username, password_hash):
        self.id = username
        self.username = username
        self.password_hash = password_hash



@login_manager.user_loader
def load_user(username):
    users = get_users()
    user_info = users.get(username)
    if user_info:
        return User(username, user_info["password_hash"])
    return None



def get_users():
    if not os.path.exists(USERS_FILE):
        return {}
    with open(USERS_FILE, "r") as f:
        return json.load(f)

def save_user(username, password_hash):
    users = get_users()
    users[username] = {"password_hash": password_hash, "stats": {"vowels": 0, "words": 0, "sentences": 0, "recordings": 0, "days": 0}}
    with open(USERS_FILE, "w") as f:
        json.dump(users, f, indent=4)


@app.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    users = get_users()
    username = data["username"]
    password = data["password"]

    if username in users and check_password_hash(users[username]["password_hash"], password):
        user_obj = User(username, users[username]["password_hash"])
        login_user(user_obj)
        return jsonify({"message": "Logged in successfully"}), 200

    return jsonify({"message": "Invalid username or password"}), 401



@app.route("/register", methods=["POST"])
def register():
    data = request.json
    username = data.get("username")
    password = data.get("password")
    users = get_users()

    if username in users:
        return jsonify({"message": "Username already exists"}), 400

    password_hash = generate_password_hash(password)
    save_user(username, password_hash)

    return jsonify({"message": "User successfully registered"}), 201



if __name__ == "__main__":
    app.run(debug=False)
