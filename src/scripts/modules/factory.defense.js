define(
    [
    'modules/engine.game',
    'modules/engine.map',
    'modules/engine.events',
    'modules/loader.assets',
    'modules/engine.util',
    'modules/engine.debug',
    ],
    function (gameEngine, mapEngine, eventEngine, assetLoader, util, debugEngine) {
        eventEngine.sub(gameEngine.events.MOUSE_DOWN, function(canvas, context, e) {
            var map = mapEngine.getCurrentMap();
            var index = util.pointToIndex(canvas, map.tileDimensions, map.width, { x: e.offsetX, y: e.offsetY });

            var defense = newDefense(index);

            map.defenses.push(defense);

            defense.act();
        });

        var newDefense = function (index, rateOfFire, range) {
            return {
                index: index,
                rateOfFire: rateOfFire || 2000,
                range: range || 2,
                currentTarget: null,

                // TODO: Fix, this shouldn't be here
                image: assetLoader.getAsset('images/defense.png'),
                missileImage: assetLoader.getAsset('images/missile.png'),

                act: function () {
                    var defense = this;

                    if (!this.currentTarget || this.currentTarget.life <= 0) {
                        // Try to acquire a target
                        this.currentTarget = null;

                        this.acquireTarget();

                        if (this.currentTarget) {
                            debugEngine.log('Target acquired:');
                            debugEngine.log(this.currentTarget);

                            var canvas = gameEngine.getCanvas();
                            var map = mapEngine.getCurrentMap();
                            var rowCol = util.indexToRowCol(map.width, this.index);

                            var missile = {
                                index: this.index
                                , pos: util.entityRowColToPoint(canvas.width, map.tileDimensions, rowCol.row, rowCol.col, this.missileImage)
                                , target: this.currentTarget
                                , image: this.missileImage
                            };

                            map.missiles.push(missile);
                        }
                    }

                    if (this.currentTarget && this.currentTarget.life > 0) {
                        setTimeout(function () { defense.act(defense) }, this.rateOfFire);
                    } else {
                        // No target acquired, try again
                        setTimeout(function () {defense.act(defense) }, 500);
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
