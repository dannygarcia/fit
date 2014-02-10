/*
 * input.js – Part of FIT (Front-end Interactive Toolkit)
 * Copyright (c) 2014, Danny Garcia. All rights reserved.
 * Code licensed under the MIT License
 * https://github.com/dannygarcia/fit/
 */

'use strict';

var AbstractClass = require('./AbstractClass');

/**
 * Input Constructor
 * @param  {Object} userOptions {
 *   {Object} element DOM Node
 *   {Boolean} preventDefault Should prevent default event?
 *   {Number} ratio Device pixel ratio.
 *   {Boolean} forceTouch Should force touch event?
 *   {String} type Type of coordinate vehicle to return 'object' or 'array'.
 * }
 * @return {Function} Input instance.
 */
var Input = new AbstractClass(function (userOptions) {

	this._setOptions({
		element: document.body,
		preventDefault: false,
		ratio: window.devicePixelRatio || 1,
		forceTouch: false,
		type: 'object',
		autoBindInputs: true
	}, userOptions);

	this._ratio = 1;
	this._bound = false;
	this._touch = !!(this.options.forceTouch || this.supportsTouch());

	this.inputs = [];
	this.average = {};

	if (this.options.autoBindInputs) {
		this.bindAllInputs();
	}

	return this;

});

Input.prototype._makeCoordinate = function (x, y) {
	return (this.options.type === 'object') ? {x : x, y: y } : [x, y];
};

Input.prototype._getX = function (from) {
	return (this.options.type === 'object') ? from.x : from[0];
};

Input.prototype._getY = function (from) {
	return (this.options.type === 'object') ? from.y : from[1];
};

Input.prototype._incrementCoordinate = function (c, by) {
	if (this.options.type === 'object') {
		c.x += by.x;
		c.y += by.y;
	} else {
		c[0] += by[0];
		c[1] += by[1];
	}
	return c;
};

/**
 * Primary method that sets coordinates by a given mouse or touch event.
 * @param {Object} e HTML event.
 * @return {Object} This.
 */
Input.prototype.setCoordinates = function (e) {

	if (this.options.preventDefault) {
		e.preventDefault();
	}

	var c = [],
		sum = this._makeCoordinate(0, 0);

	if (this._touch) {

		// For each touch input, generate its coordinates.
		for (var i = 0; i < e.touches.length; i++) {
			c[i] = this._makeCoordinate(e.touches[i].pageX * this._ratio, e.touches[i].pageY * this._ratio);
			sum = this._incrementCoordinate(sum, c[i]);
		}

	} else {

		// Regular Mouse Event Coordinates
		c[0] = this._makeCoordinate(e.pageX * this._ratio, e.pageY * this._ratio);
		sum = c[0];

	}

	// Update the inputs array.
	this.inputs = c;

	// Update the average value.
	this.average = this._makeCoordinate(
		Math.ceil(this._getX(sum) / c.length),
		Math.ceil(this._getY(sum) / c.length)
	);

	return this;

};


// NOTE: This can / should be optimized somehow so
// that only one method is called instead of three.
// They are called separately so we can pass the
// specific type to this.setCoordinates() easily.
Input.prototype.bindAllInputs = function () {
	this._bound = true;
	this.bindTapStart();
	this.bindTapMove();
	this.bindTapEnd();
};


Input.prototype.unbindAllInputs = function () {
	if (this._bound) {
		this.unbindTapStart();
		this.unbindTapMove();
		this.unbindTapEnd();
	}
	this._bound = false;
};


/* ============================
* Tap / Click Down
* ========================== */

Input.prototype.bindTapStart = function () {
	var event = this.getEventType('start');
	this.options.element.addEventListener(event, this.tapStart.bind(this), false);
};

Input.prototype.tapStart = function (e) {
	this.setCoordinates(e, 'start');
	this.ontapstart(this.average, this.inputs);
};

// This is the hook for the fired event.
Input.prototype.ontapstart = function (/** average, inputs **/) {};

Input.prototype.unbindTapStart = function () {
	var event = this.getEventType('start');
	this.options.element.removeEventListener(event, this.tapStart.bind(this), false);
};


/* ============================
* Tap / Click Move Over
* ========================== */

Input.prototype.bindTapMove = function () {
	var event = this.getEventType('move');
	this.options.element.addEventListener(event, this.tapMove.bind(this), false);
};

Input.prototype.tapMove = function (e) {
	this.setCoordinates(e, 'move');
	this.ontapmove(this.average, this.inputs);
};

// This is the hook for the fired event.
Input.prototype.ontapmove = function (/** average, inputs **/) {};

Input.prototype.unbindTapMove = function () {
	var event = this.getEventType('move');
	this.options.element.removeEventListener(event, this.tapMove.bind(this), false);
};


/* ============================
* Tap / Click Up
* ========================== */

Input.prototype.bindTapEnd = function () {
	var event = this.getEventType('end');
	this.options.element.addEventListener(event, this.tapEnd.bind(this), false);
};

Input.prototype.tapEnd = function (e) {
	this.setCoordinates(e, 'end');
	this.ontapend(this.average, this.inputs);
};

// This is the hook for the fired event.
Input.prototype.ontapend = function (/** average, inputs **/) {};

Input.prototype.unbindTapEnd = function () {
	var event = this.getEventType('end');
	this.options.element.removeEventListener(event, this.tapEnd.bind(this), false);
};


// Returns the appropriate event type
// based on whether or not it supports touch.
Input.prototype.getEventType = function (type) {

	var prefix = this._touch ? 'touch' : 'mouse';

	if (type === 'start' && !this._touch) {
		// Convert 'start' to 'down'
		type = 'down';
	} else if (type === 'end' && !this._touch) {
		// Convert 'end' to 'up'
		type = 'up';
	}

	return prefix + type;

};


// Test for touch support.
Input.prototype.supportsTouch = function () {

	// This is a quick and simple test as borrowed from Modernizr.
	// It does not include the deeper CSS Media Query test.
	// Use Modernizr.touch for a more thorough test.
	return (('ontouchstart' in window) || window.DocumentTouch && document instanceof window.DocumentTouch);

};


// Essentially resets everything
// to the state before this.init().
Input.prototype.destroy = function () {

	this.unbindAllInputs();

	return this;

};

module.exports = Input;
