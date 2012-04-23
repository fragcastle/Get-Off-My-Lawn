var maps = { // should load maps from server
    levelOne: {
        data: "GFGGGGFGGGGFGGDGGGGGGFGWW",
        spawnData: "1000010000100001000010000",
        width: 5,
        tileDimensions: {
            height: 64,
            width: 128
        },
        treeFactor: .05,
        enemyFactor: 0.5,
        enemies: [],
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
        width: 5,
        tileDimensions: {
            height: 64,
            width: 128
        },
        treeFactor: .05,
        enemyFactor: 0.1,
        enemies: [],
        enemyTemplates: [
            {
                name: 'Kit',
                imagePath: "images/kit_from_firefox.png",
                image: null,
                size: { width: 56, height: 80 },
                ready: { x: 0, y: 0 },
                walk: { x: 0, y: 80 },
                jump: { x: 0, y: 160 },
                flinch: { x: 0, y: 240 },
                swing: { x: 0, y: 320 },
                kick: { x: 0, y: 400 },
                jumpswing: { x: 0, y: 480 },
                jumpkick: { x: 0, y: 560 },
                dizzy: { x: 0, y: 640 }
            },
            {
                name: 'Gnu',
                imagePath: "images/gnu_from_gnu.png",
                image: null,
                size: { width: 56, height: 80 },
                ready: { x: 0, y: 0 },
                walk: { x: 0, y: 80 },
                jump: { x: 0, y: 160 },
                flinch: { x: 0, y: 240 },
                swing: { x: 0, y: 320 },
                kick: { x: 0, y: 400 },
                jumpswing: { x: 0, y: 480 },
                jumpkick: { x: 0, y: 560 },
                dizzy: { x: 0, y: 640 }
            },
            {
                name: 'Android',
                imagePath: "images/droid_from_android.png",
                image: null,
                size: { width: 56, height: 80 },
                ready: { x: 0, y: 0 },
                walk: { x: 0, y: 80 },
                jump: { x: 0, y: 160 },
                flinch: { x: 0, y: 240 },
                swing: { x: 0, y: 320 },
                kick: { x: 0, y: 400 },
                jumpswing: { x: 0, y: 480 },
                jumpkick: { x: 0, y: 560 },
                dizzy: { x: 0, y: 640 }
            },
            {
                name: 'Sara',
                imagePath: "images/sara_from_opengameart.png",
                image: null,
                size: { width: 56, height: 80 },
                ready: { x: 0, y: 0 },
                walk: { x: 0, y: 80 },
                jump: { x: 0, y: 160 },
                flinch: { x: 0, y: 240 },
                swing: { x: 0, y: 320 },
                kick: { x: 0, y: 400 },
                jumpswing: { x: 0, y: 480 },
                jumpkick: { x: 0, y: 560 },
                dizzy: { x: 0, y: 640 }
            },
            {
                name: 'Tux',
                imagePath: "images/tux_from_linux.png",
                image: null,
                size: { width: 56, height: 80 },
                ready: { x: 0, y: 0 },
                walk: { x: 0, y: 80 },
                jump: { x: 0, y: 160 },
                flinch: { x: 0, y: 240 },
                swing: { x: 0, y: 320 },
                kick: { x: 0, y: 400 },
                jumpswing: { x: 0, y: 480 },
                jumpkick: { x: 0, y: 560 },
                dizzy: { x: 0, y: 640 }
            },
            {
                name: 'Wilber',
                imagePath: "images/wilber_from_gimp_0.png",
                image: null,
                size: { width: 56, height: 80 },
                ready: { x: 0, y: 0 },
                walk: { x: 0, y: 80 },
                jump: { x: 0, y: 160 },
                flinch: { x: 0, y: 240 },
                swing: { x: 0, y: 320 },
                kick: { x: 0, y: 400 },
                jumpswing: { x: 0, y: 480 },
                jumpkick: { x: 0, y: 560 },
                dizzy: { x: 0, y: 640 }
            }
        ],
        tiles: {
            "G": 'images/grass.png',
            "D": 'images/dirt.png',
            "W": 'images/dirt.png'
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
