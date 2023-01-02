const express = require("express");
const mongoose = require("mongoose");
const CryptoJS = require("crypto-js");
const User = require("./src/v1/models/user");

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

// ユーザー新規登録API
app.post("/register", async (req, res) => {
  const password = req.body.password;

  try {
    // パスワードの暗号化
    req.body.password = CryptoJS.AES.encrypt(password, process.env.SECRET_KEY);
    // ユーザーの新規作成
    const user = await User.create(req.body);
  } catch {

  }
});

// ユーザーログインAPI

app.listen(PORT, () => {
  console.log("ローカルサーバー起動中・・・")
})