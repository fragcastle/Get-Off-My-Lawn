(function ($) {
    $(function () {
        var canvas = document.getElementById('theCanvas');
        var context = canvas.getContext('2d');

        App.load(canvas, context);
        
        canvas.addEventListener('mousedown', App.handleMouseDown, false);
        canvas.addEventListener('mousemove', App.handleMouseMove, false);
        
        App.draw();
        
        $('#build').trigger('click');
    });
})(jQuery);