import math
import requests

API_URL = "https://api-inference.huggingface.co/models/audeering/wav2vec2-large-robust-12-ft-emotion-msp-dim"
headers = {"Authorization": "Bearer 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"}

def detect_emotion_parameters(filename):
    with open(filename, "rb") as f:
        data = f.read()
    response = requests.post(API_URL, headers=headers, data=data)
    return response.json()

def classify_emotion(valence, arousal, dominance):
    emotions = {
        "Anger": {"Valence": -0.43, "Arousal": 0.67, "Dominance": 0.34},
        "Joy": {"Valence": 0.76, "Arousal": 0.48, "Dominance": 0.35},
        "Surprise": {"Valence": 0.4, "Arousal": 0.67, "Dominance": -0.13},
        "Disgust": {"Valence": -0.6, "Arousal": 0.35, "Dominance": 0.11},
        "Fear": {"Valence": -0.64, "Arousal": 0.6, "Dominance": -0.43},
        "Sadness": {"Valence": -0.63, "Arousal": 0.27, "Dominance": -0.33}
    }

    min_distance = float('inf')
    detected_emotion = None
    distances = {}

    for emotion, values in emotions.items():
        distance = math.sqrt(
            (values["Valence"] - valence) ** 2 +
            (values["Arousal"] - arousal) ** 2 +
            (values["Dominance"] - dominance) ** 2
        )
        distances[emotion] = round(distance, 2)

        if distance < min_distance:
            min_distance = distance
            detected_emotion = emotion

    return detected_emotion, distances