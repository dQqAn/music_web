package com.example.database

import com.example.model.Artist
import com.example.model.ArtistTable
import org.jetbrains.exposed.sql.Database
import org.jetbrains.exposed.sql.SchemaUtils
import org.jetbrains.exposed.sql.insert
import org.jetbrains.exposed.sql.transactions.transaction
import java.sql.SQLException

class ArtistRepository(database: Database) {
    init {
        transaction(database) {
            SchemaUtils.create(ArtistTable)
        }
    }

    suspend fun addArtist(artist: Artist): Int = suspendTransaction {
        try {
            ArtistTable.insert {
                it[id] = artist.id
                it[this.status] = artist.status
            }[ArtistTable.id]
        } catch (e: SQLException) {
            e.printStackTrace()
            -1
        }
    }
}