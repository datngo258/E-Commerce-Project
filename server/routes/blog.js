const router = require("express").Router();
const asyncHandler = require("express-async-handler");
const ctrls = require("../controllers/blog");
const {
  verifyToken,
  isAdmin,
  isAdminOrSeller,
} = require("../middleware/verifyToken");

// api create blog
router.post("/", verifyToken, isAdminOrSeller, ctrls.createBlog);
// api get 1 blog
router.get("/:id", ctrls.getBlog);
// api get all blogs
router.get("/", ctrls.getAllBlogs);
// api update blog by seller
router.put("/:id", verifyToken, ctrls.updateBlog);
// api delete blog by seller
router.delete("/:id", verifyToken, ctrls.deleteBlog);
// like
// Route like blog
router.put("/like-blog/:bid", verifyToken, ctrls.likeBlog);
// Route dislike blog
router.put("/dislike-blog/:bid", verifyToken, ctrls.dislikeBlog);

module.exports = router;
