

var Level = Class.create(Scene, {
   initialize: function(assetName) {
      Scene.apply(this);
		
		bg = new Sprite(GAME_SIZE, GAME_SIZE);
      bg.frame = 0;
      bg.image = game.assets['assets/level1.png'];
      
      // Add our group of enemies, for easy access later
      this.enemies = new Group();
      this.addChild(this.enemies);
      
      // Add our group of towers, for easy access later
      this.towers = new Group();
      this.addChild(this.towers);
      
      this.addEventListener(Event.ENTER_FRAME, this.everyFrame);
   },
   
   everyFrame: function(event) {
      this.attack(event.elapsed);
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
      
            