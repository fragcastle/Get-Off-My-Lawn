define(function() {
    return {
        random: function (object) {
            if (typeof object == "object") {
                var properties = [];
                
                for (var propertyName in object) {
                    if (object.hasOwnProperty(propertyName)) {
                        properties.push(propertyName);
                    }
                }
                
                var length = properties.length;
                var randomIndex = Math.floor(Math.random() * length);
                
                return randomIndex;
            } else {
                var length = object.length;
                var randomIndex = Math.floor(Math.random() * length);
                
                return object[randomIndex];
            }
        },
    }
});