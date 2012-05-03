define(
    [
    'modules/engine.events'
    , 'modules/engine.util'
    , 'jquery'
    ],
    function(eventEngine, util, $) {
    var canvas = document.getElementById('theCanvas');
    var context = canvas.getContext('2d');

    var frameCount = 3;
    var msPerFrame = 400;

    var currentFrame = 0;
    var lastFrameChange = Date.now();

    canvas.addEventListener('mousedown', function(e){
        // pass the event off to any listeners
        eventEngine.pub('mouseDown', this, [canvas, context, e]);
    }, false);

    document.onkeypress = function(e) {
        eventEngine.pub('keyPress', this, [canvas, context, e]);
    };

    canvas.addEventListener('mousemove', function(e){
        eventEngine.pub('mouseMove', this, [canvas, context, e]);
    }, false);

    window.addEventListener('resize', function(e) {
        // user resizes the window, so have the canvas follow suit
        canvas.height = document.body.clientHeight;
        canvas.width = document.body.clientWidth;

        // notify any listeners
        eventEngine.pub('resize', this, [canvas, context, e, {
            // because we're nice we pass along the new size
            height: document.body.clientHeight,
            width: document.body.clientWidth
        }]);
    });

    window.requestAnimFrame = (function(callback) {
        return window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        function(callback) {
            window.setTimeout(callback, 1000 / 60);
        };
    })();

    var renderLoop = function () {
        requestAnimFrame(function() {
            renderLoop();
        });

        var delta = Date.now() - lastFrameChange;

        if (delta > msPerFrame) {
            lastFrameChange = Date.now();
            currentFrame++;

            if (currentFrame === 3)
                currentFrame = 0;
        }

        eventEngine.pub('renderLoop');
        eventEngine.pub('renderLoopPost');
    }

    var gameLoop = function () {
        eventEngine.pub('gameLoop');

        window.setTimeout(gameLoop, 2000);
    }

    $(renderLoop);
    $(gameLoop);

    return {
        getCurrentFrame: function() {
            return currentFrame;
        },
        getCanvas: function() {
            return canvas;
        },
        getContext: function() {
            return context;
        },
        events: {
            MOUSE_DOWN: 'mouseDown',
            RENDER_LOOP: 'renderLoop',
            RENDER_LOOP_POST: 'renderLoopPost',
            GAME_LOOP: 'gameLoop',
            RESIZE: 'resize',
            MOUSE_MOVE: 'mouseMove',
            KEY_PRESS: 'keyPress'
        }
    };
});
