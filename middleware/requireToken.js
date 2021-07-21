const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const User = mongoose.model("User");
require("dotenv").config();

const jwtKey = process.env.JWT_KEY;

module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization)
    return res.status(401).send({ error: "you must be logged in" });

  const token = authorization.replace("Bearer ", "");

  jwt.verify(token, jwtKey, async (err, payload) => {
    if (err)
      return res.status(401).send({ error: `you must be logged in 2 ${err}` });

    const { userId } = payload;
    const currentUser = await User.findById(userId);
    req.user = currentUser;
    next();
  });
};
