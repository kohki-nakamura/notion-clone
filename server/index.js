const express = require("express");
const app = express();
const PORT = 3000;

require('dotenv').config();
const mongo_db_password = process.env.MONGO_DB_PASSWORD

app.get("/", (req, res) => {
  res.send("Hello Express");
});

app.listen(PORT, () => {
  console.log("ローカルサーバー起動中・・・")
})