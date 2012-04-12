require(
    ["modules/engine.map", "modules/engine.events", "modules/engine.game", "modules/engine.debug",],
    function(mapEngine, eventEngine, gameEngine, debugEngine) {
        var _tree = null;
            _treePositions = null;
        
        function createImage(path) {
            var x = new Image();
            x.src = path;
            return x;
        }
        
        function randomNumbers(limit) {
            var nums = [];
            for( var i = -1, l = mapEngine.getCurrentMap().data.length; ++i < l; ) {
                var rnd = Math.floor(Math.random()*100000001);
                if( rnd%3 === 0 ) {
                    nums.push(i);
                }
                if (nums.length === limit) {
                    break;
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
            debugEngine.log("LOAD_COMPLETE - treeEngine");
            
            var map = mapEngine.getCurrentMap();

            var context = gameEngine.getContext();
            var canvas  = gameEngine.getCanvas();

            // Generate the position of the trees
            _tree = createImage('images/tree.png');
            _treePositions = randomNumbers( mapEngine.getCurrentMap().treeFactor * 100 );
        });
        
        eventEngine.sub(mapEngine.events.TILE_DRAW, function(index, row, col) {
            debugEngine.log("TILE_DRAW - treeEngine");
            
            var context = gameEngine.getContext();
            
            if (inArray(_treePositions, index)) {
                var pos = mapEngine.translatePosition(row, col, _tree);
                context.drawImage(_tree, pos.x, pos.y, _tree.width, _tree.height);
            }
        });
    });
