from pydub import AudioSegment, silence
from scipy.signal import find_peaks
import numpy as np


def load_audio(file_path):
    audio = AudioSegment.from_file(file_path)
    sample_rate = audio.frame_rate
    return audio, sample_rate


def detect_speech_segments(audio):
    return silence.detect_nonsilent(audio, min_silence_len=300, silence_thresh=-50)


def average_volume_per_interval(audio_data, sample_rate, interval_ms=100):
    # Calculate the number of samples per the specified interval
    samples_per_interval = sample_rate * interval_ms // 1000

    # Iterate over the audio data in chunks of samples_per_interval
    averages = []
    for i in range(0, len(audio_data), samples_per_interval):
        chunk = audio_data[i : i + samples_per_interval]
        if len(chunk) > 0:
            average_volume = np.mean(np.abs(chunk))
            averages.append(average_volume)

    return np.array(averages)


def detect_syllables(audio, sample_rate, interval_ms=1000, prominence=200):
    # Convert to numpy array for analysis
    audio_data = np.array(audio.get_array_of_samples())

    # Get average volume per interval
    averaged_data = average_volume_per_interval(audio_data, sample_rate, interval_ms)

    # Invert the data to find minima as peaks
    inverted_data = np.max(averaged_data) - averaged_data

    # Find local minima with a prominence filter
    peaks, _ = find_peaks(inverted_data, prominence=prominence)

    return len(peaks) + 1


def calculate_speech_rate(speech_segments, total_syllables):
    total_time = sum((end - start for start, end in speech_segments)) / 1000
    return total_syllables / total_time * 60


def adjust_speed(audio, rate, target_rate=100):
    new_rate = target_rate / rate
    try:
        return audio.speedup(playback_speed=new_rate)
    except ZeroDivisionError:
        return audio


def save_audio(audio, file_path):
    audio.export(file_path, format="mp3")
