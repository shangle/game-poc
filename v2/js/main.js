/**
 * RETRO ENGINE V2 - MAIN ENTRY POINT
 */

// Define global helpers outside scope for test accessibility
window.restartGame = () => {
    const winOverlay = document.getElementById('win-overlay');
    const overOverlay = document.getElementById('over-overlay');
    const hud = document.getElementById('hud');
    const titleScreen = document.querySelector('game-title-screen');

    if (winOverlay) winOverlay.classList.add('hidden');
    if (overOverlay) overOverlay.classList.add('hidden');
    if (hud) hud.style.display = 'none';
    if (titleScreen) titleScreen.classList.remove('hidden');

    if (window.gameEngine) {
        window.gameEngine.player.hp = 100;
        window.gameEngine.player.score = 0;
        window.gameEngine.updateHUD();
    }
};

document.addEventListener('DOMContentLoaded', () => {
    const titleScreen = document.querySelector('game-title-screen');
    const gameContainer = document.getElementById('game-canvas-container');
    const hud = document.getElementById('hud');
    const winOverlay = document.getElementById('win-overlay');
    const overOverlay = document.getElementById('over-overlay');

    // Initialize Engine
    gameEngine.init(gameContainer);
    gameEngine.loadCartridge(Cartridge);

    const checkLevelSelector = () => {
        if (localStorage.getItem('retroQuest_unlocked')) {
            titleScreen.setAttribute('unlocked', 'true');
        }
    };
    checkLevelSelector();

    // Event Listeners - Attach to titleScreen directly as a fallback
    const startGame = () => {
        console.log("Main: start-game executed");
        if (titleScreen) titleScreen.classList.add('hidden');
        if (hud) hud.style.display = 'flex';
        gameEngine.startLevel(0);
    };

    const selectLevel = (e) => {
        console.log("Main: select-level executed", e.detail.index);
        if (titleScreen) titleScreen.classList.add('hidden');
        if (hud) hud.style.display = 'flex';
        gameEngine.startLevel(e.detail.index);
    };

    // Try multiple ways to capture the events
    document.addEventListener('start-game', startGame);
    document.addEventListener('select-level', selectLevel);
    
    if (titleScreen) {
        titleScreen.addEventListener('start-game', startGame);
        titleScreen.addEventListener('select-level', selectLevel);
    }

    document.addEventListener('level-clear', (e) => {
        localStorage.setItem('retroQuest_unlocked', 'true');
        checkLevelSelector();
    });

    document.addEventListener('game-win', (e) => {
        localStorage.setItem('retroQuest_unlocked', 'true');
        checkLevelSelector();
        if (hud) hud.style.display = 'none';
        if (winOverlay) winOverlay.classList.remove('hidden');
        const scoreEl = document.getElementById('final-score');
        if (scoreEl) scoreEl.innerText = e.detail.score;
    });

    document.addEventListener('game-over', () => {
        if (hud) hud.style.display = 'none';
        if (overOverlay) overOverlay.classList.remove('hidden');
    });
});
