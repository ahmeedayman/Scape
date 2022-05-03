const express = require("express");

const { signUp, logIn } = require("../controllers/authController");
const { verifyToken } = require("../util/auth");

const router = express.Router();

router.post("/api/signup", signUp);

router.post("/api/login", logIn);

router.get("/api/verify", verifyToken, (req, res) => {
  console.log("user", req.user);
  res.status(200).json({ loggedUser: req.user });
});
module.exports = router;
