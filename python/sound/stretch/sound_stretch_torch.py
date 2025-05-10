"""
Time-stretch (pitch korunur) – GPU'lu veya CPU'lu.
Kullanım:
    python sound_stretch_torch.py in.wav out.wav --rate 1.12
    python sound_stretch_torch.py in.wav out.wav --duration 9.5
Girdi kanalı: 1-N (mono, stereo, vb.) hepsini destekler.
"""
from __future__ import annotations

import argparse
import math
import pathlib
import sys;

import torch
import torchaudio

sys.stdout.reconfigure(encoding="utf-8")

N_FFT = 2048
HOP = 512  # STFT pencere kayması


def phase_advance(n_freq: int, hop: int, device=None):
    # (freq, 1) faz vektörü – TimeStretch için gerekmiyor, ama
    # manuel phase vocoder kullanmak isterseniz örnek kalsın.
    return torch.linspace(0, math.pi * hop, n_freq,
                          device=device)[..., None]


def stretch(src: pathlib.Path, dst: pathlib.Path,
            *, rate: float | None, duration: float | None) -> None:
    wav, sr = torchaudio.load(src)  # shape: (C, T)

    window = torch.hann_window(N_FFT, device=wav.device)

    if rate is None:
        # hedef süre verildiyse → orana çevir
        rate = wav.shape[-1] / sr / duration

    # STFT (kanal boyutu korunur)
    spec = torch.stft(
        wav, n_fft=N_FFT, hop_length=HOP,
        window=window, return_complex=True, center=True)

    ts = torchaudio.transforms.TimeStretch(
        hop_length=HOP, n_freq=spec.size(-2), fixed_rate=rate)
    spec_stretch = ts(spec)

    # ISTFT – tüm kanallar tek seferde geri döner
    samples_out = int(wav.shape[-1] / rate)
    wav_out = torch.istft(spec_stretch, n_fft=N_FFT,
                          hop_length=HOP, window=window, length=samples_out)

    torchaudio.save(dst, wav_out, sr)
    print(f"Saved -> {dst}")


if __name__ == "__main__":
    ap = argparse.ArgumentParser()
    ap.add_argument("inp"), ap.add_argument("out")
    g = ap.add_mutually_exclusive_group(required=True)
    g.add_argument("--rate", type=float,
                   help=">1.0 hızlandırır, <1.0 yavaşlatır")
    g.add_argument("--duration", type=float,
                   help="Hedef uzunluk (saniye)")
    a = ap.parse_args()
    stretch(pathlib.Path(a.inp), pathlib.Path(a.out),
            rate=a.rate, duration=a.duration)
