var komet = require('../../lib/index.js');

komet.task({
	alias:'css',
	entry:'./css.js',
    dependencies:['sprite', 'fonts']
});

komet.task({
	alias:'sprite',
	entry:'./sprite.js'
});

komet.task({
	alias:'fonts',
	entry:'./fonts.js'
});
