const express = require("express");
const jwt = require("jsonwebtoken");
const Ward = require("../models/Ward");

const router = express.Router();

router.post("/login", async (req, res) => {
  try {
    const { wardId, password } = req.body;

    const ward = await Ward.findOne({ wardId, password });
    if (!ward) return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { wardId: ward.wardId },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({ token });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
