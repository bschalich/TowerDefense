
// Tower upgrade costs:
var SingleTowerL2 = 500;
var StatusTowerL2 = 500;
var AreaTowerL2   = 500;

var SingleTowerL3 = 2000;
var StatusTowerL3 = 1000;
var AreaTowerL3   = 1500;

var SingleTowerSpec1 = 200;
var SingleTowerSpec2 = 300;

var StatusTowerSpec1 = 250;
var StatusTowerSpec2 = 300;

var AreaTowerSpec1   = 150;
var AreaTowerSpec2   = 250;

var Button = Class.create(Sprite, {
   initialize: function(assetIndex, x, y, width, height) {
      Sprite.apply(this, [width, height]);
      
      this.image = Game.instance.assets[assetIndex];
      this.x = x;
      this.y = y;
   }
});

var SingleTowerBuy = Class.create(Button, {
   initialize: function() {
      Button.apply(this, ['assets/ui/singletowerbuy.png', 320, 600, 50, 50]);
      
      this.tower = null;
      
      this.addEventListener(Event.TOUCH_END, this.placeTower);
   },
   
   placeTower: function(event) {
      if (event.y < 64 * 8
         && this.parentNode.parentNode.map.checkTile(event.x, event.y) == 36) {
         this.parentNode.parentNode.towers.addChild(new SingleTower('assets/towers/industrialRanged1.png', event.x, event.y));
      }
   }
});

/*var StatusTowerBuy = Class.create(Button, {
   initialize: function() {
      Button.apply(this, ['assets/ui/UI_Buttons.png', 320, 600]);
      
      this.tower = null;
      
      this.addEventListener(Event.TOUCH_END, this.placeTower);
   },
   
   placeTower: function(event) {
      if (event.y < 64 * 8
         && this.parentNode.parentNode.map.checkTile(event.x, event.y) == 36) {
         this.parentNode.parentNode.towers.addChild(new StatusTower('assets/towers/industrialStatus1.png', event.x, event.y));
      }
   }
});*/

var MenuScreen = Class.create(Scene, {
   initialize: function() {
      Scene.apply(this);
      this.PlayerGold = 0;
      this.SingleTowerLevel = 1;
      this.AreaTowerLevel   = 1;
      this.StatusTowerLevel = 1;
      
      this.addChild(new NextLevel());
      
      // Add UI Elements //   
   },
   
   checkGold: function(cost) {
      return (cost < PLAYER_GOLD);
   },
   
   upgradeSingle: function() {
      switch (SingleUpgradeLevel) {
         case 1: if (this.checkGold(SingleTowerL2)) {
               PLAYER_GOLD -= SingleTowerL2;
               SingleUpgradeLevel++;
            }
            break;
         case 2: if (this.checkGold(SingleTowerL3)) {
               PLAYER_GOLD -= SingleTowerL3;
               SingleUpgradeLevel++;
               // REMOVE UI UPGRADE ELEMENT
            }
            break;
      }
   },
   
   upgradeStatus: function() {
      switch (StatusUpgradeLevel) {
         case 1: if (this.checkGold(StatusTowerL2)) {
               PLAYER_GOLD -= StatusTowerL2;
               StatusUpgradeLevel++;
            }
            break;
         case 2: if (this.checkGold(StatusTowerL3)) {
               PLAYER_GOLD -= StatusTowerL3;
               StatusUpgradeLevel++;
               // REMOVE UI UPGRADE ELEMENT
            }
            break;
      }
   },
   
   upgradeArea: function() {
      switch (AreaUpgradeLevel) {
         case 1: if (this.checkGold(AreaTowerL2)) {
               PLAYER_GOLD -= AreaTowerL2;
               AreaUpgradeLevel++;
            }
            break;
         case 2: if (this.checkGold(AreaTowerL3)) {
               PLAYER_GOLD -= AreaTowerL3;
               AreaUpgradeLevel++;
               // REMOVE UI UPGRADE ELEMENT
            }
            break;
      }
   }
});

var NextLevel = Class.create(Button, {
   initialize: function() {
      Button.apply(this, ['assets/ui/Resume.png', 300, 250, 102, 29]);
      
      this.addEventListener(Event.TOUCH_END, this.nextLevel);
   },
   
   nextLevel: function(event) {
      Game.instance.popScene();
   }
});

