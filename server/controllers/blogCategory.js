const e = require("express");
const blogCategory = require("../model/blogCategory");
const asyncHandler = require("express-async-handler");

const createblogCategory = asyncHandler(async (req, res) => {
  if (!req.body || Object.keys(req.body).length === 0) {
    return res.status(400).json({
      success: false,
      message: "Missing input data",
    });
  }
  const { title } = req.body;
  if (!title) {
    return res.status(400).json({
      success: false,
      message: "Title is required",
    });
  }

  const category = await blogCategory.create(req.body);
  return res.status(201).json({
    success: category ? true : false,
    message: category
      ? "Tạo blog-category thành công"
      : "Không tạo được blog-category",
    category,
  });
});

const updateblogCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({
      success: false,
      message: "Missing category ID",
    });
  }

  const category = await blogCategory.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  });

  return res.status(200).json({
    success: category ? true : false,
    category: category ? category : "Không tìm thấy blog-category",
  });
});
const deleteblogCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({
      success: false,
      message: "Missing category ID",
    });
  }
  const category = await blogCategory.findByIdAndDelete(id);
  return res.status(200).json({
    success: category ? true : false,
    message: category
      ? "Xoá blog-category thành công"
      : "Không tìm thấy blog-category",
  });
});
const getCategories = asyncHandler(async (req, res) => {
  
  const categories = await blogCategory.find();
  return res.status(200).json({
    success: categories ? true : false,
    categories: categories.length > 0 ? categories : "Không tìm thấy danh mục",
  });
});

module.exports = {
  createblogCategory,
  getCategories,
  updateblogCategory,
  deleteblogCategory,
};
