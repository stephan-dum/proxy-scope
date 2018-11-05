const parser = require('jsdoc3-parser');
const path = require("path");

parser(path.join(__dirname,'../src/proxyfactory.js'), function(error, ast) {
  console.log(arguments);
});
