define(
    ['modules/engine.events', 'modules/engine.game'],
    function (eventEngine, gameEngine) {
    var maps = { // should load maps from server
        levelOne: {
            data: "GGGGGGGGGGGGGGDGGGGGGGGGG",
            width: 5,
            tileDimensions: {
                height: 64,
                width: 128
            },
            treeFactor: .05,
            tiles: {
                "G": 'images/grass.png',
                "D": 'images/dirt.png'
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
    };
    var _currentMap = null;
    return {
        _getElligibleEvents: function() {
            var _e = [];
            for(var d in this.events.names) {
                if( this.events.names.hasOwnProperty(d) ) {
                    _e.push( this.events.names[d] );
                }
            }
            return _e;
        },
        getTileImage: function(cellPos) {
            var image = new Image();
            image.src = _currentMap.tiles[_currentMap.data.substr(cellPos,1)];
            return image;
        },
        getCurrentMap: function() {
            return _currentMap;
        },
        setCurrentLevel: function(name) {
            _currentMap = maps[name] || _currentMap;
            return this; // for chaining
        },
        getDataIndex: function( pos ) {
            return ((pos.y/_currentMap.tileDimensions.height)*_currentMap.width) + (pos.x/_currentMap.tileDimensions.width);
        },
        getTileType: function( pos ) {
            return _currentMap.data.substr( this.getDataIndex(pos), 1 );
        },
        getPosFromDataIndex: function(index) {
            return {
                x: (index%_currentMap.width) * _currentMap.tileDimensions.width,
                y: ( index < _currentMap.width ? 0 : Math.floor(index / _currentMap.width) ) * _currentMap.tileDimensions.height
            };
        },
        translatePosition: function(row, col, entity) {
            var tile    = _currentMap.tileDimensions;
            var canvas  = gameEngine.getCanvas();
            var pos = {
                x: ((row - col) * tile.height) + Math.floor((canvas.width / 2) - (tile.width / 2)),
                y: Math.floor( (row + col) * (tile.height / 2) )
            };

            if ( entity ) {
                pos.x -= entity.width - tile.width;
                pos.y -= entity.height - tile.height;
            }

            return pos;
        },
        tileLoop: function(fn) {
            for(var index = -1, len = _currentMap.data.length; ++index < len; ) {
                var row     = index < _currentMap.width ? 0 : Math.floor(index/_currentMap.width),
                    col     = Math.floor(index%_currentMap.width);

                fn.call(this, row, col, index);
            }
        },
        renderTo: function(canvas, context) {
            context.clearRect (0, 0, canvas.width, canvas.height);
            var X, Y;
            this.tileLoop(function(row, col, index){
                var img     = this.getTileImage(index),
                    pos     = this.translatePosition( row, col, img, canvas );

                context.drawImage(img, pos.x, pos.y, img.width, img.height);
                eventEngine.pub(this.events.TILE_DRAW, this, [img, pos]);
                // TODO: tree builder should sub to TILE_DRAW to render trees
            });

            eventEngine.pub(this.events.LOAD_COMPLETE);
        },
        tileTypes: {
            "G": {
                isBuildable: true,
                isWalkable: true
            },
            "W": {
                isBuildable: false,
                isWalkable: false
            },
            "S": {
                isBuildable: true,
                isWalkable: false
            },
            "D": {
                isBuildable: true,
                isWalkable: true
            }
        },
        events: {
            LOAD_COMPLETE: "loadDone",
            TILE_DRAW: "tileDraw"
        }
    };
});
