const mongoose = require("mongoose");
const express = require("express");
const bodyParser = require("body-parser");

const postRoutes = require("./routes/postRoutes");
const authRoutes = require("./routes/authRoutes");
const commentRoutes = require("./routes/commentRoutes");
const friendRoutes = require("./routes/friendRoutes");

const app = express();

app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

app.use(authRoutes);
app.use(postRoutes);
app.use(commentRoutes);
app.use(friendRoutes);

mongoose
  .connect("uri")
  .then(() => {
    console.log("connected");
    app.listen(8080);
  })
  .catch((err) => {
    app.listen(8080);
    app.use((req, res) => {
      res.status(500).json({ error: "Internal server error, try again later" });
    });
  });
