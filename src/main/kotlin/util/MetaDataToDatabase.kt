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

//genre, subgenre, language and instruments

//menu system-> (type)genre olanları topla. alt menü genre  anahtarındaki değere sahip olan tags sütunu göster yani subgenre ye geçiş yap.

//common parsing-> (type)subgenre den değer gelecek. level olanların arasında ve tags kısmının ilk *_* ifadesinden önce olanlarla query yap.
