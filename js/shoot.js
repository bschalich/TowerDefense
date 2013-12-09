enchant();

var Shoot = Class.create(Sprite, {
   initialize: function(assetIndex, x, y, toX, toY, enemy) {
      Sprite.apply(this, [64, 64]);
      this.image = Game.instance.assets[assetIndex];
		this.frame = 6;

      this.offsetX = 16;
		this.x = x+10;
      this.y = y+10;
      this.toX = toX+16;
      this.toY = toY+16;

      this.moveSpeed = 15;

      //Have the bullet go to the target
      this.addEventListener(Event.ENTER_FRAME, function(){

         //Remove bullet
         if(this.y == this.toY && this.x == this.toX){
            this.parentNode.removeChild(this);
         }  //move bullet
         else if((this.y > this.toY) && (this.x > this.toX)){ //Diag left down
            if(Math.abs(this.y - this.toY) < this.moveSpeed){
               this.y = this.toY;
            }else {
               this.y -= this.moveSpeed;
            }

            if(Math.abs(this.x - this.toX) < this.moveSpeed){
               this.x = this.toX;
            }else {
               this.x -= this.moveSpeed;
            }
         }
         else if((this.y > this.toY) && (this.x < this.toX)){ //Diag right down
            if(Math.abs(this.y - this.toY) < this.moveSpeed){
               this.y = this.toY;
            }else {
               this.y -= this.moveSpeed;
            }

            if(Math.abs(this.x - this.toX) < this.moveSpeed){
               this.x = this.toX;
            }else {
               this.x += this.moveSpeed;
            }
         }
         else if((this.y < this.toY) && (this.x < this.toX)){ //Diag right up
            if(Math.abs(this.y - this.toY) < this.moveSpeed){
               this.y = this.toY;
            }else {
               this.y += this.moveSpeed;
            }

            if(Math.abs(this.x - this.toX) < this.moveSpeed){
               this.x = this.toX;
            }else {
               this.x += this.moveSpeed;
            }
         }
         else if((this.y < this.toY) && (this.x > this.toX)){ //Diag left up
            if(Math.abs(this.y - this.toY) < this.moveSpeed){
               this.y = this.toY;
            }else {
               this.y += this.moveSpeed;
            }

            if(Math.abs(this.x - this.toX) < this.moveSpeed){
               this.x = this.toX;
            }else {
               this.x -= this.moveSpeed;
            }
         }
         else if(this.y > this.toY){                           //down
             if(Math.abs(this.y - this.toY) < this.moveSpeed){
                 this.y = this.toY;
             }else {
                 this.y -= this.moveSpeed;
             }
         }
         else if(this.y < this.toY){                           //up
            if(Math.abs(this.y - this.toY) < this.moveSpeed){
               this.y = this.toY;
            }else {
               this.y += this.moveSpeed;
            }
         }
         else if(this.x > this.toX){                           //left
            if(Math.abs(this.x - this.toX) < this.moveSpeed){
               this.x = this.toX;
            }else {
               this.x -= this.moveSpeed;
            }
         }
         else if(this.x < this.toX){                           //right
            if(Math.abs(this.x - this.toX) < this.moveSpeed){
               this.x = this.toX;
            }else {
               this.x += this.moveSpeed;
            }
         }

         
         //This commented out code would be used for taking the enemy as input, it was having issues removing the bullet though, if we want to change it
         //to be able to use this then this would be helpful to keep
         
         /*if(this.x == this.enemy.x && this.y == this.enemy.y){
            this.parentNode.removeChild();
         }
         else if(this.y  > this.enemy.y){
            if(this.x > this.enemy.x){
               if((Math.abs(this.y - this.enemy.y) < this.moveSpeed) && (Math.abs(this.x - this.enemy.x) < this.moveSpeed)){
                  this.y = this.enemy.y;
                  this.x = this.enemy.x;
               }
               else{
                  this.y -= this.moveSpeed;
                  this.x -= this.moveSpeed;
               }
            }
            else{
               if((Math.abs(this.y - this.enemy.y) < this.moveSpeed) && (Math.abs(this.x - this.enemy.x) < this.moveSpeed)){
                  this.y = this.enemy.y;
                  this.x = this.enemy.x;
               }
               else{
                  this.y -= this.moveSpeed;
                  this.x += this.moveSpeed;
               }
            }
         }
         else if(this.y  < this.enemy.y){
            if(this.x > this.enemy.x){
               if((Math.abs(this.y - this.enemy.y) < this.moveSpeed) && (Math.abs(this.x - this.enemy.x) < this.moveSpeed)){
                  this.y = this.enemy.y;
                  this.x = this.enemy.x;
               }
               else
               {
                  this.y += this.moveSpeed;
                  this.x -= this.moveSpeed;
               }
            }
            else{
               if((Math.abs(this.y - this.enemy.y) < this.moveSpeed) && (Math.abs(this.x - this.enemy.x) < this.moveSpeed)){
                  this.y = this.enemy.y;
                  this.x = this.enemy.x;
               }
               else{
                  this.y += this.moveSpeed;
                  this.x += this.moveSpeed;
               }
            }
         }
         */
      });
   }
});

var StatusShoot = Class.create(Shoot, {
	initialize: function(assetIndex, x, y, toX, toY, enemy, power) {
		Shoot.apply(this, [assetIndex, x, y, toX, toY, enemy, power]);

      this.addEventListener(Event.ENTER_FRAME, function(){
         //Remove bullet and slow
         if(this.y == this.toY && this.x == this.toX){
            if(enemy.speed >  enemy.maxSpeed - enemy.speed)
               enemy.speed -= power;
         }
	   });
	}
});

var AreaShoot = Class.create(Shoot, {
	initialize: function(assetIndex, x, y, toX, toY, enemy, power) {
		Shoot.apply(this, [assetIndex, x, y, toX, toY, enemy, power]);

      this.addEventListener(Event.ENTER_FRAME, function(){
         //Remove bullet and slow
         if(this.y == this.toY && this.x == this.toX)
            enemy.health -= power;
	   });
	}
});

var SingleShoot = Class.create(Shoot, {
	initialize: function(assetIndex, x, y, toX, toY, enemy, power) {
		Shoot.apply(this, [assetIndex, x, y, toX, toY, enemy, power]);

      this.addEventListener(Event.ENTER_FRAME, function(){
         //Remove bullet and add dmg
         if(this.y == this.toY && this.x == this.toX)
            enemy.health -= power;
	   });
	}
});


