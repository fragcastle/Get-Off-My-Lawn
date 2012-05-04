var maps = { // should load maps from server
    levelOne: {
        data: "DFGGGGFGGGDFGGDDDDDDGFGWW",
        spawnData: [0, 5, 10, 15, 20],
        waves: [1, 2, 3, 4, 5, 6],
        width: 5,
        tileDimensions: {
            height: 64,
            width: 128
        },
        treeFactor: .05,
        enemies: [],
        defenses: [],
        missiles: [],
        tiles: {
            "G": 'images/grass.png',
            "D": 'images/dirt.png',
            "W": 'images/water.png',
            "F": 'images/fence.png'
        },
        entities: {
            tiles: {
                "G": [
                    'images/tree.png'
                ]
            },
            buildables:{

            },
            home: {
                texture: 'images/icecream.png',
                row: 1,
                col: 4
            }
        },
        behavior: {
        }
    },
    levelTwo: {
        data: "GGGGGGGGGGGGGGDGGGGGGGGGW",
        spawnData: [0, 5, 10, 15, 20],
        waves: [1, 2, 3, 4, 5, 6],
        width: 5,
        tileDimensions: {
            height: 64,
            width: 128
        },
        treeFactor: .05,
        enemies: [],
        defenses: [],
        missiles: [],
        tiles: {
            "G": 'images/grass.png',
            "D": 'images/dirt.png',
            "W": 'images/water.png',
            "F": 'images/fence.png'
        },
        entities: {
            tiles: {
                "G": [
                    'images/tree.png'
                ]
            },
            buildables:{

            },
            home: {
                texture: 'images/icecream.png',
                row: 1,
                col: 4
            }
        },
        behavior: {
        }
    }
}

module.exports = maps;
