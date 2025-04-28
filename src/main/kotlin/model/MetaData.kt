package com.example.model

import kotlinx.serialization.Serializable
import kotlinx.serialization.json.Json
import org.jetbrains.exposed.sql.Table
import org.jetbrains.exposed.sql.javatime.datetime
import org.jetbrains.exposed.sql.statements.InsertStatement
import java.time.LocalDateTime
import java.time.format.DateTimeFormatter

@Serializable
data class RawMetaItem(
    val type: String,
    val key: String,
    val label: String? = null,
    val tags: List<String>? = null
)

@Serializable
data class MetaItem(
    val type: String,
    val key: String,
    val label: String? = null,
    val tags: List<String> = emptyList()
)

@Serializable
data class MetaData(
    val id: String,
    val type: String,
    val key: String,
    val name: String,
    val label: String?,
    val tags: List<String>,
    val createdAt: String,
    val updatedAt: String,
    val disabled: Boolean
)

@Serializable
data class MetaDataToMenu(
    val tag: String,
    val name: String
)

@Serializable
data class MetaDataMenuResponse(
    val categories: List<MetaDataToMenu> = emptyList(),
    val moods: List<MetaDataToMenu> = emptyList(),
    val instruments: List<MetaDataToMenu> = emptyList(),
)

object MetaDataTable : Table("metaData") {
    val id = varchar("id", 100)
    val type = varchar("type", 100)
    val key = varchar("key", 100)
    val name = varchar("name", 100)
    val label = varchar("label", 100).nullable()
    val tags = largeText("tags")
    val createdAt = datetime("createdAt")
    val updatedAt = datetime("updatedAt")
    val disabled = bool("disabled")
    override val primaryKey = PrimaryKey(key, name = "metaData_pk")

    init {
        uniqueIndex("unique_metadata", key)
    }
}

fun InsertStatement<Number>.fromMetaData(metaData: MetaData) {
    val formatter = DateTimeFormatter.ISO_LOCAL_DATE_TIME
    this[MetaDataTable.id] = metaData.id
    this[MetaDataTable.type] = metaData.type
    this[MetaDataTable.key] = metaData.key
    this[MetaDataTable.name] = metaData.name
    this[MetaDataTable.label] = metaData.label
    this[MetaDataTable.tags] = Json.encodeToString(metaData.tags)
    this[MetaDataTable.createdAt] = LocalDateTime.parse(metaData.createdAt, formatter)
    this[MetaDataTable.updatedAt] = LocalDateTime.parse(metaData.updatedAt, formatter)
    this[MetaDataTable.disabled] = metaData.disabled
}