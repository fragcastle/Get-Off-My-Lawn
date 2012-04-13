define(["modules/engine.events", "jquery"], function(eventEngine, $) {
    var canvas = document.getElementById('theCanvas');
    var context = canvas.getContext('2d');

    canvas.addEventListener('mousedown', function(e){
        // pass the event off to any listeners
        eventEngine.pub("mouseDown", this, [canvas, context, e]);
    }, false);

    canvas.addEventListener("mousemove", function(e){
        eventEngine.pub("mouseMove", this, [canvas, context, e]);
    }, false);

    window.addEventListener("resize", function(e) {
        // user resizes the window, so have the canvas follow suit
        canvas.height = document.body.clientHeight;
        canvas.width = document.body.clientWidth;

        // notify any listeners
        eventEngine.pub("resize", this, [canvas, context, e, {
            // because we're nice we pass along the new size
            height: document.body.clientHeight,
            width: document.body.clientWidth
        }]);
    });

    var _loopTimer = null;
    $(function theLoop() {
        _loopTimer = setInterval(function(){
            eventEngine.pub("theLoop");
        }, 1);
    });

    return {
        getCanvas: function() {
            return canvas;
        },
        getContext: function() {
            return context;
        },
        events: {
            MOUSE_DOWN: "mouseDown",
            THE_LOOP: "theLoop",
            RESIZE: "resize",
            MOUSE_MOVE: "mouseMove"
        }
    };
});
