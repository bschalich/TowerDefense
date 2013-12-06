enchant();

var GAME_SIZE = 600;
var DEBUG = true;

window.onload = function() {
   var game = new Game(GAME_SIZE, GAME_SIZE);
   
   game.preload('assets/map1.png', 'assets/walk1.png', 'assets/groudonSheet.png');
   
   game.fps = 30;
   game.onload = function() {
      game.pushScene(new Level1('assets/level1.png'));
   };
   
   game.start();
};
