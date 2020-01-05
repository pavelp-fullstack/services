const waproxy = require("./waproxy");

(async () => {
  await waproxy.connect();
  await waproxy.disconnect();
  console.log("terminated");
  process.exit();
})();
