define(function() {
    return {
        coinFlip: function() {
            return this.random([true,false]);
        },
        // Pick a random property from an object, or a random index from an array
        random: function (object) {
            if (object instanceof Array) {
                var length = object.length;
                var randomIndex = Math.floor(Math.random() * length);

                return object[randomIndex];
            } else if (typeof object == "object") {
                var properties = [];

                for (var propertyName in object) {
                    if (object.hasOwnProperty(propertyName)) {
                        properties.push(propertyName);
                    }
                }

                var length = properties.length;
                var randomIndex = Math.floor(Math.random() * length);

                return properties[randomIndex];
            }

            return [];
        },
        propability: function (factor) {
            var randomNumber = Math.floor(Math.random() * 100);
            return (randomNumber < factor * 100);
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
    }
});
