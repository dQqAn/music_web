import sys
import time

import librosa


def detect_bpm(file_path: str):
    print(f"DEBUG: loading -> {file_path}", flush=True)

    t0 = time.perf_counter()
    print("STEP 1: load", flush=True)
    y, sr = librosa.load(file_path, duration=30)
    print(f"STEP 1 DONE ({time.perf_counter() - t0:.2f}s)", flush=True)

    t1 = time.perf_counter()
    onset_env = librosa.onset.onset_strength(y=y, sr=sr)
    print(f"STEP 2 DONE ({time.perf_counter() - t1:.2f}s)", flush=True)

    tempo = librosa.feature.tempo(onset_envelope=onset_env, sr=sr)
    bpm = int(round(tempo[0]))
    print(bpm, flush=True)


if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Usage: sound_bpm.py <audio_file_path>", file=sys.stderr, flush=True)
        sys.exit(1)
    try:
        detect_bpm(sys.argv[1])
    except Exception as e:
        print(f"ERROR: {e}", file=sys.stderr, flush=True)
        sys.exit(1)
