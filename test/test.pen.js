/*global
	FIT: true,
	module: true,
	test:true,
	ok: true
*/

'use strict';

(function () {
	var pen,
		canvas = document.createElement('canvas');
	module('Pen', {
		setup: function () {
			pen = new FIT.Pen({
				ctx: canvas.getContext('2d')
			});
		},
		teardown: function () {
			pen.destroy();
		}
	});
	test('instantiation', function () {
		ok(typeof pen === 'object', 'returns a type of object');
	});
	test('.context', function () {
		ok(pen.context() === pen.ctx, 'context gets context');
		ok(pen.context(null) === null, 'context sets context');
	});
	test('.fill', function () {
		var color = '#fff000';
		pen.fill(color);
		ok(pen.context().fillStyle === color, 'sets fill color');
	});
	test('.stroke', function () {
		var color = '#fff000',
			width = 10,
			ctx = pen.context();
		pen.stroke(color, width);
		ok(ctx.strokeStyle === color, 'sets stroke color');
		ok(ctx.lineWidth === width, 'sets stroke width');
	});
	test('.line', function () {
		ok(pen.line({
			x: 0,
			y: 0
		}, {
			x: 1,
			y: 1
		}), 'calls object line w/out error');
		ok(pen.line([0, 0], [1, 1], 'array'), 'calls array line w/out error');
	});
	test('.circle', function () {
		ok(pen.circle({x: 0, y: 0}, 10), 'calls object circle w/out error');
		ok(pen.circle([0, 0], 10, 'array'), 'calls array circle w/out error');
	});
	test('.destroy', function () {
		ok(pen.destroy(), 'destroys');
		ok(pen.options === pen._defaultOptions, 'resets to default options');
	});
}(window));
