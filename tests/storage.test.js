const fs = require('fs');
const path = require('path');

// Mock localStorage
const localStorageMock = (function() {
    let store = {};
    return {
        getItem: jest.fn(key => store[key] || null),
        setItem: jest.fn((key, value) => { store[key] = value.toString(); }),
        clear: jest.fn(() => { store = {}; }),
        removeItem: jest.fn(key => { delete store[key]; })
    };
})();

global.localStorage = localStorageMock;

// Mock document
global.document = {
    createElement: jest.fn(() => ({
        classList: { add: jest.fn(), remove: jest.fn() },
        style: {},
        remove: jest.fn()
    })),
    body: {
        appendChild: jest.fn()
    }
};

// Mock gameData
global.gameData = { title: "Test Game", map: {} };

// Mock renderUI
global.renderUI = jest.fn();

// Read storage.js
const storageJsPath = path.join(__dirname, '../js/storage.js');
const storageJsContent = fs.readFileSync(storageJsPath, 'utf8');

// Evaluate storage.js
eval(storageJsContent);

// Re-mock showToast to avoid document calls and setTimeouts
// We use a var-like assignment to ensure it's overwritten
global.showToast = jest.fn();
// If it was defined as a function declaration in eval, we might need to overwrite it in the same context
// But global.showToast should work for most Jest setups.
// Let's also try to overwrite the local one if possible.
try { showToast = global.showToast; } catch(e) {}

describe('LocalStorage Persistence', () => {
    beforeEach(() => {
        localStorage.clear();
        global.gameData = { title: "Test Game", map: {} };
        jest.clearAllMocks();
    });

    test('saveToLocalStorage should save gameData to localStorage', () => {
        saveToLocalStorage();
        expect(localStorage.setItem).toHaveBeenCalledWith('retro_engine_save', JSON.stringify(gameData));
        expect(showToast).toHaveBeenCalledWith("Project saved to browser!");
    });

    test('loadFromLocalStorage should load gameData from localStorage', () => {
        const savedData = { title: "Saved Game", map: { entities: [[1]] } };
        localStorage.setItem('retro_engine_save', JSON.stringify(savedData));
        
        const result = loadFromLocalStorage();
        
        expect(result).toBe(true);
        expect(gameData.title).toBe("Saved Game");
        expect(showToast).toHaveBeenCalledWith("Project loaded from browser!");
    });

    test('loadFromLocalStorage should return false if no data exists', () => {
        const result = loadFromLocalStorage();
        expect(result).toBe(false);
    });

    test('hasSavedGame should return true if data exists', () => {
        localStorage.setItem('retro_engine_save', "some data");
        expect(hasSavedGame()).toBe(true);
    });

    test('hasSavedGame should return false if no data exists', () => {
        expect(hasSavedGame()).toBe(false);
    });
});
