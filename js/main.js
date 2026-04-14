/**
 * BOOT & MAIN LOGIC
 */
function showTitleScreen() {
    // Hide everything
    document.getElementById('boot-screen').style.display = 'flex';
    document.getElementById('editor-sidebar').classList.add('hidden');
    document.getElementById('game-container').style.display = 'none';
    document.getElementById('mobile-controls').style.display = 'none';
    
    // Stop engine and music
    if (typeof gameActive !== 'undefined') gameActive = false;
    if (typeof AudioEngine !== 'undefined') AudioEngine.stopMusic();
    if (typeof animationFrameId !== 'undefined' && animationFrameId) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
    }
}

function playDemo() {
    initDemoMap();
    document.getElementById('boot-screen').style.display = 'none';
    startGameEngine();
}

function openEditor() {
    initDemoMap();
    document.getElementById('boot-screen').style.display = 'none';
    document.getElementById('editor-sidebar').classList.remove('hidden');
    renderUI();
}

if(window.location.hash) {
    try {
        const b64 = window.location.hash.substring(1);
        gameData = JSON.parse(decodeURIComponent(atob(b64)));
        // Auto boot directly to play mode if loaded via URL
        setTimeout(() => { 
            const bootScreen = document.getElementById('boot-screen');
            if (bootScreen) bootScreen.style.display='none'; 
            startGameEngine(); 
        }, 500);
    } catch(e) { console.error("Could not load from URL"); }
}
