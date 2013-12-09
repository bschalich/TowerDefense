

var Button = Class.create(Sprite, {
   initialize: function(assetIndex, x, y) {
      Sprite.apply(this, [50, 50]);
      
      this.image = Game.instance.assets[assetIndex];
      this.x = x;
      this.y = y;
   }
});

var SingleTowerBuy = Class.create(Button, {
   initialize: function() {
      Button.apply(this, ['assets/ui/singletowerbuy.png', 320, 600]);
      
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



var PauseButton = Class.create(Button, {
	initialize: function() {
		Sprite.apply(this, [20, 20]);
		this.image = Game.instance.assets['assets/UI/Pause.png'];
		this.frame = 0;
		
		this.addEventListener(Event.TOUCH_END, this.pauseGame);	
	},
	
	pauseGame: function() {
		var pScreen = new UIPause();
		pScreen.x = 220; pScreen.y = 245;
		this.parentNode.addChild(pScreen);
		
		var rButt = new ResumeButton(pScreen);
		rButt.x = 268; rButt.y = 358;
		this.parentNode.addChild(rButt);
	}
});

var ResumeButton = Class.create(Button, {
	initialize: function(pScreen) {
		Sprite.apply(this, [102, 29]);
		this.image = Game.instance.assets['assets/UI/Resume.png'];
		this.frame = 0;
		
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
		this.parentNode.removeChild(this);
	}
});

var UIOverlay = Class.create(Sprite, {
	initialize: function() {
		Sprite.apply(this, [640, 70]);
		this.image = Game.instance.assets['assets/UI/Overlay.png'];
		this.frame = 0;	
	}
});

var UIPause = Class.create(Sprite, {
	initialize: function() {
		Sprite.apply(this, [200, 150]);
		this.image = Game.instance.assets['assets/UI/PauseScreen.png'];
		this.frame = 0;
	}
});

var UIButtons = Class.create(Button, {
	initialize: function() {
		Sprite.apply(this, [65, 50]);
		this.image = Game.instance.assets['assets/UI/ButtonTemplate.png'];
		this.frame = 0;
		
		this.addEventListener(Event.TOUCH_START, this.clickOn);
		this.addEventListener(Event.TOUCH_END, this.clickOff);
	},
	
	clickOn: function() {
		this.frame = 1;
	},
	
	clickOff: function(){
		this.frame = 0;
	}
});

var UIResource = Class.create(Sprite, {
	initialize: function() {
		Sprite.apply(this, [640, 40]);
		this.image = Game.instance.assets['assets/UI/Resource.png'];
		this.frame = 0;
	}
	
	//Lives label
	
	//Gold label
	
	//Current Wave label
	
	//Spawn next wave button
	
	//Misc?
});
