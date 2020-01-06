const puppeteer = require("puppeteer");
const jsonfile = require("jsonfile");
const fs = require("fs");

const {
  connectPath,
  configPath,
  userDataDir,
  webClientUrl
} = require("./util/waconfig");

class WhatsAppProxy {
  browser = null;
  page = null;
  endpoint = null;

  isConnected() {
    return this.browser && this.page ? true : false;
  }

  async getContacts() {
    const contacts = await this.page.evaluate(() => {
      // debugger;
      const carr = [];
      const cnodes = document.querySelectorAll(
        "#pane-side div > div > span > span"
      );
      let name = "";
      let lastmsg = "";

      cnodes.forEach((n, i) => {
        if (i % 2 === 0) {
          name = n.innerText;
        } else {
          lastmsg = n.innerText;
          carr.push({ name, lastmsg });
        }
      });

      return carr;
    });
    return contacts;
  }

  async screenshot() {
    return await this.page.screenshot({});
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
    await browser.disconnect();
    this.browser = null;
    this.page = null;
  }
}

module.exports = new WhatsAppProxy();
