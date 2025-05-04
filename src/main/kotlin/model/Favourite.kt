package com.example.model

import kotlinx.serialization.Serializable
import org.jetbrains.exposed.sql.Table

@Serializable
data class Favourite(
    val soundID: String,
    val userID: String,
    val id: Int = -1
)

object FavouriteTable : Table("favourite") {
    val soundID = varchar("soundID", 50)
    val userID = integer("userID").references(UserTable.id)
    val id = integer("id").autoIncrement()
    override val primaryKey = PrimaryKey(id, name = "favourite_pk")

    init {
        uniqueIndex("unique_user_favourite_sound", soundID, userID)
    }
}