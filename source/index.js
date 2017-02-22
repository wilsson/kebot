import EventEmitter from 'events';
import { exec } from 'child_process';

/**
 * Add a new task
 * @param {Object} config
 */
class Komet extends EventEmitter{
	constructor(){
		super();
		this.tasks = {};
	}
	task(config){
		if(config.alias && typeof config.alias !== 'string'){
			throw new Error('Alias for script requires a name that is a string');
		}
		if(config.entry && typeof config.entry !== 'string'){
			throw new Error('Entry for script requires a name that is a string');
		}
		this.tasks[config.alias] = config;
	}
	start(...args) {
		let that = this;
		let task = args[0];
		let taskRun;
		if(!task){
			throw new Error('Not alias task for argument');
		}
		for(let alias in that.tasks){
			if(alias === task){
				taskRun = that.tasks[alias];
			}
		}
		that.runScript(taskRun);
	}
	runScript(taskRun){
		let entry = taskRun.entry;
		exec(`node ${entry}`, function(error, stdout, stderr){
			if(error){
				console.log(error);
				return;
			}
			console.log(stdout.trim());
		});
	}
}

let inst = new Komet();
module.exports = inst;
