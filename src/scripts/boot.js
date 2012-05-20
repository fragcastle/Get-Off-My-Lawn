// Boot.js
// does all of the things... on boot
//
requirejs.config({
    paths: {
        'jquery' : 'http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min'
    },
    urlArgs: 'bust=' + (new Date()).getTime()
});
require(
    [
    'jquery'
    , 'modules/engine.map'
    , 'modules/engine.events'
    , 'modules/engine.config'
    , 'modules/loader.assets'
    , 'modules/engine.game'
    , 'modules/engine.util'
    , 'modules/engine.debug'
    , 'modules/factory.enemy'
    , 'modules/factory.defense'
    , 'modules/builder.home'
    , 'modules/builder.trees'
    ],
    function($, mapEngine, eventEngine, configEngine, assetLoader, gameEngine, util, debugEngine, enemyFactory, defenseFactory) {
        configEngine.set('shouldDebug', true);

        // create a list of the assets we want to load
        // TODO: we should probably move this logic out to the specific
        // json scripts that we load. Like maps and enemies
        // so that they can tell the assetLoader to load them?
        var assets = [
            'images/grass.png',
            'images/dirt.png',
            'images/water.png',
            'images/fence.png',
            'images/icecream.png',
            'images/tree.png',
            'images/kit_from_firefox.png',
            'images/gnu_from_gnu.png',
            'images/droid_from_android.png',
            'images/sara_from_opengameart.png',
            'images/tux_from_linux.png',
            'images/wilber_from_gimp_0.png',
            'images/missile.png',
            'images/defense.png'
        ];

        $(function () {
            var progressBar = assetLoader.createProgressBar($('#loaderProgress')[0], 0, assets.length);

            // don't render until all the assets have been loaded
            eventEngine.sub(assetLoader.events.ALL_ASSETS_LOADED, function(e) {
                $('#loaderProgress').hide();
                mapEngine.setCurrentLevel(0);

                eventEngine.sub(gameEngine.events.RENDER_LOOP_PRE, function (e) {
                    mapEngine.setupRender();
                });

                eventEngine.sub(gameEngine.events.RENDER_LOOP, function (e) {
                    mapEngine.renderTo(gameEngine.getCanvas(), gameEngine.getContext());
                });

                eventEngine.sub(gameEngine.events.RENDER_LOOP_POST, function (e) {
                    mapEngine.renderMissilesTo(gameEngine.getCanvas(), gameEngine.getContext());
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
            eventEngine.pub('boot', this);
        });
    });

Array.prototype.remove = function(from, to) {
  var rest = this.slice((to || from) + 1 || this.length);
  this.length = from < 0 ? this.length + from : from;
  return this.push.apply(this, rest);
};
