import EventEmitter from 'events';
import * as _ from './komet-util.js';

/**
 * @since 0.0.1
 * @example
 * var komet = require("komet");
 *
 * komet.task({
 *  alias:'task-one',
 *  entry:'task-one.js'
 * });
 */
export class Komet extends EventEmitter{

	/**
	 * @private
	 */
	constructor(){
		super();
		/**
		 * @private
		 */
		this.tasks = {};
	}

	/**
	 * @desc Method for creating a task.
	 * @param {Object} config - Task configuration object.
	 * @param {string} config.alias - The alias of your task.
	 * @param {string} config.entry - The path of your node script.
	 * @param {Array} config.dependsof - Task dependencies.
	 */
	task(config){
		this.orchestratorValidateString(config);
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
	 * @private
	 */
	orchestratorValidateString(config){
		this.validateString(config.alias);
		this.validateString(config.entry);
	}

	/**
	 * @private
	 */
	validateString(entity){
		if(entity && typeof entity !== 'string'){
			throw new Error(`${entity} needs to be a string`);
		}
	}


	/**
	 * @private
	 * @param {array} tastas - kask from cli.
	 * @param {boolean} option - Whether it is dependent or not.
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
		}else{
			this.emit('task_not_found', task);
		}
	}

	/**
	 * @private
	 * @param {array} tastas - kask from cli.
	 * @param {boolean} option -Whether it is dependent or not.
	 */
	armedTasks(task, option){
		let that = this;
		let param = {
			that:that,
			task:task
		};
		if(task.dependsof && option){
			that.dependencies(task);
		}else{
			_.execute(param);
		}
		if(!task.entry && !option && task.dependsof){
			that.emit("task_not_entry", task);
		}
	}

	/**
	 * @private
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
	 * @private
	 * @param {object} tasksRun - All configurations to run.
	 */
	dependenciesRun(tasksRun){
		let that = this;
		let task;
		let params;
		let runRecursive = (tasksRun)=>{
			if(Object.keys(tasksRun).length){
				task = _.shiftObject(tasksRun);
				params = {
					that:that,
					task:task,
					tasksRun:tasksRun,
					callback:runRecursive
				};
				_.execute(params);
			}
		};
		runRecursive(tasksRun);
	}
}