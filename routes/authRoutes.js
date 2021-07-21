const mongoose = require("mongoose");
const router = require("express").Router();
const jwt = require("jsonwebtoken");
require("dotenv").config();

const jwtKey = process.env.JWT_KEY;
const emailValidator = require("../middleware/emailValidator");
const passwordValidator = require("../middleware/passwordValidator");
const User = mongoose.model("User");

//------------------------Sign Up (Post) Route ------------------------------------------//
router.post("/signup", async (req, res) => {
  const { email, password } = req.body;
  // prettier-ignore
  if (!email || !password || !emailValidator(email) || !passwordValidator(password)) {
    return res
      .status(422)
      .send({ error: "Must provide valid email and password" });
  }

  try {
    const newUser = new User({ email, password });
    await newUser.save();

    //     creating json web token
    const token = jwt.sign({ userId: newUser._id }, jwtKey);
    res.status(201).send({ token });
  } catch (err) {
    return res.status(422).send(err.message);
  }
});

//------------------------------------- Sign In Post Route ------------------------------------------------//
router.post("/signin", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res
      .status(422)
      .send({ error: "Must provide valid email and password" });

  const user = await User.findOne({ email });
  if (!user) return res.status(422).send({ error: "Wrong Credentials!!" });

  //Compare password and send token
  try {
    await user.comparePassword(password);
    const token = jwt.sign({ userId: user._id }, jwtKey);
    res.status(201).send({ token });
  } catch (err) {
    return res.status(422).send({ error: "Wrong Credentials!!" });
  }
});
module.exports = router;
