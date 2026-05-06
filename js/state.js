/**
 * MULTI-LEVEL PROJECT ARCHITECTURE
 */

const GRID_SIZE = 14;
const ID_EMPTY = 0; const ID_PLAYER = 99; const ID_GOAL = 98;

// The "GamePack" represents a full collection of levels
let gamePack = {
    metadata: {
        title: "MY RETRO ADVENTURE",
        author: "Retro Studio User",
        version: "1.0.0",
        description: "A multi-level retro experience."
    },
    titleScreen: {
        background: "v1-...", // PixUrl data
        music: "intro_theme"
    },
    levels: [
        {
            id: "lvl_start",
            name: "The Entryway",
            map: {
                floors: Array(GRID_SIZE).fill().map(() => Array(GRID_SIZE).fill(101)),
                ceils:  Array(GRID_SIZE).fill().map(() => Array(GRID_SIZE).fill(201)),
                entities: Array(GRID_SIZE).fill().map(() => Array(GRID_SIZE).fill(0))
            },
            assets: {}, // Per-level asset overrides
            exits: [
                { sourceX: 1, sourceZ: 1, targetLevel: "lvl_dungeon", targetX: 12, targetZ: 12 }
            ]
        }
    ],
    globalPalette: {
        floors:  [{ id: 101, name: "Grey Tile", tex: "floor1", color: "#4b5563" }],
        ceils:   [{ id: 201, name: "Starry Night", tex: "ceil1", color: "#1f2937" }],
        walls:   [{ id: 1, name: "Brick Wall", tex: "wall1", color: "#9ca3af" }],
        enemies: [{ id: 10, name: "Grunt", tex: "enemy1", hp: 100, speed: 0.05, color: "#ef4444" }],
        objects: [{ id: 20, name: "Barrel", tex: "obj1", color: "#b45309" }],
        items:   [{ id: 30, name: "Health Potion", tex: "item_hp", type: "hp", value: 50, color: "#10b981" },
                  { id: 31, name: "Gold Coin", tex: "item_coin", type: "score", value: 100, color: "#eab308" }]
    }
};

let activeLevelIndex = 0;
let activeLayer = 'entities'; 
let currentPaintId = 1;

/**
 * Accessor for the currently active level's map data
 */
function getActiveLevel() {
    return gamePack.levels[activeLevelIndex];
}

function initDemoMap() {
    const level = getActiveLevel();
    // Border walls
    for(let i=0; i<GRID_SIZE; i++) {
        level.map.entities[0][i] = 1; level.map.entities[GRID_SIZE-1][i] = 1;
        level.map.entities[i][0] = 1; level.map.entities[i][GRID_SIZE-1] = 1;
    }
    level.map.entities[GRID_SIZE-2][GRID_SIZE-2] = ID_PLAYER; 
    level.map.entities[1][1] = ID_GOAL; 
    
    level.map.entities[5][5] = 1; level.map.entities[5][6] = 1; level.map.entities[5][7] = 1;
    level.map.entities[10][3] = 20; level.map.entities[10][4] = 20; 
    level.map.entities[3][10] = 10; level.map.entities[8][2] = 10; 
    
    level.map.entities[11][5] = 31; level.map.entities[11][6] = 31; 
    level.map.entities[2][2] = 30; 
}

// Backward compatibility for existing engine code that expects gameData
// We will transition engine code to use gamePack/activeLevel
let gameData = getActiveLevel(); 
