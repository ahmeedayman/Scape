const mongoose = require("mongoose");

const userSchema = mongoose.Schema;

const user = new userSchema({
  userName: { type: String, required: true },
  email: { type: String, required: true },
  name: { type: String, required: true },
  password: { type: String, required: true },
  friends: [],
  posts: [],
});

module.exports = mongoose.model("User", user);
