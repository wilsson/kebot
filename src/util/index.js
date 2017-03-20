import prettyHrtime from 'pretty-hrtime';
import chalk from 'chalk';
import timestamp from 'time-stamp';
import { exec } from 'child_process';
import fs from 'fs';

/**
 * @private
 * @param {string} param - String for simple log.
 */
function log(param){
	console.log("("+chalk.cyan(timestamp("HH:mm:ss"))+")", param);
}

/**
 * @private
 * @param {string} param - String for log error.
 */
log.error = function(param){
	console.log("("+chalk.red(timestamp("HH:mm:ss"))+")", param);
};

/**
 * @private
 */
export log;

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
