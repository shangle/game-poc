/**
 * GAMEPACK FACTORY & PRESETS
 * Demonstrates the diverse potential of the engine with curated multi-level packs.
 */

const GamePackFactory = {
    /**
     * "Neon Breach" - High contrast sci-fi pack
     */
    createNeonBreach() {
        return {
            metadata: {
                title: "NEON BREACH",
                author: "Retro Studio AI",
                version: "1.0.0",
                description: "Escape the cyber-prison."
            },
            titleScreen: { background: "v1-...", music: "cyber_drift" },
            levels: [
                {
                    id: "neon_1",
                    name: "Cyber Grid",
                    map: this.generateEmptyMap(),
                    exits: [{ sourceX: 1, sourceZ: 1, targetLevel: "neon_2" }]
                },
                {
                    id: "neon_2",
                    name: "Data Core",
                    map: this.generateEmptyMap(),
                    exits: []
                }
            ],
            globalPalette: {
                floors:  [{ id: 101, name: "Neon Floor", tex: "floor2", color: "#0ea5e9" }],
                ceils:   [{ id: 201, name: "Grid Sky", tex: "ceil1", color: "#000000" }],
                walls:   [{ id: 1, name: "Laser Wall", tex: "wall2", color: "#f43f5e" }],
                enemies: [{ id: 10, name: "Drone", tex: "enemy2", hp: 50, speed: 0.1, color: "#f43f5e" }],
                objects: [{ id: 20, name: "Console", tex: "obj1", color: "#38bdf8" }],
                items:   [{ id: 31, name: "Data Disc", tex: "item_coin", type: "score", value: 500, color: "#eab308" }]
            }
        };
    },

    /**
     * "Dungeon Crawler" - Classic fantasy pack
     */
    createDungeonCrawler() {
        return {
            metadata: {
                title: "STONE HEART",
                author: "Retro Studio AI",
                version: "1.0.0",
                description: "Delve deep into the stone heart."
            },
            levels: [
                {
                    id: "stone_1",
                    name: "The Crypt",
                    map: this.generateEmptyMap(),
                    exits: []
                }
            ],
            globalPalette: {
                floors:  [{ id: 101, name: "Mossy Stone", tex: "floor1", color: "#4b5563" }],
                ceils:   [{ id: 201, name: "Dark Ceiling", tex: "ceil1", color: "#111827" }],
                walls:   [{ id: 1, name: "Cracked Brick", tex: "wall1", color: "#1e293b" }],
                enemies: [{ id: 10, name: "Skeleton", tex: "enemy1", hp: 120, speed: 0.04, color: "#ffffff" }],
                objects: [{ id: 20, name: "Vase", tex: "obj1", color: "#92400e" }],
                items:   [{ id: 30, name: "Life Potion", tex: "item_hp", type: "hp", value: 40, color: "#ef4444" }]
            }
        };
    },

    generateEmptyMap() {
        return {
            floors: Array(GRID_SIZE).fill().map(() => Array(GRID_SIZE).fill(101)),
            ceils:  Array(GRID_SIZE).fill().map(() => Array(GRID_SIZE).fill(201)),
            entities: Array(GRID_SIZE).fill().map(() => Array(GRID_SIZE).fill(0))
        };
    },

    loadPack(pack) {
        gamePack = pack;
        activeLevelIndex = 0;
        gameData = getActiveLevel();
        if (typeof renderUI === 'function') renderUI();
        if (typeof Sequencer !== 'undefined') Sequencer.render();
    }
};

window.GamePackFactory = GamePackFactory;
