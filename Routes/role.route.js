const express = require("express");
const roleRouter = express.Router();
const roleController = require("../Controllers/role.controller");

roleRouter
  .get("/", roleController.getAllRole)
  .post("/", roleController.createRole);

module.exports = roleRouter;
