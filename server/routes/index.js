const userRouter = require("./user");
const userProduct = require("./product");
const userProductCategory = require("./productCategory");
const useBlogCategory = require("./blogCategory");

const { notFound, errHandler } = require("../middleware/errHandler");

const initRoutes = (app) => {
  app.use("/api/user", userRouter);
  app.use("/api/product", userProduct);
  app.use("/api/producCategory", userProductCategory);
  app.use("/api/blogCategory", useBlogCategory);

  app.use(notFound);
  app.use(errHandler);
};

module.exports = initRoutes;
