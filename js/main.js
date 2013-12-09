enchant();

var GAME_SIZE = 640;
var DEBUG = true;

var PAUSE_SCREEN;
var MENU_SCREEN;
var PLAYER_GOLD = 0;
var PLAYER_HEALTH = 14;

window.onload = function() {
   var game = new Game(GAME_SIZE, GAME_SIZE);
   
   game.preload(
'assets/tilesets/map1.num.png',
'assets/tilesets/map1.png',
'assets/ui/Pause.png',
'assets/ui/Resource.png',
'assets/ui/UI_Buttons.png',
'assets/ui/Overlay.png',
'assets/ui/PauseScreen.png',
'assets/ui/ButtonTemplate.png',
'assets/ui/TutorialScreen.png',
'assets/ui/singletowerbuy.png',
'assets/ui/life.png',
'assets/ui/Stats.png',
'assets/ui/Resume.png',
'assets/levels/level1.png',
'assets/enemies/articunodebug.png',
'assets/enemies/aronSheet.png',
'assets/enemies/skarmorydebug.png',
'assets/enemies/suicuneSheet.png',
'assets/enemies/omanyteSheet.png',
'assets/enemies/articunoSheet.png',
'assets/enemies/arondebug.png',
'assets/enemies/skarmorySheet.png',
'assets/enemies/suicunedebug.png',
'assets/enemies/aerodactylSheet.png',
'assets/enemies/ryhorndebug.png',
'assets/enemies/bastidonSheet.png',
'assets/enemies/porygonSheet.png',
'assets/enemies/kabutoSheet.png',
'assets/enemies/groudonSheet.png',
'assets/enemies/aggronSheet.png',
'assets/enemies/ryhornSheet.png',
'assets/enemies/porygondebug.png',
'assets/enemies/groudondebug.png',
'assets/enemies/aggrondebug.png',
'assets/narrative/title4.png',
'assets/narrative/title3.png',
'assets/narrative/title2.png',
'assets/narrative/title5.png',
'assets/narrative/title6.png',
'assets/narrative/title1.png',
'assets/narrative/title7.png',
'assets/bullet/arrow.png',
'assets/bullet/bullet.png',
'assets/bullet/blueOrb.png',
'assets/bullet/laser.png',
'assets/bullet/rock.png',
'assets/bullet/dreamcatcher.png',
'assets/bullet/blueLaser.png',
'assets/bullet/cannonball.png',
'assets/bullet/spear.png',
'assets/towers/stoneStatus2.png',
'assets/towers/industrialAoE2.png',
'assets/towers/neonAoE2.png',
'assets/towers/stoneAoE2.png',
'assets/towers/neonRanged2.png',
'assets/towers/range.png',
'assets/towers/neonStatus3.png',
'assets/towers/industrialRanged1.png',
'assets/towers/neonStatus2.png',
'assets/towers/stoneAoE3.png',
'assets/towers/neonRanged3.png',
'assets/towers/industrialAoE3.png',
'assets/towers/neonAoE3.png',
'assets/towers/stoneStatus3.png',
'assets/towers/industrialStatus1.png',
'assets/towers/industrialStatus2.png',
'assets/towers/industrialRanged3.png',
'assets/towers/neonStatus1.png',
'assets/towers/stoneRanged1.png',
'assets/towers/industrialRanged2.png',
'assets/towers/industrialStatus3.png',
'assets/towers/stoneStatus1.png',
'assets/towers/industrialAoE1.png',
'assets/towers/neonAoE1.png',
'assets/towers/stoneAoE1.png',
'assets/towers/neonRanged1.png',
//'assets/background.wav',
'assets/getItem.wav',
'assets/ui/TutorialScreen.png',
'assets/button_pressed.wav');
   
   game.fps = 30;
   game.onload = function() {
      PAUSE_SCREEN = new PauseScreen();
      MENU_SCREEN = new MenuScreen();
      game.pushScene(new Level3(10));
      game.pushScene(new Level2(8));
      game.pushScene(new Level1(6));
      game.pushScene(new Level3(4));
      game.pushScene(new Level2(3));
      game.pushScene(new Level1(2.5));
      game.pushScene(new Level3(2));
      game.pushScene(new Level2(1.5));
      game.pushScene(new Level1(1));
      game.pushScene(new Tutorial());
      game.pushScene(new CutScene(7));
      game.pushScene(new CutScene(6));
      game.pushScene(new CutScene(5));
      game.pushScene(new CutScene(4));
      game.pushScene(new CutScene(3));
      game.pushScene(new CutScene(2));
      game.pushScene(new CutScene(1));
   };
   
   game.start();
};
