const bcrypt = require("bcrypt");
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true, index: true },
    password: { type: String, required: true },
    role: {
      type: Strinxg,
      enum: ["student", "instructor", "admin"],
      required: true,
    },
    profile: {
      firstName: { type: String, required: true },
      lastName: { type: String, required: true },
      email: {
        type: String,
        unique: true,
        sparse: true,
        match: [/.+\@.+\..+/, "Please fill a valid email address"],
      },
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

const User = mongoose.model("User", userSchema);

module.exports = User;
