// // // // // // const express = require("express");
// // // // // // const router = express.Router();
// // // // // // const multer = require("multer");

// // // // // // const storage = multer.memoryStorage();
// // // // // // const upload = multer({ storage });

// // // // // // const priceController = require("../controllers/priceController");

// // // // // // // Website API
// // // // // // router.get("/website", priceController.getWebsitePrices);

// // // // // // // Status update
// // // // // // router.put("/status/:id", priceController.updateStatus);

// // // // // // // Bulk update
// // // // // // router.post("/bulk-update", priceController.bulkUpdatePrices);

// // // // // // // Copy product
// // // // // // router.post("/copy/:id", priceController.copyPrice);

// // // // // // // Get all products
// // // // // // router.get("/", priceController.getPrices);

// // // // // // // Create
// // // // // // router.post("/", upload.single("file"), priceController.createPrice);

// // // // // // // Import CSV
// // // // // // router.post("/import", upload.single("file"), priceController.importPrices);

// // // // // // // Export CSV
// // // // // // router.get("/export", priceController.exportPrices);

// // // // // // // Update
// // // // // // router.put("/:id", upload.single("file"), priceController.updatePrice);

// // // // // // // Delete
// // // // // // router.delete("/:id", priceController.deletePrice);

// // // // // // module.exports = router;

// // // // // const express = require("express");
// // // // // const router = express.Router();
// // // // // const multer = require("multer");

// // // // // const storage = multer.memoryStorage();
// // // // // const upload = multer({ storage });

// // // // // const priceController = require("../controllers/priceController");

// // // // // // Website API
// // // // // router.get("/website", priceController.getWebsitePrices);

// // // // // // Status update
// // // // // router.put("/status/:id", priceController.updateStatus);

// // // // // // Bulk update
// // // // // router.post("/bulk-update", priceController.bulkUpdatePrices);

// // // // // // Copy product
// // // // // router.post("/copy/:id", priceController.copyPrice);

// // // // // // Get all products
// // // // // router.get("/", priceController.getPrices);

// // // // // // Create
// // // // // router.post("/", upload.single("file"), priceController.createPrice);

// // // // // // Import CSV
// // // // // router.post("/import", upload.single("file"), priceController.importPrices);

// // // // // // Export CSV
// // // // // router.get("/export", priceController.exportPrices);

// // // // // // Update
// // // // // router.put("/:id", upload.single("file"), priceController.updatePrice);

// // // // // // Delete
// // // // // router.delete("/:id", priceController.deletePrice);

// // // // // // module.exports = router;
// // // // // const express = require("express");
// // // // // const router = express.Router();
// // // // // const multer = require("multer");

// // // // // const storage = multer.memoryStorage();
// // // // // const upload = multer({ storage });

// // // // // const priceController = require("../controllers/priceController");

// // // // // // Website API
// // // // // router.get("/website", priceController.getWebsitePrices);

// // // // // // Status update
// // // // // router.put("/status/:id", priceController.updateStatus);

// // // // // // Bulk update
// // // // // router.post("/bulk-update", priceController.bulkUpdatePrices);

// // // // // // Copy product
// // // // // router.post("/copy/:id", priceController.copyPrice);

// // // // // // Update DIFF (VERY IMPORTANT)
// // // // // router.put("/updateDiff/:id", priceController.updateDiff);

// // // // // // Get all products
// // // // // router.get("/", priceController.getPrices);

// // // // // // Create
// // // // // router.post("/", upload.single("file"), priceController.createPrice);

// // // // // // Import CSV
// // // // // router.post("/import", upload.single("file"), priceController.importPrices);

// // // // // // Export CSV
// // // // // router.get("/export", priceController.exportPrices);

// // // // // // Update
// // // // // router.put("/:id", upload.single("file"), priceController.updatePrice);

// // // // // // Delete
// // // // // router.delete("/:id", priceController.deletePrice);

// // // // // module.exports = router;
// // // // const express = require("express");
// // // // const router = express.Router();
// // // // const multer = require("multer");

// // // // const storage = multer.memoryStorage();
// // // // const upload = multer({ storage });

// // // // const priceController = require("../controllers/priceController");

// // // // // WEBSITE API (only active)
// // // // router.get("/website", priceController.getWebsitePrices);

// // // // // STATUS update
// // // // router.put("/status/:id", priceController.updateStatus);

// // // // // BULK update
// // // // router.post("/bulk-update", priceController.bulkUpdatePrices);

// // // // // COPY product
// // // // router.post("/copy/:id", priceController.copyPrice);

// // // // // UPDATE DIFF (VERY IMPORTANT)
// // // // router.put("/updateDiff/:id", priceController.updateDiff);

// // // // // GET ALL products
// // // // router.get("/", priceController.getPrices);

// // // // // CREATE price
// // // // router.post("/", upload.single("file"), priceController.createPrice);

