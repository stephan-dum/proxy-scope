#!/usr/bin/env node
'use strict';

const rollup = require('rollup');
const chokidar = require("chokidar");
const exec = require("child_process").exec;
const packageJSON = require("../package.json");
const CMD = "node node_modules/.bin/mocha";

const config = {
  input : {
    input: './index.js',
  },
  output : [{
    file : packageJSON.main,
    name: 'proxyScope',
    format: 'umd',
    sourcemap: true,
  }, {
    file : packageJSON.module,
    sourcemap: true,
    format: 'es'
  }]
};

const flags = {
  "w" : "watch",
  "t" : "test"
}

const options = {};

process.argv.forEach(function(raw) {
  let [property, value] = raw.replace(/^--?/, "").split("=");

  if(property in flags) {
    property = flags[property];
  }

  this[property] = value || true;
}, options);

function test() {
  console.log("testing...");

  return exec(CMD, {
    stdio : "inherit"
  }, function(error, stdout, stderr) {
    console.log(stdout || stderr);
  }).on("error", console.log);
};

function build() {
  rollup.rollup(config.input).then((output) => {
    console.log("exports", output.exports);

    let queue = config.output.map((outputConfig) => {
      return output.write(outputConfig)
    });
    Promise.all(queue).then((output) => {
      test();
    })
  })
}

if(typeof options.test != "undefined") {
  test();
} else {
  if(options.watch) {
    let change = (fileId) => {
      console.log("changed", fileId);

      build();
    }

    chokidar.watch("../src/*", {
      ignored: /node_modules/,
      ignoreInitial : true,
      cwd : __dirname
    })
      .on("add", change)
      .on("change", change)
      .on("unlink", (fileId) => console.log("error: removed a dependecy", fileId))
    ;

    chokidar.watch("../test/spec.js", {
      ignoreInitial : true,
      disableGlobbing : true,
      persistent: false,
      ignored: /node_modules/,
      cwd : __dirname
    }).on("change", test);
  }

  build();
}
