require(
    ["modules/engine.map", "modules/engine.events", "modules/engine.game"],
    function(mapEngine, eventEngine, gameEngine) {
        eventEngine.sub(mapEngine.events.LOAD_COMPLETE, function(){
            var map = mapEngine.getCurrentMap();
            var homeEntity = map.entities.home;
            var canvas = gameEngine.getCanvas();
            var context = gameEngine.getContext();
            var homeImage = new Image();
            homeImage.src = homeEntity.texture;
            var pos = mapEngine.translatePosition(homeEntity.row, homeEntity.col, homeImage);

            // center the image within the tile
            var y = pos.y; // + homeImage.height/2;
            var x = pos.x;

            context.drawImage(homeImage, x, y, homeImage.width, homeImage.height);
        });
    });
