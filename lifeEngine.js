/*
 * File: lifeEngine.js
 * Classes: lifeEngine, lifeGrid
 * Author: Sean Cline
 * Version: .1
 * Description: An HTML5 canvas drawn "life" universe for Conway's Game of Life.
 * License: You may do whatever you please with this file and any code it contains. It is public domain.
 * Usage: Place a canvas on your page somewhere like so:
	<canvas id="lifecanv" width="500" height="500">Your web browser does not support the CANVAS tag.</canvas>
	
	The width and height parameters may be changed to whatever you like.
	Next, instantiate a new lifeEngine like so:
	
	var life;
	window.onload = function() { life = new lifeEngine('lifecanv', 100, 100); }

	The first parameter is the id of the canvas that will be drawn to. The second is the life grid's width (how many cells), and the second is height.
 */

//
// Class: lifeEngine - All of the necesary functions to run Conway's game of life under the original rules.
//
function lifeEngine(canvasID, gridWidth, gridHeight) {
	// Save this object so timeouts/intervals/events can reference non-static members.
	if (typeof lifeEngine.instances == "undefined") {
		lifeEngine.instances = new Array();
	}
	this.id = lifeEngine.instances.length;
	lifeEngine.instances[this.id] = this;

	// Member Variables
	this.canvasElement = document.getElementById(canvasID);		// Save the canvas element to create the context later.
	this.ctx =null;										// YAY! A place to draw!
	this.mouseX = -1;									// mouseMove() updates this to be the position relative to the dockElement.
	this.mouseY = -1;									// mouseMove() updates this to be the position relative to the dockElement.
	this.frameInterval									// The interval that runs a new frame periodically.
	
	// Run and draw 1 full generation.
	this.runFrame = function() {
		// The mouse "feels" more responsive by rendering first then drawing.
		this.drawFrame();
		this.currentGrid.runFrame();
	}
	
	// Stop any future generations from taking place, freezing the game.
	this.stop = function() {
		clearInterval(this.frameInterval);
	}
	
	// Start calculating generations and rendering.
	this.start = function(delay) {
		delay = delay || 100;
		clearInterval(this.frameInterval); // Clear any old intervals
		this.frameInterval = setInterval("lifeEngine.instances[" + this.id + "].runFrame()", delay);
	}
	
	// Draw the grid onto the canvas.
	this.drawFrame = function() {
		var cellWidth = this.canvasElement.width/this.currentGrid.width;
		var cellHeight = this.canvasElement.height/this.currentGrid.height;
		
		this.ctx.fillStyle = "white";
		this.ctx.fillRect(0, 0, this.canvasElement.width, this.canvasElement.height);
		this.ctx.fillStyle = "black";
                for(var x = 0; x < this.currentGrid.width; x++) {
                        for(var y = 0; y < this.currentGrid.height; y++) {
                                if(this.currentGrid.getCellValue(x,y) == 1)
                                {
                                        this.ctx.fillRect (x*cellWidth, y*cellHeight, cellWidth, cellHeight);
                                }
                        }
                }

	}

	this.getGridCoords = function() {
		var cellWidth = this.canvasElement.width/this.currentGrid.width;
		var cellHeight = this.canvasElement.height/this.currentGrid.height;
		var gridX = Math.floor(this.mouseX/cellWidth);
		var gridY = Math.floor(this.mouseY/cellHeight);
		return [gridX, gridY];
	}
	
	// Executed when the mouse moves over the canvasElement.
	lifeEngine.mouseMove = function(e) {
		// Since this is a static method, it needs to know which instance of Dock caused the event.
		var self = null;
		var obj = null;
		for (var i in lifeEngine.instances) {
			// See if the event target has a parent element owned by this instance.
			obj = e.target || e.srcElement;
			while (obj != null && obj.tagName != "BODY") {
				if (obj.id == lifeEngine.instances[i].canvasElement.id) {
					self = lifeEngine.instances[i]; // Shorten to "self".
					break;
				}
				obj = obj.parentNode;
			}
			if (self == null) alert("Oops: Couldn't find the canvas associated with this event.");
		}
		// Phew...now that's over "self" can be used to access the instance that has the mouse moving.

		// Figure out where the mouse is.
		var canvPos;
		canvPos = lifeEngine.getElementPosition(self.canvasElement);
		var x = canvPos[0];
		var y = canvPos[1];

		// For compatability with other browsers, use the proper scrollLeft and scrollTop values.
		var scrollLeft = document.body.scrollLeft || document.documentElement.scrollLeft;
		var scrollTop = document.body.scrollTop || document.documentElement.scrollTop;
		
		// Subtract the canvas element's location from the mouse client location for the reletive position. See why offsetX,offsetY is easier?
		self.mouseX  = e.clientX - x + scrollLeft;
		self.mouseY = e.clientY - y + scrollTop;

		var gridPos = self.getGridCoords();
		self.currentGrid.setCellValue(gridPos[0], gridPos[1], 1);
	}
	
	// Return the x and y coords of an element as an array.
	lifeEngine.getElementPosition = function(obj) {
		var x = 0;
		var y = 0;
		while(obj) {
			x += obj.offsetLeft;
			y += obj.offsetTop;
			obj = obj.offsetParent;
		}
		return [x, y];
	}

	// ##############
	// Constructor code
	// ##############
	if (this.canvasElement.getContext) {
		this.ctx = this.canvasElement.getContext("2d");
		
		// Create a new grid and randomize it.
		this.currentGrid = new lifeGrid(gridWidth, gridHeight);
		this.currentGrid.seed();
		this.drawFrame();
		this.start();
		
		
		// Listen for mouse movement.
		if (this.canvasElement.addEventListener) {
			this.canvasElement.addEventListener("mousemove", lifeEngine.mouseMove, false);
		} else if (this.dockElement.attachEvent) {
			this.canvasElement.attachEvent("onmousemove", lifeEngine.mouseMove);
		}
		
		
	} else {
		alert("Could not get canvas 2d context. Make sure your browser supports the HTML5 canvas tag");
	}
}

