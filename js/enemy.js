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
      
      this.y = 3 * 64;
		
      this.map = map;
      this.direction = RIGHT;
      this.pathTile = pathTile;
		
		this.health = health;
		this.speed = speed;
      
      this.addEventListener(Event.ENTER_FRAME, this.walk);
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
   
   checkCollide: function(gridX, gridY) {
      if (this.map.collisionData[gridY][gridX] == 1)
         return true;
      return false;
   },
   
   newDirection: function() {
      var gridX = Math.floor((this.x) / 64);
      var gridY = Math.floor((this.y) / 64);
      
      //console.log(this.x + ", " + this.y);
      
      
      // switch (this.direction) {
         // case RIGHT: if (this.checkCollide(gridX + 1, gridY)){ this.goUpOrDown();} break;
         // case LEFT : if (this.checkCollide(gridX - 1, gridY)){ this.goUpOrDown();} break;
         // case UP   : if (this.checkCollide(gridX, gridY)){ this.goLeftOrRight();} break;
         // case DOWN : if (this.checkCollide(gridX, gridY + 1)){ this.goLeftOrRight();} break;
      // }
      
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
      
      var movement = (event.elapsed * 0.001) * this.speed;
      switch (this.direction) {
         case UP   : this.y -= movement; break;
         case DOWN : this.y += movement; break;
         case LEFT : this.x -= movement; break;
         case RIGHT: this.x += movement; break;
      }
      this.x = Math.ceil(this.x);
      this.y = Math.ceil(this.y);
	}
});

var AggronEnemy = Class.create(Enemy, {
	initialize: function(map, pathTile) {
		Enemy.apply(this, ['assets/enemies/aggronSheet.png', 20, 60, map, pathTile]);
      
		this.addEventListener(Event.ENTER_FRAME, this.walk);
	}
});