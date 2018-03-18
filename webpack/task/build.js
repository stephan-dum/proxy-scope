const webpack = require("webpack");
const nodeConfig = require("../env_node.js");
const webConfig = require("../env_web.js");

const compiler = webpack([nodeConfig, webConfig]);

compiler.run(  function(err, stats) {
  console.log("webpack finished", stats.toString());

  if (err || stats.hasErrors()) {
    // Handle errors here
  }

  // Done processing
});
