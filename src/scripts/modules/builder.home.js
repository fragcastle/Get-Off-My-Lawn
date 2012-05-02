require(
    ["modules/engine.map"
     , "modules/engine.events"
     , "modules/engine.game"
     , "modules/engine.util"
     , 'modules/engine.debug'],
    function(mapEngine, eventEngine, gameEngine, util, debugEngine) {
        var _home, _homeImage;

        eventEngine.sub(mapEngine.events.LEVEL_LOADED, function() {
            var map = mapEngine.getCurrentMap();
            _home = map.entities.home;
            _homeImage = new Image();
            _homeImage.src = _home.texture;
        });

        eventEngine.sub(mapEngine.events.BUILDING_RENDER, function(index, row, col) {
            if (_home.row === row && _home.col === col) {
                var canvas = gameEngine.getCanvas();
                var map = mapEngine.getCurrentMap();

                // center the image within the tile
                var homePosition = util.entityRowColToPoint(canvas.width, map.tileDimensions, _home.row, _home.col, _homeImage);

                var context = gameEngine.getContext();
                context.drawImage(_homeImage, homePosition.x, homePosition.y, _homeImage.width, _homeImage.height);
            }
        });
    });
