package com.example.util

import io.github.cdimascio.dotenv.Dotenv
import io.github.cdimascio.dotenv.dotenv

class DotEnvironment() {
    fun getDotEnv(): Dotenv {
        return dotenv {
            systemProperties = true
            filename = "env"
            directory = "./"
        }
    }
}