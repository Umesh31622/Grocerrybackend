const express = require("express");
const router = express.Router();
const Setting = require("../models/Setting");

// Get Current Status
router.get("/", async (req, res) => {
  let setting = await Setting.findOne();
  if (!setting) setting = await Setting.create({ websiteActive: true });

  res.json(setting);
});

// Toggle Status
router.put("/toggle", async (req, res) => {
  let setting = await Setting.findOne();
  if (!setting) setting = await Setting.create({ websiteActive: true });

  setting.websiteActive = !setting.websiteActive;
  await setting.save();

  res.json({ success: true, websiteActive: setting.websiteActive });
});

module.exports = router;
