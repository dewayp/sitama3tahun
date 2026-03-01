// =============================================
//  MAIN.JS – Scene Controller & Core Logic
// =============================================

// ── Scene management ──────────────────────────
const scenes = [
    'scene-0', 'scene-1', 'scene-tg', 'scene-wait',
    'scene-game1', 'scene-game2', 'scene-2026', 'scene-maaf',
    'scene-tali', 'scene-photos', 'scene-letter'
];

let currentScene = 'scene-0';
let audioCtx = null;
let bgmBuffer = null;
let bgmSource = null;

function showScene(id) {
    const prev = document.querySelector('.scene.active');
    if (prev) {
        prev.style.transition = 'opacity 0.8s ease';
        prev.style.opacity = '0';
        prev.style.pointerEvents = 'none';
        setTimeout(() => { prev.classList.remove('active'); prev.style.opacity = ''; }, 800);
    }
    setTimeout(() => {
        const next = document.getElementById(id);
        if (next) {
            next.classList.add('active');
            next.style.opacity = '0';
            next.style.pointerEvents = 'all';
            requestAnimationFrame(() => {
                next.style.transition = 'opacity 0.8s ease';
                next.style.opacity = '1';
            });
        }
        currentScene = id;
    }, prev ? 400 : 0);
}

function showSceneImmediate(id) {
    document.querySelectorAll('.scene').forEach(s => {
        s.classList.remove('active');
        s.style.opacity = '';
        s.style.pointerEvents = 'none';
    });
    const next = document.getElementById(id);
    if (next) {
        next.classList.add('active');
        next.style.opacity = '1';
        next.style.pointerEvents = 'all';
    }
    currentScene = id;
}

// ── Fullscreen ────────────────────────────────
function requestFullscreen() {
    const el = document.documentElement;
    try {
        // Gunakan pemanggilan tanpa parameter object untuk kompabilitas maksimal di mobile (iOS/old Android kadang error)
        let requestMethod = el.requestFullscreen || el.webkitRequestFullscreen || el.mozRequestFullScreen || el.msRequestFullscreen;

        if (requestMethod) {
            const promise = requestMethod.call(el);
            if (promise !== undefined) {
                promise.catch(err => console.log('Fullscreen error:', err));
            }
        }

        // Lock orientation to portrait on mobile
        if (screen.orientation && screen.orientation.lock) {
            screen.orientation.lock('portrait').catch(() => { });
        }
    } catch (e) { console.error('Fullscreen request failed', e); }
}

// ── Audio Manager ─────────────────────────────
function initAudio() {
    try {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    } catch (e) { console.warn('Web Audio not supported'); }
}

function playAudio(src, loop = false, volume = 0.5) {
    if (!audioCtx) return null;
    const audio = new Audio(src);
    audio.loop = loop;
    audio.volume = volume;
    const source = audioCtx.createMediaElementSource(audio);
    const gainNode = audioCtx.createGain();
    gainNode.gain.value = volume;
    source.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    audio.play().catch(() => { });
    return { audio, gainNode };
}

// Simpler audio (fallback)
function playSound(src, volume = 0.7) {
    try {
        const a = new Audio(src);
        a.volume = volume;
        a.play().catch(() => { });
        return a;
    } catch (e) { return null; }
}

let bgmAudio = null;

function startBGM() {
    if (bgmAudio) return;
    bgmAudio = playSound('assets/audio/bgm_main.mp3', 0.35);
    if (bgmAudio) bgmAudio.loop = true;
}

function crossfadeBGM(src, volume = 0.35) {
    const newBgm = playSound(src, 0);
    if (!newBgm) return;
    newBgm.loop = true;
    // Fade in new
    let vol = 0;
    const fadeIn = setInterval(() => {
        vol = Math.min(vol + 0.02, volume);
        newBgm.volume = vol;
        if (vol >= volume) clearInterval(fadeIn);
    }, 100);
    // Fade out old
    if (bgmAudio) {
        const old = bgmAudio;
        let oldVol = old.volume;
        const fadeOut = setInterval(() => {
            oldVol = Math.max(0, oldVol - 0.02);
            old.volume = oldVol;
            if (oldVol <= 0) { old.pause(); clearInterval(fadeOut); }
        }, 100);
    }
    bgmAudio = newBgm;
}

