const router = require("express").Router();
const {
  verifyToken,
  isAdmin,
  isAdminOrSeller,
} = require("../middleware/verifyToken");
const ctrls = require("../controllers/order");

router.post("/", verifyToken, ctrls.createOrder);
router.put("/:oid", verifyToken, isAdminOrSeller, ctrls.updateStatus);
router.get("/", verifyToken, isAdmin, ctrls.getOrders);
router.get("/admin", verifyToken, ctrls.getUserOrder);
module.exports = router;
