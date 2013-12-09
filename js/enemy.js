enchant();

var RIGHT = 0;
var LEFT  = 1;
var UP    = 2;
var DOWN  = 3;

var Enemy = Class.create(Sprite, {
	initialize: function(assetIndex, health, speed, map, pathTile) {
		Sprite.apply(this, [64, 64]);
		this.image = Game.instance.assets[assetIndex];
		this.frame = 0;
      
      this.y = 4 * 64;
		
      this.map = map;
      this.direction = RIGHT;
      this.pathTile = pathTile;
		
		this.health = health;
		this.maxSpeed = speed;
		this.speed = speed;

		this.label;
      
      this.addEventListener(Event.ENTER_FRAME, this.walk);
      this.addEventListener(Event.ENTER_FRAME,  function(){
         if(this.speed < this.maxSpeed)
            this.speed += 1;
      });
	},
   
   getEnemyLabel: function() {
      return this.label;
   },
   
   goLeftOrRight: function() {
      if (this.map.checkTile(this.x + 64, this.y) == this.pathTile)
         this.direction = RIGHT;
      else
         this.direction = LEFT;
   },
   
   goUpOrDown: function() {
      console.log(this.map.checkTile(this.x, this.y + 64) + ", " + this.pathTile);
      if (this.map.checkTile(this.x, this.y + 64) == this.pathTile)
         this.direction = DOWN;
      else
         this.direction = UP;
   },
   
   newDirection: function() {
      var gridX = Math.floor((this.x) / 64);
      var gridY = Math.floor((this.y) / 64);
      
      switch (this.direction) {
         case RIGHT: if (this.map.hitTest(this.x + 64, this.y)){ this.goUpOrDown();} break;
         case LEFT : if (this.map.hitTest(this.x - 1, this.y)){ this.goUpOrDown();} break;
         case UP   : if (this.map.hitTest(this.x, this.y - 1)){ this.goLeftOrRight();} break;
         case DOWN : if (this.map.hitTest(this.x, this.y + 64)){ this.goLeftOrRight();} break;
      }
   },
	
	walk: function(event) {
      
      //console.log("Enemy: tiledata: " + this.map.checkTile(this.x, this.y));
      var dirStr;
      switch (this.direction) {
         case RIGHT: dirStr = "Right"; break;
         case LEFT : dirStr = "Left"; break;
         case DOWN : dirStr = "Down"; break;
         case UP   : dirStr = "Up"; break;
      }
      //console.log("Enemy: Direction: " + dirStr);
      
      this.newDirection();
      
      // We are trying to avoid a threshold issue that causes enemies to leave the path
      // Use 0.0009 instead of 0.001
      var movement = (event.elapsed * 0.0009) * this.speed;
      switch (this.direction) {
         case UP   : this.y -= movement;
                     this.frame = this.anim[this.direction*20 + (this.age%20)]; break;
         case DOWN : this.y += movement; 
                     this.frame = this.anim[this.direction*20 + (this.age%20)]; break;
         case LEFT : this.x -= movement; 
                     this.frame = this.anim[this.direction*20 + (this.age%20)]; break;
         case RIGHT: this.x += movement;
                     this.frame = this.anim[this.direction*20 + (this.age%20)]; break;
      }
      // this.x = Math.ceil(this.x);
      // this.y = Math.ceil(this.y);

	}
});

//Stone Age

var KabutoEnemy = Class.create(Enemy, {
	initialize: function(map, pathTile) {
		Enemy.apply(this, ['assets/enemies/kabutoSheet.png', 25, 30, map, pathTile]);

      this.anim = [
         9, 9, 9, 9, 9,10,10,10,10,10,11,11,11,11,11,10,10,10,10,10, //right
         6, 6, 6, 6, 6, 7, 7, 7, 7, 7, 8, 8, 8, 8, 8, 7, 7, 7, 7, 7,//left
         3, 3, 3, 3, 3, 4, 4, 4, 4, 4, 5, 5, 5, 5, 5, 4, 4, 4, 4, 4, //up
         0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1];//down
      
		this.addEventListener(Event.ENTER_FRAME, this.walk);
	}
});

