const puppeteer = require("puppeteer");
const jsonfile = require("jsonfile");
const fs = require("fs");

const {
  connectPath,
  configPath,
  userDataDir,
  waWebUrl
} = require("./waconfig");

class WhatsAppProxy {
  waBrowser = null;
  waPage = null;
  waEndpoint = null;

  async dumpSession() {
    if (!waPage) return;
    const cookiesObject = await waPage.cookies();
    await jsonfile.writeFileSync(
      configPath,
      cookiesObject,
      { spaces: 2 },
      err => {
        throw err;
      }
    );
  }

  async restoreSession() {
    const previousSession = fs.existsSync(configPath);
    if (previousSession) {
      const cookiesArr = require(`${configPath}`);
      if (cookiesArr.length !== 0) {
        for (let cookie of cookiesArr) {
          await page.setCookie(cookie);
        }
        return true;
      }
    }
  }

  async saveLocalStorage() {
    if (!waPage) return;

    const state = await waPage.evaluate(() => {
      let json = {};
      for (let i = 0; i < localStorage.length; i++) {
        let key = localStorage.key(i);
        json[key] = localStorage.getItem(key);
      }
      return json;
    });
    fs.writeFileSync(configPath, JSON.stringify(state), "utf8");
  }

  async restoreLocalStorage() {
    if (!fs.existsSync(configPath)) return;
    const configContents = fs.readFileSync(configPath, "utf8");
    const json = JSON.parse(configContents);
    await waPage.evaluate(json => {
      localStorage.clear();
      for (let key in json) {
        localStorage.setItem(key, json[key]);
      }
    }, json);
  }

  async connect() {
    if (fs.existsSync(connectPath)) {
      waEndpoint = fs.readFileSync(connectPath, { encoding: "utf8" });
    }

    if (waEndpoint) {
      try {
        waBrowser = await puppeteer.connect({
          browserWSEndpoint: waEndpoint,
          defaultViewport: null
        });
        let pages = await waBrowser.pages();
        pages.forEach(p => {
          const url = p.url();
          if (url.includes("google.com")) waPage = p;
        });
        console.dir(waPage);
      } catch (err) {
        console.log("Error occured during connection stage, error: ", error);
        process.exit(1);
      }
    }

    if (!waBrowser) {
      console.log(puppeteer.executablePath());
      waBrowser = await puppeteer.launch({
        headless: false
      });
      waEndpoint = waBrowser.wsEndpoint();
      fs.writeFileSync(connectPath, waEndpoint, "utf8");
      waPage = await waBrowser.newPage();
      await waPage.setViewport({ width: 1000, height: 500 });
    }

    if (waPage) {
      const selector =
        "#tsf > div:nth-child(2) > div.A8SBwf > div.RNNXgb > div > div.a4bIc > input";
      const [response] = await Promise.all([
        // waPage.waitForNavigation({ waitUntil: "load" }),
        waPage.click(selector, { clickCount: 2 })
      ]);

      await waPage.type(selector, "audi\n");
    }
  }

  async disconnect() {
    if (!waBrowser) return;
    // await waDumpSession();
    // await waBrowser.close();
    await waBrowser.disconnect();
    waBrowser = null;
  }
}

/*
const waDumpSession = async () => {
  if (!waPage) return;
  const cookiesObject = await waPage.cookies();
  console.log("cookies: ", cookiesObject);
  jsonfile.writeFileSync(configPath, cookiesObject, { spaces: 2 }, err => {
    if (err) {
      console.log("The file could not be written.", err);
    }
    console.log("Session has been successfully saved");
  });
};

const waRestoreSession = async () => {
  const previousSession = fs.existsSync(configPath);
  if (previousSession) {
    const cookiesArr = require(`${configPath}`);
    if (cookiesArr.length !== 0) {
      for (let cookie of cookiesArr) {
        await page.setCookie(cookie);
      }
      console.log("Session has been loaded in the browser");
      return true;
    }
  }
};
*/

module.exports = new WhatsAppProxy();
