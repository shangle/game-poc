import { StudioCartridge } from '../studio/v3/js/core/cartridge.js';
import { StudioAssetManager } from '../studio/v3/js/core/asset_manager.js';

describe('StudioAssetManager Tests', () => {
    test('should create custom wall asset and add to global palette', () => {
        const cartridge = new StudioCartridge();
        const manager = new StudioAssetManager(cartridge);
        
        const wall = manager.createCustomWall('Neon Brick', '#ec4899', 0.5, 0.2);
        expect(wall.name).toBe('Neon Brick');
        expect(wall.color).toBe('#ec4899');
        expect(cartridge.globalPalette.walls.length).toBe(4);
    });

    test('should create custom floor, enemy, and item assets with unique IDs', () => {
        const cartridge = new StudioCartridge();
        const manager = new StudioAssetManager(cartridge);
        
        const floor = manager.createCustomFloor('Lava Tile', '#ef4444');
        const enemy = manager.createCustomEnemy('Cyber Robot', '#06b6d4', 100, 3.0, 25);
        const item = manager.createCustomItem('Super Shield', '#a855f7', 'shield', 50);

        expect(floor.id).toBeGreaterThanOrEqual(101);
        expect(enemy.id).toBeGreaterThanOrEqual(10);
        expect(item.id).toBeGreaterThanOrEqual(30);
    });

    test('should save custom pixel art texture data URL', () => {
        const cartridge = new StudioCartridge();
        const manager = new StudioAssetManager(cartridge);
        
        const mockDataUrl = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
        manager.savePixelArtTexture('tex_custom_wall_1', mockDataUrl);

        expect(cartridge.textures['tex_custom_wall_1']).toBe(mockDataUrl);
    });
});
