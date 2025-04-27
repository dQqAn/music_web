package com.example.model

import kotlinx.serialization.Serializable
import kotlinx.serialization.json.Json
import org.jetbrains.exposed.sql.ResultRow
import org.jetbrains.exposed.sql.Table
import org.jetbrains.exposed.sql.statements.InsertStatement

@Serializable
data class Sound(
    val name: String,
    val artistIDs: List<Int>,
    var status: String,
    var categories: List<String>,
    val soundPath: String,
    var image1Path: String,
    var duration: Int,
    val soundID: String,
    val id: Int = -1
)

@Serializable
data class SoundBasic(
    val name: String,
    val artistIDs: List<Int>,
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
    val artistIDs = largeText("artistIDs")
    var status = varchar("status", 50)
    var categories = largeText("categories")
    val soundPath = varchar("soundPath", 512)
    var image1Path = varchar("image1Path", 512)
    var duration = integer("duration")
    val soundID = varchar("soundID", 50)
    val id = integer("id").autoIncrement()
    override val primaryKey = PrimaryKey(id, name = "sound_pk")
}

fun ResultRow.toSound(): Sound = Sound(
    name = this[SoundTable.name],
    artistIDs = Json.decodeFromString(this[SoundTable.artistIDs]),
    status = this[SoundTable.status],
    categories = Json.decodeFromString(this[SoundTable.categories]),
    soundPath = this[SoundTable.soundPath],
    image1Path = this[SoundTable.image1Path],
    duration = this[SoundTable.duration],
    soundID = this[SoundTable.soundID],
    id = this[SoundTable.id]
)

fun InsertStatement<Number>.fromSound(sound: Sound) {
    this[SoundTable.name] = sound.name
    this[SoundTable.artistIDs] = Json.encodeToString(sound.artistIDs)
    this[SoundTable.status] = sound.status
    this[SoundTable.categories] = Json.encodeToString(sound.categories)
    this[SoundTable.soundPath] = sound.soundPath
    this[SoundTable.image1Path] = sound.image1Path
    this[SoundTable.duration] = sound.duration
    this[SoundTable.soundID] = sound.soundID
}