var OmanyteEnemy = Class.create(Enemy, {
	initialize: function(map, pathTile) {
		Enemy.apply(this, ['assets/enemies/omanyteSheet.png', 30, 30, map, pathTile]);

      this.anim = [
         9, 9, 9, 9, 9,10,10,10,10,10,11,11,11,11,11,10,10,10,10,10, //right
         6, 6, 6, 6, 6, 7, 7, 7, 7, 7, 8, 8, 8, 8, 8, 7, 7, 7, 7, 7,//left
         3, 3, 3, 3, 3, 4, 4, 4, 4, 4, 5, 5, 5, 5, 5, 4, 4, 4, 4, 4, //up
         0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1];//down
      
		this.addEventListener(Event.ENTER_FRAME, this.walk);
	}
});

var BastidonEnemy = Class.create(Enemy, {
	initialize: function(map, pathTile) {
		Enemy.apply(this, ['assets/enemies/bastidonSheet.png', 30, 30, map, pathTile]);

      this.anim = [
         6, 6, 6, 6, 6, 7, 7, 7, 7, 7, 6, 6, 6, 6, 6, 7, 7, 7, 7, 7, //right
         4, 4, 4, 4, 4, 5, 5, 5, 5, 5, 4, 4, 4, 4, 4, 5, 5, 5, 5, 5, //left
         2, 2, 2, 2, 2, 3, 3, 3, 3, 3, 2, 2, 2, 2, 2, 3, 3, 3, 3, 3, //up
         0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1];//down
      
		this.addEventListener(Event.ENTER_FRAME, this.walk);
	}
});

var AerodactylEnemy = Class.create(Enemy, {
	initialize: function(map, pathTile) {
		Enemy.apply(this, ['assets/enemies/aerodactylSheet.png', 30, 30, map, pathTile]);

      this.anim = [
         9, 9, 9, 9, 9,10,10,10,10,10,11,11,11,11,11,10,10,10,10,10, //right
         6, 6, 6, 6, 6, 7, 7, 7, 7, 7, 8, 8, 8, 8, 8, 7, 7, 7, 7, 7,//left
         3, 3, 3, 3, 3, 4, 4, 4, 4, 4, 5, 5, 5, 5, 5, 4, 4, 4, 4, 4, //up
         0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1];//down
      
		this.addEventListener(Event.ENTER_FRAME, this.walk);
	}
});

//Industrial Age

var AronEnemy = Class.create(Enemy, {
	initialize: function(map, pathTile) {
		Enemy.apply(this, ['assets/enemies/aronSheet.png', 50, 30, map, pathTile]);

      this.anim = [
         6, 6, 6, 6, 6, 7, 7, 7, 7, 7, 6, 6, 6, 6, 6, 7, 7, 7, 7, 7, //right
         4, 4, 4, 4, 4, 5, 5, 5, 5, 5, 4, 4, 4, 4, 4, 5, 5, 5, 5, 5, //left
         2, 2, 2, 2, 2, 3, 3, 3, 3, 3, 2, 2, 2, 2, 2, 3, 3, 3, 3, 3, //up
         0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1];//down
      
		this.addEventListener(Event.ENTER_FRAME, this.walk);
	}
});

var AggronEnemy = Class.create(Enemy, {
	initialize: function(map, pathTile) {
		Enemy.apply(this, ['assets/enemies/aggronSheet.png', 30, 40, map, pathTile]);

      this.anim = [
         9, 9, 9, 9, 9,10,10,10,10,10,11,11,11,11,11,10,10,10,10,10, //right
         6, 6, 6, 6, 6, 7, 7, 7, 7, 7, 8, 8, 8, 8, 8, 7, 7, 7, 7, 7,//left
         3, 3, 3, 3, 3, 4, 4, 4, 4, 4, 5, 5, 5, 5, 5, 4, 4, 4, 4, 4, //up
         0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1];//down
      
		this.addEventListener(Event.ENTER_FRAME, this.walk);
	}
});

var SkarmoryEnemy = Class.create(Enemy, {
	initialize: function(map, pathTile) {
		Enemy.apply(this, ['assets/enemies/skarmorySheet.png', 30, 40, map, pathTile]);

      this.anim = [
         9, 9, 9, 9, 9,10,10,10,10,10,11,11,11,11,11,10,10,10,10,10, //right
         6, 6, 6, 6, 6, 7, 7, 7, 7, 7, 8, 8, 8, 8, 8, 7, 7, 7, 7, 7,//left
         3, 3, 3, 3, 3, 4, 4, 4, 4, 4, 5, 5, 5, 5, 5, 4, 4, 4, 4, 4, //up
         0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1];//down
      
		this.addEventListener(Event.ENTER_FRAME, this.walk);
	}
});

