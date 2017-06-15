var kebot = require('kebot');

kebot.task({
	alias:"css",
	entry:"./tasks/css.js",
	sequential:["pug", "sprite"]
});

kebot.task({
	alias:"fonts",
	entry:"./tasks/fonts.js"
});

kebot.task({
	alias:"pug",
	//entry:"./tasks/pug.js",
	command:"babel -w ./src -d ./lib",
	local:true
});

kebot.task({
	alias:"sprite",
	entry:"./tasks/sprite.js"
});

kebot.task({
	alias:"command",
	command:"yarn add runjs -g"
});

kebot.task({
	alias:"babel",
	command: "babel -w ./src -d ./lib",
	local:true
});

kebot.task({
	alias:'babel-c',
    command: "babel ./src -d ./lib",
	local:true
});