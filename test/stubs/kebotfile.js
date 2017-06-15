var kebot = require('kebot');

kebot.task({
	alias:"css",
	entry:"./tasks/css.js",
	sequential:["pug", "fonts"]
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
	command:"npm install lodash -g"
});

kebot.task({
	alias:"static",
	parallel:["babel", "babel2"]
});

kebot.task({
	alias:"babel",
	command:"babel -w ./src/lib -d ./lib",
	local:true
});

kebot.task({
	alias:"babel2",
	command:"babel -w ./src/bin -d ./lib",
	local:true
});