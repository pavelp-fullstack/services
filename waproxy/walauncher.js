const puppeteer = require("puppeteer");
const jsonfile = require("jsonfile");
const fs = require("fs");
const {
  connectPath,
  configPath,
  userDataDir,
  webClientUrl
} = require("./util/waconfig");

let browser = null;
let page = null;
let endpoint = null;

process.on("exit", async () => {
  console.log("WhatsApp Launcher is shutting down...");
});

process.on("SIGINT", async () => {
  //dump localstorage and session
  await saveLocalStorage();

  console.log(
    "WhatsApp Launcher caught interruption signal, storing session and configs..."
  );
  process.exit();
});

const saveLocalStorage = async () => {
  if (!page) return;

  const state = await page.evaluate(() => {
    let json = {};
    for (let i = 0; i < localStorage.length; i++) {
      let key = localStorage.key(i);
      json[key] = localStorage.getItem(key);
    }
    return json;
  });
  fs.writeFileSync(configPath, JSON.stringify(state), "utf8");
};

const restoreLocalStorage = async () => {
  if (!fs.existsSync(configPath)) return;
  const configContents = fs.readFileSync(configPath, "utf8");
  const json = JSON.parse(configContents);
  await page.evaluate(json => {
    localStorage.clear();
    for (let key in json) {
      localStorage.setItem(key, json[key]);
    }
  }, json);
};

const openClientWindow = async () => {
  console.log("---> opening target window...");
  let pages = await browser.pages();
  if (pages.length > 0) {
    await pages[0].bringToFront(), (page = pages[0]);
  } else page = await browser.newPage();

  page.on("domcontentloaded", restoreLocalStorage);

  const url = page.url();
  if (!url.includes(webClientUrl)) {
    await page.goto(webClientUrl, { timeout: 0 });
    await page.waitForSelector("title");
  }
  //bypass actual devtools endpoint to the api process via file
  endpoint = browser.wsEndpoint();
  fs.writeFileSync(connectPath, endpoint, "utf8");

  console.log("<--- done.");
  //stamp localstorage
  // setInterval(saveLocalStorage, 1000);
};

const launchBrowser = async () => {
  console.log("--> starting browser...");
  browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null
  });

  browser.on("disconnected", () => {
    console.log("Browser disconnect was detected - relaunching...");
    launchBrowser();
  });

  browser.on("targetdestroyed", () => {
    console.log("Target window disconnect was detected - reopening...");
    openClientWindow();
  });

  console.log("<-- done.");
  await openClientWindow();
};

(async () => {
  await launchBrowser();
})();
