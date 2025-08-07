const jwt = require("jsonwebtoken");
const generateAccessToken = (uid, role) => {
  return jwt.sign({ _id: uid, role }, process.env.JWT_ACCESSTOKEN, {
    expiresIn: "2d",
  });
};
const generatePreefresToken = (uid, role) => {
  return jwt.sign({ _id: uid, role }, process.env.JWT_ACCESSTOKEN, {
    expiresIn: "7d",
  });
};
const makeToken = (userData) => {
  return jwt.sign(userData, process.env.JWT_SECRET, { expiresIn: "15m" });
};

module.exports = {
  generatePreefresToken,
  generateAccessToken,
  makeToken,
};
