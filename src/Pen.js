/*
 * Pen.js – Part of FIT (Front-end Interactive Toolkit)
 * Copyright (c) 2014, Danny Garcia. All rights reserved.
 * Code licensed under the MIT License
 * https://github.com/dannygarcia/fit/
 */

'use strict';

var AbstractClass = require('./AbstractClass');

/**
 * Pen Constructor
 * @param {Object} userOptions {
 * }
 * @return {Function} Pen instance.
 */
var Pen = new AbstractClass(function (userOptions) {

	this._setOptions({
		ctx: null
	}, userOptions);

	this.ctx = this.options.ctx;

	return this;

});

/**
 * Gets and/or sets the current context.
 * @param  {Object} context Canvas context.
 * @return {Object} Canvas context.
 */
Pen.prototype.context = function (context) {

	if (typeof context === 'undefined') {

		if (this.ctx === null) {
			throw 'You must provide a [ctx] to draw on. Try setting it with context(ctx)';
		}

		return this.ctx;
	}

	this.ctx = this.options.ctx = context;
	return this.ctx;

};

/**
 * Sets the context fillStyle.
 * @param  {String} color Fill color.
 * @return {Object} This.
 */
Pen.prototype.fill = function (color) {
	var ctx = this.context();
	ctx.fillStyle = color;
	return this;
};

/**
 * Sets the stroke color and width.
 * @param  {String} color Stroke style color.
 * @param  {Number} width Line width.
 * @return {Object} This.
 */
Pen.prototype.stroke = function (color, width) {
	var ctx = this.context();

	if (color) {
		ctx.strokeStyle = color;
	}

	if (width) {
		ctx.lineWidth = width;
	}

	return this;
};

/**
 * Draws a simple line.
 * @param  {Object||Array} from Coordinate to draw a line from.
 * @param  {Object||Array} to   Coordinate to draw a line to.
 * @param  {String} type Type of input.
 * @return {Object} This.
 */
Pen.prototype.line = function (from, to, type) {
	type = type || 'object';
	var ctx = this.context();
	ctx.beginPath();
	if (type === 'array') {
		ctx.moveTo(from[0], from[1]);
		ctx.lineTo(to[0], to[1]);
	} else {
		ctx.moveTo(from.x, from.y);
		ctx.lineTo(to.x, to.y);
	}
	ctx.stroke();
	return this;
};

/**
 * Draws a centered circle.
 * @param  {Object||Array} pos  Coordinate position.
 * @param  {Number} size Size.
 * @param  {String} type Type of input.
 * @return {Object} This.
 */
Pen.prototype.circle = function (pos, size, type) {
	type = type || 'object';
	var ctx = this.context();
	ctx.beginPath();
	if (type === 'array') {
		ctx.arc(pos[0], pos[1], size, 0, Math.PI * 2, true);
	} else {
		ctx.arc(pos.x, pos.y, size, 0, Math.PI * 2, true);
	}
	ctx.closePath();
	ctx.fill();
	return this;
};

/**
 * Resets options.
 * @return {Object} This.
 */
Pen.prototype.destroy = function () {

	this.options = this._defaultOptions;
	return this;

};

module.exports = Pen;
