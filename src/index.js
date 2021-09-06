const GoogleImageSearch = require("./google-image-search");
const imageDownloader = require("./image-downloader");
const writeToFile = require("./write-object");
const readCsv = require("./read-csv");

async function run() {
  const persons = await readCsv("person.csv");

  console.log("Application running...");
  const googleImage = await GoogleImageSearch();
  const failed = {};

  for (let person of persons) {
    await grabImages(person.english, person.english, 10);
    await grabImages(person.english, person.persian, 5);
  }

  googleImage.closeBrowser();

  console.log("All Images downloaded successfully");

  writeToFile(failed, "failed-urls");
  process.exit();

  async function grabImages(keyword, name, count = 100) {
    try {
      console.log(`search for ${name}`);
      await googleImage.search(name);

      console.log("grabbing urls...");
      const urls = await googleImage.imageUrls(count);
      console.log(`${urls.length} grabbed`);

      console.log(`downloading images of ${name}..`);
      failed[keyword] = await imageDownloader(urls, keyword);
      console.log("download completed");
    } catch (err) {
      console.error(err);
    } finally {
      googleImage.closePage();
    }
  }
}

run();
