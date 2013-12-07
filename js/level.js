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
		var L1W4 = [];
			L1W4.push(new AggronEnemy(map, 100));
			L1W4.push(new AggronEnemy(map, 100));
			L1W4.push(new AggronEnemy(map, 100));
			L1W4.push(new AggronEnemy(map, 100));
			L1Enemies.push(L1W4);
		var L1W3 = [];
			L1W3.push(new AggronEnemy(map, 100));
			L1W3.push(new AggronEnemy(map, 100));
			L1W3.push(new AggronEnemy(map, 100));
			L1W3.push(new AggronEnemy(map, 100));
			L1Enemies.push(L1W3);
		var L1W2 = [];
			L1W2.push(new AggronEnemy(map, 100));
			L1W2.push(new AggronEnemy(map, 100));
			L1W2.push(new AggronEnemy(map, 100));
			L1W2.push(new AggronEnemy(map, 100));
			L1Enemies.push(L1W2);
		var L1W1 = [];
			L1W1.push(new AggronEnemy(map, 100));
			L1W1.push(new AggronEnemy(map, 100));
			L1W1.push(new AggronEnemy(map, 100));
			L1W1.push(new AggronEnemy(map, 100));
			L1Enemies.push(L1W1);
         
		Level.apply(this, [L1Enemies, map]);
      
      var st = new SingleTower('assets/towers/industrialRanged1.png', 250, 130);
      
      this.towers.addChild(st);
	}
});
