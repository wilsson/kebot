import prettyHrtime from 'pretty-hrtime';
import chalk from 'chalk';
import timestamp from 'time-stamp';
import { exec } from 'child_process';
import fs from 'fs';

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
 */
export function executeCommand(param){
	let { task } = param;
	exec(`bash ./node_modules/${task.command}`, (error, stout, stderr) => {
		if(error){
			console.log(error);
			return
		}
		console.log(stout.trim());
	})
}