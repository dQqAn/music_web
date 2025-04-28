package com.example.util

import com.example.model.MetaItem
import com.example.model.RawMetaItem
import kotlinx.serialization.json.Json
import java.io.File

fun loadMetaItems(jsonFilePath: String): List<MetaItem> {
    val fileContent = File(jsonFilePath).readText()
    val rawItems = Json.decodeFromString<List<RawMetaItem>>(fileContent)

    return rawItems.map { raw ->
        MetaItem(
            type = raw.type,
            key = raw.key,
            label = raw.label,
            tags = raw.tags ?: emptyList()
        )
    }
}

//genre, subgenre and instruments
