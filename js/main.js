/**
 * UI STATE MANAGER (SINGLE SOURCE OF TRUTH)
 */
function setUIMode(mode) {
    console.log("Setting UI Mode:", mode);
    const screens = {
        'TITLE': document.getElementById('boot-screen'),
        'EDITOR': document.getElementById('editor-sidebar'),
        'GAME': document.getElementById('game-container')
    };

    // Hide all first
    Object.values(screens).forEach(el => {
        if (el) el.classList.add('hidden');
        if (el && el.id === 'boot-screen') el.style.display = 'none'; // Overriding default flex
    });

    // Show active one
    const active = screens[mode];
    if (active) {
        active.classList.remove('hidden');
        if (mode === 'TITLE') active.style.display = 'flex';
        else if (mode === 'GAME') active.style.display = 'block';
    }

    // Contextual UI
    const mobileHud = document.getElementById('mobile-controls');
    const pauseBtn = document.getElementById('btn-pause');
    
    if (mode === 'GAME') {
        if (pauseBtn) pauseBtn.classList.remove('hidden');
        if (mobileHud && isTouchDevice) mobileHud.style.display = 'flex';
    } else {
        if (pauseBtn) pauseBtn.classList.add('hidden');
        if (mobileHud) mobileHud.style.display = 'none';
    }
}

/**
 * BOOT & MAIN LOGIC
 */
function showTitleScreen() {
    setUIMode('TITLE');
    if (typeof gameActive !== 'undefined') gameActive = false;
    if (typeof AudioEngine !== 'undefined') AudioEngine.stopMusic();
    if (typeof animationFrameId !== 'undefined' && animationFrameId) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
    }
}

function playDemo() {
    initDemoMap();
    startGameEngine();
}

function openEditor() {
    initDemoMap();
    setUIMode('EDITOR');
    renderUI();
}

if(window.location.hash) {
    try {
        const b64 = window.location.hash.substring(1);
        gameData = JSON.parse(decodeURIComponent(atob(b64)));
        setTimeout(() => { 
            startGameEngine(); 
        }, 500);
    } catch(e) { console.error("Could not load from URL"); }
}
