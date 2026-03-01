// =============================================
//  SCENES.JS – Scene Animation Logic
// =============================================

// ── SCENE 1B: TELEGRAM CHAT ───────────────────
async function playTelegramChat() {
    const typingWrap = document.getElementById('typing-wrap');
    const bubbleOut = document.getElementById('bubble-out');

    const show = (el) => {
        el.style.transition = 'opacity 0.35s ease, transform 0.35s ease';
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
    };
    const hide = (el) => {
        el.style.transition = 'opacity 0.25s ease';
        el.style.opacity = '0';
    };

    // "Dari jawa?" sudah muncul (opacity 1 by default di HTML)
    // Langsung saya mulai mengetik...
    await delay(1000);
    show(typingWrap);
    await delay(2000); // durasi ngetik "iyaa"

    // Balasan "iyaa" muncul
    hide(typingWrap);
    await delay(250);
    typingWrap.style.display = 'none';
    show(bubbleOut);
    playSound('assets/audio/sfx_notif.mp3', 0.35);

    // Lanjut ke flow
    await delay(1400);
    startChatFlow();
}

// ── SCENE 2: CHAT FLOW ────────────────────────
async function startChatFlow() {
    const overlay = document.getElementById('flow-overlay');
    const flowText = document.getElementById('flow-text');
    const msgArea = document.getElementById('tg-messages');

    // Activate overlay
    overlay.classList.add('active');

    // Add floating photos to overlay
    addFlowPhotos(overlay);

    // Add floating hearts
    startFloatingHearts(overlay);

    // Auto-scroll chat bubbles
    msgArea.style.transition = 'transform 1.5s ease';
    await delay(200);
    msgArea.style.transform = 'translateY(-80px)';

    // Show text
    await delay(1800);
    flowText.classList.add('visible');

    // Auto advance after reading time
    await delay(3500);
    showScene('scene-wait');
}

function addFlowPhotos(container) {
    const photos = [];
    for (let i = 1; i <= 10; i++) {
        photos.push(`assets/images/couple/photo_${String(i).padStart(2, '0')}.jpg`);
    }

    const positions = [
        { top: '8%', left: '5%', w: 80, rot: -8 },
        { top: '12%', right: '8%', w: 70, rot: 6 },
        { top: '35%', left: '10%', w: 65, rot: -4 },
        { top: '30%', right: '12%', w: 75, rot: 10 },
        { top: '55%', left: '8%', w: 60, rot: -12 },
        { top: '50%', right: '6%', w: 68, rot: 7 },
    ];

    positions.forEach((pos, i) => {
        const src = photos[i % photos.length];
        const el = document.createElement('div');
        el.className = 'flow-photo';
        el.style.cssText = `
      width: ${pos.w}px;
      aspect-ratio: 2/3;
      top: ${pos.top || 'auto'};
      left: ${pos.left || 'auto'};
      right: ${pos.right || 'auto'};
      transform: rotate(${pos.rot}deg);
      animation-delay: ${i * 0.3}s;
      animation-duration: ${4 + i * 0.3}s;
    `;
        el.innerHTML = `<img src="${src}" style="width:100%;height:100%;object-fit:cover;border-radius:6px;" onerror="this.parentElement.style.display='none'"/>`;
        container.insertBefore(el, container.firstChild);
    });
}

function startFloatingHearts(container) {
    const emojis = ['❤️', '💕', '💗', '💓', '🌸'];
    let count = 0;
    const interval = setInterval(() => {
        if (count > 25) { clearInterval(interval); return; }
        const heart = document.createElement('div');
        heart.className = 'flow-heart';
        heart.textContent = emojis[Math.floor(Math.random() * emojis.length)];
        heart.style.cssText = `
      left: ${randomBetween(5, 90)}%;
      bottom: ${randomBetween(5, 30)}%;
      font-size: ${randomBetween(1, 2.2)}rem;
      animation-delay: 0s;
      animation-duration: ${randomBetween(2.5, 4)}s;
    `;
        container.appendChild(heart);
        setTimeout(() => heart.remove(), 4500);
        count++;
    }, 300);
}

