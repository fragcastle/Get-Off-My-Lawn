define(
    [
    'modules/loader.assets'
    , 'modules/engine.util'
    , '/enemies.json?callback=define'
    , 'modules/engine.debug'
    ],
    function(assetLoader, util, enemiesJson, debugEngine){
        var keyFrames = {
            ready: 'ready',
            walk: 'walk',
            jump: 'jump',
            flinch: 'flinch',
            swing: 'swing',
            kick: 'kick',
            jumpswing: 'jumpswing',
            jumpkick: 'jumpkick',
            dizzy: 'dizzy'
        };
        var orientations = { left: 0, right: 1 };
  
        var enemyTemplates = {};
        
        for(var i = -1; ++i < enemiesJson.enemies.length; ) {
            var enemyTemplate = enemiesJson.enemies[i];
            enemyTemplates[enemyTemplate.name] = enemyTemplate;
        }
  
        return {
            enemies: enemiesJson.enemies,
            new: function(templateName, index) {
                var template = enemyTemplates[templateName];
      
                return {
                    index: index,
                    targetIndex: index,
                    position: { x: 0, y: 0 },
                    
                    lastUpdate: Date.now(),
                    
                    rateOfMovement: 2000,
                    
                    template: template,
                    frame: util.random(template.keyFrames),
                    orientation: util.coinFlip() ? 0 : 1,
      
                    life: 100,
                    
                    setFrame: function(frameName) {
                        this.frame = this.template.keyFrames[frameName];
                    },
      
                    // used when the map engine is done rendering other things to move an enemy
                    draw: function (canvas, context, map, tileDimensions, currentFrame) {
                        var now = Date.now();
                        var delta = now - this.lastUpdate;
                        
                        var actionFrame = this.template.keyFrames[ this.frame ];
                        var frameChange = currentFrame * this.template.size.width;
                        
                        var percentOfDistanceTraveled = delta / this.rateOfMovement;
                        startPoint = util.indexToPoint(canvas.width, map.width, tileDimensions, this.index);
                        endPoint = util.indexToPoint(canvas.width, map.width, tileDimensions, this.targetIndex);
                        point = util.centerPoint(startPoint, endPoint, percentOfDistanceTraveled);
                        
                        //if (this.orientation === orientations.left) {
                        //    context.save();
                        //    context.translate(tilePos.x + 80, tilePos.y - 40);
                        //    context.scale(-1, 1);
                        //
                        //    pos = { x: 0, y: 0 };
                        //} else {
                        //    pos = util.entityRowColToPoint(canvas.width, tileDimensions, row, col, this.template.size);
                        //}
        
                        // Image, image x, image y, image width, image height, map x, map y, map width, map height
                        context.drawImage(this.template.image, actionFrame.x + frameChange, actionFrame.y, this.template.size.width, this.template.size.height, point.x, point.y, this.template.size.width, this.template.size.height);
        
                        if (this.orientation === orientations.left) {
                            context.restore();
                        }
                    },
                        
                    update: function (mapEngine) {
                        var now = Date.now();
                        var delta = now - this.lastUpdate;
        
                        if (delta >= this.rateOfMovement) {
                            this.lastUpdate = now;
          
                            var map = mapEngine.getCurrentMap();
                            var potentialMove = util.random(mapEngine.getEligibleMoves(this.targetIndex));
                            var tileType = map.data[potentialMove];
          
                            if (!mapEngine.tileTypes[tileType].isWalkable) {
                                potentialMove = this.targetIndex;
                            }
                            
                            this.index = this.targetIndex;
                            this.targetIndex = potentialMove;
                        }
                    }
                }
            }
        }
  });
