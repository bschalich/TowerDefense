enchant();

var GAME_SIZE = 640;
var DEBUG = true;

window.onload = function() {
   var game = new Game(GAME_SIZE, GAME_SIZE);
   
   game.preload(
'assets/ui/singletowerbuy.png',
'assets/towers/range.png',
'assets/Wave_start.wav',
'assets/button_pressed.wav',
'assets/lose-health.wav',
'assets/tilesets/map1.png',
'assets/enemies/skarmorydebug.png',
'assets/enemies/porygondebug.png',
'assets/enemies/groudondebug.png',
'assets/enemies/articunodebug.png',
'assets/enemies/skarmorySheet.png',
'assets/enemies/porygonSheet.png',
'assets/enemies/groudonSheet.png',
'assets/enemies/articunoSheet.png',
'assets/enemies/ryhornSheet.png',
'assets/enemies/aerodactylSheet.png',
'assets/enemies/aggrondebug.png',
'assets/enemies/bastidonSheet.png',
'assets/enemies/suicunedebug.png',
'assets/enemies/aronSheet.png',
'assets/enemies/kabutoSheet.png',
'assets/enemies/ryhorndebug.png',
'assets/enemies/aggronSheet.png',
'assets/enemies/suicuneSheet.png',
'assets/enemies/omanyteSheet.png',
'assets/enemies/arondebug.png',
'assets/towers/industrialAoE3.png',
'assets/towers/industrialRanged1.png',
'assets/towers/neonStatus2.png',
'assets/towers/stoneRanged1.png',
'assets/towers/industrialStatus1.png',
'assets/towers/industrialAoE2.png',
'assets/towers/neonStatus3.png',
'assets/towers/industrialRanged3.png',
'assets/towers/industrialStatus2.png',
'assets/towers/industrialAoE1.png',
'assets/towers/neonStatus1.png',
'assets/towers/industrialStatus3.png',
'assets/towers/industrialRanged2.png',
'assets/levels/level1.png',
'assets/UI/ButtonTemplate.png',
'assets/UI/Overlay.png',
'assets/UI/PauseScreen.png',
'assets/UI/Resource.png',
'assets/UI/Pause.png',
'assets/UI/Resume.png');
   
   game.fps = 30;
   game.onload = function() {
      game.pushScene(new Level1('assets/level1.png'));
   };
   
   game.start();
};
