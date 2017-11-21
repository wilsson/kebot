#!/usr/bin/env node

import * as interpret from "interpret";
import * as Liftoff from "liftoff";
import * as util from "../lib/util";
import {resolve} from 'path';

let argv = require('minimist')(process.argv.slice(2));
let argTask: string  = String(argv._[0]);
let envKebot: string = argv.env;
let argsKomet: any   = argv;
let option: boolean  = argv.a || false;

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
	let { 
		modulePackage, 
		modulePath, 
		configPath 
	} = env;
	let instKebot;
	let args;
	if(argVersion && !argv._.length){
		util.log(`CLI version ${versionCli}`);
		if(modulePackage && typeof modulePackage.version !== "undefined"){
			util.log(`Local version ${modulePackage.version}`);
		}
		process.exit();
	}

	// mode testing flag -t
	if(argv.t){
        configPath = resolve('./test/fixture/kebotfile.js');
        modulePath = resolve('./lib/index.js');
	}
	
	if (!modulePath) {
		util.log("Local kebot not found");
		process.exit();
	}
	if (!configPath) {
		util.log("No kebotfile found");
		process.exit();
	}
	require(configPath);
	instKebot = require(modulePath);
	loadEvents(instKebot);
	args = {
		argsKomet:argsKomet,
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
	inst.on("task_not_found", (e) => {
		util.error(`Task ${e} not found`);
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
