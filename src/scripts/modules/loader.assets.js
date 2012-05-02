define(
    [
        'modules/engine.events',
        'modules/engine.debug'
    ],
    function(eventEngine, debugEngine) {
        var ProgressBar = function(parent, min, max){
            this.element = document.createElement('progress');
            parent.appendChild(this.element);

            // initialize the progress bar at zero percent
            this.element.setAttribute('value', min);
            this.element.setAttribute('max', max);

            // for this example, progress will be some value [0,1]
            this.update = function (progress) {
                this.element.setAttribute('value', (progress/max) * 100);
            };
        };

        var AssetManager = function() {
            var downloadQueue = [],
                cache = {},
                counts = {
                    successes: 0,
                    fails: 0,
                    sum: function() {
                        return this.successes + this.fails;
                    }
                },
                parent = this,
                signalAllAssetsLoaded = function(){
                    debugEngine.log('All assets loaded.');
                    eventEngine.pub(parent.events.ALL_ASSETS_LOADED, this, [downloadQueue]);
                };

            this.queueAsset = function(path) {
                downloadQueue.push(path);
            };
            this.queueAssets = function(assets) {
                for(var i = -1, l = assets.length; ++i < l;) {
                    this.queueAsset(assets[i]);
                }
            }
            this.doneYet = function() {
                return (downloadQueue.length === counts.sum());
            };

            this.downloadAll = function() {
                debugEngine.log('starting download');
                if (downloadQueue.length === 0) {
                    signalAllAssetsLoaded();
                }
                for (var i = -1, l = downloadQueue.length; ++i < l;) {
                    var path = downloadQueue[i],
                        allDoneTrigger = signalAllAssetsLoaded,
                        manager = this,
                        counter = counts;

                    debugEngine.log('downloading ' + path);

                    function downloadImage(src, successCallback, failCallback) {
                        var image = new Image();
                        image.addEventListener('load', function(e) {
                            successCallback(e, image);
                        }, false);
                        image.addEventListener('error', function(e) {
                            failCallback(e, image);
                        }, false);
                        image.src = src;
                        return image;
                    }

                    cache[path] = downloadImage(path,
                        function onSuccess(e, img) {
                            counter.successes++;
                            var args = [ counter.sum(), img.src, 'ok', e ];

                            debugEngine.log('Loaded image:');
                            debugEngine.log(img);

                            eventEngine.pub(manager.events.ASSET_LOAD, manager, args);
                            if( manager.doneYet() ) {
                                allDoneTrigger();
                            }
                        },
                        function onFail(e, img) {
                            counter.fails++;
                            var args = [ counter.sum(), img.src, 'fail', e ];

                            eventEngine.pub(manager.events.ASSET_LOAD, manager, args);
                            if( manager.doneYet() ) {
                                allDoneTrigger();
                            }
                        });
                }
            };

            this.getAsset = function(path) {
                return cache[path];
            };

            this.createProgressBar = function(parent, min, max) {
                return new ProgressBar(parent, min || 0, max || 100);
            };

            this.events = {
                ASSET_LOAD: 'assetLoad',
                ALL_ASSETS_LOADED: 'allAssetsLoaded'
            };
        };
        return new AssetManager();
    });
