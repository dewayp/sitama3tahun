// =============================================
//  GAMES.JS – Game 1 & Game 2 Logic
// =============================================

// ══════════════════════════════════════════════
//  GAME 1 – TANGKAP HATI
// ══════════════════════════════════════════════

let game1Count = 0;
const GAME1_TARGET = 7;
let game1Hearts = [];
let game1AnimFrame = null;
let game1Running = false;

function startGame1() {
    game1Count = 0;
    game1Hearts = [];
    game1Running = true;
    updateGame1Counter();

    const arena = document.getElementById('game1-arena');
    arena.innerHTML = '';

    // Spawn hearts over time
    let spawned = 0;
    const maxHearts = 10;

    function spawnHeart() {
        if (!game1Running || spawned >= maxHearts) return;
        const heart = createFlyingHeart();
        arena.appendChild(heart);
        game1Hearts.push(heart);
        spawned++;
        // Spawn more if under cap
        setTimeout(() => {
            if (game1Running && game1Hearts.length < 6) spawnHeart();
        }, randomBetween(800, 2000));
    }

    // Initial spawn
    for (let i = 0; i < 4; i++) {
        setTimeout(spawnHeart, i * 400);
    }

    // Keep spawning
    const spawnInterval = setInterval(() => {
        if (!game1Running) { clearInterval(spawnInterval); return; }
        if (game1Hearts.length < 5) spawnHeart();
    }, 1200);
}

function createFlyingHeart() {
    const arena = document.getElementById('game1-arena');
    const w = arena.offsetWidth || 360;
    const h = arena.offsetHeight || 600;

    const el = document.createElement('div');
    el.className = 'flying-heart';
    el.textContent = ['❤️', '💕', '💗', '💓'][Math.floor(Math.random() * 4)];

    // Random starting position
    let x = randomBetween(20, w - 60);
    let y = randomBetween(20, h - 80);
    let vx = randomBetween(1.5, 3.5) * (Math.random() > 0.5 ? 1 : -1);
    let vy = randomBetween(1.5, 3.5) * (Math.random() > 0.5 ? 1 : -1);

    el.style.left = x + 'px';
    el.style.top = y + 'px';
    el.style.fontSize = randomBetween(1.4, 2.4) + 'rem';

    // Click/touch to catch
    el.addEventListener('click', (e) => catchHeart(e, el));
    el.addEventListener('touchstart', (e) => catchHeart(e, el), { passive: true });

    // Animation loop
    const size = parseFloat(el.style.fontSize) * 16;

    function move() {
        if (!game1Running || !el.parentNode) return;
        x += vx;
        y += vy;

        // Bounce off walls
        if (x <= 0) { x = 0; vx = Math.abs(vx); }
        if (x >= w - size) { x = w - size; vx = -Math.abs(vx); }
        if (y <= 0) { y = 0; vy = Math.abs(vy); }
        if (y >= h - size) { y = h - size; vy = -Math.abs(vy); }

        el.style.left = x + 'px';
        el.style.top = y + 'px';
        el._rafId = requestAnimationFrame(move);
    }

    el._rafId = requestAnimationFrame(move);
    el._data = { x, y, vx, vy };
    return el;
}

function catchHeart(e, el) {
    if (!game1Running || el._caught) return;
    el._caught = true;
    cancelAnimationFrame(el._rafId);
    playSound('assets/audio/sfx_pop.mp3', 0.7);

    // Explosion particles
    const rect = el.getBoundingClientRect();
    const arenaRect = document.getElementById('game1-arena').getBoundingClientRect();
    explodeHeart(rect.left - arenaRect.left, rect.top - arenaRect.top);

    // Remove from DOM and array
    el.remove();
    game1Hearts = game1Hearts.filter(h => h !== el);

    game1Count++;
    updateGame1Counter();
    showGame1Feedback();

    if (game1Count >= GAME1_TARGET) {
        game1Running = false;
        game1Hearts.forEach(h => cancelAnimationFrame(h._rafId));
        setTimeout(() => {
            document.getElementById('game1-complete').classList.add('active');
        }, 800);
    }
}

function explodeHeart(x, y) {
    const arena = document.getElementById('game1-arena');
    const emojis = ['💥', '💕', '✨', '❤️'];
    const colors = ['#FF6B9D', '#FFB3D1', '#FF4488', '#FF80B0'];

    for (let i = 0; i < 10; i++) {
        const p = document.createElement('div');
        p.className = 'particle-dot';
        const angle = (i / 10) * Math.PI * 2;
        const dist = randomBetween(30, 80);
        const tx = Math.cos(angle) * dist + 'px';
        const ty = Math.sin(angle) * dist + 'px';
        p.style.cssText = `
      left: ${x + 20}px;
      top: ${y + 10}px;
      background: ${colors[Math.floor(Math.random() * colors.length)]};
      --tx: ${tx};
      --ty: ${ty};
      width: ${randomBetween(4, 9)}px;
      height: ${randomBetween(4, 9)}px;
    `;
        arena.appendChild(p);
        setTimeout(() => p.remove(), 700);
    }

    // Emoji pop
    const pop = document.createElement('div');
    pop.style.cssText = `
    position:absolute;
    left:${x - 10}px;
    top:${y - 20}px;
    font-size:1.8rem;
    pointer-events:none;
    animation:fadeInScale 0.3s ease forwards;
    z-index:8;
  `;
    pop.textContent = emojis[Math.floor(Math.random() * emojis.length)];
    arena.appendChild(pop);
    setTimeout(() => pop.remove(), 700);
}

