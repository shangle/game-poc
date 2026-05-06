const GRID_SIZE = 16;
const ID_EMPTY = 0;
const ID_PLAYER = 99;
const ID_GOAL = 98;

const RetroQuestCartridge = {
    metadata: {
        title: "RETRO QUEST",
        version: "1.0.0",
        author: "Retro Studio AI"
    },
    palette: {
        floors: [
            { id: 101, name: "Stone Floor", tex: "https://shangle.me/game-poc/assets/floor1.png" }
        ],
        ceils: [
            { id: 201, name: "Dark Ceiling", tex: "https://shangle.me/game-poc/assets/ceil1.png" }
        ],
        walls: [
            { id: 1, name: "Dungeon Wall", tex: "https://shangle.me/game-poc/assets/wall1.png" }
        ],
        enemies: [
            { id: 10, name: "Slime", tex: "https://shangle.me/game-poc/assets/enemy1.png", hp: 50, speed: 0.05 }
        ],
        items: [
            { id: 30, name: "Heart", tex: "https://shangle.me/game-poc/assets/item_hp.png", type: "hp", value: 25 }
        ]
    },
    levels: [
        {
            id: "lvl_1",
            name: "The First Step",
            map: {
                floors: Array(GRID_SIZE).fill().map(() => Array(GRID_SIZE).fill(101)),
                ceils: Array(GRID_SIZE).fill().map(() => Array(GRID_SIZE).fill(201)),
                entities: [
                    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
                    [1,99,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
                    [1,0,1,1,1,0,1,1,1,0,1,1,1,0,0,1],
                    [1,0,0,0,1,0,1,0,0,0,0,0,1,0,0,1],
                    [1,1,1,0,1,0,1,0,1,1,1,0,1,0,0,1],
                    [1,0,0,0,0,0,1,0,0,0,1,0,0,0,0,1],
                    [1,0,1,1,1,1,1,1,1,0,1,1,1,1,0,1],
                    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
                    [1,0,1,1,1,1,1,0,1,1,1,1,1,1,0,1],
                    [1,0,1,0,0,0,1,0,1,0,0,0,0,1,0,1],
                    [1,0,1,0,1,0,1,0,1,0,1,1,0,1,0,1],
                    [1,1,1,0,1,0,0,0,0,0,1,0,0,0,0,1],
                    [1,0,0,0,1,1,1,1,1,1,1,0,1,1,1,1],
                    [1,0,1,0,0,0,0,10,0,0,0,0,0,0,0,1],
                    [1,0,0,0,0,0,0,0,0,0,0,0,0,98,0,1],
                    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
                ]
            },
            exits: [{ targetLevel: "lvl_2" }]
        },
        {
            id: "lvl_2",
            name: "Deeper In",
            map: {
                floors: Array(GRID_SIZE).fill().map(() => Array(GRID_SIZE).fill(101)),
                ceils: Array(GRID_SIZE).fill().map(() => Array(GRID_SIZE).fill(201)),
                entities: Array(GRID_SIZE).fill().map(() => Array(GRID_SIZE).fill(0))
            },
            exits: []
        }
    ]
};

window.Cartridge = RetroQuestCartridge;
