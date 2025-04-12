// user-api.js
const exp = require("express");
const userApp = exp.Router();
const bcryptjs = require("bcryptjs");
const expressAsyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const verifyToken = require("../middlewares/verifyToken");
require("dotenv").config();

// Middleware to get collections
userApp.use((req, res, next) => {
  userCollection = req.app.get("userscollection");
  next();
});

// User registration route
userApp.post('/user', expressAsyncHandler(async (req, res) => {
  const user = req.body;
  console.log(user);
  
  // Check if the user already exists and log the result
  const existingUser = await userCollection.findOne({ username: user.username });
  if (existingUser) {
      console.log("User already exists:", existingUser);
      return res.send({ message: "User already exists" });
  }

  // Hash the password and insert the user
  const hashedPassword = await bcryptjs.hash(user.password, 7);
  user.password = hashedPassword;
  await userCollection.insertOne(user);

  res.send({ message: "User created" });
}));

userApp.post('/login', expressAsyncHandler(async (req, res) => {
  const user = req.body; // Retrieve user credentials from req.body
  console.log(user)
  // Find the user in the database
  const dbUser = await userCollection.findOne({ username: user.username });
  if (!dbUser) {
      return res.send({ message: "Invalid username" });
  }

  // Compare the provided password with the hashed password in the database
  const status = await bcryptjs.compare(user.password, dbUser.password);
  if (!status) {
      return res.send({ message: "Invalid password" });
  }

  // Generate a token if login is successful
  const signedToken = jwt.sign({ username: dbUser.username }, process.env.SECRET_KEY, { expiresIn: '1d' });
  delete dbUser.password; // Remove password from the response
  res.send({ message: "Login successful", token: signedToken, user: dbUser });
}));

module.exports = userApp;
