/*global
	FIT: true,
	module: true,
	test:true,
	ok: true
*/

'use strict';

(function () {
	var alter;
	module('Alter', {
		setup: function () {
			alter = new FIT.Alter();
		},
		teardown: function () {
			alter.destroy();
		}
	});
	test('instantiation', function () {
		ok(typeof alter === 'object', 'returns a type of object');
	});
	test('.transform', function () {
		var div = document.createElement('div');
		alter.transform(div, {translateZ: 0});
		ok(div.style[alter._prefixed('transform', div.style)] === 'translateZ(0px)', 'transform set');
	});
	test('.transformOrigin', function () {
		var div = document.createElement('div');
		alter.transformOrigin(div, '10%', '50%');
		ok(div.style[alter._prefixed('transformOrigin', div.style)] === '10% 50%', 'transform origin set');
	});
	test('.destroy', function () {
		ok(alter.destroy(), 'destroys');
		ok(alter.options === alter._defaultOptions, 'resets to default options');
	});
}(window));
