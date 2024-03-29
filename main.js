const { argv } = require("node:process");
const { crawlPage } = require("./crawl.js");
const { printReport } = require("./report.js");
async function main() {
  if (argv.length != 3) {
    console.log(argv.length);
    console.error(
      "The program only accept one argument and it needs to be one"
    );
  }
  const baseURL = argv[2];
  printReport(await crawlPage(baseURL, baseURL, {}));
}

main();
