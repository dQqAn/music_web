package com.example.model

import kotlinx.serialization.Serializable
import org.jetbrains.exposed.sql.Table

@Serializable
data class Artist(
    var status: String,
    override val id: Int
) : UserInterface

object ArtistTable : Table("artist") {
    val status = varchar("status", 50)
    val id = integer("id").references(UserTable.id)
    override val primaryKey = PrimaryKey(id, name = "artist_pk")
}