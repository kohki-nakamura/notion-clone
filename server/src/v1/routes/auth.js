const router = require("express").Router();
const { body, validationResult } = require("express-validator");
const JWT = require("jsonwebtoken");
const CryptoJS = require("crypto-js");

const User = require("../models/user");

require('dotenv').config();

// ユーザー新規登録API
router.post(
  "/register",
  body("username")
    .isLength({ min: 8 })
    .withMessage("ユーザー名は8文字以上で入力してください。"),
  body("password")
    .isLength({ min: 8 })
    .withMessage("パスワードは8文字以上で入力してください"),
  body("confirmPassword")
    .isLength({ min: 8 })
    .withMessage("確認用パスワードは8文字以上で入力してください"),
  body("username").custom(async (value) => {
    const user = await User.findOne( { username: value } );
    if ( user ) {
      return Promise.reject( "ユーザー名は既に存在します" );
    }
  }),
  (req, res, next) => {
    // バリデーションに引っかかった場合はエラーを返す
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
async (req, res) => {
  const password = req.body.password;

  try {
    // パスワードの暗号化
    req.body.password = CryptoJS.AES.encrypt(password, process.env.SECRET_KEY);
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
});

// ユーザーログインAPI


module.exports = router;