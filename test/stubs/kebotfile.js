var kebot = require('kebot');

kebot.task({
	alias:"css",
	entry:"./tasks/css.js",
	sequential:["pug", "sprite", "fonts", "babel-c"]
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
	alias:"sprite",
	entry:"./tasks/sprite.js"
});

kebot.task({
	alias:"command",
	command:"gulp --version",
	local:true
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