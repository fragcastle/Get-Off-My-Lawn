define(function() {
    return {
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
                
                return randomIndex;
            }
            
            return [];
        },
        propability: function (factor) {
            var randomNumber = Math.floor(Math.random() * 100);
            return (randomNumber < factor * 100);
        }
    }
});