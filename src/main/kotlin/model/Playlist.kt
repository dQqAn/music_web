package com.example.model

import kotlinx.serialization.Serializable
import org.jetbrains.exposed.sql.Table

@Serializable
data class Playlist(
    val name: String,
    val soundID: String?,
    val userID: Int,
    override val id: Int
) : UserInterface

object PlaylistTable : Table("playlist") {
    val name = varchar("name", 255)
    val soundID = varchar("soundID", 50).nullable()
    val userID = integer("userID").references(UserTable.id)
    val id = integer("id").autoIncrement()
    override val primaryKey = PrimaryKey(id, name = "playlist_pk")

    init {
        uniqueIndex("unique_user_playlist_sound", userID, name, soundID)
    }
}