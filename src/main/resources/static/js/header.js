import {toSlug} from "../js/index/index.js";

document.addEventListener("DOMContentLoaded", () => {
    const resultsDiv = document.getElementById("searchResults");
    if (resultsDiv) {
        const input = document.getElementById("searchInput")
        if (input) {
            input.addEventListener("input", async (event) => {
                const query = event.target.value.trim();
                if (query.length < 3) {
                    resultsDiv.style.display = "none";
                    resultsDiv.innerHTML = "";
                    return;
                }

                try {
                    const response = await fetch(`/search?query=${encodeURIComponent(query)}`);
                    if (!response.ok) {
                        resultsDiv.innerHTML = "<p style='color: red;'>Error while searching.</p>";
                        return;
                    }

                    const results = await response.json();
                    resultsDiv.innerHTML = "";

                    if (results.length === 0) {
                        resultsDiv.style.display = "none";
                        resultsDiv.innerHTML = "<p>No results found.</p>";
                        return;
                    }

                    results.forEach(item => {
                        const div = document.createElement("div");
                        div.className = "pointer";
                        div.textContent = item.name + " - " + item.artist;
                        div.onclick = () => {
                            window.location.href = `/sound/?${toSlug(item.name)}&soundID=${item.soundID}`;
                        };
                        resultsDiv.appendChild(div);
                    });
                    resultsDiv.style.display = "block";
                } catch (error) {
                    resultsDiv.innerHTML = `<p style="color: red;">Error: ${error}</p>`;
                    resultsDiv.style.display = "none";
                }
            });
        }

        const searchBox = document.querySelector(".search_box")
        document.addEventListener("click", (e) => {
            if (searchBox && !searchBox.contains(e.target)) {
                resultsDiv.style.display = "none";
            }
        });
    }
})
