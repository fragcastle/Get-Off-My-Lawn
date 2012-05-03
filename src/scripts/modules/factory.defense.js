define(
    [
    'modules/engine.game'
    , 'modules/engine.map'
    , 'modules/engine.events'
    , 'modules/loader.assets'
    , 'modules/engine.util'
    , 'modules/engine.debug'
    ],
    function (gameEngine, mapEngine, eventEngine, assetLoader, util, debugEngine) {
        eventEngine.sub(gameEngine.events.MOUSE_DOWN, function(canvas, context, e) {
            var map = mapEngine.getCurrentMap();
            var index = util.pointToIndex(canvas, map.tileDimensions, map.width, { x: e.offsetX, y: e.offsetY });

            if (mapEngine.tileTypes[map.data[index]].isBuildable) {
                var defense = newDefense(index);
    
                map.defenses.push(defense);   
            }
        });

        var newDefense = function (index, rateOfFire, range) {
            return {
                index: index,
                rateOfFire: rateOfFire || 2000,
                range: range || 2,
                currentTarget: null,
                lastUpdate: Date.now(),

                image: assetLoader.getAsset('images/defense.png'),
                missileImage: assetLoader.getAsset('images/missile.png'),

                update: function () {
                    var now = Date.now();
                    var delta = now - this.lastUpdate;

                    if (delta >= this.rateOfFire) {
                        this.lastUpdate = now;

                        if (!this.currentTarget || this.currentTarget.life <= 0) {
                            // Try to acquire a target
                            this.currentTarget = null;

                            this.acquireTarget();
                        }

                        if (this.currentTarget) {
                            var canvas = gameEngine.getCanvas();
                            var map = mapEngine.getCurrentMap();
                            var rowCol = util.indexToRowCol(map.width, this.index);

                            var missile = {
                                index: this.index
                                , rotation: 0
                                , speed: 50
                                , damage: 15
                                , pos: util.entityRowColToPoint(canvas.width, map.tileDimensions, rowCol.row, rowCol.col, this.missileImage)
                                , target: this.currentTarget
                                , image: this.missileImage
                                , lastFrame: Date.now()
                                , lastUpdate: Date.now()
                                , die: function () {
                                    for (var i = map.missiles.length - 1; i > -1; i--) {
                                        if(map.missiles[i] == this) {
                                            map.missiles.remove(i);
                                            break;
                                        }
                                    }
                                }
                                , update: function () {
                                    var delta = Date.now() - this.lastUpdate;
                                    var deltaSeconds = (Date.now() - this.lastFrame) / 1000;
                                    var targetPos = util.indexToPoint(canvas.width, map.width, map.tileDimensions, this.target.index);

                                    if (Math.abs(Math.abs(targetPos.x) - Math.abs(this.pos.x)) < 10 && Math.abs(Math.abs(targetPos.y) - Math.abs(this.pos.y)) < 10) {
                                        this.target.life -= this.damage;

                                        if (this.target.life <= 0) {
                                            for (var i = map.enemies.length - 1; i > -1; i--) {
                                                if (map.enemies[i] == this.target) {
                                                    map.enemies.remove(i);
                                                    break;
                                                }
                                            }
                                        }

                                        this.die();

                                        return;
                                    }

                                    this.rotation = util.deltaToAngle(targetPos.x - this.pos.x, targetPos.y - this.pos.y);
                                    
                                    // Yay math:
                                    // soh cah toa
                                    // sin = opposite over hypotenuse
                                    // cos = adjacent over hypotenuse
                                    // tan = opposite over adjacent
                                    var distance = deltaSeconds * this.speed;
                                    
                                    this.pos.x += Math.cos(this.rotation) * distance;
                                    this.pos.y += Math.sin(this.rotation) * distance;
                                    
                                    this.lastFrame = Date.now();
                                }
                            };

                            map.missiles.push(missile);
                        }
                    }
                },

                acquireTarget: function () {
                    var map = mapEngine.getCurrentMap();

                    // Random targeting
                    this.currentTarget = util.random(map.enemies);

                    // Proximity targeting
                    // var target = mapEngine.getClosestEnemy(this.point, this.range);
                }
            };

        return {
            new: newDefense
            }
        }
    });
