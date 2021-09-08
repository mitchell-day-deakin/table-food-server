//create custom logger
const fs = require("fs")
const path = require("path");
const logDir = path.join(__dirname, "../logs/");
const output = fs.createWriteStream(`${logDir}/stdout.log`);
const errorOutput = fs.createWriteStream(`${logDir}/stderr.log`);
// custom simple logger
module.exports = new console.Console(output, errorOutput);