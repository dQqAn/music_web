package com.example.util

import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import java.io.File

suspend fun detectTempo(file: File): Double? = withContext(Dispatchers.IO) {
    val python = "C:\\Program Files\\Python312\\python.exe"
    val script = "python/sound/sound_bpm.py"
    val ffmpegBin = "C:/ffmpeg/bin"

    return@withContext null
}
