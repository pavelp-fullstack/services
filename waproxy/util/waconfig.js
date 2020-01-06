const path = require("path");
const appDir = path.dirname(require.main.filename);

module.exports = {
  connectPath: appDir + "/config/connect.ws",
  configPath: appDir + "/config/localstorage.json",
  userDataDir: appDir + "/config/userdata",
  //webClientUrl: "https://www.google.com"
  webClientUrl: "https://web.whatsapp.com/"
};
