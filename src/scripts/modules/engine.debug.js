define(
    [
        'jquery',
        'modules/engine.game',
        'modules/engine.events',
        'modules/engine.config'
    ],
    function($, gameEngine, eventEngine, configEngine){
        var frames = 0,
            date = new Date(),
            debug = {
                log: function(o) {
                    console.log(o);
                }
            },
            debugData = {};
        var seconds = date.getSeconds();

        function drawDebug(){
            if($('#debug').size() === 0) {
                $('<div />', {
                    id: 'debug',
                    style: 'position: absolute; top: 0; left: 0; z-index: 1000;'
                }).insertBefore('body > *:first');
            }
            $('#debug').html('');
            for(var p in debugData){
                $('#debug').html( $('#debug').html() + '<br /><strong>' + p + ': </strong>' + debugData[p] );
            }
        }

        eventEngine.sub(gameEngine.events.MOUSE_MOVE, function(canvas, context, e) {
            var shouldDebug = configEngine.get('shouldDebug');
            if( shouldDebug ) {
                var pos     = { x: e.clientX, y: e.clientY }
                    , img     = context.getImageData(e.clientX, e.clientY, 1, 1)
                    , idata   = img.data
                    , red     = idata[0]
                    , green   = idata[1]
                    , blue    = idata[2]
                    , alpha   = idata[3];

                var rgba      = 'rgba(' + red + ', ' + green + ', ' + blue + ', ' + alpha + ')';

                debugData['rgba'] = rgba;
            }
        });

        eventEngine.sub(gameEngine.events.RENDER_LOOP, function(){
            var shouldDebug = configEngine.get('shouldDebug');
            if( shouldDebug ) {
                if(new Date().getSeconds() !== seconds) {
                    // if the debug elem already exists, set it's HTML to our message
                    debugData['FPS'] = frames;
                    frames = 0;
                    seconds = new Date().getSeconds();
                } else {
                    frames++;
                }
            }
        });

        setInterval(drawDebug, 250);

        return debug;
    });