//
// Class: lifeGrid - The magic happens here.
//
function lifeGrid(width, height) {
	// Member Variables
	this.width = width;				// The width of this life universe.
	this.height = height;				// The height of this life universe.
	this.grid = new Array();
	
	// Seed the game by generating a random grid.
	this.seed = function() {
		var newgrid = new Array();
		var column = null;
		var gridval = 0;

		for (var x = 0; x < this.width; x++) {
			column = new Array();
			for (var y = 0; y < this.height; y++) {
				gridval = Math.random() < .75 ? 0 : 1;
				column.push(gridval);
			}
			newgrid.push(column);
		}

		this.grid = newgrid;
	}
	
	// Reset the grid to all 0's (dead cells)
	this.reset = function() {
		var newgrid = new Array();
		var column = null;
		var gridval = 0;

		for (var x = 0; x < this.width; x++) {
			column = new Array();
			for (var y = 0; y < this.height; y++) {
				gridval = 0;
				column.push(gridval);
			}
			newgrid.push(column);
		}
		
		this.grid = newgrid;
	}
	
	// Change the demensions of the grid.
	this.resize = function(width, height) {
		this.width = width;
		this.height = height;
	}
	
	// Load up an array of cells into the center of the grid. Useful for demonstrating patterns.
	this.loadDemo = function(demoArray) {
		this.reset();
	
		// Make a guess at the center.
		yOffset = Math.floor((this.width - demoArray.length)/2);
		xOffset = Math.floor((this.height - demoArray[0].length)/2);
		
		for (var y = 0; y < demoArray.length; y++) {
			for (var x = 0; x < demoArray[y].length; x++) {
				this.setCellValue(x+xOffset, y+yOffset, demoArray[y][x]);
			}
		}
	}
	
	// Set all cells to their next value, performing 1 full generation.
	this.runFrame = function() {
		var newgrid = new Array();
		var column = null;
		var gridval = 0;

		for (var x = 0; x < this.width; x++) {
			column = new Array();
			for (var y = 0; y < this.height; y++) {
				gridval = this.nextCellValue(x,y);
				column.push(gridval);
			}
			newgrid.push(column);
		}
		this.grid = newgrid;
	}
	
	// Calculate the next value for a cell on this grid.
	this.nextCellValue = function(x, y) {
		var aliveCount = 0;
		for (var xOffset = -1; xOffset <= 1; xOffset++) {
			for (var yOffset = -1; yOffset <= 1; yOffset++) {
				if (xOffset != 0 || yOffset != 0) {
					aliveCount += this.getCellValue(x+xOffset, y+yOffset);
				}
			}
		}
		
		var currentVal = this.getCellValue(x, y);
		if (currentVal == 1) {
			if (aliveCount >= 2 && aliveCount <= 3) {
				return 1;
			} else {
				return 0;
			}
		} else {
			if (aliveCount == 3) {
				return 1;
			} else {
				return 0;
			}	
		}
		
	}
	
	// Get the value (whether a cell is alive or dead) for an x,y pair.
	this.getCellValue = function(x, y) {
		if (typeof this.grid[x] == "undefined" || typeof this.grid[x][y] == "undefined" ) {
			return 0; // Return 0 so everything off the grid is not alive.
		}
		return this.grid[x][y];
	}
	
	// Set the value (whether a cell is alive or dead) for an x,y pair.
	this.setCellValue = function(x, y, value) {
		//if (x < this.width && y < this.height) { // Never set off the grid.
			this.grid[x][y] = value;
		//}
	}
	
}