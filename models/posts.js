const mongoose = require("mongoose");

const postSchema = mongoose.Schema;

const post = new postSchema({
  postBody: {
    required: true,
    type: String,
  },
  date: String,
  comments: [],
  user: {},
  _id: String,
});

module.exports = mongoose.model("Post", post);
