const waproxy = require("./waproxy");

exports.screen = async (req, res) => {
  const data = await waproxy.screenshot();
  res.contentType("image/png");
  res.end(data, "binary");
};

(async () => {
  await waproxy.connect();
})();
