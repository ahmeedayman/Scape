const express = require("express");

const { verifyToken } = require("../util/auth");
const {
  createComment,
  deleteComment,
  editComment,
} = require("../controllers/commentControllers");
const router = express.Router();

router.post("/api/createcomment", verifyToken, createComment);
router.delete("/api/deletecomment", verifyToken, deleteComment);
router.patch("/api/editcomment", verifyToken, editComment);

module.exports = router;
