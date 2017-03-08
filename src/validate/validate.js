/**
 * @private
 */
export class Validate{
	string(entity){
		if(entity && typeof entity !== 'string'){
			throw new Error(`${entity} needs to be a string`);
		}
	}
	array(entity){
		if(!Array.isArray(entity)){
			throw new Error(`${entity} needs to be a array`);
		}
	}
	execute(type, alias){
		let that = this;
		that[type].apply(that, [].slice.call(arguments, 1));
	}
}
