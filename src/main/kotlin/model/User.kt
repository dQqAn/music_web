package com.example.model

import com.example.auth.UserSession
import kotlinx.serialization.Serializable
import org.jetbrains.exposed.sql.ResultRow
import org.jetbrains.exposed.sql.Table
import org.jetbrains.exposed.sql.statements.InsertStatement
import org.jetbrains.exposed.sql.statements.UpdateStatement

@Serializable
data class User(
    override val id: Int = -1,
    var status: String,
    var mail: String,
    var password: String,
    var name: String,
    var surname: String,
    var role: String,
    var premium: String
) : UserInterface

interface UserInterface {
    val id: Int
}

@Serializable
data class UserBasic(
    val mail: String,
    val password: String
)

@Serializable
data class UserRegister(
    val mail: String,
    val password: String,
    val name: String,
    val surname: String
)

object UserTable : Table("users") {
    val id = integer("id").autoIncrement()
    val status = varchar("status", 50)
    val mail = varchar("mail", 100)
    val password = varchar("password", 100)
    val name = varchar("name", 50)
    val surname = varchar("surname", 50)
    val role = varchar("role", 50)
    val premium = varchar("premium", 50)
    override val primaryKey = PrimaryKey(id, name = "users_pk")
}

fun ResultRow.toUser(): User = User(
    id = this[UserTable.id],
    status = this[UserTable.status],
    mail = this[UserTable.mail],
    password = this[UserTable.password],
    name = this[UserTable.name],
    surname = this[UserTable.surname],
    role = this[UserTable.role],
    premium = this[UserTable.premium]
)

fun ResultRow.toUserSession() = UserSession(
    name = this[UserTable.name],
    id = this[UserTable.id],
    role = this[UserTable.role]
)

fun InsertStatement<Number>.fromUser(user: User) {
    this[UserTable.status] = user.status
    this[UserTable.mail] = user.mail
    this[UserTable.password] = user.password
    this[UserTable.name] = user.name
    this[UserTable.surname] = user.surname
    this[UserTable.role] = user.role
    this[UserTable.premium] = user.premium
}

fun UpdateStatement.fromUser(user: User) {
    this[UserTable.status] = user.status
    this[UserTable.mail] = user.mail
    this[UserTable.password] = user.password
    this[UserTable.name] = user.name
    this[UserTable.surname] = user.surname
    this[UserTable.role] = user.role
    this[UserTable.premium] = user.premium
}