import WaveSurfer from 'https://unpkg.com/wavesurfer.js/dist/wavesurfer.esm.js';

const wave1 = WaveSurfer.create({
    container: '#waveform1',
    waveColor: '#4FD1C5',
    progressColor: '#2C7A7B',
    height: 100,
});

const wave2 = WaveSurfer.create({
    container: '#waveform2',
    waveColor: '#63B3ED',
    progressColor: '#2B6CB0',
    height: 100,
});

wave1.load('/uploads/sound/3/0e321428-3417-4da8-ab19-c0af9491586f_2.mp3');
wave2.load('/uploads/sound/3/60691e3f-86b0-4f71-b08e-25dd9611262b_1.mp3');

document.getElementById('waveform1').addEventListener('click', (e) => {
    const bbox = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - bbox.left;
    const percent = x / bbox.width;

    const duration = wave2.getDuration();
    if (duration && !isNaN(percent)) {
        wave2.seekTo(percent);
    }
});

let isDragging = false;
wave1.on('ready', () => {
    const container = document.querySelector('#waveform1');

    container.addEventListener('mousedown', (e) => {
        isDragging = true;
        seek(e);
    });

    window.addEventListener('mouseup', () => {
        isDragging = false;
    });

    container.addEventListener('mousemove', (e) => {
        if (isDragging) {
            seek(e);
        }
    });

    function seek(e) {
        const rect = container.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const percent = Math.max(0, Math.min(1, x / rect.width));

        wave1.seekTo(percent);
        wave2.seekTo(percent);
    }
});

wave2.on('audioprocess', () => {
    if (!wave2.isPlaying()) return;
    const currentTime = wave2.getCurrentTime();
    wave1.seekTo(currentTime / wave2.getDuration());
});

document.getElementById('play2').addEventListener('click', () => {
    wave2.play();
});
document.getElementById('pause2').addEventListener('click', () => {
    wave2.pause();
});
document.getElementById('play1').addEventListener('click', () => {
    wave2.play();
});
document.getElementById('pause1').addEventListener('click', () => {
    wave2.pause();
});
