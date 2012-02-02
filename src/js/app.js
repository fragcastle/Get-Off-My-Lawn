var App = new function () {
    
    this.BuildingPortion = function(buildingTypeId, x, y) {
        this.buildingTypeId = buildingTypeId;
        this.x = x;
        this.y = y;
    };
	
	this.debug = function(o) {
		if( console && console.log ) {
			console.log(o);
		}
	};

    this.draw = function() {
        var canvas = App.canvas;
        var context = App.context;

        var tile = App.tile;
        var tileMap = App.tileMap;
        
        context.clearRect (0, 0, canvas.width, canvas.height);
        
        for (var col = 0; col < 10; col++) {
            for (var row = 0; row < 10; row++) {
                var tilePositionX = (row - col) * tile.height;

                // Center the grid horizontally
                tilePositionX += (canvas.width / 2) - (tile.width / 2);

                var tilePositionY = (row + col) * (tile.height / 2);

                if (tileMap[row] != null && tileMap[row][col] != null) {
                    var building = tileMap[row][col];
                    
                    tilePositionY -= building.height - tile.height;
                    tilePositionX -= (building.width / 2) - (tile.width / 2);
                    context.drawImage(building.texture, Math.round(tilePositionX), Math.round(tilePositionY), building.width, building.height);
                } else {
                    context.drawImage(tile, Math.round(tilePositionX), Math.round(tilePositionY), tile.width, tile.height);	
                }
            }	
        }
    };
    
    this.convertMouseToCanvas = function (clientX, clientY) {
        var canvas = App.canvas;
        
        var grid = App.grid;
        var tile = App.tile;
        
        var gridOffsetY = grid.height;
        var gridOffsetX = grid.width;

        // Take into account the offset on the X axis caused by centering the grid horizontally
        gridOffsetX += (canvas.width / 2) - (tile.width / 2);

        var col = (clientY - gridOffsetY) * 2;
        col = ((gridOffsetX + col) - clientX) / 2;
        
        var row = ((clientX + col) - tile.height) - gridOffsetX;

        row = Math.round(row / tile.height);
        col = Math.round(col / tile.height);
        
        return { row: row, col: col };
    };
    
    this.handleMouseDown = function (e) {
        App.debug('mouse down');
        
        var coordinate = App.convertMouseToCanvas(e.clientX, e.clientY);

        row = coordinate.row;
        col = coordinate.col;
        
        App.debug('Mouse map ' + e.clientX + ',' + e.clientY + ' to ' + row + ',' + col);
        
        if(App.selectedTool === App.Tool.build) {
            App.build(row, col);
        }
        else if(App.selectedTool === App.Tool.demolish) {
            App.demolish(row, col);
        }
    };
    
    this.build = function (row, col) {
        var canvas = App.canvas;
        var context = App.context;
        
        var grid = App.grid;
        var tile = App.tile;
        var tileMap = App.tileMap;
        
        var buildingCounter = App.buildingCounter;
        
        // Create the building object
        var building = new App.selectedBuilding(buildingCounter); // new Buildings.cinema(buldingCounter);
        
        // Check the boundaries!
        if (row >= 0 && 
            col >= 0 && 
            row <= grid.width &&
            col <= grid.height) {

            tileMap[row] = (tileMap[row] === undefined) ? [] : tileMap[row];
            
            // Do we have enough space to place this building on the grid?
            if ((row - building.tileWidth + 1) < 0 || (col - building.tileHeight + 1) < 0) {
                App.debug('(' + row + ',' + col + ') Invalid Location!\nPart of the building will appear outside the grid.');
                return;
            }

            // Now check that the tiles that the building will occupy are not occupied by other buildings
            for (var i = row - building.tileWidth + 1; i < row; i++) {
                for (var j = col - building.tileHeight + 1; j < col; j++) {
                    if (tileMap[i] != undefined && tileMap[i][j] != null) {
                        App.debug('(' + row + ',' + col + ') There\'s another building there!');
                        return;
                    }
                }
            }
            
            tileMap[row][col] = building;
            
            App.draw();
        }
    };
    
    this.demolish = function (row, col) {
        var canvas = App.canvas;
        var context = App.context;
        
        var grid = App.grid;
        var tile = App.tile;
        var tileMap = App.tileMap;
        
        tileMap[row][col] = null;
        
        App.draw();
    }
    
    this.handleMouseMove = function (e) {
        var coordinate = App.convertMouseToCanvas(e.clientX, e.clientY);
    };
    
    this.load = function (canvas, context) {
        App.canvas = canvas;
        App.context = context;
        
        App.tile.src = Resources.Terrain.grass;
    };
    
    this.Tool = new function () {
        this.build = 1;
        this.demolish = 2;
    };
    
    this.selectedTool = this.Tool.build;
    this.selectedBuilding = Buildings.cinema;
    this.canvas = null;
    this.context = null;
    
    this.grid = {
        width: 10,
        height: 10
    };
    
    this.tileMap = [];

    this.tile = new Image();
    
    // In reality, the building count is being performed server-side in the database
    this.buildingCounter = 0;
};