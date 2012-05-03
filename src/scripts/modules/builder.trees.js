require(
    ['modules/engine.map'
     , 'modules/engine.events'
     , 'modules/engine.game'
     , 'modules/loader.assets'
     , 'modules/engine.util'
     , 'modules/engine.debug'
     ],
    function(mapEngine, eventEngine, gameEngine, assetLoader, util, debugEngine) {
        var _tree, _treePositions;

        function createImage(path) {
            var x = new Image();
            x.src = path;
            return x;
        }

        function randomNumbers(limit) {
            var nums = [];
            var map = mapEngine.getCurrentMap();
            
            for (var i = -1, l = mapEngine.getCurrentMap().data.length; ++i < l;) {
                if (mapEngine.tileTypes[map.data[i]].isBuildable) {
                    var rnd = Math.floor(Math.random() * 100000001);
                    
                    if (rnd % 3 === 0 ) {
                        nums.push(i);
                    }
                    if (nums.length === limit) {
                        break;
                    }
                }
            }
            return nums;
        }

        function inArray(arr, val) {
            for(var i = -1, j = arr.length; ++i < j;)
                if(arr[i] === val) return true;
            return false;
        }

        eventEngine.sub(mapEngine.events.LEVEL_LOADED, function() {
            _tree = assetLoader.getAsset('images/tree.png');
            _treePositions = randomNumbers( mapEngine.getCurrentMap().treeFactor * 100 );
        });

        eventEngine.sub(mapEngine.events.BUILDING_RENDER, function(index, row, col) {
            var canvas = gameEngine.getCanvas();
            var context = gameEngine.getContext();
            var map = mapEngine.getCurrentMap();

            if (inArray(_treePositions, index)) {
                var pos = util.entityRowColToPoint(canvas.width, map.tileDimensions, row, col, _tree, true);
                context.drawImage(_tree, pos.x, pos.y, _tree.width, _tree.height);
            }
        });
    });