// ── SCENE MAAF ────────────────────────────────
async function startMaaf() {
    const title = document.getElementById('maaf-title');
    const container = document.getElementById('apology-container');
    const pray = document.getElementById('maaf-pray');

    // Crossfade to intimate music
    crossfadeBGM('assets/audio/bgm_intimate.mp3', 0.3);

    // Hening 1 detik
    await delay(1000);

    // Tampilkan MAAF
    title.style.transition = 'opacity 0.8s ease';
    title.style.opacity = '1';
    await delay(1500);

    // Mulai apologies (teks berjatuhan)
    const texts = CONFIG.apologyTexts;

    for (let i = 0; i < texts.length; i++) {
        await delay(600);
        const el = document.createElement('div');
        el.className = 'apology-text';
        const leftPct = randomBetween(5, 65);
        const duration = randomBetween(6, 10);
        const itemDelay = randomBetween(0, 0.5);
        el.textContent = texts[i];
        el.style.cssText = `
      left: ${leftPct}%;
      top: -40px;
      --duration: ${duration}s;
      --delay: ${itemDelay}s;
    `;
        container.appendChild(el);
        setTimeout(() => el.remove(), (duration + itemDelay + 1) * 1000);
    }

    // Tunggu semua teks selesai berjatuhan
    await delay(texts.length * 600 + 2500);

    // 1) MAAF fade out dulu
    title.style.transition = 'opacity 1s ease';
    title.style.opacity = '0';
    await delay(1200);

    // 2) Baru muncul emot 🙏
    pray.style.transition = 'opacity 1s ease';
    pray.style.opacity = '1';
    await delay(2500);

    // 3) 🙏 fade out
    pray.style.opacity = '0';
    await delay(1200);

    showScene('scene-tali');
    setTimeout(initTali, 800);
}

// ── SCENE TALI ────────────────────────────────
function initTali() {
    const container = document.getElementById('rope-container');
    // Reveal overlay: ditaruh di bawah rope, tersembunyi awalnya
    // Akan menutupi dari atas saat user drag ke bawah (efek tirai turun)
    let revealOverlay = document.getElementById('tali-reveal-overlay');
    if (!revealOverlay) {
        revealOverlay = document.createElement('div');
        revealOverlay.id = 'tali-reveal-overlay';
        revealOverlay.style.cssText = `
            position:absolute;
            inset:0;
            background: linear-gradient(to bottom, rgba(255,180,210,0.08) 0%, rgba(26,8,18,0.95) 100%);
            z-index:2;
            transform:translateY(-100%);
            transition:transform 0.15s ease;
            pointer-events:none;
        `;
        document.getElementById('app').appendChild(revealOverlay);
    }

    let isDragging = false;
    let startY = 0;
    let dragDist = 0;
    const THRESHOLD = 100;

    function onStart(e) {
        isDragging = true;
        startY = (e.touches ? e.touches[0].clientY : e.clientY);
        // Pause swing while dragging
        container.style.animationPlayState = 'paused';
    }

    function onMove(e) {
        if (!isDragging) return;
        const y = (e.touches ? e.touches[0].clientY : e.clientY);
        dragDist = Math.max(0, y - startY);
        const progress = Math.min(dragDist / THRESHOLD, 1);

        // Rope stretches down
        container.style.transform = `translateY(${dragDist * 0.4}px) scaleY(${1 + progress * 0.12})`;

        // Overlay slides in from top (tirai terbuka dari atas)
        revealOverlay.style.transform = `translateY(${-100 + progress * 100}%)`;
    }

    async function onEnd(e) {
        if (!isDragging) return;
        isDragging = false;

        if (dragDist >= THRESHOLD) {
            // Tirai jatuh menutupi layar sepenuhnya
            playSound('assets/audio/sfx_rope.mp3', 0.8);
            revealOverlay.style.transition = 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
            revealOverlay.style.transform = 'translateY(0%)';

            // Tunggu tirai tertutup penuh sebelum pindah scene
            await delay(600);
            showScene('scene-photos');
            startPhotoExplosion();

            // Biarkan tirai terus jatuh ke bawah dan menghilang (Kain Jatuh)
            await delay(100);
            revealOverlay.style.transition = 'transform 0.8s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.8s ease';
            revealOverlay.style.transform = 'translateY(100%)';
            revealOverlay.style.opacity = '0';
            setTimeout(() => revealOverlay.remove(), 800);
        } else {
            // Snap back
            container.style.transition = 'transform 0.4s cubic-bezier(0.36, 0.07, 0.19, 0.97)';
            container.style.transform = '';
            revealOverlay.style.transition = 'transform 0.4s ease';
            revealOverlay.style.transform = 'translateY(-100%)';
            setTimeout(() => {
                container.style.transition = '';
                container.style.animationPlayState = 'running';
            }, 400);
            dragDist = 0;
        }
    }

    container.addEventListener('mousedown', onStart);
    container.addEventListener('touchstart', onStart, { passive: true });
    document.addEventListener('mousemove', onMove);
    document.addEventListener('touchmove', onMove, { passive: false });
    document.addEventListener('mouseup', onEnd);
    document.addEventListener('touchend', onEnd);
}

