package com.example.util

import com.example.auth.Role
import com.example.auth.UserSession
import com.example.database.FavouriteRepository
import com.example.database.PlaylistRepository
import com.example.database.SoundRepository
import com.example.model.Playlist
import com.example.model.SoundStatus
import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.auth.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import io.ktor.server.sessions.*
import kotlinx.serialization.Serializable
import org.koin.ktor.ext.inject
import java.io.File
import java.net.URLEncoder

fun Application.databaseApi() {
    val soundRepository by inject<SoundRepository>()
    val favouriteRepository by inject<FavouriteRepository>()
    val playlistRepository by inject<PlaylistRepository>()

    routing {
        get("/check_auth") {
            val userSession = call.sessions.get<UserSession>()
            if (userSession != null) {
                call.respond("ACTIVE")
            } else {
                call.respond("NULL")
            }
        }

        get("/search") {
            val query = call.request.queryParameters["query"]?.trim()

            if (query.isNullOrBlank()) {
                call.respond(HttpStatusCode.BadRequest, "Search bar is empty")
                return@get
            }
            val results = soundRepository.searchSound(query)
            call.respond(results)
        }

        get("/stream/sound/{soundID}") {
            val soundID = call.parameters["soundID"] ?: return@get call.respond(HttpStatusCode.BadRequest)
            val soundPath = soundRepository.getSoundPath(soundID, SoundStatus.ACTIVE)
                ?: return@get call.respond(HttpStatusCode.NotFound, "Sound not found")

            val file = File(soundPath)
            if (!file.exists()) return@get call.respond(HttpStatusCode.NotFound, "File not found")

            val fileLength = file.length()

            val eTag = "\"${file.lastModified()}-${fileLength}\""
            call.response.header(HttpHeaders.ETag, eTag)

            // Local eTag vs clientETag
            val clientETag = call.request.header(HttpHeaders.IfNoneMatch)
            if (clientETag == eTag) {
                return@get call.respond(HttpStatusCode.NotModified)
            }

            val rangeHeader = call.request.header(HttpHeaders.Range)
            if (rangeHeader != null && rangeHeader.startsWith("bytes=")) {
                val parts = rangeHeader.removePrefix("bytes=").split("-", limit = 2)
                if (parts.size != 2) return@get call.respond(HttpStatusCode.BadRequest)

                val startStr = parts[0]
                val endStr = parts[1]

                val start: Long
                val end: Long

                when {
                    startStr.isNotBlank() -> {
                        start = startStr.toLongOrNull() ?: return@get call.respond(HttpStatusCode.BadRequest)
                        end = endStr.toLongOrNull() ?: (fileLength - 1)
                    }

                    endStr.isNotBlank() -> {
                        val lastBytes = endStr.toLongOrNull() ?: return@get call.respond(HttpStatusCode.BadRequest)
                        if (lastBytes <= 0 || lastBytes > fileLength)
                            return@get call.respond(HttpStatusCode.RequestedRangeNotSatisfiable)
                        start = fileLength - lastBytes
                        end = fileLength - 1
                    }

                    else -> return@get call.respond(HttpStatusCode.BadRequest)
                }

                val safeEnd = minOf(end, fileLength - 1)

                if (start < 0 || start > safeEnd) {
                    return@get call.respond(HttpStatusCode.RequestedRangeNotSatisfiable)
                }

                call.response.header(HttpHeaders.AcceptRanges, "bytes")
                call.response.header(HttpHeaders.ContentLength, (safeEnd - start + 1).toString())
                call.response.header(HttpHeaders.ContentRange, "bytes $start-$safeEnd/$fileLength")

                call.respondOutputStream(
                    status = HttpStatusCode.PartialContent,
                    contentType = ContentType.defaultForFile(file)
                ) {
                    file.inputStream().use { input ->
                        var skipped = 0L
                        while (skipped < start) {
                            val skippedNow = input.skip(start - skipped)
                            if (skippedNow <= 0) break
                            skipped += skippedNow
                        }

                        val buffer = ByteArray(DEFAULT_BUFFER_SIZE)
                        var bytesRemaining = safeEnd - start + 1

                        while (bytesRemaining > 0) {
                            val toRead = minOf(buffer.size, bytesRemaining.toInt())
                            val read = input.read(buffer, 0, toRead)
                            if (read == -1) break
                            write(buffer, 0, read)
                            bytesRemaining -= read
                        }
                    }
                }
            } else {
                call.respondFile(file)
            }
        }


        get("/download/sound/{soundID}") {
            val soundID = call.parameters["soundID"] ?: return@get call.respond(HttpStatusCode.BadRequest)
            val soundPath = soundRepository.getSoundPath(soundID, SoundStatus.ACTIVE)
                ?: return@get call.respond(HttpStatusCode.NotFound, "Sound not found")

            val file = File(soundPath)
            if (file.exists()) {
                val encodedName = URLEncoder.encode(file.name, "UTF-8").replace("+", "%20")
                call.response.header(HttpHeaders.ContentDisposition, "attachment; filename=\"$encodedName\"")
                call.respondFile(file)
            } else {
                call.respond(HttpStatusCode.NotFound, "Sound not found")
            }
        }

        get("/database/sound/{soundID}") {
            val soundID = call.parameters["soundID"] ?: "none"
            val sound = soundRepository.getSound(soundID, SoundStatus.ACTIVE)
            call.respond(mapOf("sound" to sound))
        }

        get("/database/sounds") {
            val page = call.request.queryParameters["page"]?.toIntOrNull() ?: 1
            val sounds = soundRepository
                .getSounds(pageSize = 20, page = page)
            call.respond(mapOf("sounds" to sounds))
        }

        /*get("/database/sound_count") {
            call.respond(soundRepository.getSoundsCount())
        }*/

        get("/database/category/{category}/{counter}/{minDuration}/{maxDuration}") {
            val page = call.request.queryParameters["page"]?.toIntOrNull() ?: 1
            val minDuration = call.parameters["minDuration"]?.toIntOrNull()
            val maxDuration = call.parameters["maxDuration"]?.toIntOrNull()
            var category: String? = call.parameters["category"] ?: "null"
            if (category == "null") category = null
            val sounds = soundRepository.getCategorySounds(pageSize = 20, page, category, minDuration, maxDuration)
                .map { mapOf("name" to it.name, "image1Path" to it.image1Path, "soundID" to it.soundID) }
            call.respond(mapOf("sounds" to sounds))
        }

        /*get("/database/category_size/{category}/{counter}/{minDuration}/{maxDuration}") {
            val page = call.request.queryParameters["page"]?.toIntOrNull() ?: 1
            val minDuration = call.parameters["minDuration"]?.toIntOrNull()
            val maxDuration = call.parameters["maxDuration"]?.toIntOrNull()
            var category: String? = call.parameters["category"] ?: "null"
            if (category == "null") category = null
            val filteredSize = soundRepository.getFilteredSize(
                page = page,
                category = category,
                minDuration = minDuration,
                maxDuration = maxDuration
            )
            call.respond(filteredSize)
        }*/

        /*get("/database/category_size/{category}/{counter}") {
            val category = call.parameters["category"] ?: "none"
            val categorySize = soundRepository.getCategorySize(category)
            call.respond(categorySize)
        }*/

        authenticate("auth-session") {
            get("/database/moderator_sounds_count") {
                val userSession = call.sessions.get<UserSession>()
                if (userSession?.role == Role.MODERATOR.toString()) {
                    call.respond(soundRepository.getModeratorSoundsCount())
                }
            }

            get("/database/moderatorSounds") {
                val userSession = call.sessions.get<UserSession>()
                if (userSession?.role == Role.MODERATOR.toString()) {
                    val page = call.request.queryParameters["page"]?.toIntOrNull() ?: 1
                    val sounds = soundRepository
                        .getModeratorSounds(pageSize = 20, page = page)
                    call.respond(mapOf("sounds" to sounds))
                }
            }

            post("/database/moderatorSounds") {
                val userSession = call.sessions.get<UserSession>()
                if (userSession?.role == Role.MODERATOR.toString()) {
                    val selectedSoundIds = call.receive<SelectedSoundIds>()
                    val listIDs = selectedSoundIds.soundIDs
                    val errorIDs: ArrayList<String> = arrayListOf()

                    for (id in listIDs) {
                        val checkBarcode = soundRepository
                            .updateStatus(id, SoundStatus.ACTIVE)
                        if (checkBarcode == null) {
                            errorIDs.add(id)
                        }
                    }

                    if (errorIDs.isNotEmpty()) {
                        call.respondText(
                            "Error IDs: ${errorIDs.toList()}",
                            status = HttpStatusCode.ExpectationFailed
                        )
                    } else {
                        call.respondText("Items updated", status = HttpStatusCode.OK)
                    }
                }
            }

            post("/database/favouriteSound") {
                val userSession = call.sessions.get<UserSession>() ?: return@post call.respond(HttpStatusCode.Forbidden)
                val selectedSoundIds = call.receive<SelectedSoundIds>()

                val exists = favouriteRepository.checkFavourite(
                    selectedSoundIds.soundIDs[0], userSession.id
                )

                if (exists) {
                    val checkRemove = favouriteRepository.removeFavourite(
                        selectedSoundIds.soundIDs[0], userSession.id
                    )
                } else {
                    val checkID = favouriteRepository.addFavourite(
                        selectedSoundIds.soundIDs[0], userSession.id
                    )
                }
                val newStatus = !exists
                call.respond(FavouriteStatusResponse(newStatus))
            }

            get("/database/search_user_playlist") {
                val query = call.request.queryParameters["query"]?.trim()
                val userSession = call.sessions.get<UserSession>() ?: return@get call.respond(HttpStatusCode.NotFound)
                val soundID = call.parameters["soundID"] ?: return@get call.respond(HttpStatusCode.BadRequest)
                val id = userSession.id

                if (query.isNullOrBlank()) {
                    call.respond(HttpStatusCode.BadRequest, "Search bar is empty")
                    return@get
                }
                val results = playlistRepository.searchUserPlaylist(query, id, soundID)
                call.respond(results)
            }

            get("/database/user_playlist") {
                val userSession = call.sessions.get<UserSession>() ?: return@get call.respond(HttpStatusCode.NotFound)
                val id = userSession.id
                val soundID = call.parameters["soundID"]
                if (soundID.isNullOrBlank()) {
                    val results = playlistRepository.allUserPlaylist(id)
                    call.respond(results)
                } else {
                    val results = playlistRepository.basicUserPlaylist(id, soundID)
                    call.respond(results)
                }
            }

            post("/database/soundsToPlaylist") {
                val userSession = call.sessions.get<UserSession>() ?: return@post call.respond(HttpStatusCode.NotFound)
                val userID = userSession.id
                val selectedSoundIds = call.receive<SelectedSoundIdsToPlaylists>()

                if (selectedSoundIds.selected.isNotEmpty()) {
                    val check1 =
                        playlistRepository.addSounds(userID, selectedSoundIds.selected, selectedSoundIds.soundIDs)
                    if (check1 == -1) {
                        call.respond(HttpStatusCode.BadRequest)
                    }
                }

                if (selectedSoundIds.unselected.isNotEmpty()) {
                    val check2 = playlistRepository.removeSoundsInPlaylist(
                        userID,
                        selectedSoundIds.unselected,
                        selectedSoundIds.soundIDs
                    )
                    if (!check2) {
                        call.respond(HttpStatusCode.BadRequest)
                    }
                }

                call.respond(HttpStatusCode.OK)
            }

            post("/database/createPlaylist") {
                val userSession = call.sessions.get<UserSession>() ?: return@post call.respond(HttpStatusCode.NotFound)
                val userID = userSession.id
                val name = call.receiveParameters()["name"]?.trim()
                val checkID = playlistRepository.createPlaylist(name, userID)
                if (checkID != -1) {
                    call.respond(HttpStatusCode.OK, "OK")
                } else {
                    call.respond(HttpStatusCode.BadRequest, "Error")
                }
            }
        }
    }
}

@Serializable
private data class SelectedSoundIds(val soundIDs: List<String>)

@Serializable
private data class SelectedSoundIdsToPlaylists(
    val soundIDs: List<String>,
    val selected: List<String>,
    val unselected: List<String>
)

@Serializable
data class FavouriteStatusResponse(val favouriteStatus: Boolean)

@Serializable
data class UserPlaylists(val playlist: Playlist, val soundStatus: Boolean)
