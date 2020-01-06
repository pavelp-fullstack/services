const waproxy = require("./waproxy");

exports.screenshot = async (req, res) => {
  const data = await waproxy.screenshot();
  res.contentType("image/png");
  res.end(data, "binary");
};

exports.contacts = async (req, res) => {
  const contacts = await waproxy.getContacts();
  res.json(contacts);
};

(async () => {
  await waproxy.connect();
})();