// ── SCENE LEDAKAN FOTO ───────────────────────
let photoLoopRunning = false;

async function startPhotoExplosion() {
    const container = document.getElementById('photos-container');
    const text = document.getElementById('photos-text');
    const btn = document.getElementById('photos-btn');

    const photos = [];
    for (let i = 1; i <= 15; i++) {
        photos.push(`assets/images/couple/photo_${String(i).padStart(2, '0')}`);
    }

    const sizes = [80, 100, 120, 90, 110, 85, 115, 95, 105, 88, 118, 98, 92, 107, 82];
    const cols = [5, 15, 28, 42, 56, 68, 78, 20, 35, 50, 62, 72, 10, 45, 82];

    const placeholderColors = [
        ['#FF6B9D', '#C73B6B'], ['#FF8E9E', '#E05080'], ['#FFB3D1', '#FF6B9D'],
        ['#C73B6B', '#8B0040'], ['#FF4D8C', '#CC1A5C'], ['#FFD6E7', '#FF6B9D'],
        ['#E8547A', '#B02055'], ['#FF7EAA', '#D94070'], ['#FFA0C0', '#E06090'],
        ['#FF5590', '#BB1050'], ['#DD3366', '#990033'], ['#FF99BB', '#DD4477'],
        ['#EE6699', '#AA2255'], ['#FFBBCC', '#EE5588'], ['#CC3355', '#881122'],
    ];
    const icons = ['📸', '💕', '🌸', '💗', '✨', '💖', '🎞️', '💓', '🌹', '💝'];

    // Buat placeholder sekali, simpan ke array
    const placeholders = photos.map((_, i) => {
        const [c1, c2] = placeholderColors[i % placeholderColors.length];
        const icon = icons[i % icons.length];
        const num = String(i + 1).padStart(2, '0');
        return `data:image/svg+xml,${encodeURIComponent(
            `<svg xmlns="http://www.w3.org/2000/svg" width="120" height="180">` +
            `<defs><linearGradient id="pg${i}" x1="0" y1="0" x2="1" y2="1">` +
            `<stop offset="0%" stop-color="${c1}"/><stop offset="100%" stop-color="${c2}"/>` +
            `</linearGradient></defs>` +
            `<rect width="120" height="180" fill="url(#pg${i})" rx="6"/>` +
            `<text x="60" y="88" font-size="36" text-anchor="middle" dominant-baseline="middle">${icon}</text>` +
            `<text x="60" y="136" font-size="12" text-anchor="middle" fill="rgba(255,255,255,0.75)" font-family="sans-serif">Photo ${num}</text>` +
            `</svg>`
        )}`;
    });

    function spawnPhoto() {
        if (!photoLoopRunning) return;

        // Pilih random dari daftar foto
        const i = Math.floor(Math.random() * photos.length);
        const el = document.createElement('div');
        const size = sizes[i % sizes.length];

        // Posisi horizontal acak penuh (bukan fix ke cols tertentu)
        const leftPct = randomBetween(2, 80);
        const rotZ = randomBetween(-30, 30);
        const rotZEnd = randomBetween(-20, 20);
        const rotY = randomBetween(-25, 25);
        const rotYEnd = randomBetween(-35, 35);
        const fallDur = randomBetween(7, 11); // sedikit diperlambat

        el.className = 'falling-photo';
        el.style.cssText = `
            width:${size}px;
            aspect-ratio:2/3;
            left:${leftPct}%;
            --rot:${rotZ}deg;
            --rot-end:${rotZEnd}deg;
            --roty:${rotY}deg;
            --roty-end:${rotYEnd}deg;
            animation:photoFall ${fallDur}s ease-in-out both;
        `;
        el.innerHTML = `<img src="${photos[i]}.jpg" onerror="if(!this.dataset.tried){this.dataset.tried='1'; this.src='${photos[i]}.jpeg';} else {this.src='${placeholders[i]}';}"/>`;
        container.appendChild(el);

        // Hapus setelah animasi selesai
        setTimeout(() => { if (el.parentNode) el.remove(); }, (fallDur + 1) * 1000);

        // Jadwalkan foto berikutnya — lebih cepat agar layar tidak kosong (0.6 – 1.2 detik)
        const nextIn = randomBetween(600, 1200);
        setTimeout(spawnPhoto, nextIn);
    }

    // Start loop
    photoLoopRunning = true;

    // Spawn awal 3 foto berurutan agar langsung ramai
    spawnPhoto();
    setTimeout(spawnPhoto, 400);
    setTimeout(spawnPhoto, 800);

    // Show text after photos start
    await delay(1500);
    text.classList.add('visible');

    // Show button after 5 seconds
    await delay(5000);
    btn.style.opacity = '1';

}


