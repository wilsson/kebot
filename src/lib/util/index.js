import prettyHrtime from 'pretty-hrtime';
import chalk from 'chalk';
import timestamp from 'time-stamp';
import { exec } from 'child_process';
import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

/**
 * @private
 * @param {string} param - String for simple log.
 */


/**
 * @private
 * @param {string} param - String for log error.
 */
log.error = function(param){
	let output = "";
	output+= `(${chalk.red(timestamp("HH:mm:ss"))})`;
	output+= param;
	console.log(output);
};

/**
 * @private
 */
export function log(param, time){
	let output = "";
	if(time){
		time = chalk.magenta(time);
	}
	output+= `(${chalk.cyan(timestamp("HH:mm:ss"))})`;
	output+= param+" ";
	output+= time || "";
	console.log(output);
}

/**
 * @private
 * @param {object} object - Object to treat.
 */
export function shiftObject(object){
	let key = Object.keys(object)[0];
	let firstObject = object[key];
	delete object[key];
	return firstObject;
}

/**
 * @private
 * @param {object} param
 */
export function execute(param){
	let {that, task, tasksRun, callback} = param;
	if(task.entry){
		let start = process.hrtime();
		exec(`node ${task.entry}`, (error, stout, stderr)=>{
			if(error){
				that.emit("task_error_entry", task.entry);
				return;
			}
			let end = process.hrtime(start);
			let args = {};
			args.time = prettyHrtime(end);
			args.task = task.alias;
			that.emit('finish_task', args);
			console.log(stout.trim());
			if(callback && typeof callback === 'function'){
				callback(tasksRun);
			}
		});
	}
}

/**
 * @private
 * @param {object} param
 */
export function executeCommand(param){
	let { task : { command: cmd }}  = param;
	let chunksCommand = cmd.split(/\s/);
	let [command, ...args] = chunksCommand;
	command = getCommandForPlatform(command);
	let pathAbsolute = path.resolve(`./node_modules/.bin/${command}`);
	let runCommand = spawn(pathAbsolute, args);
	let output = "";
	output+="\n";
	output+=`> Command - ${command} \n`;
	output+=`> Args - ${args} \n`;
	console.log(output);
	runCommand.stdout.on('data', (data) => {
		console.log(`${data}`.trim());
	});
	runCommand.stderr.on('data', (data) => {
		console.log(`${data}`);
	});
}

function getCommandForPlatform(command){
	if(process.platform === 'win32' )
		return `${command}.cmd`
	return command;
}