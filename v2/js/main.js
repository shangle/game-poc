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

    // Event Listeners
    titleScreen.addEventListener('start-game', () => {
        titleScreen.classList.add('hidden');
        hud.classList.remove('hidden');
        gameEngine.startLevel(0);
    });

    document.addEventListener('game-win', (e) => {
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