function showGame1Feedback() {
    const feedbacks = CONFIG.catchTexts;
    const msg = feedbacks[Math.floor(Math.random() * feedbacks.length)];

    const el = document.createElement('div');
    el.className = 'game1-feedback';
    el.textContent = msg;
    document.getElementById('scene-game1').appendChild(el);

    setTimeout(() => {
        el.style.transition = 'opacity 0.5s ease';
        el.style.opacity = '0';
        setTimeout(() => el.remove(), 600);
    }, 1200);
}

function updateGame1Counter() {
    const el = document.getElementById('game1-counter');
    if (el) el.textContent = `${game1Count} / ${GAME1_TARGET}`;
}

// ══════════════════════════════════════════════
//  GAME 2 – DRAG & DROP KENANGAN
// ══════════════════════════════════════════════

const GAME2_DATA = [
    { year: '2023', baseSrc: 'assets/images/memories/mem_2023_01', id: 'card-2023' },
    { year: '2024', baseSrc: 'assets/images/memories/mem_2024_01', id: 'card-2024' },
    { year: '2025', baseSrc: 'assets/images/memories/mem_2025_01', id: 'card-2025' },
];

let game2Solved = {};
let game2Active = null;
let game2OffsetX = 0, game2OffsetY = 0;
let game2Clone = null;
let game2SolvedCount = 0;

function initGame2() {
    game2Solved = {};
    game2SolvedCount = 0;
    const cardContainer = document.getElementById('game2-cards');
    cardContainer.innerHTML = '';

    // Shuffle cards
    const shuffled = [...GAME2_DATA].sort(() => Math.random() - 0.5);

    shuffled.forEach(data => {
        const card = document.createElement('div');
        card.className = 'memory-card';
        card.id = data.id;
        card.dataset.year = data.year;
        const svgPlaceholder = `data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2290%22 height=%22120%22><rect fill=%22%23FF6B9D22%22 width=%2290%22 height=%22120%22/><text x=%2245%22 y=%2270%22 font-size=%2213%22 fill=%22%23FF6B9D%22 text-anchor=%22middle%22>${data.year}</text></svg>`;
        card.innerHTML = `
      <img src="${data.baseSrc}.jpg" alt="${data.year}" onerror="if(!this.dataset.tried){this.dataset.tried='1'; this.src='${data.baseSrc}.jpeg';} else if(this.dataset.tried==='1'){this.dataset.tried='2'; this.src='${data.baseSrc}.JPG';} else {this.src='${svgPlaceholder}';}" />
      <div class="card-year-hint"></div>
    `;
        setupDrag(card);
        cardContainer.appendChild(card);
    });

    // Setup drop zones
    document.querySelectorAll('.year-box').forEach(box => {
        box.addEventListener('dragover', (e) => e.preventDefault());
        box.dataset.occupied = 'false';
    });
}

function setupDrag(card) {
    // Touch events (mobile)
    card.addEventListener('touchstart', onTouchStart, { passive: true });
    card.addEventListener('mousedown', onMouseDown);
}

function onTouchStart(e) {
    if (game2Solved[this.dataset.year]) return;
    const touch = e.touches[0];
    startDrag(this, touch.clientX, touch.clientY);
}

function onMouseDown(e) {
    if (game2Solved[this.dataset.year]) return;
    e.preventDefault();
    startDrag(this, e.clientX, e.clientY);
}

function startDrag(card, clientX, clientY) {
    if (game2Active) return;
    game2Active = card;
    card.classList.add('dragging');

    const rect = card.getBoundingClientRect();
    game2OffsetX = clientX - rect.left;
    game2OffsetY = clientY - rect.top;

    // Create floating clone
    game2Clone = card.cloneNode(true);
    game2Clone.style.cssText = `
    position:fixed;
    width:${rect.width}px;
    height:${rect.height}px;
    left:${rect.left}px;
    top:${rect.top}px;
    pointer-events:none;
    z-index:1000;
    opacity:0.92;
    transform:scale(1.1) rotate(4deg);
    border-radius:10px;
    overflow:hidden;
    box-shadow:0 12px 40px rgba(255,107,157,0.5);
    transition:transform 0.1s ease;
  `;
    document.getElementById('app').appendChild(game2Clone);

    document.addEventListener('touchmove', onTouchMove, { passive: false });
    document.addEventListener('touchend', onTouchEnd);
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
}

function onTouchMove(e) {
    e.preventDefault();
    if (!game2Clone) return;
    const touch = e.touches[0];
    moveClone(touch.clientX, touch.clientY);
    highlightDropZone(touch.clientX, touch.clientY);
}

function onMouseMove(e) {
    if (!game2Clone) return;
    moveClone(e.clientX, e.clientY);
    highlightDropZone(e.clientX, e.clientY);
}

