/**
 * GAME STATE & DATA ARCHITECTURE
 */
const GRID_SIZE = 14;
const ID_EMPTY = 0; const ID_PLAYER = 99; const ID_GOAL = 98;

let gameData = {
    title: "MY RETRO ADVENTURE",
    startBg: "",
    assets: {},
    palette: {
        floors:  [{ id: 101, name: "Grey Tile", tex: "floor1", color: "#4b5563" }],
        ceils:   [{ id: 201, name: "Starry Night", tex: "ceil1", color: "#1f2937" }],
        walls:   [{ id: 1, name: "Brick Wall", tex: "wall1", color: "#9ca3af" }],
        enemies: [{ id: 10, name: "Grunt", tex: "enemy1", hp: 100, speed: 0.05, color: "#ef4444" }],
        objects: [{ id: 20, name: "Barrel", tex: "obj1", color: "#b45309" }],
        items:   [{ id: 30, name: "Health Potion", tex: "item_hp", type: "hp", value: 50, color: "#10b981" },
                  { id: 31, name: "Gold Coin", tex: "item_coin", type: "score", value: 100, color: "#eab308" }]
    },
    map: {
        floors: Array(GRID_SIZE).fill().map(() => Array(GRID_SIZE).fill(101)),
        ceils:  Array(GRID_SIZE).fill().map(() => Array(GRID_SIZE).fill(201)),
        entities: Array(GRID_SIZE).fill().map(() => Array(GRID_SIZE).fill(0))
    }
};

let activeLayer = 'entities'; 
let currentPaintId = 1;

function initDemoMap() {
    // Border walls
    for(let i=0; i<GRID_SIZE; i++) {
        gameData.map.entities[0][i] = 1; gameData.map.entities[GRID_SIZE-1][i] = 1;
        gameData.map.entities[i][0] = 1; gameData.map.entities[i][GRID_SIZE-1] = 1;
    }
    gameData.map.entities[GRID_SIZE-2][GRID_SIZE-2] = ID_PLAYER; // Start bottom right
    gameData.map.entities[1][1] = ID_GOAL; // Exit top left
    
    // Some maze/objects
    gameData.map.entities[5][5] = 1; gameData.map.entities[5][6] = 1; gameData.map.entities[5][7] = 1;
    gameData.map.entities[10][3] = 20; gameData.map.entities[10][4] = 20; // Barrels
    gameData.map.entities[3][10] = 10; gameData.map.entities[8][2] = 10; // Enemies
    
    gameData.map.entities[11][5] = 31; gameData.map.entities[11][6] = 31; // Coins
    gameData.map.entities[2][2] = 30; // Potion near exit
}
