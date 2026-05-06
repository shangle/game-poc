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
    GameEngine.init(gameContainer);
    GameEngine.loadCartridge(Cartridge);

    // Event Listeners
    titleScreen.addEventListener('start-game', () => {
        titleScreen.classList.add('hidden');
        hud.classList.remove('hidden');
        GameEngine.startLevel(0);
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
        GameEngine.player.hp = 100;
        GameEngine.player.score = 0;
        GameEngine.updateHUD();
    };
});
