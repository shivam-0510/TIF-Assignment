const express = require("express");
const communityRouter = express.Router();
const communityController = require("../Controllers/community.controller");
const middleware = require("../middleware");

communityRouter
  .post("/", middleware.verifyUser, communityController.newCommunity)
  .get("/", communityController.getAllCommunity)
  .get("/:id/members", middleware.verifyUser, communityController.getAllMembers)
  .get(
    "/me/owner",
    middleware.verifyUser,
    communityController.getAdminJoinedComms
  )
  .get("/me/member", middleware.verifyUser, communityController.getMeComms);

module.exports = communityRouter;
