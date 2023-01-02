const router = require("express").Router();
const { body } = require("express-validator");

const User = require("../models/user");
const validation = require("../handlers/validation");
const userController = require("../controllers/user")

require('dotenv').config();

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

module.exports = router;