var RyhornEnemy = Class.create(Enemy, {
	initialize: function(map, pathTile) {
		Enemy.apply(this, ['assets/enemies/ryhornSheet.png', 50, 30, map, pathTile]);

      this.anim = [
         6, 6, 6, 6, 6, 7, 7, 7, 7, 7, 6, 6, 6, 6, 6, 7, 7, 7, 7, 7, //right
         4, 4, 4, 4, 4, 5, 5, 5, 5, 5, 4, 4, 4, 4, 4, 5, 5, 5, 5, 5, //left
         2, 2, 2, 2, 2, 3, 3, 3, 3, 3, 2, 2, 2, 2, 2, 3, 3, 3, 3, 3, //up
         0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1];//down
      
		this.addEventListener(Event.ENTER_FRAME, this.walk);
	}
});

//Neon Age

var GroudonEnemy = Class.create(Enemy, {
	initialize: function(map, pathTile) {
		Enemy.apply(this, ['assets/enemies/groudonSheet.png', 50, 30, map, pathTile]);

      this.anim = [
         9, 9, 9, 9, 9,10,10,10,10,10,11,11,11,11,11,10,10,10,10,10, //right
         6, 6, 6, 6, 6, 7, 7, 7, 7, 7, 8, 8, 8, 8, 8, 7, 7, 7, 7, 7,//left
         3, 3, 3, 3, 3, 4, 4, 4, 4, 4, 5, 5, 5, 5, 5, 4, 4, 4, 4, 4, //up
         0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1];//down
      
		this.addEventListener(Event.ENTER_FRAME, this.walk);
	}
});

var ArticunoEnemy = Class.create(Enemy, {
	initialize: function(map, pathTile) {
		Enemy.apply(this, ['assets/enemies/articunoSheet.png', 50, 30, map, pathTile]);

      this.anim = [
         9, 9, 9, 9, 9,10,10,10,10,10,11,11,11,11,11,10,10,10,10,10, //right
         6, 6, 6, 6, 6, 7, 7, 7, 7, 7, 8, 8, 8, 8, 8, 7, 7, 7, 7, 7,//left
         3, 3, 3, 3, 3, 4, 4, 4, 4, 4, 5, 5, 5, 5, 5, 4, 4, 4, 4, 4, //up
         0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1];//down
        
        articunoLabel = new Label("F");
        articunoLabel.x = this.x;
        articunoLabel.y = this.y;
        //level.addChild(articunoLabel);
		
		this.addEventListener(Event.ENTER_FRAME, this.walk);
		var label = new Label("F");
		label.x = this.x;
		label.y = this.y;
	}
});

var PorygonEnemy = Class.create(Enemy, {
	initialize: function(map, pathTile) {
		Enemy.apply(this, ['assets/enemies/porygonSheet.png', 50, 30, map, pathTile]);

      this.anim = [
         9, 9, 9, 9, 9,10,10,10,10,10,11,11,11,11,11,10,10,10,10,10, //right
         6, 6, 6, 6, 6, 7, 7, 7, 7, 7, 8, 8, 8, 8, 8, 7, 7, 7, 7, 7,//left
         3, 3, 3, 3, 3, 4, 4, 4, 4, 4, 5, 5, 5, 5, 5, 4, 4, 4, 4, 4, //up
         0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1];//down
      
		this.addEventListener(Event.ENTER_FRAME, this.walk);
	}
});

var SuicuneEnemy = Class.create(Enemy, {
	initialize: function(map, pathTile) {
		Enemy.apply(this, ['assets/enemies/suicuneSheet.png', 50, 30, map, pathTile]);

      this.anim = [
         6, 6, 6, 6, 6, 7, 7, 7, 7, 7, 6, 6, 6, 6, 6, 7, 7, 7, 7, 7, //right
         4, 4, 4, 4, 4, 5, 5, 5, 5, 5, 4, 4, 4, 4, 4, 5, 5, 5, 5, 5, //left
         2, 2, 2, 2, 2, 3, 3, 3, 3, 3, 2, 2, 2, 2, 2, 3, 3, 3, 3, 3, //up
         0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1];//down
      
		this.addEventListener(Event.ENTER_FRAME, this.walk);
	}
});
