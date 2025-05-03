<div class="fixed bottom-0 w-full bg-gray-900 z-50">
    <div class="w-full flex justify-between">

        <div class="flex content-center items-center justify-start m-2">
            <div class="w-12 h-12 bg-gray-700 rounded overflow-hidden">
                <img src=""
                     class="w-full h-full object-cover" alt="">
            </div>
            <div class="ml-4">
                <p class="text-sm font-semibold">Sound Name</p>
                <p class="text-xs text-gray-400">Artist Name</p>
            </div>
            <div class="ml-4">
                <p>Fav</p>
                <p>Playlist</p>
                <button id="mainShowStems">Stems</button>
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
                    <label for="mainVolume" class="text-sm">Volume:</label>
                    <input id="mainVolume" type="range" min="0" max="1" step="0.01" value="1"
                           class="w-32 h-2">
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