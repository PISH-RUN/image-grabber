const downloader = require("image-downloader");
const path = require("path");
const kebabCase = require("lodash/kebabCase");
const mkdir = require("./mkdir");
const URL = require("url");

async function imageDownloader(urls, keyword) {
  const dest = path.join("img/" + kebabCase(keyword));
  const failed = [];
  mkdir(dest);

  for (let url of urls) {
    try {
      console.log(`download ${url} started...`);
      await downloader.image({
        url,
        dest: getFilename(url, dest),
        extractFilename: false,
        timeout: 5000,
      });
      console.log(`download ended successfully`);
    } catch (e) {
      failed.push(url);
      console.error(`download failed`);
      console.error(e);
    }
  }

  return failed;
}

function getFilename(url, dest) {
  const pathname = URL.parse(url).pathname;
  const basename = path.basename(pathname);
  const decodedBasename = decodeURIComponent(basename);
  const removedBackslash = decodedBasename.split("/").pop();

  return path.join(dest, removedBackslash);
}

module.exports = imageDownloader;
