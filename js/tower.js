enchant();

// Tower constants
// Range in multiples of 64

var SingleTowerCost = 50;
var StatusTowerCost = 100;
var AreaTowerCost   = 75;

var AreaTowerRange = 1.8;
var AreaTowerPower = 5;
var AreaTowerSpeed = 2;
var AreaTowerBlast = 10;

var StatusTowerRange = 1.5;
var StatusTowerPower = 10;
var StatusTowerSpeed = 0.2;
var StatusTowerBlast = 10;

var SingleTowerRange = 2.5;
var SingleTowerPower = 8;
var SingleTowerSpeed = 1;
var SingleTowerBlast = 1;

var SingleUpgradeLevel = 1;
var StatusUpgradeLevel = 1;
var AreaUpgradeLevel   = 1;

var Tower = Class.create(Sprite, {
   initialize: function(assetIndex, range, power, speed, blast, cost, x, y, upgrade) {
      Sprite.apply(this, [64, 64]);
      this.image = Game.instance.assets[assetIndex];
      this.frame = 0;
      
      this.x = x;
      this.y = y;
      this.snapToGrid();
      
      this.range = range * upgrade;
      this.power = power * upgrade;
      this.speed = speed * upgrade;
      this.blast = blast * Math.ceil(upgrade / 2);
      this.cost = cost;
      
      this.rangeCircle = new Sprite(64, 64);
      this.rangeCircle.image = Game.instance.assets['assets/towers/range.png'];
      this.rangeCircle.x = this.x;
      this.rangeCircle.y = this.y;
      this.rangeCircle.scale(this.range * 2);
      
      this.attackTimer = 0.0;
      
      this.addEventListener(Event.TOUCH_START, this.showMenu);
      this.addEventListener(Event.TOUCH_END, this.closeMenu);
   },
   
   snapToGrid: function() {
      this.x = (Math.floor(this.x / 64) * 64);
      this.y = (Math.floor(this.y / 64) * 64);
   },
   
   showMenu: function(event) {
      this.parentNode.parentNode.addChild(this.rangeCircle);
   },
   
   closeMenu: function() {
      this.parentNode.parentNode.removeChild(this.rangeCircle);
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
      return this.within(enemy, this.range * 64);
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
   initialize: function(x, y) {
      var assetIndex = 'assets/towers/industrialAoE' + SingleUpgradeLevel + '.png';
      Tower.apply(this, [assetIndex,
         AreaTowerRange, AreaTowerPower, AreaTowerSpeed,
         AreaTowerBlast, AreaTowerCost, x, y, AreaUpgradeLevel]);
   },
	
	attackArea: function(enemyList) {
		for (var i = 0; i < enemyList.length; i++) {
			var enemy = enemyList[i];
			var blt = new AreaShoot('assets/bullet/rock.png', this.x, this.y, enemy.x, enemy.y, enemy, this.power);
         this.parentNode.parentNode.addChild(blt);
		}
	}
});

var SingleTower = Class.create(Tower, {
   initialize: function(x, y) {
      var assetIndex = 'assets/towers/industrialRanged' + SingleUpgradeLevel + '.png';
      Tower.apply(this, [assetIndex,
         SingleTowerRange, SingleTowerPower, SingleTowerSpeed,
         SingleTowerBlast, SingleTowerCost, x, y, SingleUpgradeLevel]);
   },
	
	attackSingle: function(enemyList) {
      //console.log(enemyList[0]);
		if (enemyList.length > 0){
		   var blt = new SingleShoot('assets/bullet/arrow.png', this.x, this.y, enemyList[0].x, enemyList[0].y, enemyList[0], this.power);
         this.parentNode.parentNode.addChild(blt);
		}
	}
});

var StatusTower = Class.create(Tower, {
   initialize: function(x, y) {
      var assetIndex = 'assets/towers/industrialStatus' + SingleUpgradeLevel + '.png';
      Tower.apply(this, [assetIndex,
         StatusTowerRange, StatusTowerPower, StatusTowerSpeed,
         StatusTowerBlast, StatusTowerCost, x, y, StatusUpgradeLevel]);
   },
	
	applyStatus: function(enemyList) {
		for (var i = 0; i < enemyList.length; i++) {
         var enemy = enemyList[i];
	      var blt = new StatusShoot('assets/bullet/dreamcatcher.png', this.x, this.y, enemy.x, enemy.y, enemy, this.power);
         this.parentNode.parentNode.addChild(blt);
		}
	}
});
