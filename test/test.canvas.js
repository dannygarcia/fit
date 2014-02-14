/*global
	FIT: true,
	module: true,
	test:true,
	ok: true
*/

'use strict';

(function () {
	var canvas;
	module('Canvas', {
		setup: function () {
			canvas = new FIT.Canvas({
				parent: document.getElementById('container')
			});
		},
		teardown: function () {
			canvas.destroy();
		}
	});
	test('instantiation', function () {
		ok(typeof canvas === 'object', 'returns a type of object');
	});
	test('.getContext 2d', function () {
		var ctx = canvas.getContext();
		ok(typeof canvas.getContext === 'function', 'getContext is a type of function');
		ok(typeof ctx === 'object', 'returns a type of object');
		ok(canvas.getContext('2d') instanceof window.CanvasRenderingContext2D, '2d context matches 2d context instance');
		ok(canvas._context === canvas.getContext(), 'method returns internal context');
	});
	test('.getContext webgl', function () {
		var webglCanvas = new FIT.Canvas({contextType: 'webgl'}),
			webglContext = webglCanvas.getContext('webgl');

		if (window.WebGLRenderingContext && webglContext) {
			ok(webglContext instanceof window.WebGLRenderingContext, 'webgl context matches webgl context instance');
		} else {
			ok(true, 'no webgl rendering context available');
		}
	});
	test('.resize', function () {
		var width = 10;
		var height = 20;
		canvas.resize(width, height);
		ok(canvas.width === width && canvas.height === height, 'sets canvas width and height');
		ok(canvas._canvas.style.width === width + 'px', 'width set in px');
		ok(canvas._canvas.style.height === height + 'px', 'height set in px');
	});
	test('.clear', function () {
		ok(canvas === canvas.clear(), 'does not throw.');
	});
	test('.destroy', function () {
		var parent = canvas.options.parent;
		ok(parent.childNodes.length === 1, 'one canvas element before destroy');
		canvas.destroy();
		ok(parent.childNodes.length === 0, 'no canvas element after destroy');
		ok(canvas.options === canvas._defaultOptions, 'resets to default options');
		ok(!canvas._canvas, 'nullifies canvas element');
		ok(!canvas._context, 'nullifies canvas context');
	});
}(window));
