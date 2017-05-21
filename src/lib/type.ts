/**
 * @interface
 * @desc Type task
 */

interface Types{
	TASKS:string,
	SEQUENTIAL:string,
	PARALLEL:string,
	TASK:string
}

const TYPE = <Types>{};
TYPE.TASKS = "TASKS";
TYPE.SEQUENTIAL = "SEQUENTIAL";
TYPE.PARALLEL = "PARALLEL";
TYPE.TASK = "TASK";

export default TYPE;