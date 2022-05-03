const Post = require("../models/posts");
const User = require("../models/users");
const Comment = require("../models/comments");
const { default: mongoose } = require("mongoose");

exports.createComment = async (req, res) => {
  const userId = req.body.userId;
  const commentBody = req.body.commentBody;
  const postId = req.body.postId;

  if (!commentBody.length > 0) {
    return res.status(403).json({ error: "comment must have content" });
  }
  try {
    const user = await User.findOne({ id: userId });

    const post = await Post.findOne({ id: postId });

    const comment = new Comment({
      commentBody: commentBody,
    });

    comment._id = new mongoose.Types.ObjectId();
    comment.user = { ...user };

    post.comments.push({ ...comment });

    const updatedPost = await Post.findOneAndUpdate(
      { id: postId },
      { $set: { comments: post.comments } },
      { new: true }
    );
    comment.post = { ...updatedPost };

    await comment.save();

    res.status(201).json({ msg: "comment created" });
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
    console.log(err);
  }
};

exports.deleteComment = async (req, res) => {
  try {
    const postId = req.body.postId;
    const commentId = req.body.commentId;
    const userId = req.body.userId;

    const comment = await Comment.findOne({ id: commentId });
    const post = await Post.findOne({ id: postId });

    if (comment.user._id.toString() === userId) {
      const index = post.findIndex((comment) => {
        return comment._id === commentId;
      });

      await Comment.findOneAndRemove({ id: postId });
      post.comments.splice(index, 1);
      await Post.updateOne(
        { id: postId },
        { $set: { comments: [...post.comments] } }
      );
      return res.status(200).json({ msg: "post deleted" });
    }
    res.status(403).json({ error: "not authorized" });
  } catch (err) {
    res.status(500).json({ error: "internal server error" });
    console.log(err);
  }
};

exports.editComment = async (req, res) => {
  try {
    const postId = req.body.postId;
    const commentId = req.body.commentId;
    const userId = req.body.userId;
    const commentBody = req.body.commentBody;

    const comment = await Comment.findOne({ id: commentId });
    const post = await Post.findOne({ id: postId });

    if (comment.user._id.toString() === userId) {
      {
        if (!commentBody.length > 0) {
          return res.status(403).json({ error: "comment must have content" });
        }
        await Comment.findOneAndUpdate(
          { _id: commentId },
          { $set: { commentBody: commentBody } }
        );
        const index = post.comments.findIndex((oldComment) => {
          console.log(oldComment._id);
          return oldComment._id === commentId;
        });

        const comments = [
          ...post.comments.slice(0, index),
          { ...post.comments[index], commentBody: commentBody },
          ...post.comments.slice(index + 1),
        ];
        await Post.updateOne(
          { id: userId },
          { $set: { comments: [...comments] } }
        );

        return res.status(201).json({ msg: "post updated" });
      }
    }
    res.status(403).json({ msg: "not authorized" });
  } catch (err) {
    res.status(500).json({ error: "internal server error" });
    console.log(err);
  }
};
