const JWT = require("jsonwebtoken");
const CryptoJS = require("crypto-js");

const User = require("../models/user")

require('dotenv').config();;

// ユーザー新規登録API
exports.register = async (req, res) => {
  const password = req.body.password;

  try {
    // パスワードの暗号化
    req.body.password = CryptoJS.AES.encrypt(password, process.env.CRYPTO_SECRET_KEY);
    // ユーザーの新規作成
    const user = await User.create(req.body);
    // JWT発行
    const token = JWT.sign({ id: user._id }, process.env.TOKEN_SECRET_KEY, {
      expiresIn: "24h",
    });
    return res.status(200).json({ user, token });
  } catch (err) {
    return res.status(500).json(err);
  }
}

// ユーザーログインAPI
exports.login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username: username })
    if (!user) {
      return res.status(401).json({
        errors: {
          param: "username",
          message: "ユーザー名が無効です"
        }
      })
    }

    // パスワードの照合
    const decryptedPassword = CryptoJS.AES.decrypt(
      user.password,
      process.env.CRYPTO_SECRET_KEY,
    ).toString(CryptoJS.enc.Utf8);

    if (decryptedPassword !== password) {
      return res.status(401).json({
        errors: {
          param: "password",
          message: "パスワードが無効です"
        }
      })
    }

    // JWTを発行
    const token = JWT.sign({ id: user._id }, process.env.TOKEN_SECRET_KEY, {
      expiresIn: "24h",
    });
    return res.status(201).json({ user, token });
  } catch (err) {
    return res.status(500).json(err)
  }
}