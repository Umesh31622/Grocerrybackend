// const express = require("express");
// const router = express.Router();
// const multer = require("multer");

// const storage = multer.memoryStorage();
// const upload = multer({ storage });

// const priceController = require("../controllers/priceController");

// // ⭐ STATUS ROUTE FIRST
// router.put("/status/:id", priceController.updateStatus);

// // ⭐ BULK UPDATE ROUTE (must be BEFORE /:id)
// router.post("/bulk-update", priceController.bulkUpdatePrices);

// // CRUD
// router.get("/", priceController.getPrices);
// router.post("/", upload.single("file"), priceController.createPrice);

// // ⭐ dynamic route AFTER static routes
// router.put("/:id", upload.single("file"), priceController.updatePrice);
// router.delete("/:id", priceController.deletePrice);

// // CSV
// router.post("/import", upload.single("file"), priceController.importPrices);
// router.get("/export", priceController.exportPrices);

// module.exports = router;

const express = require("express");
const router = express.Router();
const multer = require("multer");

const storage = multer.memoryStorage();
const upload = multer({ storage });

const priceController = require("../controllers/priceController");

/* =====================================================
   WEBSITE API (SHOW TO CUSTOMERS)
===================================================== */
router.get("/website", priceController.getWebsitePrices);

/* =====================================================
   STATUS UPDATE (STATIC ROUTE)
===================================================== */
router.put("/status/:id", priceController.updateStatus);

/* =====================================================
   BULK UPDATE (STATIC ROUTE)
===================================================== */
router.post("/bulk-update", priceController.bulkUpdatePrices);

/* =====================================================
   COPY PRODUCT (STATIC ROUTE)
===================================================== */
router.post("/copy/:id", priceController.copyPrice);

/* =====================================================
   GET ALL PRICES (ADMIN PANEL)
===================================================== */
router.get("/", priceController.getPrices);

/* =====================================================
   CREATE PRICE
===================================================== */
router.post("/", upload.single("file"), priceController.createPrice);

/* =====================================================
   IMPORT CSV
===================================================== */
router.post("/import", upload.single("file"), priceController.importPrices);

/* =====================================================
   EXPORT CSV
===================================================== */
router.get("/export", priceController.exportPrices);

/* =====================================================
   UPDATE PRICE (DYNAMIC ROUTE)
===================================================== */
router.put("/:id", upload.single("file"), priceController.updatePrice);

/* =====================================================
   DELETE PRICE (DYNAMIC ROUTE)
===================================================== */
router.delete("/:id", priceController.deletePrice);

module.exports = router;

