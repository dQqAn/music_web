package com.example.database

import com.example.auth.Role
import com.example.auth.UserSession
import com.example.auth.UserStatus
import com.example.auth.auth
import com.example.model.*
import com.example.routing.loadWords
import com.example.util.DotEnvironment
import com.example.util.EncryptionSystem
import com.example.util.HashingSystem
import com.mpatric.mp3agic.Mp3File
import io.ktor.http.*
import io.ktor.http.content.*
import io.ktor.server.application.*
import io.ktor.server.auth.*
import io.ktor.server.freemarker.*
import io.ktor.server.http.content.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import io.ktor.server.sessions.*
import io.ktor.utils.io.jvm.javaio.*
import kotlinx.serialization.json.Json
import org.jetbrains.exposed.sql.Database
import org.koin.ktor.ext.inject
import java.io.BufferedInputStream
import java.io.File
import java.util.*
import javax.sound.sampled.AudioFileFormat
import javax.sound.sampled.AudioSystem

fun Application.configureDatabase(): Database {
    val dotenvInject by inject<DotEnvironment>()
    val dotenv = dotenvInject.getDotEnv()
    return Database.connect(
        url = dotenv["databaseURL"],
        driver = dotenv["databaseDriver"],
        user = dotenv["databaseUser"],
        password = dotenv["databasePW"]
    )
}

fun Application.databaseRouting() {
    val adminRepository by inject<AdminRepository>()
    val moderatorRepository by inject<ModeratorRepository>()
    val artistRepository by inject<ArtistRepository>()
    val userRepository by inject<UserRepository>()
    val soundRepository by inject<SoundRepository>()
    val dotEnv by inject<DotEnvironment>()
    val encryptionSystem by inject<EncryptionSystem>()
    val hashingSystem by inject<HashingSystem>()

    auth(userRepository, encryptionSystem, hashingSystem)

    routing {
        staticFiles("/uploads", File("uploads"))

        adminRoute(adminRepository, moderatorRepository, artistRepository, userRepository, encryptionSystem)
        moderatorRoute()
        artistRoute(soundRepository, userRepository)
        userRoute()
        commonRoute(soundRepository, userRepository)
    }
}

private fun Routing.adminRoute(
    adminRepository: AdminRepository,
    moderatorRepository: ModeratorRepository,
    artistRepository: ArtistRepository,
    userRepository: UserRepository,
    encryptionSystem: EncryptionSystem
) {
    route("/admin") {
        authenticate("auth-session") {
            get("/dashboard") {
                val userSession = call.sessions.get<UserSession>()
                if (userSession?.role == Role.ADMIN.toString()) {
                    val lang = call.request.cookies["lang"] ?: "tr"
                    val supportedLang = if (lang in listOf("en", "tr")) lang else "tr"
                    val words = loadWords(supportedLang)
                    val model = mapOf(
                        "words" to words,
                        "lang" to supportedLang
                    )
                    call.respond(FreeMarkerContent("admin_dashboard.ftl", model))
                }
            }

            get("/register") {
                val userSession = call.sessions.get<UserSession>()
                if (userSession?.role == Role.ADMIN.toString()) {
                    val lang = call.request.cookies["lang"] ?: "tr"
                    val supportedLang = if (lang in listOf("en", "tr")) lang else "tr"
                    val words = loadWords(supportedLang)
                    val model = mapOf(
                        "words" to words,
                        "lang" to supportedLang
                    )
                    call.respond(FreeMarkerContent("admin_register.ftl", model))
                }
            }

            post("/register") {
                val userSession = call.sessions.get<UserSession>()
                if (userSession?.role == Role.ADMIN.toString()) {
                    val staff = call.receive<StaffRegister>()
                    val encryptMail = encryptionSystem.encryptAES(staff.mail)
                    val id = userRepository.userID(encryptMail)
                    if (id != null && id != -1) {
                        var controlID: Int? = null
                        when (staff.role) {
                            Role.ADMIN.toString() -> {
                                controlID = adminRepository.addAdmin(
                                    Admin(
                                        status = UserStatus.ACTIVE.toString(),
                                        level = 0,
                                        id = id
                                    )
                                )
                            }

                            Role.MODERATOR.toString() -> {
                                controlID = moderatorRepository.addModerator(
                                    Moderator(
                                        status = UserStatus.ACTIVE.toString(),
                                        level = 0,
                                        id = id
                                    )
                                )
                            }

                            Role.ARTIST.toString() -> {
                                controlID = artistRepository.addArtist(
                                    Artist(
                                        status = UserStatus.ACTIVE.toString(),
                                        id = id
                                    )
                                )
                            }
                        }
                        if (controlID != -1 && controlID != null) {
                            call.respond(HttpStatusCode.OK)
                        } else {
                            call.respond(HttpStatusCode.BadRequest, "User error")
                        }
                    } else {
                        call.respond(HttpStatusCode.BadRequest)
                    }
                }
            }
        }
    }
}

