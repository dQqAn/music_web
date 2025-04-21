package com.example.database

import com.example.auth.UserSession
import com.example.model.User
import com.example.model.UserTable
import com.example.model.fromUser
import com.example.model.toUserSession
import com.example.util.EncryptionSystem
import com.example.util.HashingSystem
import org.jetbrains.exposed.sql.Database
import org.jetbrains.exposed.sql.SchemaUtils
import org.jetbrains.exposed.sql.insert
import org.jetbrains.exposed.sql.selectAll
import org.jetbrains.exposed.sql.transactions.transaction
import java.sql.SQLException

class UserRepository(
    database: Database,
    private val hashingSystem: HashingSystem,
    private val encryptionSystem: EncryptionSystem
) {
    init {
        transaction(database) {
            SchemaUtils.create(UserTable)
        }
    }

    suspend fun addUser(user: User): Int = suspendTransaction {
        try {
            UserTable.insert { it.fromUser(user) }[UserTable.id]
        } catch (e: SQLException) {
            e.printStackTrace()
            -1
        }
    }

    suspend fun checkUser(mail: String, password: String): UserSession? = suspendTransaction {
        UserTable.selectAll()
            .where { UserTable.mail eq mail }
            .singleOrNull()
            ?.takeIf { hashingSystem.verifyPW(password, it[UserTable.password]) }
            ?.toUserSession()
    }

    suspend fun userName(id: Int): String? = suspendTransaction {
        UserTable.selectAll().where { (UserTable.id eq id) }
            .map { it[UserTable.name] }.singleOrNull()
    }

    suspend fun userID(mail: String): Int? = suspendTransaction {
        UserTable.selectAll().where { (UserTable.mail eq mail) }
            .map { it[UserTable.id] }.singleOrNull()
    }
}