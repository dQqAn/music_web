package com.example.routing

import com.example.auth.UserSession
import com.example.database.FavouriteRepository
import com.example.database.PlaylistRepository
import com.example.database.SoundRepository
import com.example.model.SoundBasic
import com.example.model.SoundStatus
import freemarker.cache.ClassTemplateLoader
import io.ktor.http.*
import io.ktor.serialization.kotlinx.json.*
import io.ktor.server.application.*
import io.ktor.server.freemarker.*
import io.ktor.server.http.content.*
import io.ktor.server.plugins.contentnegotiation.*
import io.ktor.server.plugins.httpsredirect.*
import io.ktor.server.plugins.statuspages.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import io.ktor.server.sessions.*
import org.koin.ktor.ext.inject
import org.slf4j.LoggerFactory
import java.util.*

fun Application.basicRouting() {
    configureRouting()
    val soundRepository by inject<SoundRepository>()
    val playlistRepository by inject<PlaylistRepository>()
    val favouriteRepository by inject<FavouriteRepository>()
    routing {
        install(HttpsRedirect) {
            sslPort = 8444
            permanentRedirect = true
        }

        get("/") {
            val lang = call.request.cookies["lang"] ?: "tr"
            val supportedLang = if (lang in listOf("en", "tr")) lang else "tr"
            val words = loadWords(supportedLang)

            val model = mapOf(
                "words" to words,
                "lang" to supportedLang
            )
            call.respond(FreeMarkerContent("index.ftl", model))
        }

        get("/sound/") {
            val soundID = call.parameters["soundID"] ?: return@get call.respond(HttpStatusCode.BadRequest)
            val lang = call.request.cookies["lang"] ?: "tr"
            val supportedLang = if (lang in listOf("en", "tr")) lang else "tr"
            val words = loadWords(supportedLang)

            val sound = soundRepository.getSound(soundID, SoundStatus.ACTIVE)
                ?: return@get call.respond(HttpStatusCode.NotFound)

            val name = sound.name
            val artist = sound.artist
            val category1 = sound.category1
            val image1Path = sound.image1Path

            val userSession = call.sessions.get<UserSession>()
            var favouriteStatus = false
            if (userSession != null) {
                favouriteStatus = favouriteRepository.checkFavourite(soundID, userSession.id)
            }

            val basicSound = SoundBasic(
                name = name,
                artist = artist,
                category1 = category1,
                image1Path = image1Path,
                soundID = soundID,
                favouriteStatus = favouriteStatus
            )

            val model = mapOf(
                "words" to words,
                "lang" to supportedLang,
                "sound" to basicSound
            )
            call.respond(FreeMarkerContent("sound.ftl", model))
        }
    }
}

private fun Application.configureRouting() {
    routing {
        staticResources(
            remotePath = "/",
            basePackage = "/static"
        )
        staticResources(
            remotePath = "/static/js",
            basePackage = "/static"
        )
    }
    install(ContentNegotiation) {
        json()
    }
    install(FreeMarker) {
        templateLoader = ClassTemplateLoader(this::class.java.classLoader, "static/template")
    }
    val logger = LoggerFactory.getLogger("com.example.MyApplication")
    install(StatusPages) {
        status(HttpStatusCode.NotFound) { call, status ->
            val requestUri = call.request.uri
            logger.warn("Error page URI = $requestUri")
            call.respondRedirect("/", permanent = false)
        }
        exception<Throwable> { call, cause ->
            call.respondText(text = "500: $cause", status = HttpStatusCode.InternalServerError)
        }
    }
}

private val messagesCache = mutableMapOf<String, Properties>()

fun loadWords(lang: String): Properties {
    return messagesCache.getOrPut(lang) {
        val properties = Properties()
        val fileName = "/static/localization/localization_${lang}.properties"
        val stream = object {}.javaClass.getResourceAsStream(fileName)
            ?: throw IllegalArgumentException("Missing localization file: $fileName")
        stream.use { properties.load(it) }
        properties
    }
}

/*fun RoutingContext.basicContentLoader(model: Map<String, Serializable>, pageName: String) {
    //todo
    val lang = call.request.cookies["lang"] ?: "tr"
    val supportedLang = if (lang in listOf("en", "tr")) lang else "tr"
    val words = loadWords(supportedLang)
}*/
