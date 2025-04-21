package com.example.database

import com.example.model.Admin
import com.example.model.AdminTable
import org.jetbrains.exposed.sql.Database
import org.jetbrains.exposed.sql.SchemaUtils
import org.jetbrains.exposed.sql.insert
import org.jetbrains.exposed.sql.transactions.transaction
import java.sql.SQLException

class AdminRepository(database: Database) {
    init {
        transaction(database) {
            SchemaUtils.create(AdminTable)
        }
    }

    suspend fun addAdmin(admin: Admin): Int = suspendTransaction {
        try {
            AdminTable.insert {
                it[this.id] = admin.id
                it[this.status] = admin.status
                it[this.level] = admin.level
            }[AdminTable.id]
        } catch (e: SQLException) {
            e.printStackTrace()
            -1
        }
    }
}