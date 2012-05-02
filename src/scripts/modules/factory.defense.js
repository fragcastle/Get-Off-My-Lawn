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

            var defense = newDefense(index);

            map.defenses.push(defense);
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
                                , pos: util.entityRowColToPoint(canvas.width, map.tileDimensions, rowCol.row, rowCol.col, this.missileImage)
                                , target: this.currentTarget
                                , image: this.missileImage
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
                                    var targetPos = util.indexToPoint(canvas.width, map.width, map.tileDimensions, this.target.index);

                                    if (targetPos.x === this.pos.x && targetPos.y === this.pos.y ) {
                                        this.target.life -= 15;

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

                                    if (targetPos.x > this.pos.x)
                                        this.pos.x += 1;
                                    else if (targetPos.x < this.pos.x)
                                        this.pos.x -= 1;

                                    if (targetPos.y > this.pos.y)
                                        this.pos.y += 1;
                                    else if (targetPos.y < this.pos.y)
                                        this.pos.y -= 1;

                                    //Math.pow(targetPos.x - pos.x, 2) + Math.pow(targetPos.y - pos.y, 2)
                                }
                            };

                            map.missiles.push(missile);
                        }
                    }

                        //if (this.currentTarget && this.currentTarget.life > 0) {
                        //    setTimeout(function () { defense.update(defense) }, this.rateOfFire);
                        //} else {
                        //    // No target acquired, try again
                        //    setTimeout(function () {defense.update(defense) }, 500);
                        //}
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
