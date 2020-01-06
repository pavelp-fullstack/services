const waproxy = require("./waproxy");

(async () => {
  await waproxy.connect();
  const contacts = await waproxy.getContacts();
  console.log("contacts: ", contacts);
  // await waproxy.disconnect();
  process.exit();
})();
