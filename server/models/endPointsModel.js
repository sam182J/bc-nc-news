const fs = require("node:fs/promises");
function fetchEndpoints() {
  return fs
    .readFile(`${__dirname}/../../endpoints.json`, "utf8")
    .then((result) => {
      return JSON.parse(result);
    });
}
module.exports = fetchEndpoints;
