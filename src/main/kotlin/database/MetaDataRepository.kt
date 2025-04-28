package com.example.database

import com.example.model.MetaDataTable
import com.example.model.MetaDataToMenu
import com.example.model.MetaItem
import kotlinx.serialization.json.Json
import org.jetbrains.exposed.sql.*
import org.jetbrains.exposed.sql.SqlExpressionBuilder.eq
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
                this[MetaDataTable.name] = keyToName(key)
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

    suspend fun metaDataToMenu(
        pageSize: Int = 10,
        page: Int,
        contentType: String?,
        key: String?
    ): List<MetaDataToMenu> = suspendTransaction {
        val conditions = mutableListOf(Op.build { MetaDataTable.disabled eq false })
        val tempContentType = contentType ?: "GENRE"
        conditions += MetaDataTable.type eq tempContentType

        if (key != null) {
            conditions += MetaDataTable.key eq key
        }

        MetaDataTable.selectAll().where {
            conditions.reduce { acc, op -> acc and op }
        }
            .limit(n = pageSize, offset = ((page - 1) * pageSize).toLong())
            .map { row ->
                MetaDataToMenu(
                    tag = row[MetaDataTable.key],
                    name = row[MetaDataTable.name]
                )
            }
    }

    suspend fun checkMetaDataSubCategory(key: String): Boolean = suspendTransaction {
        MetaDataTable.selectAll().where { //search in tag
            (MetaDataTable.type eq "SUBGENRE") and
                    (MetaDataTable.tags eq key)
        }.count() > 0
    }

    private fun keyToName(input: String): String {
        return input
            .split('_')
            .joinToString(" ") { word ->
                word.lowercase().replaceFirstChar { it.uppercaseChar() }
            }
    }
}