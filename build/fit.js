(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (global){'use strict';

global.FIT = module.exports = {
	Canvas: require('./src/Canvas'),
	Input: require('./src/Input'),
	Pen: require('./src/Pen')
};
}).call(this,typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./src/Canvas":3,"./src/Input":4,"./src/Pen":5}],2:[function(require,module,exports){
'use strict';

var AbstractModule = function (Class) {
	Class = Class || function () {};
	Class.prototype = Object.create(AbstractModule.prototype);
	Class.prototype.constructor = Class;
	return Class;
};

AbstractModule.prototype._setOptions = function (defaultOptions, userOptions) {

	this._defaultOptions = defaultOptions || {};

	this.options = {};
	userOptions = userOptions || {};

	for (var option in this._defaultOptions) {
		if (this._defaultOptions.hasOwnProperty(option)) {
			this.options[option] = userOptions[option] || this._defaultOptions[option];
		}
	}

	return this;

};

module.exports = AbstractModule;

},{}],3:[function(require,module,exports){
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

},{"./AbstractClass":2}],4:[function(require,module,exports){
/*
 * Input.js – Part of FIT (Front-end Interactive Toolkit)
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

},{"./AbstractClass":2}],5:[function(require,module,exports){
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

},{"./AbstractClass":2}]},{},[1,2,3,4,5])