// Boot.js
// does all of the things... on boot
//
requirejs.config({
  paths: {
    'jquery' : 'http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min'
  },
  urlArgs: "bust=" + (new Date()).getTime()
});
require(
    [
        "jquery",
        "modules/engine.map",
        "modules/engine.events",
        "modules/engine.config",
        "modules/loader.assets",
        "modules/engine.game",
        "modules/engine.util",
        "modules/engine.debug",
        "modules/builder.home",
        "modules/builder.trees",
        "modules/factory.enemy",
        "modules/engine.enemy", // doesn't create an object it just sets up event listeners
    ],
    function($, mapEngine, eventEngine, configEngine, assetLoader, gameEngine, util, debugEngine, enemyFactory) {
        configEngine.set("shouldDebug", true);

        // create a list of the assets we want to load
        // TODO: we should probably move this logic out to the specific
        // json scripts that we load. Like maps and enemies
        // so that they can tell the assetLoader to load them?
        var assets = [
            "images/grass.png",
            "images/dirt.png",
            "images/water.png",
            "images/fence.png",
            "images/icecream.png",
            "images/tree.png",
            "images/kit_from_firefox.png",
            "images/gnu_from_gnu.png",
            "images/droid_from_android.png",
            "images/sara_from_opengameart.png",
            "images/tux_from_linux.png",
            "images/wilber_from_gimp_0.png"
        ];

        $(function () {
            var progressBar = assetLoader.createProgressBar($('#loaderProgress')[0], 0, assets.length);

            eventEngine.sub(gameEngine.events.MOUSE_DOWN, function(canvas, context, e) {
                debugEngine.log("MOUSE DOWN");
                debugEngine.log(e);
            });

            // don't render until all the assets have been loaded
            eventEngine.sub(assetLoader.events.ALL_ASSETS_LOADED, function(e) {
                $("#loaderProgress").hide();
                mapEngine.setCurrentLevel("levelOne");

                eventEngine.sub(gameEngine.events.RENDER_LOOP, function (e) {
                    mapEngine.renderTo(gameEngine.getCanvas(), gameEngine.getContext());
                });

                eventEngine.sub(gameEngine.events.GAME_LOOP, function (e) {
                    var currentMap = mapEngine.getCurrentMap();
                    var enemies = currentMap.enemies;
                    var length = enemies.length;

                    for (var i = 0; i < length; i++) {
                        var potentialMove = util.random(mapEngine.getEligibleMoves(enemies[i].index));
                        var tileType = currentMap.data[potentialMove];

                        if (mapEngine.tileTypes[tileType].isWalkable) {
                            enemies[i].index = potentialMove;
                        }
                    }
                });
            });

            eventEngine.sub(assetLoader.events.ASSET_LOAD, function(itemCount) {
                // update the progressbar
                progressBar.update(itemCount);
            });

            // prep the assetLoader and start downloading
            assetLoader.queueAssets(assets);
            assetLoader.downloadAll();

            // publish the boot event
            eventEngine.pub("boot", this);
        });
    });
