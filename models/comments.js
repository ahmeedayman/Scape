const mongoose = require("mongoose");

const commentSchema = mongoose.Schema;

const comment = new commentSchema({
  commentBody: {
    required: true,
    type: String,
  },
  post: {},
  user: {},
  _id: String,
});

module.exports = mongoose.model("Comment", comment);
