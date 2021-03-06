/*
 * Canvas.js – Part of FIT (Front-end Interactive Toolkit)
 * Copyright (c) 2014, Danny Garcia. All rights reserved.
 * Code licensed under the MIT License
 * https://github.com/dannygarcia/fit/
 */

'use strict';

var AbstractClass = require('./AbstractClass');

/**
 * Canvas Constructor
 * @param {Object} userOptions {
 *   {String} contextType '2d' or '3d'
 *   {Object} parent DOM Node
 *   {String||Number} width A 'auto' or number value of initial width.
 *   {String||Number} height A 'auto' or number value of initial height.
 *   {Boolean} resize Should it resize when the window resizes?
 *   {Number} ratio Device pixel ratio.
 * }
 * @return {Function} Canvas instance.
 */
var Canvas = new AbstractClass(function (userOptions) {

	this._setOptions({
		contextType: '2d',
		parent: document.body,
		width: 'auto',
		height: 'auto',
		resize: false,
		ratio: window.devicePixelRatio || 1
	}, userOptions);

	this._canvas = this.options.parent.appendChild(document.createElement('canvas'));
	this._context = this.getContext(this.options.contextType);

	this.resize(this.options.width, this.options.height);

	if (this.options.resize) {
		window.addEventListener('resize', this.resize.bind(this), false);
	}

	return this;

});

/**
 * Get Context
 * @return {Object} Canvas context.
 */
Canvas.prototype.getContext = function () {
	return this._context || this._canvas.getContext(this.options.contextType);
};

/**
 * Resize canvas element.
 * @param  {Object} e (optional) HTML event.
 * @param  {Number} width Desired width.
 * @param  {Number} height Desired height.
 * @return {Object} This.
 */
Canvas.prototype.resize = function (e, width, height) {

	// Makes e optional.
	if (!height && typeof e === 'number' && typeof width === 'number') {
		height = width;
		width = e;
	}

	// Determine the appropriate width.
	if (typeof width === 'undefined' || width === 'auto') {
		width = this.options.parent.offsetWidth;
	}

	// Determine the appropriate height.
	if (typeof height === 'undefined' || height === 'auto') {
		height = this.options.parent.offsetHeight;
	}

	width *= this.options.ratio;
	height *= this.options.ratio;

	// Set the appropriate canvas resolution.
	this.width = this._canvas.width = width;
	this.height = this._canvas.height = height;


	// Set the actual canvas width and height.
	this._canvas.style.width = (width / this.options.ratio) + 'px';
	this._canvas.style.height = (height / this.options.ratio) + 'px';

	return this;

};


/**
 * Clears the canvas.
 * @return {Object} This.
 */
Canvas.prototype.clear = function () {
	this._context.clearRect(0, 0, this.width, this.height);
	return this;
};

/**
 * Resets options, removes canvas element, resize events and context. Works as a cleanup after something like a transition out.
 * @return {Object} This.
 */
Canvas.prototype.destroy = function () {

	// Unbind resize.
	if (this.options.resize) {
		window.removeEventListener('resize', this.resize.bind(this), false);
	}

	// Remove canvas node.
	if (this._canvas) {
		this.options.parent.removeChild(this._canvas);
	}

	// Reset variables.
	this.options = this._defaultOptions;
	this._canvas = null;
	this._context = null;

	return this;

};

module.exports = Canvas;
