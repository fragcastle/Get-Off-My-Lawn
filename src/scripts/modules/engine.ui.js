define(
    [
    'modules/engine.game'
    , 'modules/engine.map'
    , 'modules/engine.events'
    ],
    function (gameEngine, mapEngine, eventEngine) {
        eventEngine.sub(gameEngine.events.RENDER_LOOP_POST, function (e) {
            if(!mapEngine.getAnimate()) {
                var canvas = gameEngine.getCanvas();
                var context = gameEngine.getContext();

                var resumeAnimateTime = mapEngine.GetResumeAnimateTime();

                var secondsLeft = Math.ceil((resumeAnimateTime - Date.now()) / 1000);

                // Draw UI box
                context.save();
                context.translate((canvas.width / 2) - 200, 100);
                context.fillStyle   = '#fff';
                context.strokeStyle = '#000';
                context.lineWidth   = 1;

                context.fillRect  (0, 0, 400, 200);
                context.strokeRect(0, 0, 400, 200);

                // Draw text
                context.save();
                context.translate(50, 50);
                context.fillStyle    = '#000';
                context.font         = 'normal 30px sans-serif';
                context.textBaseline = 'top';
                context.fillText  ('Starting level in ' + secondsLeft + '...', 0, 0);

                // Reset
                context.restore();
                context.restore();
            }
        });

        //function(canvas, context, e) {
        //
        //    var map = mapEngine.getCurrentMap();
        //    var index = util.pointToIndex(canvas, map.tileDimensions, map.width, { x: e.offsetX, y: e.offsetY });
        //
        //    if (index < map.data.length && mapEngine.tileTypes[map.data[index]].isBuildable) {
        //        var defense = newDefense(index);
        //
        //        map.defenses.push(defense);
        //    }
        //});
    });
