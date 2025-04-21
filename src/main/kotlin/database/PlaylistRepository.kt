package com.example.database

import com.example.model.PlaylistTable
import com.example.util.UserPlaylists
import org.jetbrains.exposed.sql.*
import org.jetbrains.exposed.sql.SqlExpressionBuilder.eq
import org.jetbrains.exposed.sql.transactions.transaction
import java.sql.SQLException

class PlaylistRepository(database: Database) {
    init {
        transaction(database) {
            SchemaUtils.create(PlaylistTable)
        }
    }

    suspend fun createPlaylist(name: String, userID: Int): Int = suspendTransaction {
        try {
            PlaylistTable.insert {
                it[this.name] = name
                it[this.userID] = userID
            }[PlaylistTable.id]
        } catch (e: SQLException) {
            e.printStackTrace()
            -1
        }
    }

    suspend fun removePlaylist(id: Int): Boolean = suspendTransaction {
        val rowsDeleted = PlaylistTable.deleteWhere { PlaylistTable.id eq id }
        rowsDeleted > 0
    }

    suspend fun addSounds(
        userID: Int, playlistName: String,
        soundIDs: List<String>
    ): Int = suspendTransaction {
        try {
            val existingSoundIDs = PlaylistTable
                .selectAll()
                .where {
                    (PlaylistTable.userID eq userID) and
                            (PlaylistTable.name eq playlistName) and
                            (PlaylistTable.soundID inList soundIDs)
                }
                .map { it[PlaylistTable.soundID] }
                .toSet()

            val toInsert = soundIDs.filterNot { it in existingSoundIDs }

            if (toInsert.isEmpty()) return@suspendTransaction 0

            PlaylistTable.batchInsert(toInsert) { soundID ->
                this[PlaylistTable.userID] = userID
                this[PlaylistTable.name] = playlistName
                this[PlaylistTable.soundID] = soundID
            }

            toInsert.size
        } catch (e: SQLException) {
            e.printStackTrace()
            -1
        }
    }

    suspend fun searchUserPlaylist(name: String, userID: Int, soundID: String): List<UserPlaylists> =
        suspendTransaction {
            val status = PlaylistTable.selectAll().where {
                (PlaylistTable.name eq name) and
                        (PlaylistTable.soundID eq soundID)
            }.any()

            PlaylistTable.selectAll().where {
                (PlaylistTable.name eq name) and (PlaylistTable.userID eq userID)
            }.orderBy(PlaylistTable.name to SortOrder.ASC)
                .map { row ->
                    UserPlaylists(
                        playlistID = row[PlaylistTable.id].toString(),
                        soundStatus = status
                    )
                }
        }

    suspend fun checkSoundInPlaylist(name: String, soundID: String): Boolean = suspendTransaction {
        PlaylistTable.selectAll().where {
            (PlaylistTable.name eq name) and
                    (PlaylistTable.soundID eq soundID)
        }.any()
    }

    /*suspend fun userPlaylist(userID:Int): List<Int> = suspendTransaction {

    }*/
}