const waproxy = require("./proxy/waproxy");

(async () => {
  await waproxy.connect();
  const contacts = await waproxy.getContacts();
  console.log("contacts: ", contacts);

  const messages = await waproxy.getMessages(contacts[1].title);
  console.log("current contact:", await waproxy.getCurrentContact());
  console.dir(messages);
  // await waproxy.disconnect();
  process.exit();
})();
