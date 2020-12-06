#!/usr/bin/env node
const fs = require("fs");
const path = require("path");
const minify = require('@node-minify/core');
const babelMinify = require('@node-minify/babel-minify');

function walk (currentDirPath, callback) {
  fs.readdirSync(currentDirPath).forEach(function(name) {
    var filePath = path.join(currentDirPath, name);
    var stat = fs.statSync(filePath);
    if (stat.isFile()) {
      callback(filePath, stat);
    } else if (stat.isDirectory()) {
      walk(filePath, callback);
    }
  });
}

function minifyAll (dir, options, callback){
  options = options || {};

  walk(dir, function(path, result){
    if (path.substr(-3) === ".js"){
      if (!options.silent){
        console.log("found file: " + path);
      }
      minify({
        compressor: babelMinify,
        input: path,
        output: path,
        callback: callback || function(err, min){
          if(err){
            console.log(err);
          }
        }
      });
    }
  });
};

if (require.main === module) {
  var input = process.argv;
  var inputDir = input[2];
  minifyAll(inputDir);

} else {
  module.exports = minifyAll;
}
