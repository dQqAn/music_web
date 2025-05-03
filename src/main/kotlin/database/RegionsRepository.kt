package com.example.database

import com.example.model.Regions
import com.example.model.RegionsTable
import com.example.model.fromRegions
import com.example.model.toRegions
import org.jetbrains.exposed.sql.*
import org.jetbrains.exposed.sql.SqlExpressionBuilder.eq
import org.jetbrains.exposed.sql.transactions.transaction
import java.sql.SQLException

class RegionsRepository(database: Database) {
    init {
        transaction(database) {
            SchemaUtils.create(RegionsTable)
        }
    }

    suspend fun getRegions(soundID: String): Regions? = suspendTransaction {
        RegionsTable.selectAll().where {
            (RegionsTable.soundID eq soundID)
        }.map { it.toRegions() }.singleOrNull()
    }

    suspend fun addRegions(regions: Regions): Int = suspendTransaction {
        try {
            RegionsTable.insert {
                it.fromRegions(regions)
            }[RegionsTable.id]
        } catch (e: SQLException) {
            e.printStackTrace()
            -1
        }
    }

    suspend fun removeRegion(region: Regions): Boolean = suspendTransaction {
        val rowDeleted = RegionsTable.deleteWhere {
            (RegionsTable.soundID eq region.soundID)
        }
        rowDeleted == 1
    }
}