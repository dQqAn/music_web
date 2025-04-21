package com.example.database

import com.example.model.Moderator
import com.example.model.ModeratorTable
import org.jetbrains.exposed.sql.Database
import org.jetbrains.exposed.sql.SchemaUtils
import org.jetbrains.exposed.sql.insert
import org.jetbrains.exposed.sql.transactions.transaction
import java.sql.SQLException

class ModeratorRepository(database: Database) {
    init {
        transaction(database) {
            SchemaUtils.create(ModeratorTable)
        }
    }

    suspend fun addModerator(moderator: Moderator): Int = suspendTransaction {
        try {
            ModeratorTable.insert {
                it[id] = moderator.id
                it[this.status] = moderator.status
                it[this.level] = moderator.level
            }[ModeratorTable.id]
        } catch (e: SQLException) {
            e.printStackTrace()
            -1
        }
    }
}