var PauseScreen = Class.create(Scene, {
   initialize: function() {
      Scene.apply(this);
      
      var pScreen = new UIPause();
		pScreen.x = 220; pScreen.y = 245;
		this.addChild(pScreen);
		
		var rButt = new ResumeButton(pScreen, 268, 358);
		this.addChild(rButt);
   }
});


var PauseButton = Class.create(Button, {
	initialize: function(x, y) {
		Button.apply(this, ['assets/ui/Pause.png', x, y, 20, 20]);
		
		this.addEventListener(Event.TOUCH_END, this.pauseGame);	
	},
	
	pauseGame: function() {
      Game.instance.pushScene(PAUSE_SCREEN);
	}
});

var ResumeButton = Class.create(Button, {
	initialize: function(pScreen, x, y) {
		Button.apply(this, ['assets/ui/Resume.png', x, y, 102, 29]);
		
		this.addEventListener(Event.TOUCH_START, this.clickOn);
		this.addEventListener(Event.TOUCH_END, this.clickOff);
		this.addEventListener(Event.TOUCH_END, function(){this.resumeGame(pScreen)});		
	},
	
	clickOn: function() {
		this.frame = 1;
	},
	
	clickOff: function(){
		this.frame = 0;
	},
	
	resumeGame: function(pScreen) {
		Game.instance.popScene();
	}
});

var UIOverlay = Class.create(Sprite, {
	initialize: function() {
		Sprite.apply(this, [640, 70]);
		this.image = Game.instance.assets['assets/ui/Overlay.png'];
		this.frame = 0;	
	}
});

var UIPause = Class.create(Sprite, {
	initialize: function() {
		Sprite.apply(this, [200, 150]);
		this.image = Game.instance.assets['assets/ui/PauseScreen.png'];
		this.frame = 0;
	}
});


var UIButtons = Class.create(Button, {
	initialize: function(frame, x, y, touchHandler) {
		Button.apply(this, ['assets/ui/UI_Buttons.png', x, y, 65, 50]);
		this.frame = frame;
		
      this.slowAbility = new Label("ABILITY: Slows all enemies in range.");
      this.slowAbility.x = 150; this.slowAbility.y = 513;  

      this.aoeAbility = new Label("ABILITY: Attacks multiple enemies.");
      this.aoeAbility.x = 150; this.aoeAbility.y = 513;

      switch(frame)
      {
         case SINGLE:
           var tower = new SingleTower(x, y);
           this.cost = 50;
           break;
         case AREA:
           var tower = new AreaTower(x, y);
           this.cost = 75;
           break;
         case STATUS:
           var tower = new StatusTower(x, y);
           this.cost = 100;
           break;
         default:
            break;
      }

      this.cLabel = new Label("Cost: " + this.cost);
      this.cLabel.color = "rgb(255, 215, 0)";
      this.cLabel.x = 80; this.cLabel.y = 513; 

      //Create a new label for range, cost, damage, and speed.
      //Also talk about AoE shits or slows.


		this.addEventListener(Event.TOUCH_START, this.clickOn);
		this.addEventListener(Event.TOUCH_END, this.clickOff);
      this.addEventListener(Event.TOUCH_END, touchHandler);
	},
	
	clickOn: function() {
      this.frame += 6;

      this.parentNode.addChild(this.cLabel);
      
      if(this.frame == AREA + 6) {
         this.parentNode.addChild(this.aoeAbility);
      }
      if(this.frame == STATUS + 6) {
         this.parentNode.addChild(this.slowAbility);
      }
	},
	
	clickOff: function(){
		this.frame -= 6;

      this.parentNode.removeChild(this.cLabel);
      
      if(this.frame == AREA) {
         this.parentNode.removeChild(this.aoeAbility);
      }
      if(this.frame == STATUS) {
         this.parentNode.removeChild(this.slowAbility);
      }
	}
});

var UIResource = Class.create(Sprite, {
	initialize: function() {
		Sprite.apply(this, [640, 40]);
		this.image = Game.instance.assets['assets/ui/Resource.png'];
		this.frame = 0;
	}
});
	//Lives label
	var UILives = Class.create(Sprite, {
	initialize: function() {
		Sprite.apply(this, [16, 16]);
		this.image = Game.instance.assets['assets/ui/life.png'];
	}
});	
	//Current Wave label
	
	//Spawn next wave button
	
	//Misc?

