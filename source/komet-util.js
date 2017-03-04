import { exec } from 'child_process';
import fs from 'fs';
import prettyHrtime from 'pretty-hrtime';

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
	let that = param.that;
	let task = param.task;
	let tasksRun = param.tasksRun;
	let callback = param.callback;
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
