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

	this.events = {
		tapStart: this.getEventType('start'),
		tapMove: this.getEventType('move'),
		tapEnd: this.getEventType('end')
	};

	if (this.options.autoBindInputs) {
		this.bindAllInputs();
	}

	return this;

});

/**
 * Builds a coordinate.
 * @param  {Number} x X coordinate.
 * @param  {Number} y Y coordinate.
 * @return {Object||Array} Object or Array depending on options.type setting.
 */
Input.prototype._makeCoordinate = function (x, y) {
	return (this.options.type === 'object') ? {x : x, y: y } : [x, y];
};

/**
 * Gets X coordinate from a given coordinate.
 * @param  {Object||Array} from From coordinate.
 * @return {Number} X value.
 */
Input.prototype._getX = function (from) {
	return (this.options.type === 'object') ? from.x : from[0];
};

/**
 * Gets Y coordinate from a given coordinate.
 * @param  {Object||Array} from From coordinate.
 * @return {Number} Y value.
 */
Input.prototype._getY = function (from) {
	return (this.options.type === 'object') ? from.y : from[1];
};

/**
 * Increments a given coordinate by a given value.
 * @param  {Object||Array} c  Coordinate.
 * @param  {Object||Array} by Incrementor.
 * @return {Object||Array} Incremented coordinate.
 */
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

/**
 * Binds all inputs in this.events.
 */
Input.prototype.bindAllInputs = function () {

	this._bound = true;

	for (var e in this.events) {
		if (this.events.hasOwnProperty(e)) {
			this.options.element.addEventListener(this.events[e], this[e].bind(this), false);
		}
	}
};

/**
 * Unbinds all input events.
 */
Input.prototype.unbindAllInputs = function () {

	for (var e in this.events) {
		if (this.events.hasOwnProperty(e)) {
			this.options.element.removeEventListener(this.events[e], this[e].bind(this), false);
		}
	}

	this._bound = false;
};

/**
 * Fired by tap start event.
 * @param  {Object} e HTML DOM event.
 */
Input.prototype.tapStart = function (e) {
	this.setCoordinates(e, 'start');
	this.ontapstart(this.average, this.inputs);
};

/**
 * Tap Start Hook
 * @param {Number} average Averaged inputs.
 * @param {Array} inputs Array of all inputs.
 */
Input.prototype.ontapstart = function (/** average, inputs **/) {};

/**
 * Fired by tap move event.
 * @param  {Object} e HTML DOM event.
 */
Input.prototype.tapMove = function (e) {
	this.setCoordinates(e, 'move');
	this.ontapmove(this.average, this.inputs);
};

/**
 * Tap Move Hook
 * @param {Number} average Averaged inputs.
 * @param {Array} inputs Array of all inputs.
 */
Input.prototype.ontapmove = function (/** average, inputs **/) {};

/**
 * Fired by tap end event.
 * @param  {Object} e HTML DOM event.
 */
Input.prototype.tapEnd = function (e) {
	this.setCoordinates(e, 'end');
	this.ontapend(this.average, this.inputs);
};

/**
 * Tap End Hook
 * @param {Number} average Averaged inputs.
 * @param {Array} inputs Array of all inputs.
 */
Input.prototype.ontapend = function (/** average, inputs **/) {};

/**
 * Returns the appropriate event type for input.
 * @param  {String} type Type to get.
 * @return {String} Event type.
 */
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

/**
 * Tests touch support.
 * @return {Boolean} Does the device support touch?
 */
Input.prototype.supportsTouch = function () {

	// This is a quick and simple test as borrowed from Modernizr.
	// It does not include the deeper CSS Media Query test.
	// Use Modernizr.touch for a more thorough test.
	return (('ontouchstart' in window) || window.DocumentTouch && document instanceof window.DocumentTouch);

};

/**
 * Resets options and unbinds inputs.
 * @return {Object} This.
 */
Input.prototype.destroy = function () {

	this.unbindAllInputs();
	this.options = this._defaultOptions;
	return this;

};

module.exports = Input;
