import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { jest } from '@jest/globals';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

globalThis.showToast = jest.fn();

// Evaluate storage.js
(new Function(storageJsContent + '; globalThis.saveToLocalStorage = saveToLocalStorage; globalThis.loadFromLocalStorage = loadFromLocalStorage; globalThis.hasSavedGame = hasSavedGame;'))();

const saveToLocalStorage = globalThis.saveToLocalStorage;
const loadFromLocalStorage = globalThis.loadFromLocalStorage;
const hasSavedGame = globalThis.hasSavedGame;

const showToast = globalThis.showToast;

describe('LocalStorage Persistence', () => {
    beforeEach(() => {
        localStorage.clear();
        global.gameData = { title: "Test Game", map: {} };
        jest.clearAllMocks();
    });

    test('saveToLocalStorage should save gameData to localStorage', () => {
        saveToLocalStorage();
        expect(localStorage.setItem).toHaveBeenCalledWith('retro_engine_save', JSON.stringify(gameData));
    });

    test('loadFromLocalStorage should load gameData from localStorage', () => {
        const savedData = { title: "Saved Game", map: { entities: [[1]] } };
        localStorage.setItem('retro_engine_save', JSON.stringify(savedData));
        
        const result = loadFromLocalStorage();
        
        expect(result).toBe(true);
        expect(gameData.title).toBe("Saved Game");
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
