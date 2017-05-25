var kebot = require('kebot');

kebot.task({
	alias:"css",
	entry:"./tasks/css.js",
	sequential:["sprite", "babel-c"]
});

kebot.task({
	alias:"server",
	entry:"./server/index.js",
});

kebot.task({
	alias:"sprite",
	entry:"./tasks/sprite.js"
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
	alias:"static-s",
	sequential:["pug", "css", "sprite", "babel"]
});

kebot.task({
	alias:"static-p",
	parallel:["pug", "css", "sprite", "babel"]
});

kebot.task({
	alias:'babel-c',
    command: "babel ./src -d ./lib",
    sequential:["sprite"]
});

kebot.task({
	alias:'babel',
    command: "babel -w ./src -d ./lib"
});

kebot.task({
	alias:'nada'
});