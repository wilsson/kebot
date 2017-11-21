#!/usr/bin/env node

import * as interpret from "interpret";
import * as Liftoff from "liftoff";
import * as util from "../lib/util";
import { resolve } from 'path';

let argv = require('minimist')(process.argv.slice(2));
let argTask: string = String(argv._[0]);
let envKebot: string = argv.env;
let argsKomet: any = argv;
let option: boolean = argv.a || false;

/**
 * @desc Instance of Liftoff.
 */
let cli = new Liftoff({
	name: 'kebot',
	extensions: interpret.jsVariants
});

let argVersion: string = argv.v || argv.version;
let argHelp: string    = argv.help;

let versionCli: string = require("../package.json").version;

/**
 * @desc Callback for initialize aplication.
 * @param {Object} env - Instance of Liftoff.
 */
let callback = (env): void => {
	let {
		modulePackage,
		modulePath,
		configPath
	} = env;
	let instKebot;
	let args;

	if (argVersion && !argv._.length) {
		util.log(`CLI version ${versionCli}`);
		if (modulePackage && typeof modulePackage.version !== "undefined") {
			util.log(`Local version ${modulePackage.version}`);
		}
		process.exit();
	}

	// mode testing flag -t
	if (argv.t) {
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

	if(argHelp){
		console.log(`\nKebot version: ${versionCli}`);
		console.log('Kebot usage: kb <task>\n');
		console.log('Tasks availables:');

		let _tasks = instKebot.tasks;
		let tasks = [];

		for(let task in _tasks){
			tasks.push({name:task, description:_tasks[task].description})
		}

		let maxSpace = tasks.reduce((max:any,p:any)=>p.name.length > max ? p.name.length : max, tasks[0].name.length);

		tasks.forEach(task =>{
			let numSpaces = maxSpace - task.name.length;
			console.log(`- kb ${task.name}${createSpaces(numSpaces)} # ${typeof task.description == 'undefined' ? 'No Description' : capitalizeString(task.description)}`);
		});
		console.log('\n');
		process.exit();
	}

	loadEvents(instKebot);
	args = {
		argsKomet: argsKomet,
		argTask: argTask,
		option: option,
		envKebot: envKebot
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
 * @param {Number} total - num of spaces.
 */
let createSpaces = (total):string =>{
	let s = [];
	for(let i = 0; i < total; i++){
		s.push(' ');
	}
	return s.join('');
};

/**
 * @param {String} str - Letters.
 */
let capitalizeString = (str) =>str[0].toUpperCase() + str.slice(1);

/**
 * @desc Start aplication.
 */
cli.launch({
	cwd: argv.cwd,
	configPath: argv.kebotfile,
	require: argv.require
}, callback);
