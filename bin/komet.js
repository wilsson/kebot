#!/usr/bin/env node
"use strict";

var _interpret = require("interpret");

var _interpret2 = _interopRequireDefault(_interpret);

var _liftoff = require("liftoff");

var _liftoff2 = _interopRequireDefault(_liftoff);

var _util = require("../lib/util");

var util = _interopRequireWildcard(_util);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var argv = require('minimist')(process.argv.slice(2));
var argTask = String(argv._[0]);
var envKomet = argv.env;
var option = argv.a || false;

/**
 * @private
 * @desc Instance of Liftoff.
 */
var cli = new _liftoff2.default({
	name: 'komet',
	extensions: _interpret2.default.jsVariants
});

var version = argv.v || argv.version;
var versionCli = require("../package.json");

/**
 * @private
 * @desc Callback for initialize aplication.
 * @param {Object} env - Instance of Liftoff.
 */
var callback = function callback(env) {
	var modulePackage = env.modulePackage,
	    modulePath = env.modulePath,
	    configPath = env.configPath;

	var instKomet = void 0;
	var params = void 0;
	if (version && argv._.length === 0) {
		util.log("CLI version " + versionCli.version);
		if (modulePackage && typeof modulePackage.version !== "undefined") {
			util.log("Local version " + modulePackage.version);
		}
		process.exit(1);
	}
	if (!modulePath) {
		util.log("Local komet not found");
		process.exit(1);
	}
	if (!configPath) {
		util.log("No kometfile found");
		process.exit(1);
	}

	require(configPath);
	instKomet = require(modulePath);
	loadEvents(instKomet);
	params = {
		argTask: argTask,
		option: option,
		envKomet: envKomet
	};
	instKomet.start.call(instKomet, params);
};

/**
 * @private
 * @param {Object} inst - Instance of komet.
 */
var loadEvents = function loadEvents(inst) {
	inst.on("finish_task", function (e) {
		util.log("Finish task " + e.task + " in", e.time);
	});

	inst.on("task_not_found", function (e) {
		util.log.error("Task " + e + " not found");
	});

	inst.on("task_error_entry", function (e) {
		util.log.error("Error in " + e);
	});

	inst.on("task_not_entry", function (e) {
		util.log.error("Not entry " + e.alias + " use flag -a");
	});
};

/**
 * @private
 * @desc Start aplication.
 */
cli.launch({
	cwd: argv.cwd,
	configPath: argv.kometfile,
	require: argv.require
}, callback);