var Buildings = new function()
{
    this.cinema = function(instanceId) {
        this.buildingTypeId = 1; // It's a cinema
        this.instanceId = null;

        this.texture = new Image();
        this.texture.src = Resources.Buildings.cinema;

        this.width = this.texture.width / 2;
        this.height = this.texture.height / 2;

        this.tileWidth = 1;
        this.tileHeight = 1;
    };
    
    this.icecream = function(instanceId) {
        this.buildingTypeId = 1; // It's a cinema
        this.instanceId = null;

        this.texture = new Image();
        this.texture.src = Resources.Buildings.icecream;

        this.width = this.texture.width / 2;
        this.height = this.texture.height / 2;

        this.tileWidth = 1;
        this.tileHeight = 1;
    };
}