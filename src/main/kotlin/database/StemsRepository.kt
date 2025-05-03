package com.example.database

import com.example.model.Stem
import com.example.model.StemsTable
import com.example.model.fromStems
import com.example.model.toStems
import org.jetbrains.exposed.sql.*
import org.jetbrains.exposed.sql.SqlExpressionBuilder.inList
import org.jetbrains.exposed.sql.transactions.transaction

class StemsRepository(database: Database) {
    init {
        transaction(database) {
            SchemaUtils.create(StemsTable)
        }
    }

    suspend fun getStemPath(stemID: String): String? = suspendTransaction {
        StemsTable.selectAll().where {
            (StemsTable.stemID eq stemID)
        }.map { it[StemsTable.stemPath] }.singleOrNull()
    }

    suspend fun getStems(soundID: String): List<Stem> = suspendTransaction {
        StemsTable.selectAll().where {
            (StemsTable.soundID eq soundID)
        }.map { it.toStems() }
    }

    suspend fun addStem(stem: Stem): Int = suspendTransaction {
        try {
            StemsTable.insert { it.fromStems(stem) }[StemsTable.id]
        } catch (e: Exception) {
            e.printStackTrace()
            -1
        }
    }

    suspend fun removeStems(listStems: List<String>): Boolean = suspendTransaction {
        val rowsDeleted = StemsTable.deleteWhere {
            (StemsTable.stemID inList listStems)
        }
        rowsDeleted > 0
    }

}