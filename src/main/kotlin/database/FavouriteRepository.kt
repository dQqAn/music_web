package com.example.database

import com.example.model.*
import org.jetbrains.exposed.sql.*
import org.jetbrains.exposed.sql.SqlExpressionBuilder.eq
import org.jetbrains.exposed.sql.transactions.transaction
import java.sql.SQLException

class FavouriteRepository(database: Database) {

    init {
        transaction(database) {
            SchemaUtils.create(FavouriteTable)
        }
    }

    suspend fun addFavourite(soundID: String, userID: Int): Int = suspendTransaction {
        try {
            FavouriteTable.insert {
                it[this.soundID] = soundID
                it[this.userID] = userID
            }[FavouriteTable.id]
        } catch (e: SQLException) {
            e.printStackTrace()
            -1
        }
    }

    suspend fun removeFavourite(soundID: String, userID: Int): Boolean = suspendTransaction {
        val rowDeleted = FavouriteTable.deleteWhere {
            (FavouriteTable.soundID eq soundID) and (FavouriteTable.userID eq userID)
        }
        rowDeleted == 1
    }

    suspend fun checkFavourite(soundID: String, userID: Int): Boolean = suspendTransaction {
        FavouriteTable.selectAll().where { (FavouriteTable.soundID eq soundID) and (FavouriteTable.userID eq userID) }
            .any()
    }

    suspend fun favouriteSounds(userID: Int, pageSize: Int = 20, page: Int): List<Sound> = suspendTransaction {
        val soundIDs = FavouriteTable.selectAll()
            .where { FavouriteTable.userID eq userID }.map { it[FavouriteTable.soundID] }

        SoundTable.selectAll().where {
            (SoundTable.status eq SoundStatus.ACTIVE.toString()) and
                    (SoundTable.soundID inList soundIDs)
        }
            .limit(n = pageSize, offset = ((page - 1) * pageSize).toLong())
            .map { row -> row.toSound() }
    }
}