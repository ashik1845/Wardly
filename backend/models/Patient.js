const mongoose = require("mongoose");

const patientSchema = new mongoose.Schema({
  patientName: String,
  patientId: String,
  wardId: String,
  contact1: String,
  contact2: String
});

module.exports = mongoose.model("Patient", patientSchema);
