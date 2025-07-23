const userRouter = require("./user");
const userProduct = require("./product");

const { notFound, errHandler } = require("../middleware/errHandler");

const initRoutes = (app) => {
  app.use("/api/user", userRouter);
  app.use("/api/product", userProduct);

  app.use(notFound);
  app.use(errHandler);
};

module.exports = initRoutes;
