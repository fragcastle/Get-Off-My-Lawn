/*
    Pathfinder library based on a*
*/
var PathFinder = (function() {
    return {
        pushFinder: function(name, finder) {
            _finders.push({ name: name, finder: finder });
            _finders[name] = finder; //cheat a little
        },
        navigate: function( start, end, name ) {
            if(_finders.length === 1) {
                return _finders[0].finder.plotPath( start, end );
            } else {
                return _finders[name].plotPath( start, end );
            }
        }
    };
})();
