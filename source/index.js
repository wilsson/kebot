import EventEmitter from 'events';
import * as _ from './helper.js';

class Komet extends EventEmitter{
	constructor(){
		super();
		this.tasks = {};
	}
	/**
	 * @param {object} config - Whether it is dependent or not.
	 */
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
	 * @param {array} tastas - kask from cli.
	 * @param {boolean} option -Whether it is dependent or not.
	 */
	start(task, option){
		let that = this;
		let foundTask;
		if(!task){
			throw new Error('Not alias task for argument');
		}
		for(let alias in that.tasks){
			if(alias === task){
				foundTask = that.tasks[alias];
			}
		}
		if(foundTask){
			that.armedTasks(foundTask, option);
		}
	}
	/**
	 * @param {array} tastas - kask from cli.
	 * @param {boolean} option -Whether it is dependent or not.
	 */
	armedTasks(task, option){
		let that = this;
		if(task.dependsof && option){
			that.dependencies(task);
		}else{
			_.execute(task.entry);
		}
	}
	/**
	 * @param {object} task - Configuration to run the script with dependencies.
	 */
	dependencies(task){
		let that = this;
		let tasksRun = {};
		let lengthTask = task.dependsof.length;
		for(let alias in that.tasks){
			for(let i = 0; i < lengthTask; i++){
				if(alias === task.dependsof[i]){
					tasksRun[alias] = that.tasks[alias];
				}
			}
		}
		tasksRun[task.alias] = task;
		this.dependenciesRun(tasksRun);
	}
	/**
	 * @param {object} tasksRun - All configurations to run.
	 */
	dependenciesRun(tasksRun){
		let that = this;
		let runRecursive = (tasksRun)=>{
			if(Object.keys(tasksRun).length){
				let task = _.shiftObject(tasksRun);
				_.execute(task.entry, tasksRun, runRecursive);
			}
		};
		runRecursive(tasksRun);
	}
}

let inst = new Komet();
module.exports = inst;
