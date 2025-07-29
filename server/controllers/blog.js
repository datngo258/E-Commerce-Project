const { response } = require("express");
const Blog = require("../model/blog"); // Đổi blog -> Blog
const asyncHandler = require("express-async-handler");
const slugify = require("slugify");

// api create blog
const createBlog = asyncHandler(async (req, res) => {
  const { title, description, category } = req.body || {};
  if (!title || !description || !category) {
    return res.status(400).json({
      success: false,
      message: "Missing input data",
    });
  }
  const response = await Blog.create(req.body);
  return res.status(201).json({
    success: response ? true : false,
    CreateBlog: response
      ? "Tạo bài viết thành công"
      : "Không tạo được bài viết",
  });
});

// api get 1 blog
const getBlog = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!id) throw new Error("Missing input");
  const blogPost = await Blog.findByIdAndUpdate(
    id,
    { $inc: { numberView: 1 } },
    { new: true }
  )
    .populate("likes", "firstname lastname")
    .populate("dislikes", "firstname lastname");
  return res.status(200).json({
    success: blogPost ? true : false,
    blog: blogPost ? blogPost : "Không tìm thấy bài viết",
  });
});

// api get all blogs
const getAllBlogs = asyncHandler(async (req, res) => {
  console.log("User ID:", req.user);
  const blogs = await Blog.find().sort({ createdAt: -1 });
  return res.status(200).json({
    success: blogs ? true : false,
    blogs: blogs ? blogs : "Không tìm thấy bài viết",
  });
});

// api update blog by seller
const updateBlog = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!id) throw new Error("Missing input");

  if (!req.body || Object.keys(req.body).length === 0) {
    return res.status(400).json({
      success: false,
      message: "Missing input data",
    });
  }

  if (req.body.title) {
    req.body.slug = slugify(req.body.title);
  }

  const blogPost = await Blog.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  });

  return res.status(200).json({
    success: !!blogPost,
    UpdateBlog: blogPost
      ? "Cập nhật bài viết thành công"
      : "Không cập nhật được bài viết",
  });
});

// api delete blog by admin
const deleteBlog = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!id) throw new Error("Missing input");

  const blogPost = await Blog.findByIdAndDelete(id);
  if (!blogPost) {
    return res.status(404).json({
      success: false,
      message: "Không tìm thấy bài viết để xoá",
    });
  }

  return res.status(200).json({
    success: !!blogPost,
    DeleteBlog: blogPost
      ? "Xoá bài viết thành công"
      : "Không xoá được bài viết",
  });
});

// like blog
const likeBlog = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { bid } = req.params;
  // const { bid } = req.params;
  console.log(bid);
  if (!bid) throw new Error("Missing inputs");
  const blog = await Blog.findById(bid);
  const alreadyDisliked = blog?.dislikes?.find((el) => el.toString() === _id);
  if (alreadyDisliked) {
    const response = await Blog.findByIdAndUpdate(
      bid,
      { $pull: { dislikes: _id } },
      { new: true }
    );
    return res.json({
      success: response ? true : false,
      rs: response,
    });
  }
  const isLiked = blog?.likes?.find((el) => el.toString() === _id);
  if (isLiked) {
    const response = await Blog.findByIdAndUpdate(
      bid,
      { $pull: { likes: _id } },
      { new: true }
    );
    return res.json({
      success: response ? true : false,
      rs: response,
    });
  } else {
    const response = await Blog.findByIdAndUpdate(
      bid,
      { $push: { likes: _id } },
      { new: true }
    );
    return res.json({
      success: response ? true : false,
      rs: response,
    });
  }
});
// dislike blog
const dislikeBlog = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { bid } = req.params;
  if (!bid) throw new Error("Missing inputs");
  const blog = await Blog.findById(bid);
  const alreadyLiked = blog?.likes?.find((el) => el.toString() === _id);
  if (alreadyLiked) {
    const response = await Blog.findByIdAndUpdate(
      bid,
      { $pull: { likes: _id } },
      { new: true }
    );
    return res.json({
      success: response ? true : false,
      rs: response,
    });
  }
  const isDisliked = blog?.dislikes?.find((el) => el.toString() === _id);
  if (isDisliked) {
    const response = await Blog.findByIdAndUpdate(
      bid,
      { $pull: { dislikes: _id } },
      { new: true }
    );
    return res.json({
      success: response ? true : false,
      rs: response,
    });
  } else {
    const response = await Blog.findByIdAndUpdate(
      bid,
      { $push: { dislikes: _id } },
      { new: true }
    );
    return res.json({
      success: response ? true : false,
      rs: response,
    });
  }
});

// api ratings
module.exports = {
  createBlog,
  getBlog,
  getAllBlogs,
  updateBlog,
  deleteBlog,
  dislikeBlog,
  likeBlog,
};
