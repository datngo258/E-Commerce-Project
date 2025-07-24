const router = require("express").Router();
const ctrls = require("../controllers/productCategory");
const {
  verifyToken,
  isAdmin,
  isAdminOrSeller,
} = require("../middleware/verifyToken");

// ✅ Mỗi route truyền vào function trực tiếp
router.post("/", verifyToken, isAdminOrSeller, ctrls.createProductCategory);
router.get("/", ctrls.getCategories);
router.put("/:id", verifyToken, isAdminOrSeller, ctrls.updateProductCategory);
router.delete(
  "/:id",
  verifyToken,
  isAdminOrSeller,
  ctrls.deleteProductCategory
);

module.exports = router;
