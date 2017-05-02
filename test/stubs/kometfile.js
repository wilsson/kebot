var komet = require('komet');

komet.task({
	alias:"css",
	entry:"./tasks/css.js",
	sequential:["sprite", "babel-c"]
});

komet.task({
	alias:"server",
	entry:"./server/index.js",
});

komet.task({
	alias:"sprite",
	entry:"./tasks/sprite.js"
});

komet.task({
	alias:"fonts",
	entry:"./tasks/fonts.js"
});

komet.task({
	alias:"pug",
	entry:"./tasks/pug.js"
});

komet.task({
	alias:"static-s",
	sequential:["pug", "css", "sprite", "babel"]
});

komet.task({
	alias:"static-p",
	parallel:["pug", "css", "sprite", "babel"]
});

komet.task({
	alias:'babel-c',
    command: "babel ./src -d ./lib",
    sequential:["sprite"]
});

komet.task({
	alias:'babel',
    command: "babel -w ./src -d ./lib"
});

komet.task({
	alias:'nada'
});