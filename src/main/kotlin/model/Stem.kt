package com.example.model

import kotlinx.serialization.Serializable
import org.jetbrains.exposed.sql.ResultRow
import org.jetbrains.exposed.sql.Table
import org.jetbrains.exposed.sql.statements.InsertStatement

@Serializable
data class Stem(
    val id: Int = -1,
    val soundID: String,
    val name: String,
    val stemID: String,
    val stemPath: String
)

object StemsTable : Table("stems") {
    val soundID = varchar("soundID", 100)
    val name = varchar("name", 100)
    val stemID = varchar("stemID", 100)
    val stemPath = varchar("stemPath", 100)
    val id = integer("id").autoIncrement()
    override val primaryKey = PrimaryKey(id, name = "stems_pk")
}

fun ResultRow.toStems() = Stem(
    id = this[StemsTable.id],
    soundID = this[StemsTable.soundID],
    name = this[StemsTable.name],
    stemID = this[StemsTable.stemID],
    stemPath = this[StemsTable.stemPath]
)

fun InsertStatement<Number>.fromStems(stem: Stem) {
    this[StemsTable.soundID] = stem.soundID
    this[StemsTable.name] = stem.name
    this[StemsTable.stemID] = stem.stemID
    this[StemsTable.stemPath] = stem.stemPath
}