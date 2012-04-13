require(
    ["modules/engine.map", "modules/engine.events", "modules/engine.game", 'modules/engine.debug'],
    function(mapEngine, eventEngine, gameEngine, debugEngine) {
        var _home, _homeImage, _homePosition;
        
        eventEngine.sub(mapEngine.events.LEVEL_LOADED, function() {
            var map = mapEngine.getCurrentMap();
            _home = map.entities.home;
            _homeImage = new Image();
            _homeImage.src = _home.texture;
            
            // center the image within the tile
            _homePosition = mapEngine.translatePosition(_home.row, _home.col, _homeImage);
            
            debugEngine.log("LOAD_COMPLETE - homeBuilder");
        });
        
        eventEngine.sub(mapEngine.events.BUILDING_RENDER, function(index, row, col) {
            if (_home.row === row && _home.col === col) {
                var context = gameEngine.getContext();
                context.drawImage(_homeImage, _homePosition.x, _homePosition.y, _homeImage.width, _homeImage.height);
                
                debugEngine.log("BUILDING_RENDER - homeBuilder");
            }
        });
    });
