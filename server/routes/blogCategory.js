const express = require("express");
const router = express.Router();
const ctrls = require("../controllers/blogCategory");
const {} = require("../middleware/verifyToken");
const {
  verifyToken,
  isAdmin,
  isAdminOrSeller,
} = require("../middleware/verifyToken");

router.post("/", verifyToken, isAdminOrSeller, ctrls.createblogCategory);
router.get("/", ctrls.getCategories);
router.put("/:id", verifyToken, isAdminOrSeller, ctrls.updateblogCategory);
router.delete("/:id", verifyToken, isAdminOrSeller, ctrls.deleteblogCategory);

module.exports = router;
