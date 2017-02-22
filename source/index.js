import EventEmitter from 'events';

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
		this.tasks[config.alias] = config;
	}
	start() {
		console.log("arguments->", arguments);
		var args = Array.prototype.slice.call(arguments, 0);
		console.log("args->", args);
		console.log("tasks->", this.tasks);
	}
}
let inst = new Komet();
module.exports = inst;