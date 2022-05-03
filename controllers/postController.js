const { default: mongoose } = require("mongoose");
const Post = require("../models/posts");
const User = require("../models/users");

exports.createPost = async (req, res) => {
  const userId = req.body.userId;
  const postBody = req.body.postBody;

  if (!postBody.length > 0) {
    return res.status(403).json({ error: "Post must have content" });
  }
  try {
    const user = await User.findOne({ _id: userId });
    console.log(user);
    const post = new Post({ postBody: postBody, date: new Date() });
    post._id = new mongoose.Types.ObjectId();
    const updatedUser = await User.findOneAndUpdate(
      { _id: userId },
      { $set: { posts: [...user.posts, { ...post }] } },
      { new: true }
    );
    post.user = { ...updatedUser };
    await post.save();
    res.status(201).json({ msg: "post created" });
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
    console.log(err);
  }
};

exports.deletePost = async (req, res) => {
  try {
    const postId = req.body.postId;
    const userId = req.body.userId;

    const user = await User.findOne({ _id: userId });

    if (
      user.posts.some((post) => {
        return post._id === postId;
      })
    ) {
      const index = user.posts.findIndex((post) => {
        return post._id === postId;
      });
      console.log(index);

      await Post.findOneAndRemove({ id: postId });
      user.posts.splice(index, 1);
      await User.updateOne(
        { id: userId },
        { $set: { posts: [...user.posts] } }
      );
      return res.status(200).json({ msg: "post deleted" });
    }
    res.status(403).json({ error: "not authorized" });
  } catch (err) {
    res.status(500).json({ error: "internal server error" });
    console.log(err);
  }
};

exports.editPost = async (req, res) => {
  try {
    const postId = req.body.postId;
    const postBody = req.body.postBody;
    const userId = req.body.userId;
    const user = await User.findOne({ _id: userId });
    if (
      user.posts.some((post) => {
        return post._id === postId;
      })
    ) {
      if (!postBody.length > 0) {
        return res.status(403).json({ error: "Post must have content" });
      }
      await Post.findOneAndUpdate(
        { id: postId },
        { $set: { postBody: postBody } }
      );
      const index = user.posts.findIndex((oldPost) => {
        return oldPost._id === postId;
      });

      const posts = [
        ...user.posts.slice(0, index),
        { ...user.posts[index], postBody: postBody },
        ...user.posts.slice(index + 1),
      ];
      await User.updateOne({ id: userId }, { $set: { posts: [...posts] } });

      return res.status(201).json({ msg: "post updated" });
    }
    res.status(403).json({ msg: "not authorized" });
  } catch (err) {
    res.status(500).json({ error: "internal server error" });
  }
};

exports.getAllPosts = async (req, res) => {
  try {
    const userId = req.body.userId;
    const user = await User.findOne({ _id: userId });
    const friends = await User.find({ _id: { $in: user.friends } });
    const posts = [];
    user.posts.forEach((post) => {
      post.user = user._id.toString();
    });
    posts.push(...user.posts);
    friends.forEach((friend) => {
      friend.posts.forEach((post) => {
        return (post.user = friend._id.toString());
      });
      return posts.push(...friend.posts);
    });
    posts.sort((a, b) => {
      return new Date(b.date) - new Date(a.date);
    });
    res.status(200).json({ posts: posts, loggedUser: req.user });
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getUserPosts = async (req, res) => {
  try {
    const userId = req.body.userId;
    const user = await User.findOne({ _id: userId });
    const posts = user.posts;
    res.status(200).json({ posts: posts, loggedUser: req.user });
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
};
