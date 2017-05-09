'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.Komet = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _events = require('events');

var _events2 = _interopRequireDefault(_events);

var _validate = require('./validate');

var _validate2 = _interopRequireDefault(_validate);

var _util = require('./util');

var _ = _interopRequireWildcard(_util);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ENTRY = "ENTRY";
var COMMAND = "COMMAND";
var TASKS = "TASKS";
var SEQUENTIAL = "SEQUENTIAL";
var PARALLEL = "PARALLEL";

/**
 * @since 0.0.1
 * @example
 * var komet = require("komet");
 *
 * komet.task({
 *  alias:'task-one',
 *  entry:'task-one.js'
 * });
 */

var Komet = exports.Komet = function (_EventEmitter) {
	_inherits(Komet, _EventEmitter);

	/**
  * @private
  */
	function Komet() {
		_classCallCheck(this, Komet);

		/**
   * @private
   */
		var _this = _possibleConstructorReturn(this, (Komet.__proto__ || Object.getPrototypeOf(Komet)).call(this));

		_this.tasks = {};
		return _this;
	}

	/**
  * @private
  * @desc Method for validate task.
  * @param {Object} config - Task configuration object.
  * @return {Object} task - Subscribed task.
  */


	_createClass(Komet, [{
		key: 'validateTask',
		value: function validateTask(config) {
			var alias = config.alias,
			    entry = config.entry,
			    sequential = config.sequential;

			var task = {};
			_validate2.default.execute('string', alias);
			_validate2.default.execute('string', entry);
			if (sequential) {
				_validate2.default.execute('array', sequential);
				var _iteratorNormalCompletion = true;
				var _didIteratorError = false;
				var _iteratorError = undefined;

				try {
					for (var _iterator = sequential[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
						var dependence = _step.value;

						_validate2.default.execute('string', dependence);
					}
				} catch (err) {
					_didIteratorError = true;
					_iteratorError = err;
				} finally {
					try {
						if (!_iteratorNormalCompletion && _iterator.return) {
							_iterator.return();
						}
					} finally {
						if (_didIteratorError) {
							throw _iteratorError;
						}
					}
				}
			}
			task[alias] = config;
			return task;
		}

		/**
   * @desc Method for creating a task.
   * @param {Object} config - Task configuration object.
   * @param {string} config.alias - The alias of your task.
   * @param {string} config.entry - The path of your node script.
   * @param {Array} config.dependsof - Task dependencies.
   */

	}, {
		key: 'task',
		value: function task(config) {
			var task = this.validateTask(config);
			Object.assign(this.tasks, task);
		}

		/**
   * @private
   * @param {array} tastas - kask from cli.
   * @param {boolean} option - Whether it is dependent or not.
   */

	}, {
		key: 'start',
		value: function start(params) {
			var argTask = params.argTask,
			    option = params.option,
			    envKomet = params.envKomet;

			var foundTask = void 0;
			var type = void 0;
			if (envKomet) {
				this.createEnv(envKomet);
			}
			if (!argTask) {
				throw new Error('Not alias task for argument');
			}
			for (var alias in this.tasks) {
				if (alias === argTask) {
					foundTask = this.tasks[alias];
				}
			}

			if (foundTask) {
				type = this.verifyTypeTask(foundTask);
				switch (type) {
					case ENTRY:
						this.initEntry(foundTask, option);
						break;
					case COMMAND:
						this.initCommand(foundTask);
						//console.log("Ejecutar la tarea con el comando", type, foundTask);
						break;
					case TASKS:
						//console.log("Ejecutar las tareas, no tiene ni entry ni comando", type, foundTask);
						this.initTasks(foundTask);
				}
			} else {
				this.emit('task_not_found', task);
			}
		}

		/**
   * @private
   * @param {string} env - enviroment a create.
   */

	}, {
		key: 'createEnv',
		value: function createEnv(env) {
			process.env[env] = env;
		}

		/**
   * @private
   * @param {Object} foundTask - Task found.
   * @return {string} type - Type of task.
   */

	}, {
		key: 'verifyTypeTask',
		value: function verifyTypeTask(foundTask) {
			//console.log("verifyTypeTask foundTask >", foundTask);
			var entry = foundTask.entry,
			    command = foundTask.command;

			var valid = false;
			var type = void 0;
			var count = 0;
			if (entry) {
				type = ENTRY;
				count++;
			}
			if (command) {
				type = COMMAND;
				count++;
			}
			//console.log("count>", count);
			if (count > 1) {
				throw new Error("You can not have entry and commando together");
			}
			if (!count) {
				type = TASKS;
			}
			return type;
		}

		/**
   * @private
   * @param {Object} task - Task found.
   * @param {boolean} option -Whether it is dependent or not.
   */

	}, {
		key: 'initEntry',
		value: function initEntry(task, option) {
			var sequential = task.sequential,
			    parallel = task.parallel;

			var param = {
				that: this,
				task: task
			};
			if (parallel && option) {
				throw new Error("You can only have sequential dependency tasks");
			}
			if (sequential && option) {
				this.sequentialProcess(task);
			} else {
				_.execute(param);
			}
		}

		/**
   * @private
   * @param {Object} task - Task found.
   */

	}, {
		key: 'initCommand',
		value: function initCommand(task) {
			var param = {
				that: this,
				task: task
			};
			_.executeCommand(param);
		}

		/**
   * @private
   * @param {object} task
   */

	}, {
		key: 'initTasks',
		value: function initTasks(task) {
			var sequential = task.sequential,
			    parallel = task.parallel;

			var tasks = sequential || parallel;
			var type = this.getTypeTasks(sequential, parallel);
			var tasksRun = tasks && this.getDependsTasks(tasks);
			if (tasksRun) {
				switch (type) {
					case SEQUENTIAL:
						this.dependenciesRun(tasksRun);
						break;
					case PARALLEL:
						console.log("ejecutar tareas en paralelo");
						this.runDependenciesParallel(tasksRun);
						break;
				}
			}
		}

		/**
   * @private
   * @param {object} tasksRun
   */

	}, {
		key: 'runDependenciesParallel',
		value: function runDependenciesParallel(tasksRun) {
			for (var _task in tasksRun) {
				var params = {
					that: this,
					task: tasksRun[_task]
				};
				_.execute(params);
			}
		}
		/**
   * @private
   * @param {string} sequential
   * @param {string} parallel
   */

	}, {
		key: 'getTypeTasks',
		value: function getTypeTasks(sequential, parallel) {
			var type = void 0;
			if (sequential) {
				type = SEQUENTIAL;
			}
			if (parallel) {
				type = PARALLEL;
			}
			return type;
		}

		/**
   * @private
   * @param {object} task - Configuration to run the script with dependencies.
   */

	}, {
		key: 'sequentialProcess',
		value: function sequentialProcess(task) {
			var sequential = task.sequential,
			    alias = task.alias;

			var tasksRun = this.getDependsTasks(sequential);
			tasksRun[alias] = task;
			this.dependenciesRun(tasksRun);
		}

		/**
   * @private
   * @param {array} dependencies
   */

	}, {
		key: 'getDependsTasks',
		value: function getDependsTasks(dependencies) {
			var tasksRun = {};
			var _iteratorNormalCompletion2 = true;
			var _didIteratorError2 = false;
			var _iteratorError2 = undefined;

			try {
				for (var _iterator2 = dependencies[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
					var dependence = _step2.value;

					for (var _task2 in this.tasks) {
						if (_task2 === dependence) {
							tasksRun[_task2] = this.tasks[_task2];
							break;
						}
					}
				}
			} catch (err) {
				_didIteratorError2 = true;
				_iteratorError2 = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion2 && _iterator2.return) {
						_iterator2.return();
					}
				} finally {
					if (_didIteratorError2) {
						throw _iteratorError2;
					}
				}
			}

			return tasksRun;
		}

		/**
   * @private
   * @param {object} tasksRun - All configurations to run.
   */

	}, {
		key: 'dependenciesRun',
		value: function dependenciesRun(tasksRun) {
			var _this2 = this;

			//console.log("dependenciesRun tareas por parametro", tasksRun)
			var task = void 0;
			var params = void 0;
			var runRecursive = function runRecursive(tasksRun) {
				if (Object.keys(tasksRun).length) {
					task = _.shiftObject(tasksRun);
					params = {
						that: _this2,
						task: task,
						tasksRun: tasksRun,
						callback: runRecursive
					};
					_.execute(params);
				}
			};
			runRecursive(tasksRun);
		}
	}]);

	return Komet;
}(_events2.default);