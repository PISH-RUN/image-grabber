const path = require("path");
const fs = require("fs");
const util = require("util");

function writeToFile(obj, filename) {
  dir = path.resolve(filename + ".json");
  fs.writeFileSync(dir, JSON.stringify(obj), "utf-8");
}

module.exports = writeToFile;
