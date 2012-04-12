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
        "modules/engine.debug",
        "modules/builder.home",
        "modules/builder.trees"
    ],
    function($, mapEngine, eventEngine, configEngine, assetLoader, gameEngine) {
        configEngine.set("shouldDebug", true);

        // create a list of the assets we want to load
        var assets = [
            "images/grass.png",
            "images/dirt.png",
            "images/icecream.png",
            "images/tree.png"
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
                mapEngine.setCurrentLevel("levelOne")
                         .renderTo(gameEngine.getCanvas(), gameEngine.getContext());
            });

            eventEngine.sub(assetLoader.events.ASSET_LOAD, function(itemCount) {
                // update the progressbar
                progressBar.update(itemCount);
            });

            // prep the assetLoader and start downloading
            assetLoader.queueAssets(assets);
            assetLoader.downloadAll();
        });
    });
