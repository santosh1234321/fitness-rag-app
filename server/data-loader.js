const fs = require("fs");
const path = require("path");

function loadData() {
  const filePath = path.join(__dirname, "../data/fitness.txt");
  const text = fs.readFileSync(filePath, "utf-8");
  return text.split("\n\n");
}

module.exports = loadData;
