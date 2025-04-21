package com.example.auth

import com.example.database.UserRepository
import com.example.model.User
import com.example.model.UserBasic
import com.example.model.UserRegister
import com.example.routing.loadWords
import com.example.util.EncryptionSystem
import com.example.util.HashingSystem
import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.auth.*
import io.ktor.server.freemarker.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import io.ktor.server.sessions.*
import kotlinx.serialization.Serializable

@Serializable
data class UserSession(val name: String, val id: Int, val role: String)

enum class Role {
    USER, ARTIST, MODERATOR, ADMIN
}

enum class UserStatus {
    PASSIVE, ACTIVE
}

enum class UserPremium {
    PASSIVE, ACTIVE
}

fun Application.auth(
    userRepository: UserRepository,
    encryptionSystem: EncryptionSystem,
    hashingSystem: HashingSystem,
) {
    install(Sessions) {
        cookie<UserSession>("user_session") { cookie.path = "/" }
    }
    install(Authentication) {
        session<UserSession>("auth-session") {
            validate { session ->
                if (session.name.isNotEmpty() && session.role in Role.entries.map { it.name }) {
                    session
                } else {
                    null
                }
            }
            challenge {
                call.respondRedirect("/login")
            }
        }
    }

    routing {
        get("/login") {
            val userSession = call.sessions.get<UserSession>()
            if (userSession == null) {
                val lang = call.request.cookies["lang"] ?: "tr"
                val supportedLang = if (lang in listOf("en", "tr")) lang else "tr"
                val words = loadWords(supportedLang)
                val model = mapOf(
                    "words" to words,
                    "lang" to supportedLang
                )

                call.respond(FreeMarkerContent("login.ftl", model))
            } else {
                call.respondRedirect("/")
            }
        }

        post("/login") {
            val userSession = call.sessions.get<UserSession>()
            if (userSession == null) {
                val user = call.receive<UserBasic>()
                val encryptMail = encryptionSystem.encryptAES(user.mail)
                val userControl = userRepository.checkUser(
                    encryptMail,
                    user.password
                )
                if (userControl != null) {
                    val role = Role.entries.find {
                        it.toString() == userControl.role.toString()
                    }
                    role?.let {
                        call.sessions.set(UserSession(encryptMail, userControl.id, it.toString()))
                        call.respond(HttpStatusCode.OK)
                    }
                } else {
                    call.respond(HttpStatusCode.BadRequest)
                }
            }
        }

        post("/register") {
            val userSession = call.sessions.get<UserSession>()
            if (userSession == null) {
                val user = call.receive<UserRegister>()
                val encryptMail = encryptionSystem.encryptAES(user.mail)
                val id = userRepository.addUser(
                    User(
                        status = UserStatus.ACTIVE.toString(),
                        mail = encryptMail,
                        password = hashingSystem.hashString(user.password),
                        name = user.name,
                        surname = user.surname,
                        role = Role.USER.toString(),
                        premium = UserPremium.PASSIVE.toString()
                    )
                )
                if (id != -1) {
                    call.sessions.set(UserSession(encryptMail, id, Role.USER.toString()))
                    call.respond(HttpStatusCode.OK)
                } else {
                    call.respond(HttpStatusCode.BadRequest)
                }
            } else {
                call.respondRedirect("/")
            }
        }

        get("/logout") {
            call.sessions.clear<UserSession>()
            call.respondRedirect("/")
        }
    }
}