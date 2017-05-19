#!/usr/bin/env node
import * as interpret from "interpret";
import * as Liftoff from "liftoff";
import * as util from "../lib/util";

let argv = require('minimist')(process.argv.slice(2));
let argTask: string = String(argv._[0]);
let envKomet: string = argv.env;
let option: boolean = argv.a || false;

/**
 * @private
 * @desc Instance of Liftoff.
 */
let cli = new Liftoff({
	name: 'komet',
	extensions: interpret.jsVariants
});

let argVersion: string = argv.v || argv.version;
let versionCli: string = require("../package.json").version;

/**
 * @private
 * @desc Callback for initialize aplication.
 * @param {Object} env - Instance of Liftoff.
 */
let callback = (env): void =>{
	let { modulePackage, modulePath, configPath } = env;
	let instKomet;
	let params;
	if(argVersion && argv._.length === 0){
		util.log(`CLI version ${versionCli}`);
		if(modulePackage && typeof modulePackage.version !== "undefined"){
			util.log(`Local version ${modulePackage.version}`);
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
		argTask:argTask,
		option:option,
		envKomet:envKomet
	}
	instKomet.start.call(instKomet, params);
};

/**
 * @private
 * @param {Object} inst - Instance of komet.
 */
let loadEvents = (inst): void => {
	inst.on("finish_task", (e) => {
		util.log(`Finish task ${e.task}`);
	});

	inst.on("task_not_found", (e) => {
		util.error(`Task ${e} not found`);
	});

	inst.on("task_error_entry", (e) => {
		util.error(`Error in ${e}`);
	});

	inst.on("task_not_entry", (e) => {
		util.error(`Not entry ${e.alias} use flag -a`);
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
