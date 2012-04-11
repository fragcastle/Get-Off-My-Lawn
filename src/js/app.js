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

    this.start = function(levelName) {
        MapEngine.setCurrentMap(levelName).render();
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

        // if(App.selectedTool === App.Tool.build) {
        //     App.build(row, col);
        // }
        // else if(App.selectedTool === App.Tool.demolish) {
        //     App.demolish(row, col);
        // }
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

    this.load = function (canvasName) {
        var canvas = document.getElementById('theCanvas');
        var context = canvas.getContext('2d');

        App.canvas = canvas;
        App.context = context;

        App.canvas.addEventListener('mousedown', App.handleMouseDown, false);
        App.canvas.addEventListener('mousemove', App.handleMouseMove, false);
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
