declare const VANTA: any;
declare const THREE: any;

interface Song {
    src: string;
    title: string;
}

interface LanyardData {
    success: boolean;
    data: {
        discord_status: string;
        activities: Activity[];
    };
}

interface Activity {
    type: number;
    name: string;
    state?: string;
    details?: string;
    application_id?: string;
    assets?: {
        large_image?: string;
    };
}

const startOverlay = document.getElementById('startOverlay') as HTMLDivElement;
const loader = document.getElementById('loader') as HTMLDivElement;
const loaderBar = document.getElementById('loaderBar') as HTMLDivElement;
const loaderPercent = document.getElementById('loaderPercent') as HTMLDivElement;
const main = document.getElementById('main') as HTMLDivElement;
const audio = document.getElementById('audio') as HTMLAudioElement;
const audioControl = document.getElementById('audioControl') as HTMLDivElement;
const audioProgress = document.getElementById('audioProgress') as HTMLDivElement;
const audioTitle = document.querySelector('.audio-title') as HTMLSpanElement;
const statusDot = document.getElementById('statusDot') as HTMLDivElement;
const statusText = document.getElementById('statusText') as HTMLParagraphElement;
const discordActivity = document.getElementById('discordActivity') as HTMLDivElement;

let isPlaying = false;
let vantaEffect: any = null;

const discordId = '1321090812947468288';

const songs: Song[] = [
    { src: 'audio/brave_shine.mp3', title: 'Brave Shine - Aimer' },
    { src: 'audio/rising_hope.mp3', title: 'Rising Hope - LiSA' },
    { src: 'audio/unravel.mp3', title: 'Unravel - TK' },
    { src: 'audio/like_flames.mp3', title: 'Like Flames - MindaRyn' },
    { src: 'audio/song.mp3', title: '青のすみか - キタニタツヤ' },
    { src: 'audio/numb.mp3', title: 'Comfortably Numb Solo Cover - Thomas75s' },
    { src: 'audio/luhcalm.mp3', title: 'ふたりの気持ち' },
    { src: 'audio/aot-la-la-la.mp3', title: 'Attack on titan la la la' },
    { src: 'audio/spend-some-goon-away.mp3', title: 'Chamber Of Reflection - Mac DeMarco' }

];

const currentSong = songs[Math.floor(Math.random() * songs.length)];
audio.src = currentSong.src;
audioTitle.textContent = currentSong.title;

startOverlay.addEventListener('click', () => {
    startOverlay.classList.add('hidden');
    audio.volume = 0.5;
    audio.play();
    isPlaying = true;

    let progress = 0;
    const loadInterval = setInterval(() => {
        progress += Math.random() * 12 + 3;
        if (progress >= 100) {
            progress = 100;
            clearInterval(loadInterval);
            loaderBar.style.width = '100%';
            loaderPercent.textContent = '100 %';
            setTimeout(() => {
                loader.classList.add('hidden');
                main.classList.add('visible');
                audioControl.classList.add('playing');
            }, 400);
        } else {
            loaderBar.style.width = `${progress}%`;
            loaderPercent.textContent = `${Math.floor(progress)} %`;
        }
    }, 120);
});

audioControl.addEventListener('click', () => {
    if (isPlaying) {
        audio.pause();
        isPlaying = false;
        audioControl.classList.remove('playing');
    } else {
        audio.play();
        isPlaying = true;
        audioControl.classList.add('playing');
    }
});

audio.addEventListener('timeupdate', () => {
    const prog = (audio.currentTime / audio.duration) * 100;
    audioProgress.style.width = `${prog}%`;
});

async function fetchDiscord(): Promise<void> {
    try {
        const res = await fetch(`https://api.lanyard.rest/v1/users/${discordId}`);
        const data: LanyardData = await res.json();

        if (!data.success) return;

        const d = data.data;
        statusDot.className = `status-dot ${d.discord_status}`;

        if (d.activities && d.activities.length > 0) {
            let html = '';

            d.activities.forEach((act) => {
                if (act.type === 4) {
                    statusText.textContent = act.state || '';
                    return;
                }

                let icon = '';
                if (act.assets?.large_image) {
                    if (act.assets.large_image.startsWith('mp:external')) {
                        icon = `https://media.discordapp.net/external/${act.assets.large_image.replace('mp:external/', '')}`;
                    } else if (act.application_id) {
                        icon = `https://cdn.discordapp.com/app-assets/${act.application_id}/${act.assets.large_image}.png`;
                    }
                }

                html += '<div class="activity-item">';
                html += '<div class="activity-icon">';
                if (icon) html += `<img src="${icon}" alt="">`;
                html += '</div>';
                html += '<div class="activity-info">';
                html += `<div class="activity-name">${act.name}</div>`;
                if (act.details) html += `<div class="activity-details">${act.details}</div>`;
                if (act.state) html += `<div class="activity-details">${act.state}</div>`;
                html += '</div></div>';
            });

            discordActivity.innerHTML = html || '<span class="activity-loading">nothing rn</span>';
        } else {
            discordActivity.innerHTML = '<span class="activity-loading">nothing rn</span>';
        }
    } catch {
        discordActivity.innerHTML = '<span class="activity-loading">couldn\'t load</span>';
    }
}

function initVanta(): void {
    if (vantaEffect) vantaEffect.destroy();

    vantaEffect = VANTA.BIRDS({
        el: '#vantaBg',
        THREE: THREE,
        mouseControls: true,
        touchControls: true,
        gyroControls: false,
        minHeight: window.innerHeight,
        minWidth: window.innerWidth,
        scale: 1.00,
        scaleMobile: 1.00,
        backgroundColor: 0x0a0a0a,
        color1: 0x888888,
        color2: 0x444444,
        colorMode: 'variance',
        birdSize: 1.2,
        wingSpan: 20.00,
        separation: 30.00,
        alignment: 30.00,
        cohesion: 30.00,
        quantity: 3.00
    });
}

fetchDiscord();
setInterval(fetchDiscord, 30000);

if (typeof VANTA !== 'undefined') {
    initVanta();
}

window.addEventListener('resize', () => {
    if (vantaEffect) vantaEffect.resize();
});