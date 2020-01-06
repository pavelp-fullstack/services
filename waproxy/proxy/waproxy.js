const puppeteer = require("puppeteer");
const jsonfile = require("jsonfile");
const fs = require("fs");

const {
  connectPath,
  configPath,
  userDataDir,
  webClientUrl
} = require("../util/waconfig");

const CONTACTS_SELECTOR = "#pane-side div > div > span > span";
const CURRENT_CONTACT_SELECTOR =
  "#main > header > div._3V5x5 > div._1lpto > div > span";

class WhatsAppProxy {
  browser = null;
  page = null;
  endpoint = null;

  isConnected() {
    return this.browser && this.page ? true : false;
  }

  async getContacts() {
    let cs = CONTACTS_SELECTOR;
    const contacts = await this.page.evaluate(() => {
      // debugger;
      const carr = [];
      const cnodes = document.querySelectorAll(
        "#pane-side div > div > span > span"
      );
      let title = "";
      let lastmsg = "";

      cnodes.forEach((n, i) => {
        if (i % 2 === 0) {
          title = n.innerText;
        } else {
          lastmsg = n.innerText;
          carr.push({ title, lastmsg });
        }
      });

      return carr;
    });
    return contacts;
  }

  async getCurrentContact() {
    const title = await this.page.evaluate(() => {
      var h1 = document.querySelectorAll(
        "#main > header > div._3V5x5 > div._1lpto > div > span"
      );
      return h1[0].title;
    });
    return title;
  }

  async getMessages(title) {
    await this.selectContact(title);
    await this.page.waitFor(1000);
    const currentTitle = await this.getCurrentContact();
    const messages = await this.page.evaluate(() => {
      const msgs = [];
      const msgArea = document.querySelector("#main .copyable-area");
      var div = msgArea.querySelector("div");
      for (i = 0; i < div.children.length; i++) {
        const chdiv = div.children[i];
        if (chdiv.children.length === 0) continue;
        const msgnodes = chdiv.querySelectorAll("div > div > span > span");
        for (j = 0; j < msgnodes.length; j++) {
          msgnode = msgnodes[j];
          msgs.push({ msg: msgnode.innerText });
        }
      }
      return msgs;
    });
    return messages;
  }

  async selectContact(title) {
    const contacts = await this.page.$$(CONTACTS_SELECTOR);
    let i = 0;
    let contact = null;
    while (i < contacts.length) {
      const contactTitle = await contacts[i].getProperty("title");
      const ct = await contactTitle.jsonValue();
      if (ct === title) {
        contact = contacts[i];
        break;
      }
      i += 2; //iterate over last message item
    }
    if (contact) {
      await contact.click();
    }
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
  }

  async disconnect() {
    if (!this.browser) return;
    await browser.disconnect();
    this.browser = null;
    this.page = null;
  }
}

module.exports = new WhatsAppProxy();
