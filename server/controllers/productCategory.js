const e = require("express");
const productCategory = require("../model/productCategory");
const asyncHandler = require("express-async-handler");

const createProductCategory = asyncHandler(async (req, res) => {
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

  const category = await productCategory.create(req.body);
  return res.status(201).json({
    success: category ? true : false,
    message: category ? "Tạo danh mục thành công" : "Không tạo được danh mục",
    category,
  });
});

const getCategories = asyncHandler(async (req, res) => {
  const categories = await productCategory.find();

  return res.status(200).json({
    success: categories ? true : false,
    categories: categories ? categories : "Không tìm thấy danh mục",
  });
});

const updateProductCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({
      success: false,
      message: "Missing category ID",
    });
  }

  const category = await productCategory.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  });

  return res.status(200).json({
    success: category ? true : false,
    category: category ? category : "Không tìm thấy danh mục",
  });
});
const deleteProductCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({
      success: false,
      message: "Missing category ID",
    });
  }
  const category = await productCategory.findByIdAndDelete(id);
  return res.status(200).json({
    success: category ? true : false,
    message: category ? "Xoá danh mục thành công" : "Không tìm thấy danh mục",
  });
});

module.exports = {
  createProductCategory,
  getCategories,
  updateProductCategory,
  deleteProductCategory,
};
