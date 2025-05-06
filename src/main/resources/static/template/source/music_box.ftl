<footer class="fixed bottom-0 w-full">
    <div class="w-full flex justify-between">

        <div class="flex content-center items-center justify-start gap-x-4">
            <div class="w-12 h-12  rounded overflow-hidden">
                <img id="mainSoundImage" src=""
                     class="w-full h-full object-cover" alt="">
            </div>
            <div class="ml-4">
                <p class="text-sm font-semibold" id="mainSoundName">Sound Name</p>
                <div class="text-xs " id="mainArtistsName">Artist Name</div>
            </div>

            <div class="ml-10 gap-x-4 content-center items-center">
                <button class="" id="musicBoxSkipBack"><i data-lucide="skip-back" class="w-6 h-6"></i>
                </button>

                <button class="" id="musicBoxPlayPause">
                    <i id="playPauseIcon" data-lucide="play" class="w-6 h-6"></i>
                </button>

                <button class="" id="musicBoxSkipForward"><i data-lucide="skip-forward"
                                                             class="w-6 h-6"></i></button>

                <button class="" id="musicBoxRepeat"><i data-lucide="repeat" class="w-6 h-6"></i>
                </button>

                <button id="openStemsOverlay">Stems</button>
            </div>

        </div>

        <div class="flex items-center justify-center max-w-300">

            <div class="flex">
                <p id="mainTime">0:00</p>
                <span>/</span>
                <p id="mainDuration">0:00</p>
            </div>

            <div id="music_box" class="container" style="position: relative;">
                <div class="flex items-center space-y-2">
                    <div class="flex space-x-2">
                        <label>
                            Speed: <span id="mainRate"></span>
                        </label>
                        <label>
                            0.5x <input id="mainRateInput" type="range" min="0.5" max="2" step="0.5" value="1"/> 2x
                        </label>
                        <label>
                            Zoom: <input id="mainZoomInput" type="range" min="10" max="200" value="100"/>
                        </label>

                        <label>
                            <input id="mainLoopCheckbox" type="checkbox"/>
                            Loop regions
                        </label>
                        <button id="mainClearRegions">Clear Regions</button>
                    </div>
                    <div id="mainHover" style="position: absolute; left: 0; top: 0; z-index: 1010;
                            pointer-events: none; height: 100%; width: 0; mix-blend-mode: overlay; opacity: 0;
                            background: rgba(255, 255, 255, 0.5); transition: opacity 0.2s ease;
                    "></div>
                </div>
            </div>
        </div>

        <div class="content-center items-center justify-end ">
            <div class="flex ml-4 gap-x-4 content-center items-center">
                <button id="openPlaylistButton">
                    <i data-lucide="list-music" class="w-6 h-6"></i>
                </button>

                <div id="mainFavDiv"></div>

                <div id="mainPlaylistDiv">
                    <button id="mainPlaylistBtn">Add Playlist</button>

                    <div class="rounded-2xl bg-fuchsia-100 dark:bg-neutral-950 text-neutral-950 dark:text-fuchsia-500 max-h-100"
                         id="mainPlaylistContainer" style="
                        display: none;
                        position: fixed;
                        top: 50%;
                        left: 50%;
                        transform: translate(-50%, -50%);
                        border: 1px solid #ccc;
                        z-index: 1000;
                        max-width: 90%;
                        max-height: 80%;
                        overflow-y: auto;
                        padding: 10px;
                    ">
                        <div class="flex items-center justify-center gap-4">
                            <div class="flex items-center gap-2">
                                <button id="mainCreatePlaylist">Create Playlist</button>
                                <input type="text" id="mainPlaylistInput" placeholder="Search">
                            </div>
                            <div class="flex items-center">
                                <button
                                        id="mainPlaylistCloseBtn"
                                        class="text-xl leading-none border-none bg-transparent cursor-pointer"
                                >
                                    ×
                                </button>
                            </div>
                        </div>

                        <div id="mainPlaylistResult" class="h-60 mt-8 border-t" style="display: none;"></div>
                        <button id="mainAddToPlaylistBtn">Submit</button>
                    </div>
                </div>

                <input id="mainVolume" type="range" min="0" max="1" step="0.01" value="1"
                       class="w-32 h-2">
            </div>
        </div>

    </div>
</footer>

