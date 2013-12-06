enchant();

var GAME_SIZE = 600;

window.onload = function() {
   var game = new Game(GAME_SIZE, GAME_SIZE);
   
   game.preload('assets/level1.png', 'assets/walk1.png');
   
   game.fps = 30;
   game.onload = function() {
      game.pushScene(new Level1('assets/level1.png'));
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

// Tower constants

var AreaTowerRange = 50;
var AreaTowerPower = 5;
var AreaTowerSpeed = 2;
var AreaTowerBlast = 10;

var StatusTowerRange = 75;
var StatusTowerPower = 10;
var StatusTowerSpeed = 0.2;
var StatusTowerBlast = 10;

var SingleTowerRange = 150;
var SingleTowerPower = 15;
var SingleTowerSpeed = 1;
var SingleTowerBlast = 1;

var Tower = Class.create(Sprite, {
   initialize: function(assetIndex, range, power, speed, blast, effect) {
      Sprite.apply(this, [64, 64]);
      this.image = Game.instance.assets[assetIndex];
      this.frame = 0;
      
      this.range = range;
      this.power = power;
      this.speed = speed;
      this.blast = blast;
      this.effect = effect;
      
      this.attackTimer = 0;
   },
   
   isReloaded: function(elapsed) {
      this.attackTimer += (elapsed * 0.001);
      return (this.attackTimer >= this.speed);
   },
   
   inRange: function(enemy) {
      return this.within(enemy, this.range);
   },
   
   attack: function(enemyList) {
		if (this instanceof AreaTower)
			this.attackArea(enemyList);
		if (this instanceof StatusTower)
			this.applyStatus(enemyList);
		if (this instanceof SingleTower)
			this.attackSingle(enemyList);
   }
});

var AreaTower = Class.create(Tower, {
   initialize: function(assetIndex) {
      Tower.apply(this, [assetIndex,
         AreaTowerRange, AreaTowerPower, AreaTowerSpeed,
         AreaTowerBlast, AreaTowerEffect]);
   },
	
	attackArea: function(enemyList) {
		for (var i = 0; i < enemyList.length; i++) {
			var enemy = enemyList[i];
			enemy.health -= this.power;
		}
	}
});

var SingleTower = Class.create(Tower, {
   initialize: function(assetIndex) {
      Tower.apply(this, [assetIndex,
         SingleTowerRange, SingleTowerPower, SingleTowerSpeed,
         SingleTowerBlast, SingleTowerEffect]);
   },
	
	attackSingle: function(enemyList) {
		if (enemyList.length > 0)
			enemyList[0].health -= this.power;
	}
});

var StatusTower = Class.create(Tower, {
   initialize: function(assetIndex) {
      Tower.apply(this, [assetIndex,
         StatusTowerRange, StatusTowerPower, StatusTowerSpeed,
         StatusTowerBlast, StatusTowerEffect]);
   },
	
	applyStatus: function(enemyList) {
		for (var i = 0; i < enemyList.length; i++) {
			var enemy = enemyList[i];
			enemy.speed -= this.power;
		}
	}
});

var EnemySpawnRateInWave = 60;
var WaveSpawnRate = 400;

var Level = Class.create(Scene, {
   initialize: function(assetName, enemyListList) {
      Scene.apply(this);
		
		bg = new Sprite(GAME_SIZE, GAME_SIZE);
      bg.frame = 0;
      bg.image = Game.instance.assets['assets/level1.png'];
		this.addChild(bg);
      
      // Add our group of enemies, for easy access later
      this.enemies = new Group();
      this.addChild(this.enemies);
      
      // Add our group of towers, for easy access later
      this.towers = new Group();
      this.addChild(this.towers);
		
		this.enemyListList = enemyListList;
		this.currentWave = this.enemyListList.pop();
		this.spawnFrame = 0;
      
      this.addEventListener(Event.ENTER_FRAME, this.everyFrame);
   },
   
   everyFrame: function(event) {
      this.attack(event.elapsed);
		this.spawnEnemies();
   },
	
	spawnEnemies: function() {
		this.spawnFrame++;
		if (this.spawnFrame % EnemySpawnRateInWave == 0
			&& this.currentWave.length > 0) {
			this.enemies.addChild(this.currentWave.pop());
		}
		
		if (this.spawnFrame % WaveSpawnRate == 0
			&& this.enemyListList.length > 0) {
			this.currentWave = this.enemyListList.pop();
		}
	},
   
   // attack is a relation between two types. We want to calculate this on the Scene,
   // which knows about both types' instances. We could offload some of this to the types,
   // but that would introduce several additional event handlers triggering every frame.
   attack: function(elapsed) {
      for (var i = 0; i < this.towers.childNodes.length; i++) {
         // For each tower, attack some enemies
         var tower = this.towers.childNodes[i];
         if (!tower.isReloaded()) continue;
         
         var numAttacks = 0;
			var enemyList = [];
         for (var j = 0; j < this.enemies.childNodes.length; j++) {
            // If there are fewer enemies than we can target, break
            if (numAttacks == tower.blast) break;
            
            // Command the tower to attack the enemy
            var enemy = this.enemies.childNodes[j];
            if (!tower.inRange(enemy)) continue;
            
            // If we are in range, attack and increment our attack count
            numAttacks++;
            enemyList.push(enemy);
			
         }
		 
			tower.attack(enemyList);
			
			for (var i = 0; i < enemyList.length; i++) {
				// If the enemy died, remove it
				if (enemy.health <= 0) {
					this.enemies.removeChild(enemy);
				}
			}
      }
   },
});

var Level1 = Class.create(Level, {
	initialize: function(assetIndex) {
	
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
			
		Level.apply(this, [assetIndex, L1Enemies]);
	}
});
	
	
	
	
	
	