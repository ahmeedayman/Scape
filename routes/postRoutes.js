const { verifyToken } = require("../util/auth");
const {
  createPost,
  deletePost,
  editPost,
  getAllPosts,
  getUserPosts,
} = require("../controllers/postController");

const express = require("express");
const router = express.Router();

router.get("/api/home", verifyToken, getAllPosts);
router.get("/api/users/:id", getUserPosts);
router.post("/api/createpost", verifyToken, createPost);
router.delete("/api/deletepost", verifyToken, deletePost);
router.patch("/api/editpost", verifyToken, editPost);

module.exports = router;
