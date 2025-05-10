"""
High-quality time-stretch with Librosa.

⚙️  CLI
    python sound_stretch_librosa.py in.wav out.wav --rate 1.25
    python sound_stretch_librosa.py in.wav out.wav --duration 8.0
"""
from __future__ import annotations

import argparse
import pathlib
import sys;

import librosa  # pip install librosa soundfile
import soundfile as sf

sys.stdout.reconfigure(encoding="utf-8")


def stretch(src: pathlib.Path, dst: pathlib.Path, *, rate: float | None,
            duration: float | None) -> None:
    if not src.exists():
        sys.exit(f"❌ {src} not found")

    y, sr = librosa.load(src, sr=None, mono=True)
    if duration:
        rate = len(y) / sr / duration  # convert target-seconds → rate
    y_out = librosa.effects.time_stretch(y, rate=rate)  # p-voc
    sf.write(dst, y_out, sr)
    print(f"saved → {dst}")


if __name__ == "__main__":
    p = argparse.ArgumentParser()
    p.add_argument("inp"), p.add_argument("out")
    g = p.add_mutually_exclusive_group(required=True)
    g.add_argument("--rate", type=float)
    g.add_argument("--duration", type=float,
                   help="target length in seconds")
    args = p.parse_args()

    stretch(pathlib.Path(args.inp), pathlib.Path(args.out),
            rate=args.rate, duration=args.duration)
