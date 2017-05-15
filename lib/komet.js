"use strict";
/**
 * @author Wilson Flores <wilsonft83@gmail.com>
 * @since 0.0.1
 * @example
 * var komet = require("komet");
 *
 * komet.task({
 *  alias:'task-one',
 *  entry:'task-one.js'
 * });
 */
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var events_1 = require("events");
var validate_1 = require("./validate");
var _ = require("./util");
var type_1 = require("./type");
var Komet = (function (_super) {
    __extends(Komet, _super);
    function Komet() {
        var _this = _super.call(this) || this;
        _this.tasks = {};
        return _this;
    }
    /**
     * @private
     * @desc Method for validate task.
     * @param {Object} config - Task configuration object.
     * @return {Object} task - Subscribed task.
     */
    Komet.prototype.validateTask = function (config) {
        var alias = config.alias, entry = config.entry, sequential = config.sequential;
        var task = {};
        validate_1.default.execute('string', alias);
        validate_1.default.execute('string', entry);
        if (sequential) {
            validate_1.default.execute('array', sequential);
            for (var _i = 0, sequential_1 = sequential; _i < sequential_1.length; _i++) {
                var dependence = sequential_1[_i];
                validate_1.default.execute('string', dependence);
            }
        }
        task[alias] = config;
        return task;
    };
    /**
     * @desc Method for creating a task.
     * @param {Object} config - Task configuration object.
     * @param {string} config.alias - The alias of your task.
     * @param {string} config.entry - The path of your node script.
     * @param {Array} config.dependsof - Task dependencies.
     */
    Komet.prototype.task = function (config) {
        var task = this.validateTask(config);
        Object.assign(this.tasks, task);
    };
    /**
     * @private
     */
    Komet.prototype.start = function (params) {
        var argTask = params.argTask, option = params.option, envKomet = params.envKomet;
        var foundTask;
        var type;
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
                case type_1.default.ENTRY:
                case type_1.default.COMMAND:
                    this.initEntryOrCommand(foundTask, option);
                    break;
                case type_1.default.TASKS:
                    this.initTasks(foundTask);
            }
        }
        else {
            this.emit('task_not_found', argTask);
        }
    };
    /**
     * @private
     * @param {string} env - enviroment a create.
     */
    Komet.prototype.createEnv = function (env) {
        process.env[env] = env;
    };
    /**
     * @private
     * @param {Object} foundTask - Task found.
     * @return {string} type - Type of task.
     */
    Komet.prototype.verifyTypeTask = function (foundTask) {
        var entry = foundTask.entry, command = foundTask.command;
        var valid = false;
        var type;
        var count = 0;
        if (entry) {
            type = type_1.default.ENTRY;
            count++;
        }
        if (command) {
            type = type_1.default.COMMAND;
            count++;
        }
        if (count > 1) {
            throw new Error("You can not have entry and commando together");
        }
        if (!count) {
            type = type_1.default.TASKS;
        }
        return type;
    };
    /**
     * @private
     * @param {Object} task - Task found.
     * @param {boolean} option -Whether it is dependent or not.
     */
    Komet.prototype.initEntryOrCommand = function (task, option) {
        var sequential = task.sequential, parallel = task.parallel;
        var param = {
            that: this,
            task: task
        };
        if (parallel && option) {
            throw new Error("You can only have sequential dependency tasks");
        }
        if (sequential && option) {
            this.dependenciesTask(task);
        }
        else {
            _.execute(param);
        }
    };
    /**
     * @private
     * @param {object} task
     */
    Komet.prototype.initTasks = function (task) {
        var sequential = task.sequential, parallel = task.parallel;
        var tasks = sequential || parallel;
        var type = this.getTypeTasks(sequential, parallel);
        var tasksRun = tasks && this.getDependsTasks(tasks);
        if (tasksRun) {
            switch (type) {
                case type_1.default.SEQUENTIAL:
                    this.runDependenciesSequential(tasksRun);
                    break;
                case type_1.default.PARALLEL:
                    this.runDependenciesParallel(tasksRun);
                    break;
            }
        }
    };
    /**
     * @private
     * @param {object} tasksRun
     */
    Komet.prototype.runDependenciesParallel = function (tasksRun) {
        for (var task in tasksRun) {
            var params = {
                that: this,
                task: tasksRun[task]
            };
            _.execute(params);
        }
    };
    /**
     * @private
     * @param {string} sequential
     * @param {string} parallel
     */
    Komet.prototype.getTypeTasks = function (sequential, parallel) {
        var type;
        if (sequential) {
            type = type_1.default.SEQUENTIAL;
        }
        if (parallel) {
            type = type_1.default.PARALLEL;
        }
        return type;
    };
    /**
     * @private
     * @param {object} task - Configuration to run the script with dependencies.
     */
    Komet.prototype.dependenciesTask = function (task) {
        var sequential = task.sequential, alias = task.alias;
        var tasksRun = this.getDependsTasks(sequential);
        tasksRun[alias] = task;
        this.runDependenciesSequential(tasksRun);
    };
    /**
     * @private
     * @param {array} dependencies
     */
    Komet.prototype.getDependsTasks = function (dependencies) {
        var tasksRun = {};
        for (var _i = 0, dependencies_1 = dependencies; _i < dependencies_1.length; _i++) {
            var dependence = dependencies_1[_i];
            for (var task in this.tasks) {
                if (task === dependence) {
                    tasksRun[task] = this.tasks[task];
                    break;
                }
            }
        }
        return tasksRun;
    };
    /**
     * @private
     * @param {object} tasksRun - All configurations to run.
     */
    Komet.prototype.runDependenciesSequential = function (tasksRun) {
        var _this = this;
        var task;
        var params;
        var runRecursive = function (tasksRun) {
            if (Object.keys(tasksRun).length) {
                task = _.shiftObject(tasksRun);
                params = {
                    that: _this,
                    task: task,
                    tasksRun: tasksRun,
                    callback: runRecursive
                };
                _.execute(params);
            }
        };
        runRecursive(tasksRun);
    };
    return Komet;
}(events_1.EventEmitter));
exports.Komet = Komet;
