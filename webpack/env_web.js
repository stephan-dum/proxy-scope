const path = require('path');

module.exports = {
	entry: './index.js',
	mode : 'production',
  target : 'web',
	output: {
		filename: 'web.js',
		path: path.resolve(__dirname, '../dist')
	}
};
