'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _events = require('events');

var _events2 = _interopRequireDefault(_events);

var _child_process = require('child_process');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Komet = function (_EventEmitter) {
	_inherits(Komet, _EventEmitter);

	function Komet() {
		_classCallCheck(this, Komet);

		var _this = _possibleConstructorReturn(this, (Komet.__proto__ || Object.getPrototypeOf(Komet)).call(this));

		_this.tasks = {};
		return _this;
	}

	_createClass(Komet, [{
		key: 'task',
		value: function task(config) {
			if (config.alias && typeof config.alias !== 'string') {
				throw new Error('Alias for script requires a name that is a string');
			}
			if (config.entry && typeof config.entry !== 'string') {
				throw new Error('Entry for script requires a name that is a string');
			}
			if (config.dependencies) {
				if (!Array.isArray(config.dependencies)) {
					throw new Error('Dependencies require a array');
				}
				config.dependencies.forEach(function (dep) {
					if (typeof dep !== 'string') {
						throw new Error('Dependency name ' + dep + ' needs to be a string');
					}
				});
			}
			this.tasks[config.alias] = config;
		}
		/**
  * @param {array} ...args - Cli task argument.
  */

	}, {
		key: 'start',
		value: function start() {
			var that = this;
			var task = arguments.length <= 0 ? undefined : arguments[0];
			var taskRun = void 0;
			if (!task) {
				throw new Error('Not alias task for argument');
			}
			for (var alias in that.tasks) {
				if (alias === task) {
					taskRun = that.tasks[alias];
				}
			}
			that.runScript(taskRun);
		}
		/**
  * @param {objet} taskRun - Configuration to run the script.
  */

	}, {
		key: 'runScript',
		value: function runScript(taskRun) {
			var entry = taskRun.entry;
			(0, _child_process.exec)('node ' + entry, function (error, stdout, stderr) {
				if (error) {
					console.log(error);
					return;
				}
				console.log(stdout.trim());
			});
		}
	}]);

	return Komet;
}(_events2.default);

var inst = new Komet();
module.exports = inst;