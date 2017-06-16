var kebot = require('kebot');

kebot.task({
	alias:"css",
	entry:"./tasks/css.js",
	sequential:["fonts", "pug"]
});

kebot.task({
	alias:"fonts",
	entry:"./tasks/fonts.js"
});

kebot.task({
	alias:"pug",
	entry:"./tasks/pug.js"
});

kebot.task({
	alias:"add",
	command:"yarn add lodash -g"
});

kebot.task({
	alias:"static",
	parallel:["fonts", "pug"]
});

kebot.task({
	alias:"babel",
	command:"babel -w ./src -d /lib",
	local:true
});

kebot.task({
	alias:"babel2",
	command:"babel -w ./src/js/index2.js -d /lib",
	local:true
});