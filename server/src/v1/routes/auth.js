const router = require("express").Router();
const { body } = require("express-validator");

const User = require("../models/user");
const validation = require("../handlers/validation");
const userController = require("../controllers/user");
const tokenHandler = require("../handlers/tokenHandler");

require('dotenv').config();

// 新規登録
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
  validation.validate,
  userController.register,
);

// ログイン
router.post(
  "/login",
  body("username")
    .isLength({ min: 8 })
    .withMessage("ユーザー名は8文字以上で入力してください。"),
  body("password")
    .isLength({ min: 8 })
    .withMessage("パスワードは8文字以上で入力してください"),
  validation.validate,
  userController.login,
)

// JWT認証
router.post(
  "/verify-token", tokenHandler.verifyToken, (req, res) => {
    return res.status(200).json({ user: req.user })
  }
)

module.exports = router;