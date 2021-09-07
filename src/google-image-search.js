const puppeteer = require("puppeteer-extra");
const queryString = require("query-string");

// add stealth plugin and use defaults (all evasion techniques)
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
puppeteer.use(StealthPlugin());

async function GoogleImageSearch() {
  const browser = await puppeteer.launch({ headless: true });
  let page;
  // page.on("console", (consoleObj) => console.log(consoleObj.text()));

  async function search(keyword) {
    page = await browser.newPage();
    await page.goto("https://www.google.com/imghp", {
      waitUntil: "networkidle0",
    });

    await page.evaluate((keyword) => {
      document.querySelector("input[name=q]").value = keyword;
      document.querySelector("button[type=submit]").click();
    }, keyword);

    await page.waitForNavigation({
      waitUntil: "networkidle0",
    });
  }

  async function scrollTill(count) {
    let shouldStop = false;
    let before = null;

    while (!shouldStop) {
      let { result, c } = await page.evaluate(
        ({ count, before }) => {
          let current = document.querySelectorAll("a[data-nav='1']").length;
          if (current < count && before !== current) {
            window.scrollTo(0, document.body.scrollHeight);
            before = current;
            return { result: false, c: before };
          }
          return { result: true, c: before };
        },
        { count, before }
      );

      shouldStop = result;
      before = c;
    }
  }

  async function loadHref() {
    await page.evaluate(() => {
      document
        .querySelectorAll("a[data-nav='1']")
        .forEach((a) => a.click({ button: "right" }));
    });
  }

  async function imageUrls(count = null) {
    count && (await scrollTill(count));
    await loadHref();
    const links = await page.evaluate(() => {
      return Array.from(document.querySelectorAll("a[data-nav='1']"))
        .map((a) => a.href)
        .filter((href) => href)
        .map((href) => new URL(href).search);
    });

    return links
      .map((href) => queryString.parse(href).imgurl)
      .slice(0, count || links.length);
  }

  async function closePage() {
    page && (await page.close());
  }

  async function closeBrowser() {
    await browser.close();
  }

  return {
    search,
    imageUrls,
    closeBrowser,
    closePage,
  };
}

module.exports = GoogleImageSearch;
