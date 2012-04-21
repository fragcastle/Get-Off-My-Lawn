define(function () {
    return {
        stances: {
            ready: 0,
            walk: 1,
            jump: 2,
            flinch: 3,
            swing: 4, 
            kick: 5,
            jumpswing: 6, 
            jumpkick: 7, 
            dizzy: 8
        },
        orientations: {
            left: 0,
            right: 1
        },
        translatePosition: function(canvas, tileSize, row, col, entity) {
            var pos = {
                x: ((row - col) * tileSize.height) + Math.floor((canvas.width / 2) - (tileSize.width / 2)),
                y: Math.floor( (row + col) * (tileSize.height / 2) )
            };

            if (entity) {
                if (entity.width != tileSize.width) {
                    pos.x += tileSize.width / 2 - entity.width / 2;
                }

                if (entity.height != tileSize.height) {
                    pos.y -= entity.height - tileSize.height / 2;
                }
            }

            return pos;
        },
    };
});