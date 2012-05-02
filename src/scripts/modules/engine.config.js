define(
    [
        'modules/engine.events',
        'jquery'
    ],
    function(eventEngine, $){
        var _settings = {};
        return {
            set: function(name, val) {
                eventEngine.pub(this.events.CHANGED, this, [_settings[name], val]);
                _settings[name] = val;
            },
            get: function(name) {
                eventEngine.pub(this.events.RETRIEVED, this, [name]);
                return _settings[name] || null;
            },
            pull: function(url) {
                $.get(url, function(data){
                    _settings = $.merge(data, _settings);
                }, 'json');
                eventEngine.pub(this.events.PULLED, this, [_settings]);
            },
            events: {
                CHANGED: 'settingChanged',
                RETRIEVED: 'settingRetrieved',
                PULLED: 'settingsPulled'
            }
        };
    });
