define(
    [
    'modules/engine.player',
    ],
    function (playerEngine) {
        return {
            enemyAction: function (canvas, context, tileDimensions, enemy, row, col, tilePos, currentFrame) {
                var stance, pos;
                var stances = playerEngine.stances;
                
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
    
                var frameChange = currentFrame * enemy.enemyTemplate.size.width;
    
                if (enemy.orientation === playerEngine.orientations.left) {
                    context.save();
                    context.translate(tilePos.x + 80, tilePos.y - 40);
                    context.scale(-1, 1);
    
                    pos = { x: 0, y: 0 };
                } else {
                    pos = playerEngine.translatePosition(canvas, tileDimensions, row, col, enemy.enemyTemplate.size);
                }
    
                // Image, image x, image y, image width, image height, map x, map y, map width, map height
                context.drawImage(enemy.enemyTemplate.image, stance.x + frameChange, stance.y, enemy.enemyTemplate.size.width, enemy.enemyTemplate.size.height, pos.x, pos.y, enemy.enemyTemplate.size.width, enemy.enemyTemplate.size.height);
    
                if (enemy.orientation === playerEngine.orientations.left) {
                    context.restore();
                }
            }
        };
    });