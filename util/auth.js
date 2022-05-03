const jwt = require("jsonwebtoken");

const User = require("../models/users");

exports.createJwt = async (identifier) => {
  const user = await User.findOne({
    $or: [{ email: identifier }, { userName: identifier }],
  });
  const token = await jwt.sign({ user: user }, "?");

  return token;
};

exports.verifyToken = async (req, res, next) => {
  console.log(req.headers.authorization);
  try {
    const token = req.headers["authorization"].split(" ")[1];
    console.log(token);
    let decodedToken;

    decodedToken = await jwt.verify(token, "?");
    if (!decodedToken) {
      return res.status(403).json({ error: "not authenticated" });
    }
    req.user = decodedToken.user;
    next();
  } catch (err) {
    res.status(500).json({ error: "internal server error" });
  }
};
