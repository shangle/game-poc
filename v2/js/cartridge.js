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
                entities: Array(GRID_SIZE).fill().map((_, z) => 
                    Array(GRID_SIZE).fill(0).map((_, x) => {
                        if (z === 0 || z === 4 || x === 0 || x === 15) return 1;
                        if (z === 2 && x === 2) return 99;
                        if (z === 2 && x === 13) return 98;
                        return 0;
                    })
                )
            },
            exits: [{ targetLevel: "lvl_2" }]
        },
        {
            id: "lvl_2",
            name: "First Contact",
            map: {
                floors: Array(GRID_SIZE).fill().map(() => Array(GRID_SIZE).fill(101)),
                ceils: Array(GRID_SIZE).fill().map(() => Array(GRID_SIZE).fill(201)),
                entities: Array(GRID_SIZE).fill().map((_, z) => 
                    Array(GRID_SIZE).fill(0).map((_, x) => {
                        if (z === 0 || z === 4 || x === 0 || x === 15) return 1;
                        if (z === 2 && x === 1) return 99;
                        if (z === 2 && x === 8) return 10;
                        if (z === 2 && x === 14) return 98;
                        return 0;
                    })
                )
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
                entities: Array(GRID_SIZE).fill().map((_, z) => 
                    Array(GRID_SIZE).fill(0).map((_, x) => {
                        if (z === 0 || z === 6 || x === 0 || x === 15) return 1;
                        if (z === 1 && x === 1) return 99;
                        if (z === 3 && x === 5) return 10;
                        if (z === 3 && x === 9) return 10;
                        if (z === 5 && x === 14) return 98;
                        if ((z === 2 || z === 4) && (x === 3 || x === 11)) return 1;
                        return 0;
                    })
                )
            },
            exits: [{ targetLevel: "lvl_5" }]
        },
        {
            id: "lvl_5",
            name: "The Guarded Hall",
            map: {
                floors: Array(GRID_SIZE).fill().map(() => Array(GRID_SIZE).fill(101)),
                ceils: Array(GRID_SIZE).fill().map(() => Array(GRID_SIZE).fill(201)),
                entities: Array(GRID_SIZE).fill().map((_, z) => 
                    Array(GRID_SIZE).fill(0).map((_, x) => {
                        if (z === 0 || z === 3 || x === 0 || x === 15) return 1;
                        if (z === 1 && x === 1) return 99;
                        if (z === 1 && (x === 5 || x === 7 || x === 9)) return 10;
                        if (z === 1 && (x === 4 || x === 6 || x === 8 || x === 10)) return 1;
                        if (z === 2 && x === 13) return 98;
                        return 0;
                    })
                )
            },
            exits: [{ targetLevel: "lvl_6" }]
        },
        {
            id: "lvl_6",
            name: "The Arena",
            map: {
                floors: Array(GRID_SIZE).fill().map(() => Array(GRID_SIZE).fill(101)),
                ceils: Array(GRID_SIZE).fill().map(() => Array(GRID_SIZE).fill(201)),
                entities: Array(GRID_SIZE).fill().map((_, z) => 
                    Array(GRID_SIZE).fill(0).map((_, x) => {
                        if (z === 0 || z === 7 || x === 0 || x === 15) return 1;
                        if (z === 2 && x === 2) return 99;
                        if (z === 6 && x === 13) return 98;
                        if ((z === 1 || z === 2 || z === 4) && (x === 6 || x === 7)) return 1;
                        if (z === 5 && (x === 5 || x === 8)) return 10;
                        if (z === 2 && x === 12) return 10;
                        return 0;
                    })
                )
            },
            exits: [{ targetLevel: "lvl_7" }]
        },
        {
            id: "lvl_7",
            name: "Final Descent",
            map: {
                floors: Array(GRID_SIZE).fill().map(() => Array(GRID_SIZE).fill(101)),
                ceils: Array(GRID_SIZE).fill().map(() => Array(GRID_SIZE).fill(201)),
                entities: Array(GRID_SIZE).fill().map((_, z) => 
                    Array(GRID_SIZE).fill(0).map((_, x) => {
                        if (z === 0 || z === 2 || x === 0 || x === 15) return 1;
                        if (z === 1 && x === 1) return 99;
                        if (z === 1 && x === 14) return 98;
                        if (z === 1 && x % 2 === 0 && x > 1 && x < 14) return 10;
                        return 0;
                    })
                )
            },
            exits: []
        }
    ]
};

window.Cartridge = RetroQuestCartridge;