// ──  LETTER / FINALE ──────────────────────────
function initLetter() {
    // Populate collage
    const collage = document.getElementById('letter-collage');
    for (let i = 1; i <= 12; i++) {
        const img = document.createElement('img');
        img.src = `assets/images/couple/photo_${String(i).padStart(2, '0')}.jpg`;
        img.alt = '';
        img.onerror = function () { this.src = 'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs='; };
        collage.appendChild(img);
    }
}

async function openEnvelope() {
    const body = document.getElementById('envelope-body');
    const envelopeScene = document.getElementById('envelope-scene');
    const letterContent = document.getElementById('letter-content');

    // Open flap
    body.classList.add('opened');
    await delay(700);

    // Fade out envelope, show letter
    envelopeScene.style.transition = 'opacity 0.5s ease';
    envelopeScene.style.opacity = '0';
    await delay(500);
    envelopeScene.style.display = 'none';

    letterContent.classList.add('visible');
    await delay(500);

    // Type the letter
    await typeLetter();
}

async function typeLetter() {
    const textEl = document.getElementById('letter-text');
    const cursor = document.getElementById('letter-cursor');
    const btnReply = document.getElementById('btn-reply');
    const letter = CONFIG.letterContent;
    const SPEED = 28; // ms per character

    textEl.textContent = '';
    cursor.style.display = 'inline-block';

    for (let i = 0; i < letter.length; i++) {
        textEl.textContent += letter[i];
        // Scroll letter paper as text grows
        const paper = textEl.closest('.letter-paper');
        if (paper) paper.scrollTop = paper.scrollHeight;
        // Vary speed at punctuation
        let waitTime = SPEED;
        if (['.', '!', '?', '\n'].includes(letter[i])) waitTime = SPEED * 6;
        else if ([',', '—'].includes(letter[i])) waitTime = SPEED * 3;
        await delay(waitTime);
    }

    // Done typing
    cursor.style.display = 'none';

    // Show reply button
    btnReply.style.opacity = '1';
    btnReply.style.pointerEvents = 'all';
}

async function replyLetter() {
    const overlay = document.getElementById('redirect-overlay');
    overlay.classList.add('active');

    await delay(2500);
    const waUrl = `https://wa.me/${CONFIG.whatsappNumber}?text=Haii%20sayang%2C%20aku%20udah%20baca%20suratnya%20%F0%9F%A5%BA%F0%9F%92%95`;
    window.location.href = waUrl;
}
