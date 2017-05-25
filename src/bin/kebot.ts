#!/usr/bin/env node

import * as interpret from "interpret";
import * as Liftoff from "liftoff";
import * as util from "../lib/util";

let argv = require('minimist')(process.argv.slice(2));
let argTask: string = String(argv._[0]);
let envKebot: string = argv.env;
let option: boolean = argv.a || false;

/**
 * @desc Instance of Liftoff.
 */
let cli = new Liftoff({
	name: 'kebot',
	extensions: interpret.jsVariants
});

let argVersion: string = argv.v || argv.version;
let versionCli: string = require("../package.json").version;

/**
 * @desc Callback for initialize aplication.
 * @param {Object} env - Instance of Liftoff.
 */
let callback = (env): void =>{
	let { modulePackage, modulePath, configPath } = env;
	let instKebot;
	let args;
	if(argVersion && !argv._.length){
		util.log(`CLI version ${versionCli}`);
		if(modulePackage && typeof modulePackage.version !== "undefined"){
			util.log(`Local version ${modulePackage.version}`);
		}
		process.exit(1);
	}
	if (!modulePath) {
		util.log("Local kebot not found");
		process.exit(1);
	}
	if (!configPath) {
		util.log("No kebotfile found");
		process.exit(1);
	}
	require(configPath);
	instKebot = require(modulePath);
	loadEvents(instKebot);
	args = {
		argTask:argTask,
		option:option,
		envKebot:envKebot
	};
	instKebot.start.call(instKebot, args);
};

/**
 * @param {Object} inst - Instance of kebot.
 */
let loadEvents = (inst): void => {
	inst.on("finish_task", (e) => {
		util.log(`Finish task ${e.task}`, e.time);
	});

	inst.on("task_not_found", (e) => {
		util.error(`Task ${e} not found`);
	});

	inst.on("task_error", (e) => {
		util.error(`Error in task ${e}`);
	});
};

/**
 * @desc Start aplication.
 */
cli.launch({
	cwd: argv.cwd,
	configPath: argv.kebotfile,
	require: argv.require
}, callback);
