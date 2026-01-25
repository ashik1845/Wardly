const mongoose = require("mongoose");

const wardSchema = new mongoose.Schema({
  wardId: { type: String, unique: true },
  password: String
});

module.exports = mongoose.model("Ward", wardSchema);
