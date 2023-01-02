const { validationResult } = require("express-validator");

exports.validate = (req, res, next) => {
  // バリデーションに引っかかった場合はエラーを返す
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};
