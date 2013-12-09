enchant();

var EnemySpawnRateInWave = 60;
var WaveSpawnRate = 500;

var MapDataMinusOnes = [
       [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
       [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
       [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
       [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
       [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
       [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
       [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
       [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
       [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
       [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1]
   ];

var createBuyHandler = function(level, TowerClass) {
   return function(event) {
      if (event.y < 64 * 8 && level.map.checkTile(event.x, event.y) == 36) {
         var tower = new TowerClass(event.x, event.y);
         if (tower.cost <= level.gold) {
            level.gold -= tower.cost;
            level.towers.addChild(tower);
         }
      }
   };
};

var Level = Class.create(Scene, {
   initialize: function(enemyListList, map) {
      Scene.apply(this);
      
      this.map = map;
      this.addChild(map);
      
      // Add our group of enemies, for easy access later
      this.enemies = new Group();
      this.addChild(this.enemies);
      this.enemyLabels = new Group();
      this.addChild(this.enemyLabels);
      
      // Add our group of towers, for easy access later
      this.towers = new Group();
      this.addChild(this.towers);
      
      this.buttons = new Group();
      this.addChild(this.buttons);
		
		this.enemyListList = enemyListList;
		this.currentWave = this.enemyListList.pop();
		this.spawnFrame = 0;
      
      this.gold = 200;
      
      // UI ELEMENTS BEGIN //
      var res = new UIResource();
		res.x = 0; res.y = 0;
		this.addChild(res);
	  
		var over = new UIOverlay();
		over.x = 0; over.y = 506;
		this.buttons.addChild(over);

		//THESE BUTTONS WILL BE REPLACED WITH DANTE'S SYSTEM LATER. FOR NOW IDGAF
		var pbtn = new PauseButton(3, 555);
		this.buttons.addChild(pbtn);
	  
		var btn1 = new UIButtons(3, 380, 521,
         createBuyHandler(this, SingleTower));
		this.buttons.addChild(btn1);
	  
		var btn2 = new UIButtons(15, 445, 521,
         createBuyHandler(this, StatusTower));
		this.buttons.addChild(btn2);
	  
		var btn3 = new UIButtons(12, 510, 521,
         createBuyHandler(this, AreaTower));
		this.buttons.addChild(btn3);
	  
		var btn4 = new UIButtons(0, 575, 521,
         createBuyHandler(this, SingleTower));
		this.buttons.addChild(btn4);
		//END ALLCAPS COMMENTS

		var goldLabel = new Label("Rupiis: " + this.gold);
		goldLabel.color = "rgb(255, 215, 0)";
		goldLabel.x = 5;
		goldLabel.y = 10;

		this.goldL = goldLabel;
		this.addChild(goldLabel);

      this.myLife = new Array();
      for(var g = 0; g < 15 ; g++){
		   var life = new UILives();
		   life.x = 125 + g*20;
		   life.y = 1;

         this.addChild(life);
		   this.myLife[g] = life;
		   
      }
      
      this.livesLost = 0;
      
      this.addEventListener(Event.ENTER_FRAME, this.everyFrame);
   },
   
   everyFrame: function(event) {
      this.attack(event.elapsed);
		this.spawnEnemies();
      this.checkLevelEnd();
      this.goldL.text = "Rupiis: " + this.gold;
   },
   
   checkLevelEnd: function() {
      if (this.enemyListList.length == 0
         && this.currentWave.length == 0) {
         if (this.enemies.childNodes.length == 0) {
            PLAYER_GOLD += this.gold;
            Game.instance.replaceScene(MENU_SCREEN);
         }
      }

      for (var j = 0; j < this.enemies.childNodes.length; j++) {
         var enemy = this.enemies.childNodes[j];

         if (enemy.x < 0 || enemy.x > 10 * 64 || enemy.y < 0 || enemy.y > 8 * 64) {
            if(enemy.x > 10 * 64 || enemy.y > 8 * 64)
            {
                  this.removeChild(this.myLife[14-this.livesLost]);
                  this.livesLost += 1;
            }
            this.enemies.removeChild(enemy);
         }
      }
   },
	
	spawnEnemies: function() {
		this.spawnFrame++;
		if (this.spawnFrame % EnemySpawnRateInWave == 0
			&& this.currentWave.length > 0) {
         var enemy = this.currentWave.pop();
			this.enemies.addChild(enemy);
         if (enemy.label) this.enemyLabels.addChild(enemy.label);
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
         if (!tower.isReloaded(elapsed)) continue;
         
         var numAttacks = 0;
			var enemyList = [];
         for (var j = 0; j < this.enemies.childNodes.length; j++) {
            // Command the tower to attack the enemy
            var enemy = this.enemies.childNodes[j];

            
            // If there are fewer enemies than we can target, break
            if (numAttacks == tower.blast) break;
            
            if (!tower.inRange(enemy)) continue;
  
            // If we are in range, attack and increment our attack count
            numAttacks++;
            enemyList.push(enemy);
			
         }
		 
			tower.attack(enemyList);

			
			for (var i = 0; i < enemyList.length; i++) {
            console.log("Level: Dead enemies");
            enemy = enemyList[i];
				// If the enemy died, remove it
				if (enemy.health <= 0) {
               console.log(enemy);
					this.enemies.removeChild(enemy);
               this.gold += enemy.gold;
               if (enemy.label) this.enemyLabels.removeChild(enemy.label);
				}
			}
      }
   },
});

var Level1 = Class.create(Level, {
	initialize: function() {
	
      var map = new Map(64, 64);
      map.image = Game.instance.assets['assets/tilesets/map1.png'];
      
      var mapData = [
		    [ 33, 33, 33, 33, 33, 33, 33, 33, 33, 33],
          [ 49, 49, 49, 49, 49, 49, 49, 49, 49, 49],
          [ 36,100,100,100,100, 36, 36, 36, 36, 36],
          [ 36,100, 36, 36,100, 36, 36, 36, 36, 36],
          [100,100, 36,100,100, 36,100,100,100,100],
          [ 36, 36, 36,100, 36, 36,100, 36, 36, 36],
          [ 36, 36, 36,100,100,100,100, 36, 36, 36],
          [ 17, 17, 17, 17, 17, 17, 17, 17, 17, 17],
          [ 33, 33, 33, 33, 33, 33, 33, 33, 33, 33],
          [ 71, 71, 71, 71, 71, 71, 71, 71, 71, 71],
          [ 71, 71, 71,100, 71, 71, 71, 71, 71, 71]
      ];
      var mapCol = []
      
      map.loadData(mapData, MapDataMinusOnes);
      
      // Set any 100 to a non-colliding tile.
      for (var i = 0; i < mapData.length; i++) {
         mapCol.push(new Array());
         for (var j = 0; j < mapData[i].length; j++) {
            mapCol[i][j] = (mapData[i][j] == 100 ? 0 : 1);
         }
      }
      
      map.collisionData = mapCol;
      
      // map.collisionData = [
          // [1,1,1,1,1,1,0,0,0,0],
          // [0,0,0,0,0,1,0,0,0,1],
          // [1,0,1,1,0,1,1,1,1,1],
          // [0,0,1,0,0,1,0,0,0,0],
          // [1,1,1,0,1,1,0,1,1,1],
          // [0,0,1,0,0,0,0,1,0,0],
          // [0,0,1,1,1,1,1,1,0,0],
          // [0,0,0,0,0,0,0,0,0,0]
      // ];
   
		var L1Enemies = [];
		var L1W5 = [];
         L1W5.push(new KabutoEnemy(map, 100));
         L1W5.push(new OmanyteEnemy(map, 100));
         L1W5.push(new BastidonEnemy(map, 100));
         L1W5.push(new AerodactylEnemy(map, 100));
         L1W5.push(new AronEnemy(map, 100));
         L1W5.push(new AggronEnemy(map, 100));
         L1W5.push(new RyhornEnemy(map, 100));
         L1W5.push(new SkarmoryEnemy(map, 100));
		   L1Enemies.push(L1W5);
		var L1W4 = [];
			L1W4.push(new ArticunoEnemy(map, 100));
			L1W4.push(new ArticunoEnemy(map, 100));
			L1W4.push(new ArticunoEnemy(map, 100));
			L1W4.push(new ArticunoEnemy(map, 100));
			L1Enemies.push(L1W4);
		var L1W3 = [];
			L1W3.push(new PorygonEnemy(map, 100));
			L1W3.push(new PorygonEnemy(map, 100));
			L1W3.push(new PorygonEnemy(map, 100));
			L1W3.push(new PorygonEnemy(map, 100));
			L1Enemies.push(L1W3);
		var L1W2 = [];
			L1W2.push(new GroudonEnemy(map, 100));
			L1W2.push(new GroudonEnemy(map, 100));
			L1W2.push(new GroudonEnemy(map, 100));
			L1W2.push(new GroudonEnemy(map, 100));
			L1Enemies.push(L1W2);
		var L1W1 = [];
			L1W1.push(new SuicuneEnemy(map, 100));
			L1W1.push(new SuicuneEnemy(map, 100));
			L1W1.push(new SuicuneEnemy(map, 100));
			L1W1.push(new SuicuneEnemy(map, 100));
			L1W1.push(new ArticunoEnemy(map, 100));
			L1Enemies.push(L1W1);
         
		Level.apply(this, [L1Enemies, map]);
	}
});

var Level2 = Class.create(Level, {
	initialize: function() {
	
      var map = new Map(64, 64);
      map.image = Game.instance.assets['assets/tilesets/map1.png'];
      
      var mapData = [
		    [ 33, 33, 33, 33, 33, 33, 33, 33, 33, 33],
          [ 49, 49, 49, 49, 49, 49, 49, 49, 49, 49],
          [ 36, 36, 36,100,100,100, 36, 36, 36, 36],
          [ 36, 36, 36,100, 36,100,100, 36, 36, 36],
          [100,100, 36,100,100, 36,100, 36, 36, 36],
          [ 36,100, 36, 36,100, 36,100,100,100,100],
          [ 36,100,100,100,100, 36, 36, 36, 36, 36],
          [ 17, 17, 17, 17, 17, 17, 17, 17, 17, 17],
          [ 33, 33, 33, 33, 33, 33, 33, 33, 33, 33],
          [ 71, 71, 71, 71, 71, 71, 71, 71, 71, 71],
          [ 71, 71, 71, 71, 71, 71, 71, 71, 71, 71]
      ];
      var mapCol = []
      
      map.loadData(mapData, MapDataMinusOnes);
      
      // Set any 100 to a non-colliding tile.
      for (var i = 0; i < mapData.length; i++) {
         mapCol.push(new Array());
         for (var j = 0; j < mapData[i].length; j++) {
            mapCol[i][j] = (mapData[i][j] == 100 ? 0 : 1);
         }
      }
      
      map.collisionData = mapCol;
   
		var L1Enemies = [];
		var L1W5 = [];
         L1W5.push(new KabutoEnemy(map, 100));
         L1W5.push(new OmanyteEnemy(map, 100));
         L1W5.push(new BastidonEnemy(map, 100));
         L1W5.push(new AerodactylEnemy(map, 100));
         L1W5.push(new AronEnemy(map, 100));
         L1W5.push(new AggronEnemy(map, 100));
         L1W5.push(new RyhornEnemy(map, 100));
         L1W5.push(new SkarmoryEnemy(map, 100));
		   L1Enemies.push(L1W5);
		var L1W4 = [];
			L1W4.push(new ArticunoEnemy(map, 100));
			L1W4.push(new ArticunoEnemy(map, 100));
			L1W4.push(new ArticunoEnemy(map, 100));
			L1W4.push(new ArticunoEnemy(map, 100));
			L1Enemies.push(L1W4);
		var L1W3 = [];
			L1W3.push(new PorygonEnemy(map, 100));
			L1W3.push(new PorygonEnemy(map, 100));
			L1W3.push(new PorygonEnemy(map, 100));
			L1W3.push(new PorygonEnemy(map, 100));
			L1Enemies.push(L1W3);
		var L1W2 = [];
			L1W2.push(new GroudonEnemy(map, 100));
			L1W2.push(new GroudonEnemy(map, 100));
			L1W2.push(new GroudonEnemy(map, 100));
			L1W2.push(new GroudonEnemy(map, 100));
			L1Enemies.push(L1W2);
		var L1W1 = [];
			L1W1.push(new SuicuneEnemy(map, 100));
			L1W1.push(new SuicuneEnemy(map, 100));
			L1W1.push(new SuicuneEnemy(map, 100));
			L1W1.push(new SuicuneEnemy(map, 100));
			L1Enemies.push(L1W1);
         
		Level.apply(this, [L1Enemies, map]);
	}
});

var CutScene = Class.create(Scene, {
   initialize: function(offset) {
      Scene.apply(this);

      var bg = new Sprite(640,640);
      bg.image = Game.instance.assets['assets/narrative/title' + offset + '.png'];
      this.addChild(bg);
      var se = Game.instance.assets['assets/getItem.wav'];

      this.addEventListener(Event.TOUCH_END, function(){
          if(offset == 6)
            se.play();
          Game.instance.popScene();
      });

      
	}
});

      
