MapEngine = (function () {
    var _events = {};
    var maps = { // should load maps from server
        levelOne: {
            data: "GGGGGGGGGG" +
                  "GGGGGGGGGG" +
                  "GGGGGGGGGG" +
                  "GGGGGGGGGG" +
                  "GGGGGGGGGG" +
                  "GGGGGHGGGG" +
                  "GGGGGGGGGG" +
                  "GGGGGGGGGG" +
                  "GGGGGGGGGG" +
                  "GGGGGGGGGG" +
                  "GGGGGGGGGG",
            width: 10,
            tiles: {
                "G": 'images/tile.png',
                "D": 'images/dirt.png',
                "H": 'images/cinema.png'
            },
            behavior: {

            }
        }
    };
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
        getTileType: function(cellPos) {
            return this.map.tiles[this.map.substr(cellPos,1)];
        },
        setCurrentLevel: function(name) {
            this.map = this.maps[name] || this.map;
            return this; // for chaining
        },
        render: function() {
            this.renderTo(App.canvas, App.context);
        },
        renderTo: function(canvas, context) {
            context.clearRect (0, 0, canvas.width, canvas.height);
            var img = new Image(); // cache this so it's reused
            for(var cell = -1, len = this.map.length; ++i < len; ) {
                var col     = cell%map.width,
                    row     = cell - (col * this.map.width).
                    tile    = this.getTileImage();

                // Center the grid horizontally
                tilePositionX += (canvas.width / 2) - (tile.width / 2);

                tile.src = tile;

                // render the tile image from the available map tiles
                context.drawImage(img, Math.round(tilePositionX), Math.round(tilePositionY), tile.width, tile.height);
            }
        },
        tileStyles: { "W":"water", "G":"grass", "S":"stone", "D":"dirt", "P": "portal", "H": "home" },
        walkableTiles: {"G":true, "D": true},
        buildabltTiles: { "G": true, "D": true, "S": true },
        map: null,
        events: {
            names: {
                LOAD_COMPLETE: "loadDone",
                TILE_DRAW: "tileDraw"
            },
            sub: function(e, fn) {
                if( !_events[e] ) {
                    _events[e] = [];
                }
                _events[e].push(fn);
                App.debug("someone subscribed to: " + e);
                return fn;
            },
            fire: function(e,t,a) {
                App.debug("firing event: " + e);
                var ar = _events[e] || [];
                t = t || this;
                a = a || [];
                for(var i = -1, l = ar.length; ++i < l; ) {
                    var ev = ar[i];
                    ev.apply(t, a);
                }
            }
        }
    };
})();
