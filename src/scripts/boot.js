// Boot.js
// does all of the things... on boot
//
requirejs.config({
  paths: {
    'jquery' : 'http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min'
  }
});
require(
    [
        "jquery",
        "modules/engine.game",
        "modules/engine.map",
        "modules/engine.events",
        "modules/engine.debug",
        "modules/engine.config",
        "modules/builder.home",
        "modules/builder.trees"
    ],
    function($, gameEngine, mapEngine, eventEngine, debugEngine, configEngine) {
        configEngine.set("shouldDebug", true);
        $(function () {
            eventEngine.sub(gameEngine.events.MOUSE_DOWN, function(canvas, context, e) {
                debugEngine.log("MOUSE DOWN");
                debugEngine.log(e);
            });

            mapEngine.setCurrentLevel("levelOne").renderTo(gameEngine.getCanvas(), gameEngine.getContext());
        });
    });
