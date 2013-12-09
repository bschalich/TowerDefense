enchant();

var EnemySpawnRateInWave = 60;
var WaveSpawnRate = 500;

var Level = Class.create(Scene, {
   initialize: function(enemyListList, map) {
      Scene.apply(this);
      
      this.map = map;
      this.addChild(map);
      
      // Add our group of enemies, for easy access later
      this.enemies = new Group();
      this.addChild(this.enemies);
      
      // Add our group of towers, for easy access later
      this.towers = new Group();
      this.addChild(this.towers);
      
      this.buttons = new Group();
      this.addChild(this.buttons);
      this.buttons.addChild(new SingleTowerBuy());
		
		this.enemyListList = enemyListList;
		this.currentWave = this.enemyListList.pop();
		this.spawnFrame = 0;
      
      // UI ELEMENTS BEGIN //
      var res = new UIResource();
		res.x = 0; res.y = 0;
		this.addChild(res);
	  
		var over = new UIOverlay();
		over.x = 0; over.y = 506;
		this.addChild(over);

		//THESE BUTTONS WILL BE REPLACED WITH DANTE'S SYSTEM LATER. FOR NOW IDGAF
		var pbtn = new PauseButton();
		pbtn.x = 3; pbtn.y = 555;
		this.addChild(pbtn);
	  
		var btn1 = new UIButtons();
		btn1.x = 375; btn1.y = 521;
		this.addChild(btn1);
	  
		var btn2 = new UIButtons();
		btn2.x = 440; btn2.y = 521;
		this.addChild(btn2);
	  
		var btn3 = new UIButtons();
		btn3.x = 505; btn3.y = 521;
		this.addChild(btn3);
	  
		var btn4 = new UIButtons();
		btn4.x = 570; btn4.y = 521;
		this.addChild(btn4);
		//END ALLCAPS COMMENTS
      
      this.addEventListener(Event.ENTER_FRAME, this.everyFrame);
   },
   
   everyFrame: function(event) {
      this.attack(event.elapsed);
		this.spawnEnemies();
      this.checkLevelEnd();
   },
   
   checkLevelEnd: function() {
      if (this.enemyListList.length == 0
         && this.currentWave.length == 0) {
         if (this.enemies.childNodes.length == 0) {
            Game.instance.replaceScene(MENU_SCENE);
         }
      }
   },
	
	spawnEnemies: function() {
		this.spawnFrame++;
		if (this.spawnFrame % EnemySpawnRateInWave == 0
			&& this.currentWave.length > 0) {
         var enemy = this.currentWave.pop();
			this.enemies.addChild(enemy);
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
            
            if (enemy.x < 0 || enemy.x > 10 * 64 || enemy.y < 0 || enemy.y > 8 * 64) {
               this.enemies.removeChild(enemy);
               //this.takeDamage();
            }
            
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
      
      map.loadData(mapData,[
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
      ]);
      
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
			L1Enemies.push(L1W1);
         
		Level.apply(this, [L1Enemies, map]);
      
	 	
	  
      //var st = new SingleTower('assets/towers/industrialRanged1.png', 250, 195);
      var stat1 = new AreaTower('assets/towers/industrialAoE1.png', 160, 275);
      //var stat2 = new StatusTower('assets/towers/industrialStatus1.png', 370, 280);
      
      //this.towers.addChild(st);
      this.towers.addChild(stat1);
      //this.towers.addChild(stat2);
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
      
      map.loadData(mapData,[
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
      ]);
      
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
			L1Enemies.push(L1W1);
         
		Level.apply(this, [L1Enemies, map]);
      
	 	
	  
      //var st = new SingleTower('assets/towers/industrialRanged1.png', 250, 195);
      var stat1 = new AreaTower('assets/towers/industrialAoE1.png', 160, 275);
      //var stat2 = new StatusTower('assets/towers/industrialStatus1.png', 370, 280);
      
      //this.towers.addChild(st);
      this.towers.addChild(stat1);
      //this.towers.addChild(stat2);
	}
});
