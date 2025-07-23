const express = require("express");
const router = express.Router();
const ctrls = require("../controllers/user");
const {} = require("../middleware/verifyToken");
const { verifyToken, isAdmin } = require("../middleware/verifyToken");

router.post("/register", ctrls.register);
router.post("/login", ctrls.login);
router.get("/Current", verifyToken, ctrls.getCurrent);
router.post("/refreshToken", ctrls.refreshAccessToken);
router.get("/logout", ctrls.logout);
router.get("/forgotpassword", ctrls.fogotPassword);
router.put("/resetPassword", ctrls.verifyResetToken);
router.get("/getUser", [verifyToken, isAdmin], ctrls.getUser);
router.delete("/getUser", [verifyToken, isAdmin], ctrls.deleteUser);
router.put("/updateUser", [verifyToken], ctrls.updateUserByUser);
router.put(
  "/updateUserByAdmin/:uid",
  [verifyToken, isAdmin],
  ctrls.updateUserByAdmin
);

module.exports = router;

// create ( post ) + put : dữ liệu gửi đi kiểu body ( giấu đi )
// get + delete : dữ liệu gửi đi kiểu query  ( không cần giấu )
