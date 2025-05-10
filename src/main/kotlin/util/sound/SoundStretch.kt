package com.example.util.sound

import java.io.File

private const val PY = "C:\\Program Files\\Python312\\python.exe"
private const val LIBROSA_SCRIPT = "python/sound/stretch/sound_stretch_librosa.py"
private const val TORCH_SCRIPT = "python/sound/stretch/sound_stretch_torch.py"

fun stretch(
    input: File,
    rate: Double? = null,
    targetSecs: Double? = null,
    useTorch: Boolean = false
): File {
    require((rate != null) xor (targetSecs != null)) {
        "Supply exactly one of rate or targetSecs"
    }

    val script = if (useTorch) TORCH_SCRIPT else LIBROSA_SCRIPT
    val output = File("uploads/stretch/${input.nameWithoutExtension}_stretch.wav")

    val cmd = mutableListOf(PY, script, input.absolutePath, output.absolutePath)
    if (rate != null) cmd += listOf("--rate", rate.toString())
    if (targetSecs != null) cmd += listOf("--duration", targetSecs.toString())

    val proc = ProcessBuilder(cmd).redirectErrorStream(true).start()
    proc.inputStream.bufferedReader().forEachLine(::println)
    check(proc.waitFor() == 0) { "$script failed" }
    return output
}