package com.example.model

import kotlinx.serialization.Serializable
import kotlinx.serialization.json.Json
import org.jetbrains.exposed.sql.ResultRow
import org.jetbrains.exposed.sql.Table
import org.jetbrains.exposed.sql.statements.InsertStatement

@Serializable
data class Regions(
    val id: Int = -1,
    val soundID: String,
    val regions: List<List<String>>
)

object RegionsTable : Table("regions") {
    val soundID = varchar("soundID", 50).uniqueIndex()
    val regions = largeText("regions")
    val id = integer("id").autoIncrement()
    override val primaryKey = PrimaryKey(id, name = "regions_pk")
}

fun ResultRow.toRegions() = Regions(
    id = this[RegionsTable.id],
    soundID = this[RegionsTable.soundID],
    regions = Json.decodeFromString<List<List<String>>>(this[RegionsTable.regions])
)

fun InsertStatement<Number>.fromRegions(regions: Regions) {
    this[RegionsTable.soundID] = regions.soundID
    this[RegionsTable.regions] = Json.encodeToString<List<List<String>>>(regions.regions)
}