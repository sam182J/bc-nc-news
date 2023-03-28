const express = require("express");
const {
  getTopics,
  getArticles,
  errorHandlerPSQL,
  errorHandlerCustom,
} = require("./controllers");

const app = express();

app.get("/api/topics", getTopics);
app.get("/api/articles/:article_id", getArticles);

app.use(errorHandlerPSQL);
app.use(errorHandlerCustom);

app.all("/*", (req, res) => {
  res.status(404).send({ msg: "Path not found!" });
});
module.exports = app;
