const { response } = require("express");
const crypto = require("crypto");

const {
  generateAccessToken,
  generatePreefresToken,
} = require("../middleware/jwt");
const User = require("../model/User");
const sendMail = require("../ultils/sendMail");
const asyncHandler = require("express-async-handler");
// const jwt  = require("../middleware/jwt");
const jwt = require("jsonwebtoken");

const register = asyncHandler(async (req, res) => {
  const { email, lastname, firstname, password } = req.body || {};
  if (!email || !lastname || !firstname || !password)
    return res.status(400).json({
      success: false,
      message: "missing input",
    });

  const user = await User.findOne({ email: email });
  if (user) {
    throw new Error("User đã tồn tại!");
  } else {
    const newUser = await User.create(req.body);
    return res.status(200).json({
      success: newUser ? true : false,
      message: newUser
        ? "Đã đăng ký xong!!  hãy đăng nhậpp"
        : "Có lỗi đã xảy ra",
    });
  }
});
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password)
    return res.status(400).json({
      success: false,
      message: "missing input",
    });

  const user = await User.findOne({ email: email });
  if (user && (await user.isCorrectPassword(password))) {
    const { password, role, ...userData } = user.toObject();
    const accessToken = generateAccessToken(user._id, role);
    const RefreshToken = generatePreefresToken(user._id, role);

    // lưu refresh token vào trong db
    await User.findByIdAndUpdate(
      user._id,
      { refreshToken: RefreshToken },
      { new: true }
    );
    // lưu refresh token vào cookie
    res.cookie("refreshToken", RefreshToken, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    return res.status(200).json({
      success: true,
      accessToken,
      RefreshToken,
      userData,
    });
  } else {
    throw new Error("Thông tin không chính xác ");
  }
});
const getCurrent = asyncHandler(async (req, res) => {
  // trước khi chạy ở đây , đã chạy middleware verifyToken trước đó . req.user đã được tạo giá trị
  const { _id } = req.user;
  // _id là do trong file jwt định nghĩa
  const id = req.user;

  console.log(_id);
  console.log(id);

  const user = await User.findById(_id).select(
    "-refreshToken -password -role "
  );
  return res.status(200).json({
    success: true,
    message: user ? user : "user not found",
  });
});
// api cấp mới accessToken khi accessToken hết hạn
const refreshAccessToken = asyncHandler(async (req, res) => {
  // lấy token từ cookie
  const cookie = req.cookies;
  // kiểm tra có token hay không ?
  if (!cookie && !cookie.refreshToken)
    throw new Error("No refreshToken in cookie");
  // kiểm tra token có hợp lệ không ?
  const rs = await jwt.verify(cookie.refreshToken, process.env.JWT_ACCESSTOKEN);
  // nếu có lỗi sẽ được tự đẩy ra = asyncHandler -> dừng ,không thì xuống dưới.
  const responese = await User.findOne({
    _id: rs._id,
    refreshToken: cookie.refreshToken,
  });
  return res.status(200).json({
    success: true,
    newAccsessToken: responese
      ? generateAccessToken(responese._id, responese.role)
      : "token không hợp lệ ",
  });
});

//api đăng xuất
const logout = asyncHandler(async (req, res) => {
  // lấy token từ cookie
  const cookie = req.cookies;
  // kiểm tra có token hay không ?
  if (!cookie && !cookie.refreshToken)
    throw new Error("No refreshToken in cookie, maybe no login! ");
  // nếu có lỗi sẽ được tự đẩy ra = asyncHandler -> dừng ,không thì xuống dưới.
  // tìm user đang đăng nhập = refreshToken và xóa refreshToken trong user đi.
  await User.findOneAndUpdate(
    { refreshToken: cookie.refreshToken },
    { refreshToken: "" },
    { new: true }
  );
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: true,
  });
  return res.status(200).json({
    success: true,
    massage: " logout thành công !",
  });
});

const fogotPassword = asyncHandler(async (req, res) => {
  // 1 . Tạo resetToken và lưu vào db user
  const { email } = req.query;
  if (!email) throw new Error("Không tìm thấy email!!");
  const user = await User.findOne({ email });
  if (!user) throw new Error("Không tìm thấy user!!");
  const resetToken = user.createPasswordChangeToken();
  await user.save();

  const html = `
  Xin vui lòng click vào đường link bên dưới để thay đổi mật khẩu.
  (token có thời hạn là 15p)
  <a href="${process.env.URL_SERVER}/api/user/reset-password/${resetToken}">Thay đổi mật khẩu</a>
`;
  console.log("resetToken gửi đi lúc gửi mail", resetToken);

  const data = {
    to: email,
    subject: "Thay đổi mật khẩu",
    html,
  };
  const rs = await sendMail(data);
  return res.status(200).json({
    success: true,
    rs,
  });
});
const verifyResetToken = asyncHandler(async (req, res) => {
  // lấy password, resetToken từ client
  const { password, resetToken } = req.body;
  console.log("resetToken nhận được từ req: ", resetToken);
  if (!password || !resetToken) throw new Error("Missing input");
  // băm resetToken ra để kiểm tra.
  const passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  console.log("resetToken sau khi băm : ", resetToken);

  const user = await User.findOne({
    passwordResetToken,
    passwordResetExpires: { $gt: Date.now() },
  });
  if (!user) throw new Error("resetToken sai");
  user.password = password;
  user.passwordResetToken = undefined;
  user.passwordChangeAt = Date.now();
  user.passwordResetExpires = undefined;
  user.save();

  return res.status(200).json({
    success: true,
    mes: user ? "Thay đổi mật khẩu thành công" : "Có lỗi không xác định",
  });
});
const getUser = asyncHandler(async (req, res) => {
  const respone = await User.find();
  return res.status(200).json({
    success: respone ? true : false,
    user: respone,
  });
});
const deleteUser = asyncHandler(async (req, res) => {
  const { _id } = req.query;
  if (!_id) throw new Error("Missing input");
  const respone = await User.findByIdAndDelete(_id);
  return res.status(200).json({
    success: respone ? true : false,
    user: respone ? "Xóa user thành công " : "Không xóa được!",
  });
});
// api update user
const updateUserByUser = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  if (!_id || Object.keys(req.body).length === 0)
    throw new Error("Missing input");
  const respone = await User.findByIdAndUpdate(_id, req.body, {
    new: true,
  }).select("-refreshToken -password ");
  return res.status(200).json({
    success: respone ? true : false,
    user: respone ? "User được update thành công" : "Không update được!",
  });
});
// api update user by admin
const updateUserByAdmin = asyncHandler(async (req, res) => {
  const { uid } = req.params;
  if (!req.body || Object.keys(req.body).length === 0)
    throw new Error("Missing input");
  const respone = await User.findByIdAndUpdate(uid, req.body, {
    new: true,
  }).select("-refreshToken -password ");
  return res.status(200).json({
    success: respone ? true : false,
    user: respone ? "User được update thành công" : "Không update được!",
  });
});
module.exports = {
  register,
  login,
  getCurrent,
  refreshAccessToken,
  logout,
  fogotPassword,
  verifyResetToken,
  getUser,
  deleteUser,
  updateUserByUser,
  updateUserByAdmin,
};
