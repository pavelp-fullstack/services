const puppeteer = require("puppeteer");
const jsonfile = require("jsonfile");
const fs = require("fs");

const {
  connectPath,
  configPath,
  userDataDir,
  webClientUrl
} = require("./waconfig");

class WhatsAppProxy {
  browser = null;
  page = null;
  endpoint = null;

  isConnected() {
    return this.browser && this.page ? true : false;
  }

  async screenshot() {
    return await this.page.screenshot({});
  }

  async saveSession() {
    if (!this.page) return;
    const cookiesObject = await this.page.cookies();
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
          await this.page.setCookie(cookie);
        }
        return true;
      }
    }
  }

  async saveLocalStorage() {
    if (!this.page) return;

    const state = await this.page.evaluate(() => {
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
    await this.page.evaluate(json => {
      localStorage.clear();
      for (let key in json) {
        localStorage.setItem(key, json[key]);
      }
    }, json);
  }

  async connect() {
    if (fs.existsSync(connectPath)) {
      this.endpoint = fs.readFileSync(connectPath, { encoding: "utf8" });
    }

    if (this.endpoint) {
      try {
        this.browser = await puppeteer.connect({
          browserWSEndpoint: this.endpoint,
          defaultViewport: null
        });
        let pages = await this.browser.pages();
        pages.forEach(p => {
          const url = p.url();
          if (url.includes(webClientUrl)) this.page = p;
        });
      } catch (err) {
        console.log(
          "Error occured during WhatsApp Proxy connection stage, details: ",
          err
        );
        process.exit(1);
      }
    }

    if (!this.browser || !this.page) {
      throw new Error(
        "WhatsApp Proxy cannot connect to the client - please make sure that walauncher service is running and healthy."
      );
    }

    /*
    if (!browser) {
      console.log(puppeteer.executablePath());
      browser = await puppeteer.launch({
        headless: false
      });
      endpoint = browser.wsEndpoint();
      fs.writeFileSync(connectPath, endpoint, "utf8");
      page = await browser.newPage();
      await page.setViewport({ width: 1000, height: 500 });
    }

    if (page) {
      const selector =
        "#tsf > div:nth-child(2) > div.A8SBwf > div.RNNXgb > div > div.a4bIc > input";
      const [response] = await Promise.all([
        // page.waitForNavigation({ waitUntil: "load" }),
        page.click(selector, { clickCount: 2 })
      ]);

      await page.type(selector, "audi\n");
    }
    */
  }

  async disconnect() {
    if (!this.browser) return;
    // await waDumpSession();
    // await browser.close();
    await browser.disconnect();
    this.browser = null;
    this.page = null;
  }
}

module.exports = new WhatsAppProxy();
