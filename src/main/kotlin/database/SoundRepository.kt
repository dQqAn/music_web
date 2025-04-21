package com.example.database

import com.example.model.*
import org.jetbrains.exposed.sql.*
import org.jetbrains.exposed.sql.SqlExpressionBuilder.eq
import org.jetbrains.exposed.sql.SqlExpressionBuilder.greaterEq
import org.jetbrains.exposed.sql.SqlExpressionBuilder.lessEq
import org.jetbrains.exposed.sql.transactions.transaction
import java.sql.SQLException

class SoundRepository(database: Database) {
    init {
        transaction(database) {
            SchemaUtils.create(SoundTable)
        }
    }

    suspend fun addSound(sound: Sound): Int = suspendTransaction {
        try {
            SoundTable.insert { it.fromSound(sound) }[SoundTable.id]
        } catch (e: SQLException) {
            e.printStackTrace()
            -1
        }
    }

    suspend fun getModeratorSoundsCount(): Int = suspendTransaction {
        SoundTable.selectAll()
            .where { SoundTable.status eq SoundStatus.UNDER_CONTROL.toString() }.count().toInt()
    }

    suspend fun getModeratorSounds(pageSize: Int = 20, page: Int): List<Sound> = suspendTransaction {
        SoundTable.selectAll()
            .where { (SoundTable.status eq SoundStatus.UNDER_CONTROL.toString()) }
            .limit(n = pageSize, offset = ((page - 1) * pageSize).toLong())
            .map { row -> row.toSound() }
    }

    suspend fun updateStatus(soundID: String, soundStatus: SoundStatus): String? = suspendTransaction {
        try {
            val updatedRows = SoundTable.update(where = { SoundTable.soundID eq soundID }) {
                it[this.status] = soundStatus.toString()
            }
            if (updatedRows > 0) soundID else null
        } catch (e: SQLException) {
            e.printStackTrace()
            null
        }
    }

    suspend fun getSounds(pageSize: Int = 20, page: Int): List<Sound> = suspendTransaction {
        SoundTable.selectAll()
            .where { (SoundTable.status eq SoundStatus.ACTIVE.toString()) }
            .limit(n = pageSize, offset = ((page - 1) * pageSize).toLong())
            .map { row -> row.toSound() }
    }

    suspend fun getSound(soundID: String, status: SoundStatus): Sound? = suspendTransaction {
        SoundTable.selectAll().where {
            (SoundTable.soundID eq soundID) and
                    (SoundTable.status eq status.toString())
        }
            .map { row -> row.toSound() }.singleOrNull()
    }

    suspend fun getSoundPath(soundID: String, status: SoundStatus): String? = suspendTransaction {
        SoundTable.selectAll().where {
            (SoundTable.soundID eq soundID) and
                    (SoundTable.status eq status.toString())
        }
            .map { row -> row[SoundTable.soundPath] }.singleOrNull()
    }

    suspend fun getSoundsCount(): Int = suspendTransaction {
        SoundTable.selectAll()
            .where { SoundTable.status eq SoundStatus.ACTIVE.toString() }.count().toInt()
    }

    suspend fun getCategorySounds(
        pageSize: Int = 20,
        page: Int,
        category: String?,
        minDuration: Int?,
        maxDuration: Int?
    ): List<Sound> =
        suspendTransaction {
            val conditions = mutableListOf(Op.build { SoundTable.status eq SoundStatus.ACTIVE.toString() })

            if (category != null) {
                conditions += SoundTable.category1 eq category
            }

            if (minDuration != null && maxDuration != null) {
                conditions += SoundTable.duration greaterEq minDuration
                conditions += SoundTable.duration lessEq maxDuration
            }

            SoundTable.selectAll()
                .where {
                    conditions.reduce { acc, op -> acc and op }
                }
                .limit(n = pageSize, offset = ((page - 1) * pageSize).toLong())
                .map { row -> row.toSound() }
        }

    suspend fun getFilteredSize(
        pageSize: Int = 20,
        page: Int,
        category: String?,
        minDuration: Int?,
        maxDuration: Int?
    ): Int = suspendTransaction {
        val conditions = mutableListOf(Op.build { SoundTable.status eq SoundStatus.ACTIVE.toString() })

        if (category != null) {
            conditions += SoundTable.category1 eq category
        }

        if (minDuration != null && maxDuration != null) {
            conditions += SoundTable.duration greaterEq minDuration
            conditions += SoundTable.duration lessEq maxDuration
        }

        SoundTable.selectAll()
            .where {
                conditions.reduce { acc, op -> acc and op }
            }
            .limit(n = pageSize, offset = ((page - 1) * pageSize).toLong())
            .map { row -> row.toSound() }.count().toInt()
    }

    suspend fun getCategorySize(category: String): Int = suspendTransaction {
        SoundTable.selectAll()
            .where {
                (SoundTable.status eq SoundStatus.ACTIVE.toString()) and
                        ((SoundTable.category1 eq category))
            }.count().toInt()
    }

    suspend fun searchSound(query: String?): List<Sound> = suspendTransaction {
        /*SoundTable.select(SoundTable.name)
            .where { SoundTable.name like "%$query%" }
            .map { row -> row.toSound() }*/

        SoundTable.selectAll()
            .where {
                (SoundTable.status eq SoundStatus.ACTIVE.toString()) and
                        (SoundTable.name like "%$query%")
            }
            .orderBy(SoundTable.name to SortOrder.ASC)
            .limit(5)
            .map { row -> row.toSound() }
    }
}