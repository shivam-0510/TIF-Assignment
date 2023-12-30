const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const memberModel = new Schema({
  id: { type: String },
  community: { type: String },
  user: { type: String },
  role: { type: String },
  created_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Member", memberModel);
