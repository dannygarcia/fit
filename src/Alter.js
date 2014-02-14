/*
 * Alter.js – Part of FIT (Front-end Interactive Toolkit)
 * Copyright (c) 2014, Danny Garcia. All rights reserved.
 * Code licensed under the MIT License
 * https://github.com/dannygarcia/fit/
 */

'use strict';

var AbstractClass = require('./AbstractClass');

/**
 * Alter Constructor
 * @param {Object} userOptions {
 * }
 * @return {Function} Alter instance.
 */
var Alter = new AbstractClass(function (userOptions) {

	this._setOptions({}, userOptions);

	// This is borrowed from Modernizr
	this._contains = function contains(str, substr) {
		/*jshint bitwise: false*/
		return !!~('' + str).indexOf(substr);
	};

	// Prefixing method borrowed from Modernizr
	this._prefixed = function (prop, style) {

		var prefixes = 'Webkit Moz O ms'.split(' '),
			ucProp  = prop.charAt(0).toUpperCase() + prop.slice(1),
			props = (prop + ' ' + prefixes.join(ucProp + ' ') + ucProp).split(' '),
			i, property;

		for (i in props ) {
			property = props[i];
			if (!this._contains(property, '-') && style[property] !== undefined) {
				return property;
			}
		}

		return false;

	};

	return this;

});

/**
 * Transforms the given node.
 * @param  {Object} el         DOM Node
 * @param  {Array||Object} transforms An object or array of objects that represent the animation property and values.
 * @return {Object}            This.
 */
Alter.prototype.transform = function (el, transforms) {

	if (typeof el === 'undefined') {
		el = this.el;
	}

	this.el = el;

	var transform,
		transformation = '';

	if (transforms instanceof Array) {
		// [{ property : 'property', value : 'value' }, { property : 'property', value : 'value' }]
		for (var i = 0; i < transforms.length; i++) {
			transformation += transforms[i].property + '(' + transforms[i].value + ') ';
		}
	} else {
		// { 'property' : 'value', 'property' : 'value' }
		for (transform in transforms) {
			transformation += transform + '(' + transforms[transform] + ') ';
		}
	}

	el.style[this._prefixed('transform', el.style)] = transformation;

	return this;

};

/**
 * Transforms the origin of the given element.
 * @param  {Object} el      DOM Node.
 * @param  {String} originX X origin.
 * @param  {String} originY Y origin.
 * @return {Object} This.
 */
Alter.prototype.transformOrigin = function (el, originX, originY) {

	if (typeof el === 'undefined') {
		el = this.el;
	}

	this.el = el;

	el.style[this._prefixed('transformOrigin', el.style)] = originX + ' ' + originY;

	return this;

};

/**
 * Resets options.
 * @return {Object} This.
 */
Alter.prototype.destroy = function () {

	this.options = this._defaultOptions;
	return this;

};

module.exports = Alter;
