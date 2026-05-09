/**
 * RETRO ENGINE V2 - MAIN ENTRY POINT
 */

document.addEventListener('DOMContentLoaded', () => {
    const titleScreen = document.querySelector('game-title-screen');
    const gameContainer = document.getElementById('game-canvas-container');
    const hud = document.getElementById('hud');
    const winOverlay = document.getElementById('win-overlay');
    const overOverlay = document.getElementById('over-overlay');
    const touchControls = document.getElementById('touch-controls');

    // Initialize Engine
    gameEngine.init(gameContainer);
    gameEngine.loadCartridge(Cartridge);

    const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

    const checkLevelSelector = () => {
        if (localStorage.getItem('retroQuest_unlocked')) {
            titleScreen.setAttribute('unlocked', 'true');
        }
    };
    checkLevelSelector();

    const showInGameUI = () => {
        if (hud) hud.style.display = 'flex';
        if (isTouch && touchControls) touchControls.style.display = 'flex';
    };

    const hideInGameUI = () => {
        if (hud) hud.style.display = 'none';
        if (touchControls) touchControls.style.display = 'none';
    };

    // Event Listeners
    const onStartGame = () => {
        titleScreen.classList.add('hidden');
        showInGameUI();
        gameEngine.startLevel(0);
    };

    const onSelectLevel = (e) => {
        titleScreen.classList.add('hidden');
        showInGameUI();
        gameEngine.startLevel(e.detail.index);
    };

    document.addEventListener('start-game', onStartGame);
    document.addEventListener('select-level', onSelectLevel);

    document.addEventListener('level-clear', (e) => {
        localStorage.setItem('retroQuest_unlocked', 'true');
        checkLevelSelector();
    });

    document.addEventListener('game-win', (e) => {
        localStorage.setItem('retroQuest_unlocked', 'true');
        checkLevelSelector();
        hideInGameUI();
        if (winOverlay) winOverlay.classList.remove('hidden');
        const scoreEl = document.getElementById('final-score');
        if (scoreEl) scoreEl.innerText = e.detail.score;
    });

    document.addEventListener('game-over', () => {
        hideInGameUI();
        if (overOverlay) overOverlay.classList.remove('hidden');
    });

    // Helper to restart
    window.restartGame = () => {
        if (winOverlay) winOverlay.classList.add('hidden');
        if (overOverlay) overOverlay.classList.add('hidden');
        hideInGameUI();
        if (titleScreen) titleScreen.classList.remove('hidden');

        if (window.gameEngine) {
            window.gameEngine.player.hp = 100;
            window.gameEngine.player.score = 0;
            window.gameEngine.updateHUD();
        }
    };

    // Touch Support Logic
    if (isTouch && touchControls) {
        const base = document.getElementById('joystick-base');
        const knob = document.getElementById('joystick-knob');
        const fireBtn = document.getElementById('touch-fire-btn');

        const handleTouch = (e) => {
            const b = base.getBoundingClientRect();
            const centerX = b.left + b.width/2;
            const centerY = b.top + b.height/2;
            const t = e.touches[0];
            const dx = t.clientX - centerX;
            const dy = t.clientY - centerY;
            const dist = Math.min(40, Math.sqrt(dx*dx + dy*dy));
            const angle = Math.atan2(dy, dx);
            
            const lx = Math.cos(angle) * dist;
            const ly = Math.sin(angle) * dist;
            knob.style.transform = `translate(${lx}px, ${ly}px)`;
            
            // Map to movement
            gameEngine.keys.w = dy < -15;
            gameEngine.keys.s = dy > 15;
            gameEngine.keys.a = dx < -15;
            gameEngine.keys.d = dx > 15;
        };

        base.addEventListener('touchstart', handleTouch);
        base.addEventListener('touchmove', (e) => {
            e.preventDefault();
            handleTouch(e);
        });
        base.addEventListener('touchend', () => {
            knob.style.transform = 'translate(0,0)';
            gameEngine.keys.w = gameEngine.keys.a = gameEngine.keys.s = gameEngine.keys.d = false;
        });

        fireBtn.addEventListener('touchstart', (e) => {
            e.preventDefault();
            gameEngine.shoot();
        });
    }
});
