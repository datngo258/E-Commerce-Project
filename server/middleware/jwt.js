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



module.exports = {
  generatePreefresToken,
  generateAccessToken,
};
