const mongoose = require("mongoose"); // Erase if already required
const bcrypt = require("bcrypt");
const crypto = require("crypto");
// Declare the Schema of the Mongo model
var userSchema = new mongoose.Schema(
  {
    firstname: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    lastname: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    mobile: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      default: "user",
    },
    cart: [
      {
        product: { type: mongoose.Types.ObjectId, ref: "Product" },
        quantity: Number,
        color: String,
      },
    ],
    address: {
      type: Array,
      default: [],
    },
    wishlist: [{ type: mongoose.Types.ObjectId, ref: "Product" }],
    isBlocked: {
      type: Boolean,
      default: false,
    },
    refreshToken: {
      type: String,
    },
    passwordChangeAt: {
      type: String,
    },
    passwordResetExpires: {
      type: String,
    },
    passwordResetToken: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  const salt = bcrypt.genSaltSync(10);
  this.password = await bcrypt.hashSync(this.password, 10);
});
userSchema.methods = {
  // Dùng để so sánh : ML băm trong csdl và mk người dùng nhập có trùng không.
  isCorrectPassword: async function (password) {
    return await bcrypt.compareSync(password, this.password);
  },
  // Tạo token để reset password bằng crypto-js
  createPasswordChangeToken: function () {
    //Tạo một chuỗi token ngẫu nhiên dài 32 byte và chuyển thành chuỗi hex.
    const resetToken = crypto.randomBytes(32).toString("hex");
    // Băm resetToken gốc bằng thuật toán SHA256 rồi lưu vào this.passwordResetToken.
    this.passwordResetToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");
    // Thời gian hết token trên .
    this.passwordResetExpires = Date.now() + 15 * 60 * 1000;

    return resetToken;
  },
};
//Export the model
module.exports = mongoose.model("User", userSchema);
