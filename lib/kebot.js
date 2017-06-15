"use strict";
/**
 * @author Wilson Flores <wilsonft83@gmail.com>
 * @since 0.0.1
 * @example
 * var kebot = require("kebot");
 *
 * kebot.task({
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
var Kebot = (function (_super) {
    __extends(Kebot, _super);
    function Kebot() {
        var _this = _super.call(this) || this;
        /**
         * @type {Object}
         * @desc Method for validate task.
         */
        _this.tasks = {};
        return _this;
    }
    /**
     * @desc Method for validate task.
     * @param {Object} config - Task configuration object.
     */
    Kebot.prototype.validateTask = function (config) {
        var alias = config.alias, entry = config.entry, sequential = config.sequential, parallel = config.parallel, command = config.command, local = config.local;
        var task = {};
        validate_1.default.execute('string', alias);
        validate_1.default.execute('string', entry);
        validate_1.default.execute('string', command);
        if (sequential) {
            validate_1.default.execute('array', sequential);
            for (var _i = 0, sequential_1 = sequential; _i < sequential_1.length; _i++) {
                var dependence = sequential_1[_i];
                validate_1.default.execute('string', dependence);
            }
        }
        if (parallel) {
            validate_1.default.execute('array', parallel);
            for (var _a = 0, parallel_1 = parallel; _a < parallel_1.length; _a++) {
                var dependence = parallel_1[_a];
                validate_1.default.execute('string', dependence);
            }
        }
        config.local = config.hasOwnProperty("local") ? local : false;
        task[alias] = config;
        return task;
    };
    /**
     * @desc Method for creating a task.
     * @param {Object} config - Task configuration object.
     * @param {string} config.alias - The alias of your task.
     * @param {string} config.entry - The path of your node script.
     * @param {string} config.command - Command to execute.
     * @param {Array} config.sequential - Task dependencies sequential.
     * @param {Array} config.parallel - Task dependencies parallel.
     */
    Kebot.prototype.task = function (config) {
        var task = this.validateTask(config);
        Object.assign(this.tasks, task);
    };
    /**
     * @desc Method for creating a task.
     * @param {string} params.argTask - Command to execute.
     * @param {string} params.option - Task dependencies sequential.
     * @param {string} params.envKebot - Task dependencies parallel.
     */
    Kebot.prototype.start = function (params) {
        var argTask = params.argTask, option = params.option, envKebot = params.envKebot, argsKomet = params.argsKomet;
        var foundTask;
        var type;
        if (typeof undefined === argTask) {
            throw new Error('I did not enter any alias as argument');
        }
        for (var alias in this.tasks) {
            if (alias === argTask) {
                foundTask = this.tasks[alias];
            }
        }
        if (foundTask) {
            this.createEnv(envKebot);
            this.createArgs(argsKomet);
            type = this.verifyTypeTask(foundTask);
            switch (type) {
                case type_1.default.TASK:
                    this.initTask(foundTask, option);
                    break;
                case type_1.default.TASKS:
                    this.initTasks(foundTask);
                    break;
            }
        }
        else {
            this.emit('task_not_found', argTask);
        }
    };
    /**
     * @desc Creates args variable.
     * @param {string} args
     */
    Kebot.prototype.createArgs = function (args) {
        if (args) {
            process.env.args = args;
        }
    };
    /**
     * @desc Creates an environment variable.
     * @param {string} env - enviroment a create.
     */
    Kebot.prototype.createEnv = function (env) {
        if (env) {
            process.env[env] = true;
        }
    };
    /**
     * @desc Verity type task or tasks.
     * @param {Object} foundTask - Task found.
     */
    Kebot.prototype.verifyTypeTask = function (foundTask) {
        var entry = foundTask.entry, command = foundTask.command, sequential = foundTask.sequential, parallel = foundTask.parallel;
        var valid = false;
        var type;
        var count = 0;
        if (entry && command) {
            throw new Error("You can not have entry and commando together");
        }
        if (entry || command) {
            type = type_1.default.TASK;
        }
        if (!entry && !command) {
            type = type_1.default.TASKS;
        }
        if (type === type_1.default.TASKS) {
            if (!sequential && !parallel) {
                process.exit();
            }
        }
        return type;
    };
    /**
     * @param {Object} task - Task found.
     * @param {boolean} option - Whether it is dependent or not.
     */
    Kebot.prototype.initTask = function (task, option) {
        var sequential = task.sequential, parallel = task.parallel;
        if (parallel && option) {
            throw new Error("You can only have sequential dependency tasks");
        }
        if (sequential && option) {
            this.dependenciesTask(task);
        }
        else {
            _.execute(task, "sync");
        }
    };
    /**
     * @param {object} task - Task found.
     */
    Kebot.prototype.initTasks = function (task) {
        var sequential = task.sequential, parallel = task.parallel;
        var tasks = sequential || parallel;
        var type = this.getTypeTasks(sequential, parallel);
        var tasksRun = tasks && this.getDependsTasks(tasks);
        if (tasksRun) {
            switch (type) {
                case type_1.default.SEQUENTIAL:
                    this.executeTasks(tasksRun, "sync");
                    break;
                case type_1.default.PARALLEL:
                    this.executeTasks(tasksRun, "async");
                    break;
            }
        }
    };
    /**
     * @param {object} tasks - Tasks to execute.
     * @param {string} type -  Type of task execution.
     */
    Kebot.prototype.executeTasks = function (tasks, type) {
        var task;
        for (var task_1 in tasks) {
            task_1 = tasks[task_1];
            _.execute(task_1, type);
        }
    };
    /**
     * @param {string} sequential
     * @param {string} parallel
     */
    Kebot.prototype.getTypeTasks = function (sequential, parallel) {
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
     * @param {object} task - Configuration to run the script with dependencies.
     */
    Kebot.prototype.dependenciesTask = function (task) {
        var sequential = task.sequential, alias = task.alias;
        var tasksRun = this.getDependsTasks(sequential);
        tasksRun[alias] = task;
        this.executeTasks(tasksRun, "sync");
    };
    /**
     * @param {array} dependencies
     */
    Kebot.prototype.getDependsTasks = function (dependencies) {
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
    return Kebot;
}(events_1.EventEmitter));
exports.Kebot = Kebot;