function moveClone(x, y) {
    game2Clone.style.left = (x - game2OffsetX) + 'px';
    game2Clone.style.top = (y - game2OffsetY) + 'px';
}

function onTouchEnd(e) {
    const touch = e.changedTouches[0];
    endDrag(touch.clientX, touch.clientY);
}

function onMouseUp(e) { endDrag(e.clientX, e.clientY); }

function highlightDropZone(x, y) {
    document.querySelectorAll('.year-box').forEach(box => {
        box.classList.remove('drag-over');
        const rect = box.getBoundingClientRect();
        if (x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom) {
            if (box.dataset.occupied !== 'true') box.classList.add('drag-over');
        }
    });
}

async function endDrag(x, y) {
    if (!game2Active) return;

    document.removeEventListener('touchmove', onTouchMove);
    document.removeEventListener('touchend', onTouchEnd);
    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);

    const card = game2Active;
    game2Active = null;
    card.classList.remove('dragging');

    if (game2Clone) { game2Clone.remove(); game2Clone = null; }

    document.querySelectorAll('.year-box').forEach(b => b.classList.remove('drag-over'));

    // Check which drop zone
    let dropped = null;
    document.querySelectorAll('.year-box').forEach(box => {
        const rect = box.getBoundingClientRect();
        if (x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom) {
            dropped = box;
        }
    });

    if (!dropped) return; // Dropped nowhere

    const cardYear = card.dataset.year;
    const boxYear = dropped.dataset.year;

    if (cardYear === boxYear && dropped.dataset.occupied !== 'true') {
        // CORRECT!
        playSound('assets/audio/sfx_correct.mp3', 0.8);
        dropped.dataset.occupied = 'true';
        game2Solved[cardYear] = true;
        game2SolvedCount++;

        // Place photo in box
        const img = document.createElement('img');
        img.src = card.querySelector('img').src;
        img.className = 'placed-photo';
        img.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;object-fit:cover;border-radius:10px;animation:fadeInScale 0.4s ease';
        dropped.insertBefore(img, dropped.firstChild);
        dropped.classList.add('correct');

        // Hide original card
        card.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
        card.style.opacity = '0';
        card.style.transform = 'scale(0.8)';
        setTimeout(() => card.remove(), 350);

        // Spawn sparkles on box
        for (let i = 0; i < 6; i++) {
            setTimeout(() => {
                const sp = document.createElement('span');
                sp.textContent = ['✨', '💕', '🌸'][Math.floor(Math.random() * 3)];
                sp.style.cssText = `
          position:absolute;
          left:${randomBetween(10, 80)}%;
          top:${randomBetween(10, 80)}%;
          font-size:${randomBetween(0.8, 1.4)}rem;
          pointer-events:none;
          animation:sparkle 1.2s ease forwards;
          z-index:5;
        `;
                dropped.appendChild(sp);
                setTimeout(() => sp.remove(), 1300);
            }, i * 150);
        }

        // Check if all solved
        if (game2SolvedCount >= 3) {
            await delay(1200);

            // Tampilkan 2026 langsung di bawah
            const revealContainer = document.getElementById('game2-reveal');
            if (revealContainer) {
                revealContainer.style.opacity = '1';
                revealContainer.style.transform = 'translateY(0) scale(1)';
                playSound('assets/audio/sfx_correct.mp3', 0.5);

                // Add mini hearts floating from bottom of the reveal
                for (let i = 0; i < 12; i++) {
                    setTimeout(() => {
                        const heart = document.createElement('div');
                        heart.textContent = ['❤️', '💕', '🌸'][Math.floor(Math.random() * 3)];
                        heart.style.cssText = `
                            position:absolute;
                            left:${randomBetween(30, 70)}%;
                            bottom:20%;
                            font-size:${randomBetween(0.8, 1.5)}rem;
                            animation:floatHeart ${randomBetween(2, 4)}s ease-in-out forwards;
                            pointer-events:none;
                            z-index:10;
                        `;
                        revealContainer.appendChild(heart);
                        setTimeout(() => heart.remove(), 4000);
                    }, i * 300);
                }

                await delay(4500); // Waktu untuk baca dan lihat efek sparkle
            }

            // Advance to MAAF
            showScene('scene-maaf');
            setTimeout(startMaaf, 800);
        }
    } else {
        // WRONG – snap back
        playSound('assets/audio/sfx_wrong.mp3', 0.7);
        card.style.transition = 'transform 0.5s cubic-bezier(0.36, 0.07, 0.19, 0.97)';
        card.style.transform = 'translateX(-8px) rotate(-2deg)';
        setTimeout(() => {
            card.style.transform = 'translateX(8px) rotate(2deg)';
            setTimeout(() => {
                card.style.transform = '';
            }, 120);
        }, 100);

        showGame2Wrong(CONFIG.wrongMessage);
    }
}

function showGame2Wrong(msg) {
    const el = document.getElementById('g2-wrong-msg');
    el.textContent = msg;
    el.style.opacity = '1';
    setTimeout(() => { el.style.opacity = '0'; }, 2000);
}
