const { response } = require("express");
const Product = require("../model/Product");
const asyncHandler = require("express-async-handler");
const slugify = require("slugify");

// api create product
const createProduct = asyncHandler(async (req, res) => {
  if (!req.body || Object.keys(req.body).length === 0) {
    return res.status(400).json({
      success: false,
      message: "Missing input data",
    });
  }
  if (req.body.title && req.body) {
    req.body.slug = slugify(req.body.title);
  }
  const product = await Product.create(req.body);
  return res.status(201).json({
    success: product ? true : false,
    CreateProduct: product
      ? "Tạo sản phẩm thành công"
      : "Không tạo được sản phẩm",
  });
});

// api get 1 product
const getProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!id) throw new Error("Missing input");
  const product = await Product.findById(id);
  return res.status(200).json({
    success: product ? true : false,
    product: product ? product : "Không tìm thấy sản phẩm",
  });
});

// api get all products
const getAllProducts = asyncHandler(async (req, res) => {
  const products = await Product.find();
  return res.status(200).json({
    success: products ? true : false,
    products: products ? products : "Không tìm thấy sản phẩm nào",
  });
});
// api update product by seller

// api update product by admin
const updateProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!id) throw new Error("Missing input");
  if (!req.body || Object.keys(req.body).length === 0) {
    return res.status(400).json({
      success: false,
      message: "Missing input data",
    });
  }
  if (req.body.title && req.body) {
    req.body.slug = slugify(req.body.title);
  }
  const product = await Product.findByIdAndUpdate(id, req.body, {
    new: true,
  });
  return res.status(200).json({
    success: product ? true : false,
    UpdateProduct: product
      ? "Cập nhật sản phẩm thành công"
      : "Không cập nhật được sản phẩm",
  });
});

// aoi delete product by admin
const deleteProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!id) throw new Error("Missing input");
  const product = await Product.findByIdAndDelete(id);
  return res.status(200).json({
    success: product ? true : false,
    DeleteProduct: product
      ? "Xoá sản phẩm thành công"
      : "Không xoá được sản phẩm",
  });
});

module.exports = {
  createProduct,
  deleteProduct,
  getProduct,
  getAllProducts,
  updateProduct,
};
