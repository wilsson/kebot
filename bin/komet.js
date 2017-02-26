#!/usr/bin/env node

var exec = require('child_process').exec;
var argv = require('minimist')(process.argv.slice(2));
var interpret = require('interpret');
var Liftoff = require('liftoff');
var chalk = require('chalk');
var task = argv._[0];
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
		console.log(chalk.green('[*]'),'Finish task '+e.task+' in', chalk.magenta(e.time));
	});
};

cli.launch({
	cwd: argv.cwd,
	configPath: argv.kometfiles,
	require: argv.require
}, callback);

