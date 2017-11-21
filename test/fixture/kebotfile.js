var kebot = require('./../../lib');
var path  = require('path');

kebot.task({
	alias:"task:args",
	entry: path.join(__dirname, "./args-task.js")
});

kebot.task({
	alias:"task:args-miss",
	entry: path.join(__dirname, "./args-miss-task.js")
});

kebot.task({
	alias:"task:args-multiple",
	entry: path.join(__dirname, "./args-multiple-task.js")
});