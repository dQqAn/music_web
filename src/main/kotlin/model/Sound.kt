package com.example.model

import kotlinx.serialization.Serializable
import org.jetbrains.exposed.sql.ResultRow
import org.jetbrains.exposed.sql.Table
import org.jetbrains.exposed.sql.statements.InsertStatement

@Serializable
data class Sound(
    val name: String,
    val artist: String,
    var status: String,
    var category1: String,
    val soundPath: String,
    var image1Path: String,
    var duration: Int,
    val soundID: String,
    val artistID: Int,
    val id: Int = -1
)

@Serializable
data class SoundBasic(
    val name: String,
    val artist: String,
    val category1: String,
    val image1Path: String,
    val soundID: String,
    val favouriteStatus: Boolean
)

enum class SoundStatus {
    BANNED, WAITING, UNDER_CONTROL, PASSIVE, ACTIVE
}

object SoundTable : Table("sound") {
    val name = varchar("name", 50)
    val artist = varchar("artist", 50)
    var status = varchar("status", 50)
    var category1 = varchar("category1", 50)
    val soundPath = varchar("soundPath", 512)
    var image1Path = varchar("image1Path", 512)
    var duration = integer("duration")
    val soundID = varchar("soundID", 50)
    val artistID = integer("artistID").references(ArtistTable.id)
    val id = integer("id").autoIncrement()
    override val primaryKey = PrimaryKey(id, name = "sound_pk")
}

fun ResultRow.toSound(): Sound = Sound(
    name = this[SoundTable.name],
    artist = this[SoundTable.artist],
    status = this[SoundTable.status],
    category1 = this[SoundTable.category1],
    soundPath = this[SoundTable.soundPath],
    image1Path = this[SoundTable.image1Path],
    duration = this[SoundTable.duration],
    soundID = this[SoundTable.soundID],
    artistID = this[SoundTable.artistID],
    id = this[SoundTable.id]
)

fun InsertStatement<Number>.fromSound(sound: Sound) {
    this[SoundTable.name] = sound.name
    this[SoundTable.artist] = sound.artist
    this[SoundTable.status] = sound.status
    this[SoundTable.category1] = sound.category1
    this[SoundTable.soundPath] = sound.soundPath
    this[SoundTable.image1Path] = sound.image1Path
    this[SoundTable.duration] = sound.duration
    this[SoundTable.soundID] = sound.soundID
    this[SoundTable.artistID] = sound.artistID
}