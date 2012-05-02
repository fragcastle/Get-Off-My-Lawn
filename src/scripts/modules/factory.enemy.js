define([
      'modules/loader.assets',
      'modules/engine.util',
      'http://localhost:8000/enemies.json?callback=define',
      'modules/engine.debug'
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
        new: function(templateName) {
          var template = enemyTemplates[templateName];
          return {
              template: template,
              frame: util.random(template.keyFrames),
              orientation: util.coinFlip() ? 0 : 1,
              setFrame: function(frameName) {
                  this.frame = this.template.keyFrames[frameName];
              },

              // used during the render_loop to move enemies
              index: 0,

              life: 100,

              // used when the map engine is done rendering other things to move an enemy
              move: function (canvas, context, tileDimensions, row, col, tilePos, currentFrame) {
                var actionFrame = this.template.keyFrames[ this.frame ];

                var frameChange = currentFrame * this.template.size.width;

                if (this.orientation === orientations.left) {
                    context.save();
                    context.translate(tilePos.x + 80, tilePos.y - 40);
                    context.scale(-1, 1);

                    pos = { x: 0, y: 0 };
                } else {
                    pos = util.entityRowColToPoint(canvas.width, tileDimensions, row, col, this.template.size);
                }

                // Image, image x, image y, image width, image height, map x, map y, map width, map height
                context.drawImage(this.template.image, actionFrame.x + frameChange, actionFrame.y, this.template.size.width, this.template.size.height, pos.x, pos.y, this.template.size.width, this.template.size.height);

                if (this.orientation === orientations.left) {
                    context.restore();
                }
            }
          }
        }
      }
  });
