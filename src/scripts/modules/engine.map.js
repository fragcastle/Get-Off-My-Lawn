define(
    [
    'modules/engine.events'
    , 'modules/engine.game'
    , 'modules/engine.util'
    , 'modules/loader.assets'
    , 'modules/engine.debug'
    , '/maps.json?callback=define'
    , 'modules/factory.enemy'
    ],
    function (eventEngine, gameEngine, util, assetLoader, debugEngine, mapSet, enemyFactory) {
        var maps = mapSet
            , _currentMap = null
            , _currentMapIndex = 0
            , _currentWave = 0
            , missileImage = null
            , mapOffset = 0
            , _animate = true;

        return {
            _getElligibleEvents: function() {
                var _e = [];
                for(var d in this.events.names) {
                    if( this.events.names.hasOwnProperty(d) ) {
                        _e.push( this.events.names[d] );
                    }
                }
                return _e;
            },
            getTileImage: function(cellPos) {
                var src = _currentMap.tiles[_currentMap.data.substr(cellPos,1)];
                return assetLoader.getAsset(src);
            },
            getCurrentMap: function() {
                return _currentMap;
            },
            setCurrentLevel: function(index) {
                debugEngine.log('Loading level...');
                _currentMap = maps.data[index] || _currentMap;
                _currentMapIndex = index;
                _currentWave = 0;
                
                debugEngine.log('Done loading level.');
                eventEngine.pub(this.events.LEVEL_LOADED);
                
                _animate = false;
                
                setTimeout(function (that) {
                    that.startLevel();
                }, 5000, this);
                
                return this; // for chaining
            },
            nextWave: function () {
                if (_currentWave > _currentMap.waves.length) {
                    this.setCurrentLevel(_currentMapIndex++);
                } else {
                    _currentWave++;
                    _animate = false;
                    
                    setTimeout(function (that) {
                        that.startWave();
                    }, 2000, this);
                }
            },
            startLevel: function () {
                this.addEnemies();
                
                _animate = true;
            },
            startWave: function () {
                this.addEnemies();
                
                _animate = true;
            },
            addEnemies: function () {
                var spawnData = _currentMap.spawnData;
                    length = enemyFactory.enemies.length,
                    enemyTemplates = enemyFactory.enemies,
                    enemies = _currentMap.enemies,
                    mapSize = _currentMap.width * _currentMap.width;

                for (var i = _currentMap.waves[_currentWave] - 1; i > -1; i--) {
                    var enemyIndex = Math.floor(Math.random() * length);
                    var enemyTemplate = enemyFactory.enemies[enemyIndex];

                    // load the asset into the template
                    enemyTemplates[enemyIndex].image = assetLoader.getAsset(enemyTemplates[enemyIndex].imagePath);

                    var enemy = enemyFactory.new(enemyTemplate.name, util.random(_currentMap.spawnData));

                    enemies.push(enemy);
                }
            },
            getEligibleMoves: function (index) {
                var moves = [];
                var mapWidth = _currentMap.width;
                var mapSize = mapWidth * mapWidth;

                if ((index > 0) && (index % mapWidth !== 0))
                    moves.push(index - 1);
                if ((index - 1 < mapSize) && ((index + 1) % mapWidth !== 0))
                    moves.push(index + 1);
                if (index >= mapWidth)
                    moves.push(index - mapWidth);
                if (index < mapSize - mapWidth - 1)
                    moves.push(index + mapWidth);

                return moves;
            },
            rowColToIndex: function(row, col) {
                return (row * _currentMap.width + col);
            },
            tileLoop: function(fn) {
                var index = 0;

                for (var startPosition = 0; startPosition < _currentMap.width; startPosition++) {
                    for (var row = startPosition; row < _currentMap.width; row++) {
                        var index = this.rowColToIndex(row, startPosition);
                        fn.call(this, row, startPosition, index);
                    }

                    for (var col = startPosition + 1; col < _currentMap.width; col++) {
                        var index = this.rowColToIndex(startPosition, col);
                        fn.call(this, startPosition, col, index);
                    }
                }
            },
            renderTo: function(canvas, context) {
                context.clearRect (0, 0, canvas.width, canvas.height);
                context.save();
                context.translate(0, mapOffset);

                if (_animate && _currentMap.enemies.length === 0) {
                    this.nextWave();
                }

                this.tileLoop(function(row, col, index) {
                    var img       = this.getTileImage(index)
                        , tilePos = util.rowColToPoint(canvas.width, _currentMap.tileDimensions, row, col);

                    context.drawImage(img, tilePos.x, tilePos.y, img.width, img.height);

                    eventEngine.pub(this.events.TILE_RENDER, this, [index, row, col, tilePos]);
                    eventEngine.pub(this.events.BUILDING_RENDER, this, [index, row, col, tilePos]);
                    eventEngine.pub(this.events.DEFENSE_RENDER, this, [index, row, col, tilePos]);
                    eventEngine.pub(this.events.PLAYER_RENDER, this, [index, row, col, tilePos]);
                    eventEngine.pub(this.events.EFFECT_RENDER, this, [index, row, col, tilePos]);

                    var enemies = _currentMap.enemies;

                    for (var i = enemies.length - 1; i > -1; i--) {
                        if (enemies[i].index === index) {
                            var enemy = enemies[i];
                            enemy.move(canvas, context, _currentMap.tileDimensions, row, col, tilePos, gameEngine.getCurrentFrame());
                        }
                    }

                    var defenses = _currentMap.defenses;

                    for (var i = defenses.length - 1; i > -1; i--) {
                        if (defenses[i].index === index) {
                            var defense = defenses[i];
                            
                            if (_animate) {
                                defense.update();
                            }

                            var defenseImage = defense.image;
                            var pos = util.entityRowColToPoint(canvas.width, _currentMap.tileDimensions, row, col, defenseImage);
                            context.drawImage(defenseImage, pos.x, pos.y, defenseImage.width, defenseImage.height);
                        }
                    }
                });

                context.restore();
            },
            renderMissilesTo: function (canvas, context) {
                var missiles = _currentMap.missiles;

                for (var i = missiles.length - 1; i > -1; i--) {
                    var missile = missiles[i];
                    var missileImage = missile.image;

                    if (i === 0) {
                        if(!_currentMap.debugTracePoints) {
                            _currentMap.debugTracePoints = [];
                        }

                        _currentMap.debugTracePoints.push({ x: missile.pos.x, y: missile.pos.y });
                    }

                    missile.update();

                    context.save();
                    context.translate(missile.pos.x, missile.pos.y);
                    context.rotate(missile.rotation * Math.PI / 180);
                    context.translate( - missileImage.width, - (missileImage.height / 2))
                    context.drawImage(missileImage, 0, 0, missileImage.width, missileImage.height);
                    context.restore();
                }

                if(_currentMap.debugTracePoints) {
                    for (var i = _currentMap.debugTracePoints.length - 1; i > -1; i--) {
                        var tracePoint = _currentMap.debugTracePoints[i];
                        //context.fillRect(tracePoint.x, tracePoint.y, 1, 1);
                    }
                }
            },
            tileTypes: {
                'G': {
                    isBuildable: true,
                    isWalkable: true
                },
                'W': {
                    isBuildable: false,
                    isWalkable: false
                },
                'S': {
                    isBuildable: true,
                    isWalkable: false
                },
                'D': {
                    isBuildable: true,
                    isWalkable: true
                },
                'F': {
                    isBuildable: false,
                    isWalkable: false
                }
            },
            events: {
                LEVEL_LOADED: 'levelLoaded',

                TILE_RENDER: 'tileRender',
                BUILDING_RENDER: 'buildingRender',
                DEFENSE_RENDER: 'defenseRender',
                PLAYER_RENDER: 'playerRender',
                EFFECT_RENDER: 'effectRender'
            }
        };
    });
