require(
    ["modules/engine.map", "modules/engine.events", "modules/engine.game", "modules/loader.assets", "modules/engine.debug",],
    function(mapEngine, eventEngine, gameEngine, assetLoader, debugEngine) {
        var _enemy, _enemyPositions, _enemySpriteSize;
        
        _enemySpriteSize = {
            width: 56,
            height: 96
        };
        
        function createImage(path) {
            var x = new Image();
            x.src = path;
            return x;
        }
        
        function randomNumbers(limit) {
            var nums = [];
            for (var i = -1, l = mapEngine.getCurrentMap().data.length; ++i < l;) {
                var rnd = Math.floor(Math.random() * 100000001);
                if (rnd % 3 === 0) {
                    nums.push(i);
                }
                if (nums.length === limit) {
                    break;
                }
            }
            return nums;
        }
        
        function inArray (arr, val) {
            for (var i = -1, j = arr.length; ++i < j;)
                if (arr[i] === val) return true;
            return false;
        }
        
        eventEngine.sub(mapEngine.events.LEVEL_LOADED, function() {
            debugEngine.log("LOAD_COMPLETE - enemyBuilder");
            
            var map = mapEngine.getCurrentMap();

            _enemy = assetLoader.getAsset("images/kit_from_firefox.png");
            _enemyPositions = randomNumbers(mapEngine.getCurrentMap().enemyFactor * 100);
        });
        
        eventEngine.sub(mapEngine.events.PLAYER_RENDER, function(index, row, col) {
            debugEngine.log("PLAYER_RENDER - enemyBuilder");
            
            var context = gameEngine.getContext();
            
            if (inArray(_enemyPositions, index)) {
                var pos = mapEngine.translatePosition(row, col, _enemySpriteSize);
                context.drawImage(_enemy, 0, 0, _enemySpriteSize.width, _enemySpriteSize.height, pos.x, pos.y, _enemySpriteSize.width, _enemySpriteSize.height);
            }
        });
    });
