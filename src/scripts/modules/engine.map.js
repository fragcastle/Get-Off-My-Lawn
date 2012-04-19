define(
    [
        'modules/engine.events',
        'modules/engine.game',
        'modules/engine.util',
        'modules/loader.assets',
        'modules/engine.player',
        'modules/engine.debug',
        'http://localhost:8000/maps.json?callback=define'
    ],
    function (eventEngine, gameEngine, util, assetLoader, playerEngine, debugEngine, mapSet) {
        var maps = mapSet, _currentMap = null;
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
                _currentMap = maps[name] || _currentMap;

                var spawnData = _currentMap.spawnData;
                var length = _currentMap.enemyTemplates.length;
                var enemyTemplates = _currentMap.enemyTemplates;
                var enemies = _currentMap.enemies;

                var mapSize = _currentMap.width * _currentMap.width;

                for (var i = 0; i < mapSize; i++) {
                    if (spawnData[i] > 0 && util.propability(_currentMap.enemyFactor)) {
                        var enemyIndex = Math.floor(Math.random() * length);

                        enemyTemplates[enemyIndex].image = assetLoader.getAsset(enemyTemplates[enemyIndex].imagePath);

                        var enemy = {
                            index: i,
                            enemyTemplate: enemyTemplates[enemyIndex],
                            life: 20,
                            stance: util.random(playerEngine.stances),
                            orientation: util.random(playerEngine.orientations)
                        };

                        enemies.push(enemy);
                    }
                }

                eventEngine.pub(this.events.LEVEL_LOADED);
                return this; // for chaining
            },
            getDataIndex: function( pos ) {
                return ((pos.y/_currentMap.tileDimensions.height)*_currentMap.width) + (pos.x/_currentMap.tileDimensions.width);
            },
            getTileType: function( pos ) {
                return _currentMap.data.substr( this.getDataIndex(pos), 1 );
            },
            getPosFromDataIndex: function(index) {
                return {
                    x: (index%_currentMap.width) * _currentMap.tileDimensions.width,
                    y: ( index < _currentMap.width ? 0 : Math.floor(index / _currentMap.width) ) * _currentMap.tileDimensions.height
                };
            },
            getEligibleMoves: function (index) {
                var moves = [];
                var mapWidth = _currentMap.width;
                var mapSize = mapWidth * mapWidth;

                if ((index < 0) && (index % mapWidth !== 0))
                    moves.push(index - 1);
                if ((index - 1 < mapSize) && ((index + 1) % mapWidth !== 0))
                    moves.push(index + 1);
                if (index >= mapWidth)
                    moves.push(index - mapWidth);
                if (index < mapSize - mapWidth - 1)
                    moves.push(index + mapWidth);

                console.log(index);
                console.log(moves);
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
            translatePositionEntity: function(row, col, entity) {
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
                        pos.y -= entity.height - tile.height / 2;
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
                context.translate(0, 100);

                this.tileLoop(function(row, col, index) {
                    var img     = this.getTileImage(index),
                        tilePos = this.translatePosition( row, col );

                    context.drawImage(img, tilePos.x, tilePos.y, img.width, img.height);

                    eventEngine.pub(this.events.TILE_RENDER, this, [index, row, col, tilePos]);
                    eventEngine.pub(this.events.BUILDING_RENDER, this, [index, row, col, tilePos]);
                    eventEngine.pub(this.events.DEFENSE_RENDER, this, [index, row, col, tilePos]);
                    eventEngine.pub(this.events.PLAYER_RENDER, this, [index, row, col, tilePos]);
                    eventEngine.pub(this.events.EFFECT_RENDER, this, [index, row, col, tilePos]);

                    var enemies = _currentMap.enemies;
                    var enemyCount = enemies.length;


                    for (var i = 0; i < enemyCount; i++) {
                        if (enemies[i].index === index) {
                            var enemy = enemies[i];
                            var stances = playerEngine.stances;
                            var stance;
                            var pos;

                            if (enemy.stance === stances.ready) {
                                stance = enemy.enemyTemplate.ready;
                            } else if (enemy.stance === stances.walk) {
                                stance = enemy.enemyTemplate.walk;
                            } else if (enemy.stance === stances.jump) {
                                stance = enemy.enemyTemplate.jump;
                            } else if (enemy.stance === stances.flinch) {
                                stance = enemy.enemyTemplate.flinch;
                            } else if (enemy.stance === stances.swing) {
                                stance = enemy.enemyTemplate.swing;
                            } else if (enemy.stance === stances.kick) {
                                stance = enemy.enemyTemplate.kick;
                            } else if (enemy.stance === stances.jumpswing) {
                                stance = enemy.enemyTemplate.jumpswing;
                            } else if (enemy.stance === stances.jumpkick) {
                                stance = enemy.enemyTemplate.jumpkick;
                            } else if (enemy.stance === stances.dizzy) {
                                stance = enemy.enemyTemplate.dizzy;
                            }

                            var frameChange = gameEngine.getCurrentFrame() * enemy.enemyTemplate.size.width;

                            if (enemy.orientation === playerEngine.orientations.left) {
                                context.save();
                                context.translate(tilePos.x + 80, tilePos.y - 40);
                                context.scale(-1, 1);

                                pos = { x: 0, y: 0 };
                            } else {
                                pos = this.translatePositionEntity(row, col, enemy.enemyTemplate.size);
                            }

                            // Image, image x, image y, image width, image height, map x, map y, map width, map height
                            context.drawImage(enemy.enemyTemplate.image, stance.x + frameChange, stance.y, enemy.enemyTemplate.size.width, enemy.enemyTemplate.size.height, pos.x, pos.y, enemy.enemyTemplate.size.width, enemy.enemyTemplate.size.height);

                            if (enemy.orientation === playerEngine.orientations.left) {
                                context.restore();
                            }
                            break;
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
