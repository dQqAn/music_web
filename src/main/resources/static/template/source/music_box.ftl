<div class="fixed bottom-0 w-full bg-gray-900 z-50">
    <div class="w-full flex justify-between">

        <div class="flex content-center items-center justify-start m-2">
            <div class="w-12 h-12 bg-gray-700 rounded overflow-hidden">
                <img id="mainSoundImage" src=""
                     class="w-full h-full object-cover" alt="">
            </div>
            <div class="ml-4">
                <p class="text-sm font-semibold" id="mainSoundName">Sound Name</p>
                <div class="text-xs text-gray-400" id="mainArtistsName">Artist Name</div>
            </div>
            <div class="ml-4">
                <div id="mainFavDiv"></div>
                <div id="mainPlaylistDiv">
                    <button id="mainAddPlaylist">Add Playlist</button>

                    <div class="text-black" id="mainPlaylistContainer" style="
                        display: none;
                        position: fixed;
                        top: 50%;
                        left: 50%;
                        transform: translate(-50%, -50%);
                        background-color: white;
                        border: 1px solid #ccc;
                        z-index: 1000;
                        padding: 20px;
                        box-shadow: 0 2px 10px rgba(0,0,0,0.2);
                        max-width: 90%;
                        max-height: 80%;
                        overflow-y: auto;
                    ">
                        <button id="mainPlaylistCloseBtn" style="
                                position: absolute;
                                top: 10px;
                                right: 10px;
                                background: none;
                                border: none;
                                font-size: 20px;
                                cursor: pointer;
                            ">×
                        </button>

                        <div>
                            <label for="mainPlaylistInput">Search</label>
                            <input type="text" id="mainPlaylistInput" placeholder="Search">
                            <button id="mainCreatePlaylist">Create Playlist</button>
                        </div>

                        <div id="mainPlaylistResult" class="h-60" style="display: none;"></div>
                        <button id="mainAddToPlaylistBtn">Submit</button>
                    </div>
                </div>
                <button id="openStemsOverlay">Stems</button>
            </div>
        </div>

        <div class="flex items-center justify-center w-full">

            <#--<div id="timeDisplayMusicBox" style="border: 1px solid #ddd; position: relative; width: 100%; height: 20px; margin-top: 10px; cursor: pointer;">
                <div id="progressBarMusicBox" style="position: absolute; height: 100%; width: 100%; background-color: #e65e5e;"></div>
                <div id="sliderMusicBox" style="position: absolute; width: 10px; height: 20px; background-color: #333; left: 0;"></div>
            </div>
            <div id="timeTextMusicBox" style="font-family: monospace; margin-top: 5px;">0:00 / 0:00</div>-->

            <div id="music_box" class="container" style="border: 1px solid #ddd; position: relative;">
                <div class="flex items-center space-y-2">
                    <div class="flex space-x-2">
                        <label for="mainVolume" class="text-sm">Volume:</label>
                        <input id="mainVolume" type="range" min="0" max="1" step="0.01" value="1"
                               class="w-32 h-2">

                        <label>
                            Playback rate: <span id="mainRate">1.0</span>x
                        </label>
                        <label>
                            0.5x <input id="mainRateInput" type="range" min="0.5" max="2" step="0.5" value="1"/> 2x
                        </label>
                        <label>
                            Zoom: <input id="mainZoomInput" type="range" min="10" max="200" value="100"/>
                        </label>
                        <p id="mainTime">0:00</p>
                        <p id="mainDuration">0:00</p>
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
            <#--<audio controls id="music_box">
                <source src="">
            </audio>-->
        </div>

        <div class="content-center items-center justify-end">
            <#--            <button class="hover:text-pink-400" id="musicBoxShuffle"><i data-lucide="shuffle" class="w-6 h-6"></i></button>-->

            <button class="hover:text-pink-400" id="musicBoxSkipBack"><i data-lucide="skip-back" class="w-6 h-6"></i>
            </button>

            <button class="hover:text-pink-400" id="musicBoxPlayPause">
                <i id="playPauseIcon" data-lucide="play" class="w-6 h-6"></i>
            </button>

            <button class="hover:text-pink-400" id="musicBoxSkipForward"><i data-lucide="skip-forward"
                                                                            class="w-6 h-6"></i></button>

            <button class="hover:text-pink-400" id="musicBoxRepeat"><i data-lucide="repeat" class="w-6 h-6"></i>
            </button>
            <#--            <button class="hover:text-pink-400"><i data-lucide="repeat" class="w-6 h-6"></i></button>-->
            <#--            <button class="hover:text-pink-400"><i data-lucide="repeat-1" class="w-6 h-6"></i></button>-->
        </div>

    </div>
</div>