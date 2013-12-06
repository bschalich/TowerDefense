enchant();

var WalkEnemyHealth = 20;
var WalkEnemySpeed = 20;

var Enemy = Class.create(Sprite, {
	initialize: function(assetIndex, health, speed, map) {
		Sprite.apply(this, [64, 64]);
		this.image = Game.instance.assets[assetIndex];
		this.frame = 0;
		
      this.map = map;
		
		this.health = health;
		this.speed = speed;
      
      this.addEventListener(Event.ENTER_FRAME, this.walk);
	},
	
	walk: function(event) {
      if (this.map.hitTest(0, 2))
         console.log("Collided");
      this.x += (event.elapsed * 0.001) * this.speed;
	}
});

var WalkEnemy = Class.create(Enemy, {
	initialize: function(map) {
		Enemy.apply(this, ['assets/walk1.png', WalkEnemyHealth, WalkEnemySpeed, map]);
      
		this.addEventListener(Event.ENTER_FRAME, this.walk);
	}
});