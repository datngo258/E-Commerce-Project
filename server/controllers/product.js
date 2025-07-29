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
const qs = require("qs");

const getAllProducts = asyncHandler(async (req, res) => {
  const rawQuery = req._parsedUrl.query; // Lấy query string gốc
  const parsedQuery = qs.parse(rawQuery); // Parse lại chuẩn

  const queries = { ...parsedQuery };
  const excludeFields = ["sort", "page", "limit", "fields"];
  excludeFields.forEach((field) => delete queries[field]);

  // Convert string to number cho các toán tử
  Object.keys(queries).forEach((key) => {
    if (typeof queries[key] === "object") {
      Object.keys(queries[key]).forEach((operator) => {
        const value = queries[key][operator];
        if (!isNaN(value)) {
          queries[key][operator] = Number(value);
        }
      });
    }
  });

  let queryStr = JSON.stringify(queries);
  queryStr = queryStr.replace(
    /\b(gt|gte|lt|lte|in)\b/g,
    (match) => `$${match}`
  );
  const formatedQueryStr = JSON.parse(queryStr);

  // Regex title
  if (parsedQuery.title) {
    formatedQueryStr.title = { $regex: parsedQuery.title, $options: "i" };
  }

  let queryCommand = Product.find(formatedQueryStr);

  // Sort
  if (parsedQuery.sort) {
    const sortBy = parsedQuery.sort.split(",").join(" ");
    queryCommand = queryCommand.sort(sortBy);
  } else {
    queryCommand = queryCommand.sort("-createdAt");
  }

  // Select fields
  if (parsedQuery.fields) {
    const fields = parsedQuery.fields.split(",").join(" ");
    queryCommand = queryCommand.select(fields);
  }

  // Pagination
  const page = parseInt(parsedQuery.page) || 1;
  const limit = parseInt(parsedQuery.limit) || 10;
  const skip = (page - 1) * limit;
  queryCommand = queryCommand.skip(skip).limit(limit);

  const products = await queryCommand;
  const counts = await Product.countDocuments(formatedQueryStr);

  res.status(200).json({
    success: products.length > 0,
    count: counts,
    page,
    limit,
    products: products.length > 0 ? products : "Không tìm thấy sản phẩm nào",
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

const ratings = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { star, comment, pid } = req.body;

  console.log("🔥 API /ratings called with", { _id, star, comment, pid });

  if (!star || !pid) throw new Error("Missing inputs");

  const product = await Product.findById(pid);
  if (!product) throw new Error("Product not found");

  const alreadyRating = product.ratings?.some(
    (el) => el.postedBy.toString() === _id
  );

  console.log("🧩 alreadyRating =", alreadyRating);

  try {
    if (alreadyRating) {
      await Product.findOneAndUpdate(
        { _id: pid, "ratings.postedBy": _id },
        {
          $set: {
            "ratings.$.star": star,
            "ratings.$.comment": comment,
          },
        },
        { new: true }
      );
    } else {
      await Product.findByIdAndUpdate(
        pid,
        {
          $push: { ratings: { star, comment, postedBy: _id } },
        },
        { new: true }
      );
    }

    console.log("✅ Updated ratings array");
  } catch (err) {
    console.error("❌ Error while updating rating:", err.message);
  }

  const updatedProduct = await Product.findById(pid);
  const ratingCount = updatedProduct.ratings.length;
  const sumRating = updatedProduct.ratings.reduce(
    (sum, el) => sum + Number(el.star),
    0
  );

  updatedProduct.totalRatings = Math.round(sumRating / ratingCount);

  console.log("✅ Calculated totalRatings:", updatedProduct.totalRatings);

  await updatedProduct.save();

  console.log("✅ Saved product with updated totalRatings");

  return res.status(200).json({
    status: true,
    data: updatedProduct,
  });
});
const uploadImagesProduct = asyncHandler(async (req, res) => {
  console.log(req.file);
  return res.json("OKE");
});
module.exports = {
  createProduct,
  deleteProduct,
  getProduct,
  getAllProducts,
  updateProduct,
  uploadImagesProduct,
  ratings,
};
