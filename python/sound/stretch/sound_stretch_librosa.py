"""
High-quality time-stretch with Librosa.

⚙️  CLI examples
    python sound_stretch_librosa.py in.wav out.wav --rate 1.25
    python sound_stretch_librosa.py in.wav out.wav --duration 8.0
"""
from __future__ import annotations

import argparse
import pathlib
import sys

import librosa  # pip install librosa soundfile
import soundfile as sf

sys.stdout.reconfigure(encoding="utf-8")


def stretch(
        src: pathlib.Path,
        dst: pathlib.Path,
        *,
        rate: float | None,
        duration: float | None,
) -> None:
    """Time-stretch a WAV file, preserving pitch."""
    if not src.exists():
        sys.exit(f"{src} not found")

    # Ensure the destination folder exists (⇐ fixes “System error” on Windows)
    dst = dst.expanduser().resolve()
    dst.parent.mkdir(parents=True, exist_ok=True)

    # Load mono audio at original sample-rate
    y, sr = librosa.load(src, sr=None, mono=True)

    # Convert --duration → equivalent rate if requested
    if duration is not None:
        rate = (len(y) / sr) / duration  # original_seconds / target_seconds

    y_out = librosa.effects.time_stretch(y, rate=rate)  # phase-vocoder

    # Save as 16-bit PCM WAV
    sf.write(file=dst, data=y_out, samplerate=sr, format="WAV", subtype="PCM_16")
    # print(f"Saved → {dst}")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="High-quality time-stretch with Librosa")
    parser.add_argument("inp", help="input WAV file")
    parser.add_argument("out", help="output WAV file")
    group = parser.add_mutually_exclusive_group(required=True)
    group.add_argument("--rate", type=float, help="stretch factor (e.g. 1.25)")
    group.add_argument("--duration", type=float, help="target length in seconds")
    args = parser.parse_args()

    stretch(
        src=pathlib.Path(args.inp),
        dst=pathlib.Path(args.out),
        rate=args.rate,
        duration=args.duration,
    )
