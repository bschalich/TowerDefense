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
var StatusTowerPower = 5;
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
      
      this.range = range * (2/3 + upgrade/3);
      this.power = power * upgrade;
      this.speed = speed / upgrade;
      this.blast = blast * Math.ceil(upgrade / 2);
      this.cost = cost;
      
      this.rangeCircle = new Sprite(64, 64);
      this.rangeCircle.image = Game.instance.assets['assets/towers/range.png'];
      this.rangeCircle.x = this.x;
      this.rangeCircle.y = this.y;
      this.rangeCircle.scale(this.range * 2);
      
      this.attackTimer = 0.0;
      
      this.slowAbility = new Label("Snaring Traps: Slows all enemies in range.");
      this.slowAbility.x = 125; this.slowAbility.y = 513;  

      this.aoeAbility = new Label("Boulder Tossers: Attacks multiple enemies.");
      this.aoeAbility.x = 125; this.aoeAbility.y = 513;

      this.singleAbility = new Label("Archers: Attacks the oldest enemy.");
      this.singleAbility.x = 125; this.singleAbility.y = 513;   

      this.damageL = new Label(this.power + " dmg");
      this.damageL.x =70; this.damageL.y = 550;

      this.slowL = new Label("-" + this.power + " speed");
      this.slowL.x =70; this.slowL.y = 550;

      this.rangeL = new Label(this.range * 64 + " px");
      this.rangeL.x =170; this.rangeL.y = 550;

      this.speedL = new Label(this.speed.toFixed(2) + "/sec");
      this.speedL.x =280; this.speedL.y = 550;


      this.addEventListener(Event.TOUCH_START, this.showMenu);
      this.addEventListener(Event.TOUCH_END, this.closeMenu);
   },
   
   snapToGrid: function() {
      this.x = (Math.floor(this.x / 64) * 64);
      this.y = (Math.floor(this.y / 64) * 64);
   },
   
  showMenu: function(event) {
      this.parentNode.parentNode.addChild(this.rangeCircle);

      //Show damage icon
      if(this instanceof StatusTower)
         this.parentNode.parentNode.addChild(this.slowL);
      else
         this.parentNode.parentNode.addChild(this.damageL);

      //Show range icon
      this.parentNode.parentNode.addChild(this.rangeL);

      //Show speed icon
      this.parentNode.parentNode.addChild(this.speedL);

      if(this instanceof AreaTower) {
         this.parentNode.parentNode.addChild(this.aoeAbility);
      }
      else if(this instanceof StatusTower) {
         this.parentNode.parentNode.addChild(this.slowAbility);
      }
      else if(this instanceof SingleTower) {
         this.parentNode.parentNode.addChild(this.singleAbility);
      }
   },
   
   closeMenu: function() {
      this.parentNode.parentNode.removeChild(this.rangeCircle);

      if(this instanceof StatusTower)
         this.parentNode.parentNode.removeChild(this.slowL);
      else
         this.parentNode.parentNode.removeChild(this.damageL);

      this.parentNode.parentNode.removeChild(this.rangeL);
      this.parentNode.parentNode.removeChild(this.speedL);

      if(this instanceof AreaTower) {
         this.parentNode.parentNode.removeChild(this.aoeAbility);
      }
      else if(this instanceof StatusTower) {
         this.parentNode.parentNode.removeChild(this.slowAbility);
      }
      else if(this instanceof SingleTower) {
         this.parentNode.parentNode.removeChild(this.singleAbility);
      }
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
      var assetIndex = 'assets/towers/stoneAoE' + AreaUpgradeLevel + '.png';
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
      var assetIndex = 'assets/towers/stoneRanged' + SingleUpgradeLevel + '.png';
      Tower.apply(this, [assetIndex,
         SingleTowerRange, SingleTowerPower, SingleTowerSpeed,
         SingleTowerBlast, SingleTowerCost, x, y, SingleUpgradeLevel]);
   },
	
	attackSingle: function(enemyList) {
      //console.log(enemyList[0]);
      for (var i = 0; i < enemyList.length; i++) {
         enemy = enemyList[i];
         var blt = new SingleShoot('assets/bullet/arrow.png', this.x, this.y, enemy.x, enemy.y, enemy, this.power);
         this.parentNode.parentNode.addChild(blt);
      }
	}
});

var StatusTower = Class.create(Tower, {
   initialize: function(x, y) {
      var assetIndex = 'assets/towers/stoneStatus' + StatusUpgradeLevel + '.png';
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
