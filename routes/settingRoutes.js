// const express = require("express");
// const router = express.Router();
// const Setting = require("../models/Setting");

// // Get Current Status
// router.get("/", async (req, res) => {
//   let setting = await Setting.findOne();
//   if (!setting) setting = await Setting.create({ websiteActive: true });

//   res.json(setting);
// });

// // Toggle Status
// router.put("/toggle", async (req, res) => {
//   let setting = await Setting.findOne();
//   if (!setting) setting = await Setting.create({ websiteActive: true });

//   setting.websiteActive = !setting.websiteActive;
//   await setting.save();

//   res.json({ success: true, websiteActive: setting.websiteActive });
// });

// module.exports = router;

const express = require("express");
const router = express.Router();
const Setting = require("../models/Setting");

// Get Current Status
router.get("/", async (req, res) => {
  try {
    let setting = await Setting.findOne();

    // ❌ default TRUE hata diya
    if (!setting) {
      setting = await Setting.create({ websiteActive: false });
    }

    res.json(setting);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Toggle Status
router.put("/toggle", async (req, res) => {
  try {
    let setting = await Setting.findOne();

    if (!setting) {
      setting = await Setting.create({ websiteActive: false });
    }

    setting.websiteActive = !setting.websiteActive;
    await setting.save();

    res.json({ success: true, websiteActive: setting.websiteActive });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;


