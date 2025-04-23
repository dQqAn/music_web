package com.example.database

import com.example.model.Playlist
import com.example.model.PlaylistTable
import com.example.model.toPlaylist
import com.example.util.UserPlaylists
import org.jetbrains.exposed.sql.*
import org.jetbrains.exposed.sql.SqlExpressionBuilder.eq
import org.jetbrains.exposed.sql.SqlExpressionBuilder.inList
import org.jetbrains.exposed.sql.transactions.transaction
import java.sql.SQLException
import java.util.*

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
                it[this.playlistID] = UUID.randomUUID().toString()
            }[PlaylistTable.id]
        } catch (e: SQLException) {
            e.printStackTrace()
            -1
        }
    }

    suspend fun removePlaylist(playlistID: String): Boolean = suspendTransaction {
        val rowsDeleted = PlaylistTable.deleteWhere { PlaylistTable.playlistID eq playlistID }
        rowsDeleted > 0
    }

    suspend fun removeSoundsInPlaylist(
        userID: Int, playlistID: List<String>,
        soundIDs: List<String>
    ): Boolean = suspendTransaction {
        val rowDeleted = PlaylistTable.deleteWhere {
            (PlaylistTable.userID eq userID) and
                    (PlaylistTable.playlistID inList playlistID) and
                    (PlaylistTable.soundID inList soundIDs)
        }

        rowDeleted > 0
    }

    suspend fun addSounds(
        userID: Int, playlistID: List<String>,
        soundIDs: List<String>
    ): Int = suspendTransaction {
        try {
            val existingTriplets = PlaylistTable
                .selectAll().where {
                    (PlaylistTable.userID eq userID) and
                            (PlaylistTable.playlistID inList playlistID)
                }
                .map {
                    Triple(
                        it[PlaylistTable.userID],
                        it[PlaylistTable.playlistID],
                        (it[PlaylistTable.soundID] ?: "__NULL__")
                    )
                }
                .toSet()

            val toInsertTriplets = playlistID.flatMap { playlistID ->
                soundIDs.map { soundID ->
                    Triple(userID, playlistID, soundID ?: "__NULL__")
                }
            }.filterNot { it in existingTriplets }

            if (toInsertTriplets.isEmpty()) return@suspendTransaction 0

            val playlistNames = PlaylistTable
                .selectAll().where { PlaylistTable.playlistID inList playlistID }
                .associate {
                    it[PlaylistTable.playlistID] to it[PlaylistTable.name]
                }

            toInsertTriplets
                .groupBy { it.second } // group by playlistID
                .forEach { (playlistID, items) ->
                    val name = playlistNames[playlistID] ?: "My Playlist"
                    PlaylistTable.batchInsert(items) { (_, _, safeSoundID) ->
                        this[PlaylistTable.userID] = userID
                        this[PlaylistTable.playlistID] = playlistID
                        this[PlaylistTable.name] = name
                        this[PlaylistTable.soundID] =
                            if (safeSoundID == "__NULL__") null else safeSoundID
                    }
                }
            toInsertTriplets.size
        } catch (e: SQLException) {
            e.printStackTrace()
            -1
        }
    }

    suspend fun searchUserPlaylist(name: String, userID: Int, soundID: String): List<UserPlaylists> =
        suspendTransaction {
            val allPlaylists = PlaylistTable.selectAll().where {
                (PlaylistTable.name.lowerCase() like "%${name.lowercase()}%") and
                        (PlaylistTable.userID eq userID)
            }.orderBy(PlaylistTable.name to SortOrder.ASC)
                .map { it.toPlaylist() }

            val matchedPlaylistIDs = PlaylistTable.selectAll().where {
                (PlaylistTable.name.lowerCase() like "%${name.lowercase()}%") and
                        (PlaylistTable.soundID eq soundID)
            }.map { it[PlaylistTable.playlistID] }
                .toSet()

            allPlaylists
                .map { playlist ->
                    UserPlaylists(
                        playlist,
                        playlist.playlistID in matchedPlaylistIDs
                    )
                }
                .distinctBy { it.playlist.playlistID }
        }

    suspend fun basicUserPlaylist(userID: Int, soundID: String): List<UserPlaylists> =
        suspendTransaction {
            val allPlaylists = PlaylistTable.selectAll().where {
                (PlaylistTable.userID eq userID)
            }.orderBy(PlaylistTable.name to SortOrder.ASC)
                .map { it.toPlaylist() }

            val matchedPlaylistIDs = PlaylistTable.selectAll().where {
                (PlaylistTable.soundID eq soundID)
            }.map { it[PlaylistTable.playlistID] }
                .toSet()

            allPlaylists
                .map { playlist ->
                    UserPlaylists(
                        playlist,
                        playlist.playlistID in matchedPlaylistIDs
                    )
                }
                .distinctBy { it.playlist.playlistID }
        }

    suspend fun userPlaylistWithSoundID(userID: Int, soundID: String): List<String> = suspendTransaction {
        PlaylistTable.selectAll().where {
            (PlaylistTable.userID eq userID) and (PlaylistTable.soundID eq soundID)
        }.map { (it[PlaylistTable.playlistID]) }
    }

    suspend fun allUserPlaylist(userID: Int): List<Playlist> = suspendTransaction {
        PlaylistTable.selectAll().where {
            (PlaylistTable.userID eq userID)
        }.map { it.toPlaylist() }.distinctBy { it.playlistID }
    }
}