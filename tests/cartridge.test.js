import { StudioCartridge, GRID_SIZE, ID_WALL_DEFAULT, ID_PLAYER_SPAWN } from '../studio/v3/js/core/cartridge.js';

describe('StudioCartridge Core Tests', () => {
    test('should initialize default cartridge with metadata and level 1', () => {
        const cartridge = new StudioCartridge();
        expect(cartridge.metadata.title).toBe('NEW RETRO GAME');
        expect(cartridge.levels.length).toBe(1);
        expect(cartridge.levels[0].gridSize).toBe(GRID_SIZE);
    });

    test('should create default level with perimeter walls and player spawn', () => {
        const cartridge = new StudioCartridge();
        const level = cartridge.levels[0];
        expect(level.map.entities[0][0]).toBe(ID_WALL_DEFAULT);
        expect(level.map.entities[GRID_SIZE - 1][GRID_SIZE - 1]).toBe(ID_WALL_DEFAULT);
        expect(level.map.entities[2][2]).toBe(ID_PLAYER_SPAWN);
    });

    test('should add new level and serialize to Base64 and back', () => {
        const cartridge = new StudioCartridge();
        cartridge.addLevel('Stage 2: Danger Zone');
        expect(cartridge.levels.length).toBe(2);
        expect(cartridge.levels[1].name).toBe('Stage 2: Danger Zone');

        const base64Str = cartridge.toBase64();
        expect(typeof base64Str).toBe('string');
        expect(base64Str.length).toBeGreaterThan(50);

        const decoded = StudioCartridge.fromBase64(base64Str);
        expect(decoded.levels.length).toBe(2);
        expect(decoded.levels[1].name).toBe('Stage 2: Danger Zone');
    });
});
