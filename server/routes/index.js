const userRouter = require("./user");
const userProduct = require("./product");
const userProductCategory = require("./productCategory");
const useBlogCategory = require("./blogCategory");
const blogRouter = require("./blog");
const order = require("./order");

const couponRouter = require("./coupon");
const brand = require("./brand");
const { notFound, errHandler } = require("../middleware/errHandler");

const initRoutes = (app) => {
  app.use("/api/user", userRouter);
  app.use("/api/product", userProduct);
  app.use("/api/producCategory", userProductCategory);
  app.use("/api/blogCategory", useBlogCategory);
  app.use("/api/blog", blogRouter);
  app.use("/api/brand", brand);
  app.use("/api/coupon", couponRouter);
  app.use("/api/order", order);

  app.use(notFound);
  app.use(errHandler);
};

module.exports = initRoutes;