// ── Utility helpers ───────────────────────────
function delay(ms) { return new Promise(r => setTimeout(r, ms)); }

function randomBetween(min, max) { return Math.random() * (max - min) + min; }

function randomInt(min, max) { return Math.floor(randomBetween(min, max + 1)); }

// ── Update phone clock ─────────────────────────
function updatePhoneClock() {
    const now = new Date();
    const h = String(now.getHours()).padStart(2, '0');
    const m = String(now.getMinutes()).padStart(2, '0');
    const timeStr = `${h}:${m}`;
    const el1 = document.getElementById('phone-time');
    const el2 = document.getElementById('phone-clock-time');
    if (el1) el1.textContent = timeStr;
    if (el2) el2.textContent = timeStr;
}

// ── Intro particles ────────────────────────────
function initIntroParticles() {
    const container = document.getElementById('intro-hearts');
    for (let i = 0; i < 18; i++) {
        const heart = document.createElement('div');
        heart.textContent = ['💕', '❤️', '🌸', '✨'][Math.floor(Math.random() * 4)];
        heart.style.cssText = `
      position: absolute;
      font-size: ${randomBetween(0.8, 1.8)}rem;
      left: ${randomBetween(0, 95)}%;
      top: ${randomBetween(0, 95)}%;
      opacity: ${randomBetween(0.08, 0.18)};
      animation: float ${randomBetween(3, 7)}s ease-in-out infinite;
      animation-delay: ${randomBetween(0, 4)}s;
      pointer-events: none;
    `;
        container.appendChild(heart);
    }
}

// ── START JOURNEY (Scene 0 → 1) ───────────────
function startJourney() {
    requestFullscreen();
    initAudio();
    startBGM();
    showScene('scene-1');
    updatePhoneClock();
    setInterval(updatePhoneClock, 30000);
    // Trigger notification after 1.5s
    setTimeout(showTelegramNotif, 1500);
}

// ── TELEGRAM NOTIFICATION LOGIC ───────────────
let notifTimer = null;
let notifShown = false;

function showTelegramNotif() {
    const notif = document.getElementById('tg-notif');
    if (!notif) return;
    notif.classList.add('slide-in');
    playSound('assets/audio/sfx_notif.mp3', 0.8);
    notifShown = true;
    // Tutorial after 3s if not clicked
    notifTimer = setTimeout(() => {
        if (currentScene === 'scene-1') {
            const overlay = document.getElementById('tutorial-overlay');
            if (overlay) overlay.classList.add('active');
        }
    }, 3000);
}

function handleNotifClick() {
    if (!notifShown) return;
    clearTimeout(notifTimer);
    const overlay = document.getElementById('tutorial-overlay');
    if (overlay) overlay.classList.remove('active');
    // Transition to Telegram chat
    setTimeout(() => {
        showScene('scene-tg');
        setTimeout(playTelegramChat, 600);
    }, 200);
}

// ── INIT ──────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
    initIntroParticles();
    updatePhoneClock();
    // Preload images
    preloadImages();
});

function preloadImages() {
    const srcs = [];
    for (let i = 1; i <= 15; i++) {
        srcs.push(`assets/images/couple/photo_${String(i).padStart(2, '0')}.jpg`);
        srcs.push(`assets/images/couple/photo_${String(i).padStart(2, '0')}.jpeg`);
    }
    srcs.push('assets/images/memories/mem_2023_01.jpg');
    srcs.push('assets/images/memories/mem_2023_01.jpeg');
    srcs.push('assets/images/memories/mem_2024_01.jpg');
    srcs.push('assets/images/memories/mem_2024_01.jpeg');
    srcs.push('assets/images/memories/mem_2025_01.jpg');
    srcs.push('assets/images/memories/mem_2025_01.jpeg');
    srcs.forEach(src => { const img = new Image(); img.src = src; });
}
