const router = require("express").Router();
const {
  verifyToken,
  isAdmin,
  isAdminOrSeller,
} = require("../middleware/verifyToken");
const ctrls = require("../controllers/coupon");

router.post("/", [verifyToken, isAdmin], ctrls.createNewCoupon);
router.put("/:cid", [verifyToken, isAdmin], ctrls.updateCoupon);
router.delete("/:cid", [verifyToken, isAdmin], ctrls.deleteCoupon);
router.get("/", ctrls.getCoupons);

module.exports = router;
