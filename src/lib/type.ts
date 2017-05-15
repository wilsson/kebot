/**
 * @interface
 * @desc Type task
 */

interface Types{
	ENTRY:string,
	COMMAND:string,
	TASKS:string,
	SEQUENTIAL:string
	PARALLEL:string
}

const TYPE = <Types>{};
TYPE.ENTRY = "ENTRY";
TYPE.COMMAND = "COMMAND";
TYPE.TASKS = "TASKS";
TYPE.SEQUENTIAL = "SEQUENTIAL";
TYPE.PARALLEL = "PARALLEL";

export default TYPE;