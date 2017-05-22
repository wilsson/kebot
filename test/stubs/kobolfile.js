var kobol = require('kobol');

kobol.task({
	alias:"css",
	entry:"./tasks/css.js",
	sequential:["sprite", "babel-c"]
});

kobol.task({
	alias:"server",
	entry:"./server/index.js",
});

kobol.task({
	alias:"sprite",
	entry:"./tasks/sprite.js"
});

kobol.task({
	alias:"fonts",
	entry:"./tasks/fonts.js"
});

kobol.task({
	alias:"pug",
	entry:"./tasks/pug.js"
});

kobol.task({
	alias:"static-s",
	sequential:["pug", "css", "sprite", "babel"]
});

kobol.task({
	alias:"static-p",
	parallel:["pug", "css", "sprite", "babel"]
});

kobol.task({
	alias:'babel-c',
    command: "babel ./src -d ./lib",
    sequential:["sprite"]
});

kobol.task({
	alias:'babel',
    command: "babel -w ./src -d ./lib"
});

kobol.task({
	alias:'nada'
});