private fun Routing.moderatorRoute() {
    route("/moderator") {
        authenticate("auth-session") {
            get("/pending_approval") {
                val userSession = call.sessions.get<UserSession>()
                if (userSession?.role == Role.MODERATOR.toString()) {
                    val lang = call.request.cookies["lang"] ?: "tr"
                    val supportedLang = if (lang in listOf("en", "tr")) lang else "tr"
                    val words = loadWords(supportedLang)
                    val model = mapOf(
                        "words" to words,
                        "lang" to supportedLang
                    )
                    call.respond(FreeMarkerContent("moderator_pending_approval.ftl", model))
                }
            }
        }
    }
}

private fun Routing.artistRoute(soundRepository: SoundRepository, userRepository: UserRepository) {
    route("/artist") {
        authenticate("auth-session") {
            get("/single_sound") {
                val userSession = call.sessions.get<UserSession>()
                if (userSession?.role == Role.ARTIST.toString()) {
                    val lang = call.request.cookies["lang"] ?: "tr"
                    val supportedLang = if (lang in listOf("en", "tr")) lang else "tr"
                    val words = loadWords(supportedLang)
                    val model = mapOf(
                        "words" to words,
                        "lang" to supportedLang
                    )
                    call.respond(FreeMarkerContent("artist_single_sound.ftl", model))
                }
            }

            post("/upload_sound") {
                val userSession = call.sessions.get<UserSession>()
                if (userSession?.role == Role.ARTIST.toString()) {
                    val userID = userSession.id
                    val multipart = call.receiveMultipart()

                    val baseUploadDir = File("uploads")

                    val customImageDir = File(baseUploadDir, "image/$userID").apply { mkdirs() }
                    var imageFile: File? = null

                    val customSoundDir = File(baseUploadDir, "sound/$userID").apply { mkdirs() }
                    var soundFile: File? = null

                    var soundName: String? = null
                    var categoryList = listOf<String>()
                    var moodList = listOf<String>()
                    var instrumentList = listOf<String>()
                    val artistName = userRepository.userName(userID)

                    multipart.forEachPart { part ->
                        when (part) {
                            is PartData.FormItem -> {
                                when (part.name) {
                                    "name" -> {
                                        soundName = part.value
                                    }

                                    "category" -> {
                                        categoryList = Json.decodeFromString<List<String>>(part.value)
                                    }

                                    "mood" -> {
                                        moodList = Json.decodeFromString<List<String>>(part.value)
                                    }

                                    "instrument" -> {
                                        instrumentList = Json.decodeFromString<List<String>>(part.value)
                                    }
                                }
                            }

                            is PartData.FileItem -> {
                                val fileName = part.originalFileName ?: "unknown"
                                val inputStream = part.provider().toInputStream()
                                val bufferedStream = BufferedInputStream(inputStream)

                                when (part.name) {
                                    "image" -> {
                                        if (part.contentType?.match("image/*") == true) {
                                            val uniqueFileName = "${UUID.randomUUID()}_${fileName}"
                                            imageFile = File(customImageDir, uniqueFileName)
                                            saveFile(imageFile, bufferedStream)
                                        }
                                    }

                                    "sound" -> {
                                        if (part.contentType?.match("audio/*") == true) {
                                            val ext = File(fileName).extension.lowercase()
                                            val baseName = fileName.substringBeforeLast(".")
                                            val uuid = UUID.randomUUID()

                                            when (ext) {
                                                "wav" -> {
                                                    val uniqueFileName = "${uuid}_${baseName}.wav"
                                                    val targetFile = File(customSoundDir, uniqueFileName)
                                                    saveFile(targetFile, bufferedStream)

                                                    val isWav = try {
                                                        AudioSystem.getAudioFileFormat(targetFile).type == AudioFileFormat.Type.WAVE
                                                    } catch (e: Exception) {
                                                        false
                                                    }

                                                    if (isWav) {
                                                        soundFile = targetFile
                                                    } else {
                                                        targetFile.delete()
                                                    }
                                                }

                                                "mp3" -> {
                                                    val uniqueFileName = "${uuid}_${baseName}.mp3"
                                                    val targetFile = File(customSoundDir, uniqueFileName)
                                                    saveFile(targetFile, bufferedStream)

                                                    val isMp3 = try {
                                                        Mp3File(targetFile)
                                                        true
                                                    } catch (e: Exception) {
                                                        false
                                                    }

                                                    if (isMp3) {
                                                        soundFile = targetFile
                                                    } else {
                                                        targetFile.delete()
                                                    }
                                                }

                                                else -> {}
                                            }
                                        }
                                    }
                                }
                            }

                            else -> {}
                        }
                        part.dispose()
                    }

                    if (soundFile != null && imageFile != null && soundName != null
                        && artistName != null
                    ) {
                        val duration = if (soundFile.extension == "mp3") {
                            getMp3DurationInSeconds(soundFile)
                        } else {
                            getAudioDurationInSeconds(soundFile)
                        }
                        if (duration != -1) {
                            val checkSound = soundRepository.addSound(
                                Sound(
                                    name = normalizeSpaces(soundName),
                                    artistIDs = listOf(userID),
                                    status = SoundStatus.UNDER_CONTROL.toString(),
                                    categories = categoryList,
                                    moods = moodList,
                                    instruments = instrumentList,
                                    soundPath = soundFile.path,
                                    image1Path = imageFile.path,
                                    duration = duration,
                                    soundID = generateUniqueId()
                                )
                            )
                            if (checkSound != -1) {
                                call.respond(HttpStatusCode.OK, mapOf("fileName" to "ok"))
                            } else {
                                call.respond(HttpStatusCode.Conflict, mapOf("message" to "Error database"))
                            }
                        } else {
                            call.respond(HttpStatusCode.Conflict, mapOf("message" to "File of unsupported format"))
                        }
                    } else {
                        call.respond(HttpStatusCode.BadRequest, mapOf("message" to "Missing files"))
                    }
                }
            }
        }
    }
}

