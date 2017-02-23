import EventEmitter from 'events';
import { exec } from 'child_process';

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
		if(config.dependencies){
			if(!Array.isArray(config.dependencies)){
				throw new Error('Dependencies require a array');
			}
			config.dependencies.forEach(function(dep){
				if(typeof dep !== 'string'){
					throw new Error(`Dependency name ${dep} needs to be a string`);
				}
			});
		}
		this.tasks[config.alias] = config;
	}
	/**
	* @param {array} ...args - Cli task argument.
	*/
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
	/**
	* @param {objet} taskRun - Configuration to run the script.
	*/
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
