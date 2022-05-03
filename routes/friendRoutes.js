const express = require("express");

const { verifyToken } = require("../util/auth");
const { addOrRemove } = require("../controllers/friendController");
const router = express.Router();

router.post("/api/add", addOrRemove);
router.delete("/api/remove", verifyToken, addOrRemove);

module.exports = router;
