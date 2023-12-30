const express = require("express");
const authRouter = express.Router();
const signInAuth = require("../Auth/signIn");
const singUpAuth = require("../Auth/signUp");
const middleware = require("../middleware");
const userController = require("../Controllers/user.controller");

authRouter
  .get("/me", middleware.verifyUser, userController.getMe)
  .post("/signup", singUpAuth.signUp)
  .post("/signin", signInAuth.signIn);

module.exports = authRouter;
