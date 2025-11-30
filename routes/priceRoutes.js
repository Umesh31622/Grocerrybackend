// // // const express = require("express");
// // // const router = express.Router();
// // // const multer = require("multer");

// // // const storage = multer.memoryStorage();
// // // const upload = multer({ storage });

// // // const priceController = require("../controllers/priceController");

// // // // Website Active
// // // router.get("/website", priceController.getWebsitePrices);

// // // // Status Update
// // // router.put("/status/:id", priceController.updateStatus);

// // // // Bulk Update
// // // router.post("/bulk-update", priceController.bulkUpdatePrices);

// // // // Copy Price
// // // router.post("/copy/:id", priceController.copyPrice);

// // // // Quick Profit/Loss Change
// // // router.put("/updateDiff/:id", priceController.updateDiff);

// // // // // Import CSV
// // // // router.post("/import", upload.single("file"), priceController.importPrices);

// // // // Export ALL CSV
// // // router.get("/export", priceController.exportPrices);

// // // // Delete Multiple
// // // router.post("/delete-selected", priceController.deleteSelected);

// // // // Export Selected (MUST exist)
// // // router.post("/export-selected", priceController.exportSelected);

// // // // Get All Prices
// // // router.get("/", priceController.getPrices);

// // // // Create
// // // router.post("/", upload.single("file"), priceController.createPrice);

// // // // Update
// // // router.put("/:id", upload.single("file"), priceController.updatePrice);

// // // // Delete
// // // router.delete("/:id", priceController.deletePrice);

// // // module.exports = router;
// // const express = require("express");
// // const router = express.Router();
// // const multer = require("multer");

// // const storage = multer.memoryStorage();
// // const upload = multer({ storage });

// // const priceController = require("../controllers/priceController");

// // // WEBSITE ACTIVE PRICES
// // router.get("/website", priceController.getWebsitePrices);

// // // STATUS CHANGE
// // router.put("/status/:id", priceController.updateStatus);

// // // BULK UPDATE
// // router.post("/bulk-update", priceController.bulkUpdatePrices);

// // // COPY PRICE
// // router.post("/copy/:id", priceController.copyPrice);

// // // QUICK PROFIT/LOSS UPDATE
// // router.put("/updateDiff/:id", priceController.updateDiff);

// // // GET ALL PRICES
// // router.get("/", priceController.getPrices);

// // // CREATE PRICE
// // router.post("/", upload.single("file"), priceController.createPrice);

// // // IMPORT CSV
// // router.post("/import", upload.single("file"), priceController.importPrices);

// // // EXPORT ALL CSV
// // router.get("/export", priceController.exportPrices);

// // // DELETE SELECTED
// // router.post("/delete-selected", priceController.deleteSelected);

// // // EXPORT SELECTED
// // router.post("/export-selected", priceController.exportSelected);

// // // UPDATE PRICE
// // router.put("/:id", upload.single("file"), priceController.updatePrice);

// // // DELETE PRICE
// // router.delete("/:id", priceController.deletePrice);

// // module.exports = router;

// const express = require("express");
// const router = express.Router();
// const multer = require("multer");

// const storage = multer.memoryStorage();
// const upload = multer({ storage });

// const priceController = require("../controllers/priceController");

// // WEBSITE ACTIVE PRICES
// router.get("/website", priceController.getWebsitePrices);

// // STATUS CHANGE
// router.put("/status/:id", priceController.updateStatus);

// // BULK UPDATE
// router.post("/bulk-update", priceController.bulkUpdatePrices);

// // COPY PRICE
// router.post("/copy/:id", priceController.copyPrice);

// // QUICK PROFIT/LOSS UPDATE
// router.put("/updateDiff/:id", priceController.updateDiff);

// // GET ALL PRICES
// router.get("/", priceController.getPrices);

// // CREATE PRICE
// router.post("/", upload.single("file"), priceController.createPrice);

// // IMPORT CSV
// router.post("/import", upload.single("file"), priceController.importPrices);

// // EXPORT ALL CSV
// router.get("/export", priceController.exportPrices);

// // DELETE SELECTED
// router.post("/delete-selected", priceController.deleteSelected);

// // EXPORT SELECTED
// router.post("/export-selected", priceController.exportSelected);

// // UPDATE PRICE
// router.put("/:id", upload.single("file"), priceController.updatePrice);

// // DELETE PRICE
// router.delete("/:id", priceController.deletePrice);

// module.exports = router;
const express = require("express");
const router = express.Router();
const multer = require("multer");

const storage = multer.memoryStorage();
const upload = multer({ storage });

const priceController = require("../controllers/priceController");

// WEBSITE ACTIVE PRICES
router.get("/website", priceController.getWebsitePrices);

// STATUS CHANGE
router.put("/status/:id", priceController.updateStatus);

// BULK UPDATE
router.post("/bulk-update", priceController.bulkUpdatePrices);

// COPY PRICE
router.post("/copy/:id", priceController.copyPrice);

// QUICK PROFIT/LOSS UPDATE
router.put("/updateDiff/:id", priceController.updateDiff);

// GET ALL PRICES
router.get("/", priceController.getPrices);

// CREATE PRICE
router.post("/", upload.single("file"), priceController.createPrice);

// IMPORT CSV
router.post("/import", upload.single("file"), priceController.importPrices);

// EXPORT ALL CSV
router.get("/export", priceController.exportPrices);

// DELETE SELECTED
router.post("/delete-selected", priceController.deleteSelected);

// EXPORT SELECTED
router.post("/export-selected", priceController.exportSelected);

// UPDATE PRICE
router.put("/:id", upload.single("file"), priceController.updatePrice);

// DELETE PRICE
router.delete("/:id", priceController.deletePrice);

module.exports = router;
