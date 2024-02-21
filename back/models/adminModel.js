const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema(
  {
    adminId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    }
  }
);

const Admin = mongoose.model("Admin", adminSchema);

module.exports = Admin;
