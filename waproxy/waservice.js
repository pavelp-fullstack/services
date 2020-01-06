const express = require("express");
const api = require("./api/waapi");

const port = process.env.PORT || 3000;
const app = express();

const staticPath = __dirname + "/public";
app.use(express.static(staticPath));

app.get("/api/screenshot", api.screenshot);
app.get("/api/contacts", api.contacts);
app.get("/api/messages/:contact", api.messages);

app.use((req, res) => {
  res.type("text/plain");
  res.status(404);
  res.send("404 - Not Found");
});

app.use((err, req, res, next) => {
  console.log(err.message);
  res.type("text/plain");
  res.status(500);
  res.send("500 - Server Error");
});

app.listen(port, () =>
  console.log(
    `WhatsApp Proxy Service started on http://localhost:${port}; press CTRL+C to terminate.`
  )
);
