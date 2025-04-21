package com.example.model

import kotlinx.serialization.Serializable
import org.jetbrains.exposed.sql.Table

@Serializable
data class Admin(
    override val id: Int,
    var status: String,
    var level: Int = 0
) : UserInterface

@Serializable
data class StaffRegister(
    val mail: String,
    val role: String
)

object AdminTable : Table("admin") {
    val id = integer("id").references(UserTable.id)
    val status = varchar("status", 50)
    val level = integer("level")
    override val primaryKey = PrimaryKey(id, name = "admin_pk")
}