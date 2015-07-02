#!/usr/bin/env node
var fs = require("fs");
var path = require("path");
var input = process.argv;
var inputDir = input[2];
var inputMinType = input[3];
var compressor = require("node-minify");

var walk = function(currentDirPath, callback) {
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

var minifyAll = function(dir, options, callback){
    options = options || {};

    walk(dir, function(path, result){
        if (path.substr(-3) === ".js"){
            if (!options.silent){
                console.log("found file: " + path);
            }
            new compressor.minify({
                type: "uglifyjs", 
                fileIn: path, 
                fileOut: path, 
                callback: callback || function(err, min){
                    if(err){
                        console.log(err);
                    }
                }
            });
        }
    });
};

if (inputDir){
    minifyAll(inputDir);
}

module.exports = minifyAll;
