/**
	* @example
	* node ../../bin/komet.js komet css
	* node ../../bin/komet.js komet css -a
	*/

var komet = require('../../lib');

komet.task({
	alias:"css",
	//entry:'./tasks/css.js',
	entry:"32343" ,
	dependsof:['sprite', 'fonts', 'otro']
});

komet.task({
	alias:'sprite',
	entry:'./tasks/sprite.js'
});

komet.task({
	alias:'fonts',
	entry:'./tasks/fonts.js'
});

komet.task({
	alias:'pug',
	entry:'./tasks/pug.js'
});

komet.task({
	alias:'babel',
	entry:'./tasks/babel.js'
});

komet.task({
	alias:'static',
	dependsof:['css', 'pug', 'babel']
});