require(
  [
    'modules/engine.events',
    'modules/engine.map',
    'modules/factory.enemy',
    'modules/engine.util'
  ],
  function(eventEngine, mapEngine, enemyFactory, util) {
      eventEngine.sub('allAssetsLoaded', function(e) {
          eventEngine.sub('gameLoop', function (e) {
              var currentMap = mapEngine.getCurrentMap();
              var enemies = currentMap.enemies;
              var length = enemies.length;

              for (var i = 0; i < length; i++) {
                  var potentialMove = util.random(mapEngine.getEligibleMoves(enemies[i].index));
                  var tileType = currentMap.data[potentialMove];

                  if (mapEngine.tileTypes[tileType].isWalkable) {
                      enemies[i].index = potentialMove;
                  }
              }
          });
      });
  });
