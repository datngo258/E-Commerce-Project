const mongoose = require("mongoose");

const dbconnect = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGOOSE_URI);
    if (conn.connection.readyState === 1) {
      console.log("✅ Kết nối CSDL thành công!");
    } else {
      console.log("❌ Kết nối CSDL thất bại!");
    }
  } catch (error) {
    console.log("❌ Lỗi kết nối CSDL:");
    throw new Error(error);
  }
};

module.exports = dbconnect;
