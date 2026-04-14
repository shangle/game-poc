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
        context.gameData = typeof gameData !== 'undefined' ? gameData : null;
    `);
} catch(e) {
    console.error("Error evaluating state.js:", e);
}

describe('Game State Management', () => {
    test('Initial gameData should have correct grid dimensions', () => {
        expect(context.gameData).toBeDefined();
        expect(context.gameData.map.floors.length).toBe(14);
        expect(context.gameData.map.floors[0].length).toBe(14);
    });

    test('Initial map should be populated with default floor tile', () => {
        expect(context.gameData.map.floors[0][0]).toBe(101);
    });

    test('Palette should contain required categories', () => {
        expect(context.gameData.palette).toHaveProperty('floors');
        expect(context.gameData.palette).toHaveProperty('ceils');
        expect(context.gameData.palette).toHaveProperty('walls');
        expect(context.gameData.palette).toHaveProperty('enemies');
        expect(context.gameData.palette).toHaveProperty('objects');
        expect(context.gameData.palette).toHaveProperty('items');
    });

    test('Constants should be correctly identified', () => {
        expect(context.ID_PLAYER).toBe(99);
        expect(context.ID_GOAL).toBe(98);
        expect(context.ID_EMPTY).toBe(0);
        expect(context.GRID_SIZE).toBe(14);
    });
});
