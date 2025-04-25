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
            </div>
        </div>

        <div class="flex items-center justify-center w-full">
            <div id="music_box" class="w-full" style="border: 1px solid #ddd;"></div>
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