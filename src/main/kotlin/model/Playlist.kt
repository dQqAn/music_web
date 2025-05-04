package com.example.model

import kotlinx.serialization.Serializable
import org.jetbrains.exposed.sql.ResultRow
import org.jetbrains.exposed.sql.Table

@Serializable
data class Playlist(
    val name: String,
    val soundID: String?,
    val userID: Int,
    val playlistID: String,
    val id: Int = -1
)

object PlaylistTable : Table("playlist") {
    val name = varchar("name", 255)
    val soundID = varchar("soundID", 50).nullable()
    val userID = integer("userID").references(UserTable.id)
    val playlistID = varchar("playlistID", 50)
    val id = integer("id").autoIncrement()
    override val primaryKey = PrimaryKey(id, name = "playlist_pk")

    init {
        uniqueIndex("unique_user_playlist_sound", userID, playlistID, soundID)
    }
}

fun ResultRow.toPlaylist(): Playlist = Playlist(
    id = this[PlaylistTable.id],
    name = this[PlaylistTable.name],
    soundID = this[PlaylistTable.soundID],
    userID = this[PlaylistTable.userID],
    playlistID = this[PlaylistTable.playlistID]
)