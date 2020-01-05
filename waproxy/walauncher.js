const puppeteer = require("puppeteer");
const jsonfile = require("jsonfile");
const fs = require("fs");
const {
  connectPath,
  configPath,
  userDataDir,
  webClientUrl
} = require("./waconfig");

let browser = null;
let page = null;
let endpoint = null;

process.on("exit", async () => {
  console.log("WhatsApp Launcher is shutting down...");
});

process.on("SIGINT", async () => {
  //dump localstorage and session
  console.log(
    "WhatsApp Launcher caught interrupt signal, storing session and configs..."
  );
  process.exit();
});

const openClientWindow = async () => {
  let pages = await browser.pages();
  if (pages.length > 0) {
    await pages[0].bringToFront(), (page = pages[0]);
  } else page = await browser.newPage();

  const url = page.url();
  if (!url.includes(webClientUrl)) {
    await page.goto(webClientUrl, { timeout: 0 });
  }
  //bypass actual devtools endpoint to the api process via file
  endpoint = browser.wsEndpoint();
  fs.writeFileSync(connectPath, endpoint, "utf8");
};

const launchBrowser = async () => {
  browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null
  });

  browser.on("disconnected", launchBrowser);
  browser.on("targetdestroyed", openClientWindow);

  await openClientWindow();
};

(async () => {
  await launchBrowser();
})();
