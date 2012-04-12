require(
    ["modules/engine.map", "modules/engine.events", "modules/engine.game"],
    function(mapEngine, eventEngine, gameEngine) {
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
        eventEngine.sub(mapEngine.events.LOAD_COMPLETE, function(){
            var map = mapEngine.getCurrentMap();

            var context = gameEngine.getContext();
            var canvas  = gameEngine.getCanvas();

            // loop through the map data
            // for each tile, determine
            // the type of tile and if we should render a tree
            var tree = createImage('images/tree.png'),
                treePositions = randomNumbers( mapEngine.getCurrentMap().treeFactor * 100 );
            mapEngine.tileLoop(function(row, col, index){
                if( inArray(treePositions, index) ) {
                    var tileType = map.data.substr(index,1);
                    var pos = mapEngine.translatePosition(row, col, tree);

                    context.drawImage(tree, pos.x, pos.y, tree.width, tree.height);
                }
            });
        });
    });
