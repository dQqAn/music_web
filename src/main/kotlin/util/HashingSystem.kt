package com.example.util

import at.favre.lib.crypto.bcrypt.BCrypt

class HashingSystem {
    fun hashString(password: String): String {
        return BCrypt.withDefaults().hashToString(12, password.toCharArray())
    }

    fun verifyPW(password: String, hashingPassword: String): Boolean {
        return BCrypt.verifyer().verify(password.toCharArray(), hashingPassword).verified
    }
}

/*fun main() {
    val password = "456789"
    val bcryptHashString: String? = BCrypt.withDefaults().hashToString(12, password.toCharArray())
    println("Şifrelenmiş: "+ bcryptHashString)
    val result: BCrypt.Result? = BCrypt.verifyer().verify(password.toCharArray(), bcryptHashString)
    println(result?.verified)
}*/
