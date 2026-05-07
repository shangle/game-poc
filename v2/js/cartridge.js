const GRID_SIZE = 16;
const ID_EMPTY = 0;
const ID_PLAYER = 99;
const ID_GOAL = 98;
const ID_WALL = 1;
const ID_ENEMY = 10;
const ID_HEART = 30;

const RetroQuestCartridge = {
    metadata: {
        title: "RETRO QUEST",
        version: "1.1.0",
        author: "Retro Studio AI"
    },
    palette: {
        floors: [{ id: 101, name: "Stone Floor", tex: "floor1" }],
        ceils: [{ id: 201, name: "Dark Ceiling", tex: "ceil1" }],
        walls: [{ id: 1, name: "Dungeon Wall", tex: "wall1" }],
        enemies: [{ id: 10, name: "Slime", tex: "enemy1", hp: 50, speed: 0.05 }],
        items: [{ id: 30, name: "Heart", tex: "item_hp", type: "hp", value: 25 }]
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
                    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
                    [1,0,99,0,0,0,0,0,0,0,0,0,98,0,1],
                    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
                    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
                ]
            },
            exits: [{ targetLevel: "lvl_2" }]
        },
        {
            id: "lvl_2",
            name: "First Contact",
            map: {
                floors: Array(GRID_SIZE).fill().map(() => Array(GRID_SIZE).fill(101)),
                ceils: Array(GRID_SIZE).fill().map(() => Array(GRID_SIZE).fill(201)),
                entities: [
                    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
                    [1,99,0,0,0,0,1,0,0,0,0,0,0,0,0,1],
                    [1,0,0,0,0,0,1,0,10,0,0,0,98,0,1],
                    [1,0,0,0,0,0,1,0,0,0,0,0,0,0,0,1],
                    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
                ]
            },
            exits: [{ targetLevel: "lvl_3" }]
        },
        {
            id: "lvl_3",
            name: "The Crossroads",
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
            exits: [{ targetLevel: "lvl_4" }]
        },
        {
            id: "lvl_4",
            name: "Twin Pillars",
            map: {
                floors: Array(GRID_SIZE).fill().map(() => Array(GRID_SIZE).fill(101)),
                ceils: Array(GRID_SIZE).fill().map(() => Array(GRID_SIZE).fill(201)),
                entities: [
                    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
                    [1,99,0,0,0,0,0,1,0,0,0,0,0,0,0,1],
                    [1,0,0,1,0,0,0,0,0,0,0,1,0,0,0,1],
                    [1,0,0,0,0,10,0,1,0,10,0,0,0,0,0,1],
                    [1,0,0,1,0,0,0,0,0,0,0,1,0,30,0,1],
                    [1,0,0,0,0,0,0,1,0,0,0,0,0,0,98,1],
                    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
                ]
            },
            exits: [{ targetLevel: "lvl_5" }]
        },
        {
            id: "lvl_5",
            name: "The Guarded Hall",
            map: {
                floors: Array(GRID_SIZE).fill().map(() => Array(GRID_SIZE).fill(101)),
                ceils: Array(GRID_SIZE).fill().map(() => Array(GRID_SIZE).fill(201)),
                entities: [
                    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
                    [1,99,0,0,1,10,1,10,1,10,1,0,0,0,1],
                    [1,0,0,0,0,0,0,0,0,0,0,0,0,98,1],
                    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
                ]
            },
            exits: [{ targetLevel: "lvl_6" }]
        },
        {
            id: "lvl_6",
            name: "The Arena",
            map: {
                floors: Array(GRID_SIZE).fill().map(() => Array(GRID_SIZE).fill(101)),
                ceils: Array(GRID_SIZE).fill().map(() => Array(GRID_SIZE).fill(201)),
                entities: [
                    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
                    [1,0,0,0,0,0,1,1,0,0,0,0,0,0,0,1],
                    [1,0,99,0,0,0,1,1,0,0,0,0,10,0,1],
                    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
                    [1,1,1,0,0,0,1,1,0,0,0,1,1,1,0,1],
                    [1,30,0,0,0,10,0,0,10,0,0,0,0,30,1],
                    [1,1,1,1,1,1,1,1,1,1,1,1,1,98,1],
                    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
                ]
            },
            exits: [{ targetLevel: "lvl_7" }]
        },
        {
            id: "lvl_7",
            name: "Final Descent",
            map: {
                floors: Array(GRID_SIZE).fill().map(() => Array(GRID_SIZE).fill(101)),
                ceils: Array(GRID_SIZE).fill().map(() => Array(GRID_SIZE).fill(201)),
                entities: [
                    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
                    [1,99,10,0,10,0,10,0,10,0,10,0,10,0,98,1],
                    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
                ]
            },
            exits: []
        }
    ]
};

window.Cartridge = RetroQuestCartridge;

