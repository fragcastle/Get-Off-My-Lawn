define(
    [
        'modules/engine.events',
        'modules/engine.game',
        'modules/engine.util',
        'modules/loader.assets',
        'modules/engine.debug',
        'http://localhost:8000/maps.json?callback=define',
        'modules/factory.enemy'
    ],
    function (eventEngine, gameEngine, util, assetLoader, debugEngine, mapSet, enemyFactory) {
        var maps = mapSet
            , _currentMap = null
            , missileImage = null
            , mapOffset = 0;
        
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
            setCurrentLevel: function(name) {
                debugEngine.log('Loading level...');
                _currentMap = maps[name] || _currentMap;
                
                var spawnData = _currentMap.spawnData;
                    length = enemyFactory.enemies.length,
                    enemyTemplates = enemyFactory.enemies,
                    enemies = _currentMap.enemies,
                    mapSize = _currentMap.width * _currentMap.width;

                for (var i = 0; i < mapSize; i++) {
                    if (spawnData[i] > 0 && util.propability(_currentMap.enemyFactor)) {
                        var enemyIndex = Math.floor(Math.random() * length);
                        var enemyTemplate = enemyFactory.enemies[enemyIndex];

                        // load the asset into the template
                        enemyTemplates[enemyIndex].image = assetLoader.getAsset(enemyTemplates[enemyIndex].imagePath);

                        var enemy = enemyFactory.new(enemyTemplate.name);

                        enemies.push(enemy);
                    }
                }

                debugEngine.log('Done loading level.');
                eventEngine.pub(this.events.LEVEL_LOADED);
                return this; // for chaining
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
            translatePosition: function(row, col, entity) {
                var tile    = _currentMap.tileDimensions;
                var canvas  = gameEngine.getCanvas();
                var pos = {
                    x: ((row - col) * tile.height) + Math.floor((canvas.width / 2) - (tile.width / 2)),
                    y: Math.floor( (row + col) * (tile.height / 2) )
                };

                if (entity) {
                    if (entity.width != tile.width) {
                        pos.x += tile.width / 2 - entity.width / 2;
                    }

                    if (entity.height != tile.height) {
                        pos.y -= entity.height - tile.height;
                    }
                }

                return pos;
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

                this.tileLoop(function(row, col, index) {
                    var img     = this.getTileImage(index)
                        , tilePos = this.translatePosition( row, col );

                    context.drawImage(img, tilePos.x, tilePos.y, img.width, img.height);

                    eventEngine.pub(this.events.TILE_RENDER, this, [index, row, col, tilePos]);
                    eventEngine.pub(this.events.BUILDING_RENDER, this, [index, row, col, tilePos]);
                    eventEngine.pub(this.events.DEFENSE_RENDER, this, [index, row, col, tilePos]);
                    eventEngine.pub(this.events.PLAYER_RENDER, this, [index, row, col, tilePos]);
                    eventEngine.pub(this.events.EFFECT_RENDER, this, [index, row, col, tilePos]);

                    var enemies = _currentMap.enemies;
                    var enemyCount = enemies.length;

                    for (var i = enemies.length - 1; i > -1; i--) {
                        if (enemies[i].index === index) {
                            var enemy = enemies[i];
                            enemy.move(canvas, context, _currentMap.tileDimensions, row, col, tilePos, gameEngine.getCurrentFrame());
                        }
                    }
                    
                    var defenses = _currentMap.defenses;
                    var defenseImage = assetLoader.getAsset('images/defense.png');

                    for (var i = defenses.length - 1; i > -1; i--) {
                        if (defenses[i].index === index) {
                            context.drawImage(defenseImage, tilePos.x, tilePos.y, defenseImage.width, defenseImage.height);
                        }
                    }

                    var missiles = _currentMap.missiles;
                    var missileImage = assetLoader.getAsset('images/missile.png');

                    for (var i = missiles.length - 1; i > -1; i--) {
                        if (missiles[i].index === index) {
                            context.drawImage(missileImage, missiles[i].pos.x, missiles[i].pos.y, missileImage.width, missileImage.height);
                        }
                    }
                });

                context.restore();
            },
            tileTypes: {
                "G": {
                    isBuildable: true,
                    isWalkable: true
                },
                "W": {
                    isBuildable: false,
                    isWalkable: false
                },
                "S": {
                    isBuildable: true,
                    isWalkable: false
                },
                "D": {
                    isBuildable: true,
                    isWalkable: true
                },
                "F": {
                    isBuildable: true,
                    isWalkable: false
                }
            },
            events: {
                LEVEL_LOADED: "levelLoaded",

                TILE_RENDER: "tileRender",
                BUILDING_RENDER: "buildingRender",
                DEFENSE_RENDER: "defenseRender",
                PLAYER_RENDER: "playerRender",
                EFFECT_RENDER: "effectRender"
            }
        };
    });
