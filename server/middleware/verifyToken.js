const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const { Error } = require("mongoose");

//Kiểm tra xem người dùng có gửi token hợp lệ hay không
// (có đúng định dạng và chưa hết hạn) trước khi cho phép truy cập vào các API yêu cầu xác thực
const verifyToken = asyncHandler(async (req, res, next) => {
  if (req?.headers?.authorization?.startsWith("Bearer")) {
    const token = req.headers.authorization.split(" ")[1];
    jwt.verify(token, process.env.JWT_ACCESSTOKEN, (err, decode) => {
      if (err) {
        return res.status(401).json({
          success: false,
          mesage: "token không hợp lệ!",
        });
      }
      // những gì cho vào payload khi tạo token , thì sẽ có ở decode
      req.user = decode;
      next();
    });
  } else {
    return res.status(401).json({
      success: false,
      mesage: "Không tìm thấy token!",
    });
  }
});
const isAdmin = asyncHandler((req, res, next) => {
  console.log(req.user);
  const { role } = req.user;
  if (role !== "admin") {
    return res.status(404).json({
      success: false,
      mes: " không phải là admin, không có quyền !",
    });
  }
  next();
});

module.exports = {
  isAdmin,
  verifyToken,
};
