'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Validate = function () {
	function Validate() {
		_classCallCheck(this, Validate);
	}

	_createClass(Validate, [{
		key: 'string',
		value: function string(entity) {
			if (entity && typeof entity !== 'string') {
				throw new Error(entity + ' needs to be a string');
			}
		}
	}, {
		key: 'array',
		value: function array(entity) {
			if (!Array.isArray(entity)) {
				throw new Error(entity + ' needs to be a array');
			}
		}
	}, {
		key: 'execute',
		value: function execute(type, alias) {
			var that = this;
			that[type].apply(that, [].slice.call(arguments, 1));
		}
	}]);

	return Validate;
}();

var inst = new Validate();
module.exports = inst;