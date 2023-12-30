const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const roleModel = new Schema({
  id: { type: String },
  name: { type: String, unique: true },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Role", roleModel);
