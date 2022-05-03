const bcrypt = require("bcrypt");

const { createJwt } = require("../util/auth");
const User = require("../models/users");

exports.signUp = async (req, res) => {
  const userName = req.body.userName;
  const email = req.body.email;
  const emailRegex = /^\S+@\S+\.\S+$/;
  const userNameRegex = /^[a-zA-Z0-9-_]{0,12}$/;
  const validationErrors = [];

  const name = req.body.name;

  if (!emailRegex.test(email)) {
    validationErrors.push("email");
  }
  if (!userNameRegex.test(userName)) {
    validationErrors.push("username");
  }
  if (req.body.password.length < 8) {
    validationErrors.push("password");
  }
  if (validationErrors.length > 0) {
    return res.status(403).json({ validationErrors: validationErrors });
  }

  const hashedPassword = await bcrypt.hash(req.body.password, 10);

  let foundErrors = [];
  try {
    const emailFound = await User.findOne({ email: email });
    if (emailFound) {
      foundErrors.push({ error: "Email" });
    }

    const userNameFound = await User.findOne({ userName: userName });
    if (userNameFound) {
      foundErrors.push({ error: "Username" });
    }
    if (foundErrors.length > 0) {
      return res.status(403).json({ foundErrors });
    }
    const user = new User({
      name: name,
      email: email,
      password: hashedPassword,
      userName: userName,
    });
    await user.save();
    const token = await createJwt(email);

    res.status(201).json({ msg: "created", token: token, loggedUser: user });
  } catch (err) {
    console.log(err);
  }
};

exports.logIn = async (req, res) => {
  const identifier = req.body.identifier;
  const password = req.body.password;
  try {
    const found = await User.findOne({
      $or: [{ email: identifier }, { userName: identifier }],
    });
    if (!found) {
      return res.status(403).json({ error: "Wrong credentials" });
    }
    console.log("reached 1");

    const passwordMatched = await bcrypt.compare(password, found.password);
    if (!passwordMatched) {
      return res.status(403).json({ error: "Wrong credentials" });
    }
    const token = await createJwt(identifier);
    console.log("reached 2");
    res.status(200).json({ token: token, loggedUser: found });
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
};