// // // // // CSV IMPORT
// // // // router.post("/import", upload.single("file"), priceController.importPrices);

// // // // // CSV EXPORT
// // // // router.get("/export", priceController.exportPrices);

// // // // // UPDATE price
// // // // router.put("/:id", upload.single("file"), priceController.updatePrice);

// // // // // DELETE price
// // // // router.delete("/:id", priceController.deletePrice);

// // // // module.exports = router;
// // // const express = require("express");
// // // const router = express.Router();
// // // const multer = require("multer");

// // // const storage = multer.memoryStorage();
// // // const upload = multer({ storage });

// // // const priceController = require("../controllers/priceController");

// // // // WEBSITE API (only active)
// // // router.get("/website", priceController.getWebsitePrices);

// // // // STATUS update
// // // router.put("/status/:id", priceController.updateStatus);

// // // // BULK update
// // // router.post("/bulk-update", priceController.bulkUpdatePrices);

// // // // COPY product
// // // router.post("/copy/:id", priceController.copyPrice);

// // // // UPDATE DIFF (VERY IMPORTANT)
// // // router.put("/updateDiff/:id", priceController.updateDiff);

// // // // GET ALL products
// // // router.get("/", priceController.getPrices);

// // // // CREATE price
// // // router.post("/", upload.single("file"), priceController.createPrice);

// // // // CSV IMPORT
// // // router.post("/import", upload.single("file"), priceController.importPrices);

// // // // CSV EXPORT
// // // router.get("/export", priceController.exportPrices);

// // // // UPDATE price
// // // router.put("/:id", upload.single("file"), priceController.updatePrice);

// // // // DELETE price
// // // router.delete("/:id", priceController.deletePrice);

// // // module.exports = router;

// // const express = require("express");
// // const router = express.Router();
// // const multer = require("multer");

// // const storage = multer.memoryStorage();
// // const upload = multer({ storage });

// // const priceController = require("../controllers/priceController");

// // router.get("/website", priceController.getWebsitePrices);
// // router.put("/status/:id", priceController.updateStatus);
// // router.post("/bulk-update", priceController.bulkUpdatePrices);
// // router.post("/copy/:id", priceController.copyPrice);
// // router.put("/updateDiff/:id", priceController.updateDiff);

// // router.get("/", priceController.getPrices);
// // router.post("/", upload.single("file"), priceController.createPrice);

// // router.post("/import", upload.single("file"), priceController.importPrices);
// // router.get("/export", priceController.exportPrices);

// // router.put("/:id", upload.single("file"), priceController.updatePrice);
// // router.delete("/:id", priceController.deletePrice);

// // module.exports = router;

// const express = require("express");
// const router = express.Router();
// const multer = require("multer");

// const storage = multer.memoryStorage();
// const upload = multer({ storage });

// const priceController = require("../controllers/priceController");

// router.get("/website", priceController.getWebsitePrices);
// router.put("/status/:id", priceController.updateStatus);
// router.post("/bulk-update", priceController.bulkUpdatePrices);
// router.post("/copy/:id", priceController.copyPrice);
// router.put("/updateDiff/:id", priceController.updateDiff);

// router.get("/", priceController.getPrices);
// router.post("/", upload.single("file"), priceController.createPrice);

// router.post("/import", upload.single("file"), priceController.importPrices);
// router.get("/export", priceController.exportPrices);

// router.put("/:id", upload.single("file"), priceController.updatePrice);
// router.delete("/:id", priceController.deletePrice);

// module.exports = router;

const express = require("express");
const router = express.Router();
const multer = require("multer");

const storage = multer.memoryStorage();
const upload = multer({ storage });

const priceController = require("../controllers/priceController");

// WEBSITE
router.get("/website", priceController.getWebsitePrices);

// STATUS
router.put("/status/:id", priceController.updateStatus);

// BULK
router.post("/bulk-update", priceController.bulkUpdatePrices);

// COPY
router.post("/copy/:id", priceController.copyPrice);

// QUICK DIFF
router.put("/updateDiff/:id", priceController.updateDiff);

// GET ALL
router.get("/", priceController.getPrices);

// CREATE
router.post("/", upload.single("file"), priceController.createPrice);

// IMPORT CSV
router.post("/import", upload.single("file"), priceController.importPrices);

// EXPORT CSV
router.get("/export", priceController.exportPrices);

// SELECTED EXPORT
router.post("/export-selected", priceController.exportSelected);

// SELECTED DELETE
router.post("/delete-selected", priceController.deleteSelected);

// SELECTED CSV IMPORT
router.post("/import-selected", upload.single("file"), priceController.importSelected);

// UPDATE
router.put("/:id", upload.single("file"), priceController.updatePrice);

// DELETE
router.delete("/:id", priceController.deletePrice);

module.exports = router;
