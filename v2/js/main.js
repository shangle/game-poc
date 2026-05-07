/**
 * RETRO ENGINE V2 - MAIN ENTRY POINT
 */

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

    // Event Listeners
    titleScreen.addEventListener('start-game', () => {
        titleScreen.classList.add('hidden');
        hud.classList.remove('hidden');
        gameEngine.startLevel(0);
    });

    titleScreen.addEventListener('select-level', (e) => {
        titleScreen.classList.add('hidden');
        hud.classList.remove('hidden');
        gameEngine.startLevel(e.detail.index);
    });

    document.addEventListener('level-clear', (e) => {
        localStorage.setItem('retroQuest_unlocked', 'true');
        checkLevelSelector();
    });

    document.addEventListener('game-win', (e) => {
        localStorage.setItem('retroQuest_unlocked', 'true');
        checkLevelSelector();
        hud.classList.add('hidden');
        winOverlay.classList.remove('hidden');
        document.getElementById('final-score').innerText = e.detail.score;
    });

    document.addEventListener('game-over', () => {
        hud.classList.add('hidden');
        overOverlay.classList.remove('hidden');
    });

    // Helper to restart
    window.restartGame = () => {
        winOverlay.classList.add('hidden');
        overOverlay.classList.add('hidden');
        titleScreen.classList.remove('hidden');
        gameEngine.player.hp = 100;
        gameEngine.player.score = 0;
        gameEngine.updateHUD();
    };
});
