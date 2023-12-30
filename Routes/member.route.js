const express = require("express");
const memberRouter = express.Router();
const memberController = require("../Controllers/member.controller");
const middleware = require("../middleware");

memberRouter
  .post("/", middleware.verifyUser, memberController.createMember)
  .delete("/:id", middleware.verifyUser, memberController.deleteMember);

module.exports = memberRouter;
