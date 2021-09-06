const csv = require("csv-parser");
const path = require("path");
const fs = require("fs");

async function readCsv(file) {
  return new Promise((resolve, reject) => {
    const results = [];
    fs.createReadStream(path.resolve(file))
      .pipe(csv())
      .on("data", (data) =>
        results.push({
          english: `${data["First Name"]} ${data["Last Name"]}`,
          persian: data["Persian name"],
        })
      )
      .on("end", () => {
        resolve(results);
      });
    return results;
  });
}

module.exports = readCsv;
