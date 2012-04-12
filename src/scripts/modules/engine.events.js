define(function() {
    var _eventEngine = {
        subscribers: {}
    }

    return {
        sub: function(eventName, fn) {
            if( _eventEngine.subscribers[eventName] ) {
                _eventEngine.subscribers[eventName].push(fn);
            } else {
                _eventEngine.subscribers[eventName] = [fn];
            }
        },
        pub: function(eventName, sender, args) {
            if( _eventEngine.subscribers[eventName] ) {
                for(var i = -1, l = _eventEngine.subscribers[eventName].length; ++i < l;) {
                    var fn = _eventEngine.subscribers[eventName][i];
                    fn.apply(sender || this, args || []);
                }
            }
        }
    }
});
