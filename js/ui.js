

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