// // // const express = require("express");
// // // const router = express.Router();
// // // const multer = require("multer");

// // // const storage = multer.memoryStorage();
// // // const upload = multer({ storage });

// // // const priceController = require("../controllers/priceController");

// // // // Website API
// // // router.get("/website", priceController.getWebsitePrices);

// // // // Status update
// // // router.put("/status/:id", priceController.updateStatus);

// // // // Bulk update
// // // router.post("/bulk-update", priceController.bulkUpdatePrices);

// // // // Copy product
// // // router.post("/copy/:id", priceController.copyPrice);

// // // // Get all products
// // // router.get("/", priceController.getPrices);

// // // // Create
// // // router.post("/", upload.single("file"), priceController.createPrice);

// // // // Import CSV
// // // router.post("/import", upload.single("file"), priceController.importPrices);

// // // // Export CSV
// // // router.get("/export", priceController.exportPrices);

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

// // // Website API
// // router.get("/website", priceController.getWebsitePrices);

// // // Status update
// // router.put("/status/:id", priceController.updateStatus);

// // // Bulk update
// // router.post("/bulk-update", priceController.bulkUpdatePrices);

// // // Copy product
// // router.post("/copy/:id", priceController.copyPrice);

// // // Get all products
// // router.get("/", priceController.getPrices);

// // // Create
// // router.post("/", upload.single("file"), priceController.createPrice);

// // // Import CSV
// // router.post("/import", upload.single("file"), priceController.importPrices);

// // // Export CSV
// // router.get("/export", priceController.exportPrices);

// // // Update
// // router.put("/:id", upload.single("file"), priceController.updatePrice);

// // // Delete
// // router.delete("/:id", priceController.deletePrice);

// // // module.exports = router;
// // const express = require("express");
// // const router = express.Router();
// // const multer = require("multer");

// // const storage = multer.memoryStorage();
// // const upload = multer({ storage });

// // const priceController = require("../controllers/priceController");

// // // Website API
// // router.get("/website", priceController.getWebsitePrices);

// // // Status update
// // router.put("/status/:id", priceController.updateStatus);

// // // Bulk update
// // router.post("/bulk-update", priceController.bulkUpdatePrices);

// // // Copy product
// // router.post("/copy/:id", priceController.copyPrice);

// // // Update DIFF (VERY IMPORTANT)
// // router.put("/updateDiff/:id", priceController.updateDiff);

// // // Get all products
// // router.get("/", priceController.getPrices);

// // // Create
// // router.post("/", upload.single("file"), priceController.createPrice);

// // // Import CSV
// // router.post("/import", upload.single("file"), priceController.importPrices);

// // // Export CSV
// // router.get("/export", priceController.exportPrices);

// // // Update
// // router.put("/:id", upload.single("file"), priceController.updatePrice);

// // // Delete
// // router.delete("/:id", priceController.deletePrice);

// // module.exports = router;
// const express = require("express");
// const router = express.Router();
// const multer = require("multer");

// const storage = multer.memoryStorage();
// const upload = multer({ storage });

// const priceController = require("../controllers/priceController");

// // WEBSITE API (only active)
// router.get("/website", priceController.getWebsitePrices);

// // STATUS update
// router.put("/status/:id", priceController.updateStatus);

// // BULK update
// router.post("/bulk-update", priceController.bulkUpdatePrices);

// // COPY product
// router.post("/copy/:id", priceController.copyPrice);

// // UPDATE DIFF (VERY IMPORTANT)
// router.put("/updateDiff/:id", priceController.updateDiff);

// // GET ALL products
// router.get("/", priceController.getPrices);

// // CREATE price
// router.post("/", upload.single("file"), priceController.createPrice);

// // CSV IMPORT
// router.post("/import", upload.single("file"), priceController.importPrices);

// // CSV EXPORT
// router.get("/export", priceController.exportPrices);

// // UPDATE price
// router.put("/:id", upload.single("file"), priceController.updatePrice);

// // DELETE price
// router.delete("/:id", priceController.deletePrice);

// module.exports = router;
const express = require("express");
const router = express.Router();
const multer = require("multer");

const storage = multer.memoryStorage();
const upload = multer({ storage });

const priceController = require("../controllers/priceController");

// WEBSITE API (only active)
router.get("/website", priceController.getWebsitePrices);

// STATUS update
router.put("/status/:id", priceController.updateStatus);

// BULK update
router.post("/bulk-update", priceController.bulkUpdatePrices);

// COPY product
router.post("/copy/:id", priceController.copyPrice);

// UPDATE DIFF (VERY IMPORTANT)
router.put("/updateDiff/:id", priceController.updateDiff);

// GET ALL products
router.get("/", priceController.getPrices);

// CREATE price
router.post("/", upload.single("file"), priceController.createPrice);

// CSV IMPORT
router.post("/import", upload.single("file"), priceController.importPrices);

// CSV EXPORT
router.get("/export", priceController.exportPrices);

// UPDATE price
router.put("/:id", upload.single("file"), priceController.updatePrice);

// DELETE price
router.delete("/:id", priceController.deletePrice);

module.exports = router;
