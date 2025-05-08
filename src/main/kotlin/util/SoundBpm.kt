package com.example.util

import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import java.io.BufferedReader
import java.io.File
import java.io.InputStreamReader
import java.util.concurrent.TimeUnit
import java.util.concurrent.TimeoutException

suspend fun detectTempo(file: File, timeoutMillis: Long = 30_000): Int? = withContext(Dispatchers.IO) {
    val python = "C:\\Program Files\\Python312\\python.exe"
    val script = "python/sound/sound_bpm.py"
    val ffmpegBin = "C:/ffmpeg/bin" //system path

    val process = ProcessBuilder(python, script, file.absolutePath)
        .redirectErrorStream(true)   // stderr → stdout
        .start()

    val output = StringBuilder()
    BufferedReader(InputStreamReader(process.inputStream)).useLines { lines ->
        lines.forEach { output.appendLine(it) }
    }

    if (!process.waitFor(timeoutMillis, TimeUnit.MILLISECONDS)) {
        process.destroyForcibly()
        throw TimeoutException("Python BPM script timed out after $timeoutMillis ms.")
    }

    return@withContext output
        .lines()
        .map(String::trim)
        .lastOrNull { it.matches(Regex("""\d+""")) }
        ?.toIntOrNull()
}
