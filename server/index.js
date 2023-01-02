const express = require("express");
const mongoose = require("mongoose");
const app = express();
const PORT = 3000;
require('dotenv').config();

// DB接続
try {
  mongoose.set("strictQuery", false);
  mongoose.connect(process.env.MONGODB_URL)
  console.log("DB接続完了")
} catch (error) {
  console.log(error)
}

app.listen(PORT, () => {
  console.log("ローカルサーバー起動中・・・")
})