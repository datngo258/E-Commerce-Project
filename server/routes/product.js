const express = require("express");
const router = express.Router();
const ctrls = require("../controllers/product");
const {} = require("../middleware/verifyToken");
const uploadCloud = require("../config/cloudinary.config");
const {
  verifyToken,
  isAdmin,
  isAdminOrSeller,
} = require("../middleware/verifyToken");

router.post("/", verifyToken, isAdminOrSeller, ctrls.createProduct);
router.get("/", ctrls.getAllProducts);
router.put("/ratings", verifyToken, ctrls.ratings);
router.post(
  "/upload-images/:id",
  verifyToken,
  isAdminOrSeller,
  uploadCloud.array("images", 10),
  ctrls.uploadImagesProduct
);

router.put("/:id", verifyToken, isAdmin, ctrls.updateProduct);
router.delete("/:id", verifyToken, isAdmin, ctrls.deleteProduct);
router.get("/:id", ctrls.getProduct);

module.exports = router;
// create ( post ) + put : dữ liệu gửi đi kiểu body ( giấu đi )
// get + delete : dữ liệu gửi đi kiểu query  ( không cần giấu )
