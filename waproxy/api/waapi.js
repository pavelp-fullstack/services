const waproxy = require("../proxy/waproxy");

exports.screenshot = async (req, res) => {
  const data = await waproxy.screenshot();
  res.contentType("image/png");
  res.end(data, "binary");
};

exports.contacts = async (req, res) => {
  const contacts = await waproxy.getContacts();
  res.json(contacts);
};

exports.messages = async (req, res) => {
  const contact = req.params.contact;
  const msgs = await waproxy.getMessages(contact);
  res.json(msgs);
};

(async () => {
  await waproxy.connect();
})();
