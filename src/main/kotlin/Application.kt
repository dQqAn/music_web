package com.example

import com.example.database.*
import com.example.routing.basicRouting
import com.example.util.*
import io.ktor.server.application.*
import io.ktor.server.engine.*
import io.ktor.server.netty.*
import org.jetbrains.exposed.sql.Database
import org.koin.core.module.dsl.singleOf
import org.koin.dsl.module
import org.koin.ktor.plugin.Koin
import org.koin.ktor.plugin.KoinApplicationStarted
import org.koin.ktor.plugin.KoinApplicationStopPreparing
import org.koin.ktor.plugin.KoinApplicationStopped
import org.koin.logger.slf4jLogger
import java.io.File
import java.io.FileInputStream
import java.security.KeyStore

fun main(args: Array<String>) {
    val rootConfig = serverConfig {
        module { module() }
    }
    embeddedServer(factory = Netty, rootConfig = rootConfig) {
        envConfig(args)
    }.start(wait = true)
}

fun Application.module() {
    monitoring()
    ktorApp()

    databaseRouting()
    databaseApi()

    basicRouting()
}

fun Application.ktorApp() {
    val ktorModule = module {
        single<Database> {
            configureDatabase()
        }

        singleOf(::AdminRepository)
        singleOf(::ModeratorRepository)
        singleOf(::ArtistRepository)
        singleOf(::UserRepository)
        singleOf(::SoundRepository)
        singleOf(::FavouriteRepository)
        singleOf(::PlaylistRepository)
        singleOf(::DotEnvironment)
        singleOf(::EncryptionSystem)
        singleOf(::HashingSystem)
    }

    //region Koin Log
    install(Koin) {
        slf4jLogger()
        modules(ktorModule)
    }
    monitor.subscribe(KoinApplicationStarted) {
        log.info("Koin started.")
    }
    monitor.subscribe(KoinApplicationStopPreparing) {
        log.info("Koin stopping...")
    }
    monitor.subscribe(KoinApplicationStopped) {
        log.info("Koin is stopped.")
        monitor.unsubscribe(KoinApplicationStarted) {}
        monitor.unsubscribe(KoinApplicationStopPreparing) {}
        monitor.unsubscribe(KoinApplicationStopped) {}
    }
    //endregion
}

fun ApplicationEngine.Configuration.envConfig(args: Array<String>) {
    connector {
        port = 8083
    }

    val dotenv = DotEnvironment().getDotEnv()

    val keyStoreFile = File("keystore.jks")
    val keyStore = KeyStore.getInstance("JKS").apply {
        FileInputStream(keyStoreFile).use { fis ->
            load(fis, dotenv["sslPW"]?.toCharArray())
        }
    }

    sslConnector(
        keyStore = keyStore,
        keyAlias = dotenv["keyAlias"],
        keyStorePassword = { (dotenv["sslPW"]).toCharArray() },
        privateKeyPassword = { (dotenv["sslPW"]).toCharArray() }
    ) {
        port = 8444
    }
}
