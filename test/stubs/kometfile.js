/**
 * @example
 * node ../../bin/komet.js komet css
 * node ../../bin/komet.js komet css -a
 *
 */

var komet = require('komet');

komet.task({
	alias:"css",
	entry:"./tasks/css.js",
	sequential:["sprite", "fonts"]
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
	sequential:["pug", "css"]
});

komet.task({
	alias:"watch",
	parallel:["watch-css", "watch-pug", "watch-js"]
});

komet.task({
	alias:'babel',
    command: "babel -w ./src -d ./lib"
});