private fun Routing.userRoute() {
    route("/user") {
        authenticate("auth-session") {
            get("/library") {
                val userSession = call.sessions.get<UserSession>()
                if (userSession?.role == Role.USER.toString()) {
                    val lang = call.request.cookies["lang"] ?: "tr"
                    val supportedLang = if (lang in listOf("en", "tr")) lang else "tr"
                    val words = loadWords(supportedLang)
                    val model = mapOf(
                        "words" to words,
                        "lang" to supportedLang
                    )
                    call.respond(FreeMarkerContent("user_library.ftl", model))
                }
            }
        }
    }
}

private fun Routing.commonRoute(soundRepository: SoundRepository, userRepository: UserRepository) {
    authenticate("auth-session") {
        get("/profile") {
            val lang = call.request.cookies["lang"] ?: "tr"
            val supportedLang = if (lang in listOf("en", "tr")) lang else "tr"
            val words = loadWords(supportedLang)
            val model = mapOf(
                "words" to words,
                "lang" to supportedLang
            )

            val userSession = call.sessions.get<UserSession>()
            when (userSession?.role) {
                Role.ADMIN.toString() -> {
                    call.respond(FreeMarkerContent("admin_profile.ftl", model))
                }

                Role.MODERATOR.toString() -> {
                    call.respond(FreeMarkerContent("moderator_profile.ftl", model))
                }

                Role.ARTIST.toString() -> {
                    call.respond(FreeMarkerContent("artist_profile.ftl", model))
                }

                Role.USER.toString() -> {
                    val userID = userSession.id
                    val user = userRepository.getUser(userID)
                    val userModel = mapOf("user" to user) + model
                    call.respond(FreeMarkerContent("user_profile.ftl", userModel))
                }
            }
        }

        get("/dashboard") {
            val lang = call.request.cookies["lang"] ?: "tr"
            val supportedLang = if (lang in listOf("en", "tr")) lang else "tr"
            val words = loadWords(supportedLang)
            val model = mapOf(
                "words" to words,
                "lang" to supportedLang
            )

            val userSession = call.sessions.get<UserSession>()
            when (userSession?.role) {
                Role.ADMIN.toString() -> {
                    call.respond(FreeMarkerContent("admin_dashboard.ftl", model))
                }

                Role.MODERATOR.toString() -> {
                    call.respond(FreeMarkerContent("moderator_dashboard.ftl", model))
                }

                Role.ARTIST.toString() -> {
                    call.respond(FreeMarkerContent("artist_dashboard.ftl", model))
                }

                Role.USER.toString() -> {
                    call.respond(FreeMarkerContent("user_dashboard.ftl", model))
                }
            }
        }
    }
}

private fun saveFile(file: File?, bufferedStream: BufferedInputStream) {
    file?.let {
        bufferedStream.use { input ->
            it.outputStream().use { output ->
                input.copyTo(output)
            }
        }
    }
}

private fun generateUniqueId(): String {
    val characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
    val timestamp = System.currentTimeMillis().toString().takeLast(4)
    val randomPart = (1..6).map { characters.random() }.joinToString("")
    return timestamp + randomPart
}

private fun normalizeSpaces(text: String?, maxLength: Int = Int.MAX_VALUE): String {
    return text
        ?.takeIf { it.isNotBlank() } // Boş veya sadece boşluklardan oluşan stringleri filtrele
        ?.trim() // Baştaki ve sondaki boşlukları temizle
        ?.replace(Regex("\\s+"), " ") // Birden fazla boşluğu tek boşluğa indirge
        ?.take(maxLength) // Belirtilen maksimum uzunlukta karakter al
        ?: "NULL" // Null veya boşluk durumunda "NULL" döndür
}

private fun getAudioDurationInSeconds(file: File): Int { //WAV, AIFF
    return try {
        val audioInputStream = AudioSystem.getAudioInputStream(file)
        val format = audioInputStream.format
        val frames = audioInputStream.frameLength
        (frames / format.frameRate).toInt()
    } catch (e: Exception) {
        -1
    }
}

fun getMp3DurationInSeconds(file: File): Int {
    val mp3 = Mp3File(file)
    return (mp3.lengthInMilliseconds / 1000).toInt()
}