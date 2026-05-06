const fs = require('fs');
const path = require('path');

// Read the state.js file
const stateJsPath = path.join(__dirname, '../js/state.js');
const stateJsContent = fs.readFileSync(stateJsPath, 'utf8');

// Safely evaluate state.js
let context = {};
try {
    eval(stateJsContent + `
        context.GRID_SIZE = typeof GRID_SIZE !== 'undefined' ? GRID_SIZE : null;
        context.ID_EMPTY = typeof ID_EMPTY !== 'undefined' ? ID_EMPTY : null;
        context.ID_PLAYER = typeof ID_PLAYER !== 'undefined' ? ID_PLAYER : null;
        context.ID_GOAL = typeof ID_GOAL !== 'undefined' ? ID_GOAL : null;
        context.gamePack = typeof gamePack !== 'undefined' ? gamePack : null;
    `);
} catch(e) {
    console.error("Error evaluating state.js:", e);
}

describe('Game State Management (GamePack)', () => {
    test('Initial gamePack should have metadata and levels', () => {
        expect(context.gamePack).toBeDefined();
        expect(context.gamePack.levels.length).toBeGreaterThan(0);
    });

    test('Initial level should have correct grid dimensions', () => {
        const level = context.gamePack.levels[0];
        expect(level.map.floors.length).toBe(14);
        expect(level.map.floors[0].length).toBe(14);
    });

    test('Global Palette should contain required categories', () => {
        expect(context.gamePack.globalPalette).toHaveProperty('floors');
        expect(context.gamePack.globalPalette).toHaveProperty('ceils');
        expect(context.gamePack.globalPalette).toHaveProperty('walls');
        expect(context.gamePack.globalPalette).toHaveProperty('enemies');
        expect(context.gamePack.globalPalette).toHaveProperty('objects');
        expect(context.gamePack.globalPalette).toHaveProperty('items');
    });

    test('Constants should be correctly identified', () => {
        expect(context.ID_PLAYER).toBe(99);
        expect(context.ID_GOAL).toBe(98);
        expect(context.ID_EMPTY).toBe(0);
        expect(context.GRID_SIZE).toBe(14);
    });
});
