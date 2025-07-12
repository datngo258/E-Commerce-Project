const User = require("../model/User");
const asyncHandler = require("express-async-handler");
const register = asyncHandler(async (req, res) => {
  const { email, lastname, firstname, password } = req.body || {};
  if (!email || !lastname || !firstname || !password)
    return res.status(400).json({
      success: false,
      message: "missing input",
    });
  const respone = await User.create(req.body);
  return res.status(200).json({
    success: respone ? true : false,
    respone,
  });
});

module.exports = {
  register,
};
