from flask import Blueprint, jsonify, request
from dotenv import load_dotenv
from google.cloud import speech
from utils.audio import (
    load_audio,
    adjust_speed,
    save_audio,
    detect_speech_segments,
    detect_syllables,
    calculate_speech_rate,
)
from openai import OpenAI
from utils.assistant import update_knowledge
from utils.auth import get_users
from utils.settings import increment_stat

import os

assistant_bp = Blueprint("assistant", __name__)

load_dotenv()


openai_client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
speech_client = speech.SpeechClient()


@assistant_bp.route("/transcribe_audio", methods=["POST"])
def transcribe_audio():
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

    with open(sped_up_file, "rb") as f:
        content = f.read()

    audio = speech.RecognitionAudio(content=content)
    config = speech.RecognitionConfig(
        encoding=speech.RecognitionConfig.AudioEncoding.MP3,
        sample_rate_hertz=sped_up_sample_rate,
        language_code="pl-PL",
    )

    response = speech_client.recognize(config=config, audio=audio)
    transcription = " ".join(
        [result.alternatives[0].transcript for result in response.results]
    )

    username = request.form.get("username", None)
    increment_stat(username, "recordings")

    return jsonify({"transcribed_text": transcription})


@assistant_bp.route("/process_text", methods=["POST"])
def process_text():
    user_text = request.json.get("text")
    username = request.json.get("username")
    messages = request.json.get("previousMessages", [])
    user_data = get_users()
    assistant_knowledge = (
        user_data.get(username, {}).get("settings", {}).get("assistantKnowledge", "")
    )

    formatted_messages = (
        [
            {
                "role": "system",
                "content": "Jesteś asystentem w pomagającym pacjentom w terapii jąkania. Twoja wiedza o pacjencie: "
                + assistant_knowledge,
            },
        ]
        + messages
        + [{"role": "user", "content": user_text}]
    )

    response = openai_client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=formatted_messages,
        temperature=0.7,
        max_tokens=150,
    )

    llm_response = response.choices[0].message.content

    update_knowledge(
        openai_client, username, assistant_knowledge, messages, user_text, user_data
    )

    return jsonify({"llm_response": llm_response})
