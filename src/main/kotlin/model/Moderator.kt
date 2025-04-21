package com.example.model

import kotlinx.serialization.Serializable
import org.jetbrains.exposed.sql.Table

@Serializable
data class Moderator(
    override val id: Int,
    var status: String,
    var level: Int = 0
) : UserInterface

object ModeratorTable : Table("moderator") {
    val id = integer("id").references(UserTable.id)
    val status = varchar("status", 50)
    val level = integer("level")
    override val primaryKey = PrimaryKey(id, name = "moderator_pk")
}