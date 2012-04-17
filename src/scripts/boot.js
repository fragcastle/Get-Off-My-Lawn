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
        "modules/builder.trees",
        "modules/builder.enemies"
    ],
    function($, mapEngine, eventEngine, configEngine, assetLoader, gameEngine, debugEngine) {
        configEngine.set("shouldDebug", true);

        // create a list of the assets we want to load
        var assets = [
            "images/grass.png",
            "images/dirt.png",
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
                
                eventEngine.sub(gameEngine.events.THE_LOOP, function (e) {
                    mapEngine.renderTo(gameEngine.getCanvas(), gameEngine.getContext());
                 });
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