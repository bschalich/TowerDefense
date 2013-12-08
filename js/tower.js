enchant();

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
   initialize: function(assetIndex, range, power, speed, blast) {
      Sprite.apply(this, [64, 64]);
      this.image = Game.instance.assets[assetIndex];
      this.frame = 0;
      
      this.range = range;
      this.power = power;
      this.speed = speed;
      this.blast = blast;
      
      this.attackTimer = 0.0;
   },
   
   isReloaded: function(elapsed) {
      if (DEBUG) {
         //console.log("Tower: Reload progress: " + this.attackTimer + " / " + this.speed);
      }
      
      this.attackTimer += (elapsed * 0.001);
      
      if (this.attackTimer >= this.speed) {
         this.attackTimer = 0;
         return true;
      }
      
      return false;
   },
   
   inRange: function(enemy) {
      return this.within(enemy, this.range);
   },
   
   attack: function(enemyList) {
      if (DEBUG) {
         //console.log("Tower: Attacking: " + enemyList);
      }
      
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
         AreaTowerBlast]);
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
         SingleTowerBlast]);
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
         StatusTowerBlast]);
   },
	
	applyStatus: function(enemyList) {
		for (var i = 0; i < enemyList.length; i++) {
			var enemy = enemyList[i];
			enemy.speed -= this.power;
		}
	}
});