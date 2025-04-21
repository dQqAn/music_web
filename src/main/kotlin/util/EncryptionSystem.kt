package com.example.util

import java.security.MessageDigest
import java.util.*
import javax.crypto.Cipher
import javax.crypto.SecretKeyFactory
import javax.crypto.spec.GCMParameterSpec
import javax.crypto.spec.PBEKeySpec
import javax.crypto.spec.SecretKeySpec

class EncryptionSystem(val dotEnv: DotEnvironment) {
    private val saltLength = 16
    private val ivLength = 12
    private val tagLength = 128

    private fun deriveAESKey(userKey: String, salt: ByteArray): SecretKeySpec {
        val spec = PBEKeySpec(userKey.toCharArray(), salt, 10000, 256)
        val factory = SecretKeyFactory.getInstance("PBKDF2WithHmacSHA256")
        return SecretKeySpec(factory.generateSecret(spec).encoded, "AES")
    }

    fun encryptAES(plainText: String): String {
        try {
            val userKey = dotEnv.getDotEnv()["encryptionKey"]
            val cipher = Cipher.getInstance("AES/GCM/NoPadding")

            val salt = MessageDigest.getInstance("SHA-256")
                .digest(plainText.toByteArray()).copyOf(saltLength)
            val iv = MessageDigest.getInstance("SHA-256")
                .digest(plainText.toByteArray()).copyOf(ivLength)

            val secretKey = deriveAESKey(userKey, salt)
            val spec = GCMParameterSpec(tagLength, iv)
            cipher.init(Cipher.ENCRYPT_MODE, secretKey, spec)
            val encryptedData = cipher.doFinal(plainText.toByteArray(Charsets.UTF_8))
            return Base64.getEncoder().encodeToString(salt + iv + encryptedData)
        } catch (e: Exception) {
            throw RuntimeException("Encryption error: ${e.message}", e)
        }
    }

    fun decryptAES(encryptedText: String): String {
        try {
            val userKey = dotEnv.getDotEnv()["encryptionKey"]
            val cipher = Cipher.getInstance("AES/GCM/NoPadding")
            val decodedData = Base64.getDecoder().decode(encryptedText)
            val salt = decodedData.copyOfRange(0, saltLength)
            val iv = decodedData.copyOfRange(saltLength, saltLength + ivLength)
            val encryptedData = decodedData.copyOfRange(saltLength + ivLength, decodedData.size)
            val secretKey = deriveAESKey(userKey, salt)
            val spec = GCMParameterSpec(tagLength, iv)
            cipher.init(Cipher.DECRYPT_MODE, secretKey, spec)
            return String(cipher.doFinal(encryptedData), Charsets.UTF_8)
        } catch (e: javax.crypto.AEADBadTagException) {
            throw RuntimeException("Data is corrupted or wrong key!", e)
        } catch (e: Exception) {
            throw RuntimeException("Decryption error: ${e.message}", e)
        }
    }
}

/*fun main() {
    val dotEnv = DotEnvironment()
    val encryptionSystem = EncryptionSystem(dotEnv)
    val originalText = "dogan19572@gmail.com"
    val encrypted = encryptionSystem.encryptAES(originalText)
    val decrypted = encryptionSystem.decryptAES(encrypted)

    println("Orijinal: $originalText")
    println("Şifrelenmiş: $encrypted")
    println("Çözüldü: $decrypted")
}*/
