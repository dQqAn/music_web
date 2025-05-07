<header class="">
    <div class="search_box space-y-2">
        <input
                type="text"
                id="searchInput"
                placeholder="Search sound..."
                class="text-neutral-950 dark:text-fuchsia-500 w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2"
        />
        <div
                id="searchResults"
                class="search-dropdown mt-2 border rounded-md p-2 text-sm hidden max-w-md bg-fuchsia-100 dark:bg-neutral-950 mx-auto"
        ></div>
    </div>

    <a href="/">
        <button class="">${words["homepage"]}</button>
    </a>

    <div>
        <button class="" onclick="changeLanguage('tr')">TR</button>
        <button class="" onclick="changeLanguage('en')">EN</button>
    </div>

    <div>
        <button class="" onclick="toggleTheme()">Change Theme</button>
    </div>

    <div id="user_section"></div>
</header>