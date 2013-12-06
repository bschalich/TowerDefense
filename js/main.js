enchant();

var GAME_SIZE = 640;

window.onload = function() {
   var game = new Game(GAME_SIZE, GAME_SIZE);
   
   game.preload('assets/levelbg.png', 'assets/levelpath.bg', 'assets/walk1.png');
   
   game.fps = 30;
   game.onload = function() {
      game.pushScene(new Level1());
   };
   
   game.start();
};

var WalkEnemyHealth = 20;
var WalkEnemySpeed = 10;

var Enemy = Class.create(Sprite, {
	initialize: function(assetIndex, health, speed) {
		Sprite.apply(this, [64, 64]);
		this.image = Game.instance.assets[assetIndex];
		this.frame = 0;
		
		this.health = health;
		this.speed = speed;
	}
});

var WalkEnemy = Class.create(Enemy, {
	initialize: function() {
		Enemy.apply(this, ['assets/walk1.png', WalkEnemyHealth, WalkEnemySpeed]);
		
		this.addEventListener(Event.ENTER_FRAME, this.walkRight);
	},
	
	walkRight: function(event) {
		this.x += (event.elapsed * 0.001) * 20;
	}
});


var Level1 = Class.create(Level, {
	initialize: function() {
	
		var L1Enemies = [];
		var L1W4 = [];
			L1W4.push(new WalkEnemy());
			L1W4.push(new WalkEnemy());
			L1W4.push(new WalkEnemy());
			L1W4.push(new WalkEnemy());
			L1Enemies.push(L1W4);
		var L1W3 = [];
			L1W3.push(new WalkEnemy());
			L1W3.push(new WalkEnemy());
			L1W3.push(new WalkEnemy());
			L1W3.push(new WalkEnemy());
			L1Enemies.push(L1W3);
		var L1W2 = [];
			L1W2.push(new WalkEnemy());
			L1W2.push(new WalkEnemy());
			L1W2.push(new WalkEnemy());
			L1W2.push(new WalkEnemy());
			L1Enemies.push(L1W2);
		var L1W1 = [];
			L1W1.push(new WalkEnemy());
			L1W1.push(new WalkEnemy());
			L1W1.push(new WalkEnemy());
			L1W1.push(new WalkEnemy());
			L1Enemies.push(L1W1);
			
		Level.apply(this, [L1Enemies, pathList]);
	}
});