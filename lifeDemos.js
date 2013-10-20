/*
 * File: lifeDemos.js
 * Author: Sean Cline
 * Version: .1
 * Description: An HTML5 canvas drawn "life" universe for Conway's Game of Life.
 * License: You may do whatever you please with this file and any code it contains. It is public domain.
 * Usage: Each demo here is mean to be fed into the lifeGrid using the loadDemo function. For example:
          life.currentGrid.loadDemo(lifeDemos.pulsar);
 */
var lifeDemos = {
	
	//
	// Still lives - These shapes are "stable" and don't change in the next generation.
	//
	block: new Array(
		new Array(1, 1),
		new Array(1, 1)
	),

	beehive: new Array(
		new Array(0, 1, 1, 0),
		new Array(1, 0, 0, 1),
		new Array(0, 1, 1, 0)
	),
	
	loaf: new Array(
		new Array(0, 1, 1, 0),
		new Array(1, 0, 0, 1),
		new Array(0, 1, 0, 1),
		new Array(0, 0, 1, 0)
	),
	
	boat: new Array(
		new Array(1, 1, 0),
		new Array(1, 0, 1),
		new Array(0, 1, 0)
	),
	
	//
	// Oscillators - These patterns change through 2 or more states, eventually returning to their original state.
	//
	blinker: new Array(
		new Array(0,0, 0),
		new Array(1, 1, 1),
		new Array(0,0, 0)
	),
	
	toad: new Array(
		new Array(0,1, 1, 1),
		new Array(1,1, 1, 0)
	),
	
	beacon: new Array(
		new Array(1, 1, 0, 0),
		new Array(1, 1, 0, 0),
		new Array(0, 0, 1, 1),
		new Array(0, 0, 1, 1)
	),
	
	pulsar: new Array(
		new Array(0, 0, 1, 1, 1, 0, 0, 0, 1, 1, 1, 0, 0),
		new Array(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
		new Array(1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 1),
		new Array(1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 1),
		new Array(1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 1),
		new Array(0, 0, 1, 1, 1, 0, 0, 0, 1, 1, 1, 0, 0),
		new Array(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0), // Mirror after this line.
		new Array(0, 0, 1, 1, 1, 0, 0, 0, 1, 1, 1, 0, 0),
		new Array(1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 1),
		new Array(1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 1),
		new Array(1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 1),
		new Array(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
		new Array(0, 0, 1, 1, 1, 0, 0, 0, 1, 1, 1, 0, 0)
	),
	
	//
	// Ships - These patterns loop much like an oscillator with the exception that when returning to the original state, they have translated themselves over 1 or more units.
	//
	glider: new Array(
		new Array(0, 1, 0),
		new Array(0, 0, 1),
		new Array(1, 1, 1)
	),
	
	
	lwss: new Array( //lightweight spaceship
		new Array(1, 0, 0, 1, 0),
		new Array(0, 0, 0, 0, 1),
		new Array(1, 0, 0, 0, 1),
		new Array(0, 1, 1, 1, 1)
	),
	
	//
	// Methuselahs - The's patterns take many generations to stablize.
	//
	diehard: new Array(
		new Array(0, 0, 0, 0, 0, 0, 1, 0),
		new Array(1, 1, 0, 0, 0, 0, 0, 0),
		new Array(0, 1, 0, 0, 0, 1, 1, 1)
	),
	
	acorn: new Array(
		new Array(0, 1, 0, 0, 0, 0, 0),
		new Array(0, 0, 0, 1, 0, 0, 0),
		new Array(1, 1, 0, 0, 1, 1, 1)
	),
	
	gosper: new Array( // gosper glider gun
		new Array(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0),
		new Array(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,1,0,0,0,0,0,0,0,0,0,0,0),
		new Array(0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,1,1),
		new Array(0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,1,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,1,1),
		new Array(1,1,0,0,0,0,0,0,0,0,1,0,0,0,0,0,1,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0),
		new Array(1,1,0,0,0,0,0,0,0,0,1,0,0,0,1,0,1,1,0,0,0,0,1,0,1,0,0,0,0,0,0,0,0,0,0,0),
		new Array(0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0),
		new Array(0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0),
		new Array(0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0)

	)
}