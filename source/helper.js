import { exec } from 'child_process';
import fs from 'fs';

/**
 * @param {object} object - Object to treat.
 */
export function shiftObject(object){
	let key = Object.keys(object)[0];
	let firstObject = object[key];
	delete object[key];
	return firstObject;
}


/**
 * @param {string} entry - Script path.
 * @param {object} tasksRun - All configurations to run.
 * @param {function} callback
 */
export function execute(entry, tasksRun, callback){
	if(!fs.existsSync(entry)){
		throw new Error(`Task file ${entry} not found`);
	}
	exec(`node ${entry}`, (error, stout, stderr)=>{
		if(error){
			console.log(error);
			return;
		}
		console.log(stout.trim());
		if(callback && typeof callback === 'function'){
			callback(tasksRun);
		}
	});
}
