package com.example.database

import com.example.model.MetaDataTable
import com.example.model.MetaItem
import kotlinx.serialization.json.Json
import org.jetbrains.exposed.sql.Database
import org.jetbrains.exposed.sql.SchemaUtils
import org.jetbrains.exposed.sql.batchInsert
import org.jetbrains.exposed.sql.transactions.transaction
import java.sql.SQLException
import java.time.LocalDateTime

class MetaDataRepository(database: Database) {
    init {
        transaction(database) {
            SchemaUtils.create(MetaDataTable)
        }
    }

    suspend fun addAllMetaData(metaDataList: List<MetaItem>): Int = suspendTransaction {
        if (metaDataList.isEmpty()) return@suspendTransaction 0
        try {
            MetaDataTable.batchInsert(metaDataList) { (type, key, label, tags) ->
                this[MetaDataTable.id] = generateUniqueId()
                this[MetaDataTable.type] = type
                this[MetaDataTable.key] = key
                this[MetaDataTable.label] = label
                this[MetaDataTable.tags] = Json.encodeToString(tags)
                this[MetaDataTable.createdAt] = LocalDateTime.now()
                this[MetaDataTable.updatedAt] = LocalDateTime.now()
                this[MetaDataTable.disabled] = false
            }
            metaDataList.size
        } catch (e: SQLException) {
            e.printStackTrace()
            -1
        }
    }
}