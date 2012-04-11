 PathFinder.pushFinder("astar", (function() {

    function getMap() { return MapHandler.map; };

    function makePathArray(startPos, endPos, tileWidth) {
        tileWidth = tileWidth || 50;
        var map = getMap(),
            type = null,
            isWalkable = false,
            i = 0,
            j = 0,
            tiles = MapHandler.mapAsTiles();

        // initialize our array
        var pathArray = new Array(tiles.length);

        for (i = 0; i < tiles.length; i++) {
            pathArray[i] = new Array(tiles[i].length);
        }

        // fill the array with the status of each tile
        // "w" for walkable tiles
        // "u" for unwalkable tiles
        for (i = 0; i < tiles.length; i++) {
            for (j = 0; j < tiles[i].length; j++) {
                type = ui.getTileType({ x: j * tileWidth, y: i * tileWidth});
                isWalkable = MapHandler.walkableTiles[type];
                pathArray[i][j] = isWalkable ? "w" : "u";
            }
        }
        pathArray[startPos.y][startPos.x] = "s";
        pathArray[endPos.y][endPos.x] = "g";
        App.debug(pathArray);
        return pathArray;
    };

    // every pathfinder has to have a plotPath() method
    // it has to accept two points { x:, y: }
    function plotPath(startPos, endPos) {
        var heuristic = "manhattan";
        var cutCorners = false;

        return this.nav(makePathArray(startPos, endPos), heuristic, cutCorners);
    }

    function pathTo (n, listPath) {
        listPath.push(new NodeCoordinate(n.row, n.col));
        if (n.parentNode == null)
            return;
        pathTo(n.parentNode, listPath);
    }

    function addListToList(listA, listB) {
        for (x in listA)
            listB.push(listA[x]);
    }

    function removeMatchingNodes (listToCheck, listToClean) {
        var listToCheckLength = listToCheck.length;
        for (var i = 0; i < listToCheckLength; i++) {
            for (var j = 0; j < listToClean.length; j++) {
                if (listToClean[j].row == listToCheck[i].row && listToClean[j].col == listToCheck[i].col)
                    listToClean.splice(j, 1);
            }
        }
    }

    function cullUnwantedNodes (listToCull, listToCompare) {
        var listToCompareLength = listToCompare.length;
        for (var i = 0; i < listToCompareLength; i++) {
            for (var j = 0; j < listToCull.length; j++) {
                if (listToCull[j].row == listToCompare[i].row && listToCull[j].col == listToCompare[i].col) {
                    if (listToCull[j].f >= listToCompare[i].f)
                        listToCull.splice(j, 1);
                }
            }
        }
    }

    function areNodesEqual (nodeA, nodeB) {
        if (nodeA.row == nodeB.row && nodeA.col == nodeB.col)
            return true;
        else
            return false;
    }

    function returnNodeWithLowestFScore (list) {
        var lowestNode = list[0];
        for (x in list)
            lowestNode = (list[x].f < lowestNode.f) ? list[x] : lowestNode;
        return lowestNode;
    }

    function isListEmpty (list) {
        return (list.length < 1) ? true : false;
    }

    function removeNodeFromList (node, list) {
        var listLength = list.length;
        for (var i = 0; i < listLength; i++) {
            if (node.row == list[i].row && node.col == list[i].col) {
                list.splice(i, 1);
                break;
            }
        }
    }

    function addNodeToList (node, list) {
        list.push(node);
    }

    function createTerminalNode (map, heuristic, nodeType, nodeGoal) {
        var mapRows = map.length;
        var mapCols = map[0].length;

        for (var row = 0; row < mapRows; row++) {
            for (var col = 0; col < mapCols; col++) {
                if (map[row][col] == nodeType) {
                    return new Node(row, col, map, heuristic, null, nodeGoal);
                }
            }
        }
        return null;
    }

    function returnHScore (node, heuristic, nodeGoal) {
        var y = Math.abs(node.row - nodeGoal.row);
        var x = Math.abs(node.col - nodeGoal.col);
        switch (heuristic) {
            case "manhattan":
                return (y + x) * 10;
            case "diagonal":
                return (x > y) ? (y * 14) + 10 * (x - y) : (x * 14) + 10 * (y - x);
            case "euclidean":
                return Math.sqrt((x * x) + (y * y));
            default:
                return null;
        }
    }

    function NodeCoordinate (row, col) {
        this.row = row;
        this.col = col;
    }

    function Node (row, col, map, heuristic, parentNode, nodeGoal) {
        var mapLength = map.length;
        var mapRowLength = map[0].length;
        this.row = row;
        this.col = col;
        this.northAmbit = (row == 0) ? 0 : row - 1;
        this.southAmbit = (row == mapLength - 1) ? mapLength - 1 : row + 1;
        this.westAmbit = (col == 0) ? 0 : col - 1;
        this.eastAmbit = (col == mapRowLength - 1) ? mapRowLength - 1 : col + 1;
        this.parentNode = parentNode;
        this.childNodes = [];

        if (parentNode != null) {
            if (row == parentNode.row || col == parentNode.col)
                this.g = parentNode.g + 10;
            else
                this.g = parentNode.g + 14;
            this.h = returnHScore(this, heuristic, nodeGoal);
        }
        else {
            this.g = 0;
            if (map[row][col] == "s")
                this.h = returnHScore(this, heuristic, nodeGoal);
            else
                this.h = 0;
        }
        this.f = this.g + this.h;

        this.makeChildNodes = function (map, heuristic, cutCorners, nodeGoal) {
            for (var i = this.northAmbit; i <= this.southAmbit; i++) {
                for (var j = this.westAmbit; j <= this.eastAmbit; j++) {
                    if (i != this.row || j != this.col) {
                        if (map[i][j] != "u") {
                            if (cutCorners == true)
                                this.childNodes.push(new Node(i, j, map, heuristic, this, nodeGoal));
                            else {
                                if (i == this.row || j == this.col)
                                    this.childNodes.push(new Node(i, j, map, heuristic, this, nodeGoal));
                            }
                        }
                    }
                }
            }
        }
    }

    var _shortCircuit = 0;
    return {
        shortCircuit: function() {
            _shortCircuit = 1;
        },
        nav: function (map, heuristic, cutCorners) {
            _shortCircuit = 0;
            var listOpen = [];
            var listClosed = [];
            var listPath = [];
            var nodeGoal = createTerminalNode(map, heuristic, "g", null);
            var nodeStart = createTerminalNode(map, heuristic, "s", nodeGoal);
            addNodeToList(nodeStart, listOpen);

            var n;
            while (_shortCircuit == 0 && !isListEmpty(listOpen)) {
                try {
                n = returnNodeWithLowestFScore(listOpen);
                addNodeToList(n, listClosed);
                removeNodeFromList(n, listOpen);
                if (areNodesEqual(n, nodeGoal)) {
                    pathTo(n, listPath);
                    listPath.reverse();
                    return listPath;
                }

                n.makeChildNodes(map, heuristic, cutCorners, nodeGoal);
                cullUnwantedNodes(n.childNodes, listOpen);
                cullUnwantedNodes(n.childNodes, listClosed);
                removeMatchingNodes(n.childNodes, listOpen);
                removeMatchingNodes(n.childNodes, listClosed);
                addListToList(n.childNodes, listOpen);
                }catch(e){ break; }
            }
            return null;
        }
    };
})());
