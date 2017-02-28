#!/usr/bin/env node
var timestamp = require('time-stamp');
var log = require('fancy-log');
var exec = require('child_process').exec;
var argv = require('minimist')(process.argv.slice(2));
var interpret = require('interpret');
var Liftoff = require('liftoff');
var chalk = require('chalk');
var task = String(argv._[0]);
var cli = new Liftoff({
	name: 'komet',
	extensions: interpret.jsVariants
});

var callback = function(env){
	var option = argv.a || false;
	require(env.configPath);
	var instKomet = require(env.modulePath);
	loadEvents(instKomet);
	instKomet.start.call(instKomet, task, option);
};

var loadEvents = function(inst){
	inst.on('finish_task', function(e){
		console.log("("+chalk.cyan(timestamp("HH:mm:ss"))+")",'Finish task '+e.task+' in', chalk.magenta(e.time));
	});

	inst.on('task_not_found', function(e){
		console.log("("+chalk.red(timestamp("HH:mm:ss"))+")",`Task ${e} not found`);
	});

	inst.on('task_error_entry', function(e){
		console.log("("+chalk.red(timestamp("HH:mm:ss"))+")",`Cannot find module ${e}`);
	});

	inst.on('task_not_entry', function(e){
		console.log("("+chalk.red(timestamp("HH:mm:ss"))+")",`Not entry ${e.alias}, use flag -a`);
	});
};

cli.launch({
	cwd: argv.cwd,
	configPath: argv.kometfiles,
	require: argv.require
}, callback);

