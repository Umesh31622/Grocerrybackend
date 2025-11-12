// // const express = require("express");
// // const router = express.Router();
// // const multer = require("multer");
// // const upload = multer({ dest: "uploads/" });

// // const priceController = require("../controllers/priceController");

// // router.get("/", priceController.getPrices); // GET /api/prices
// // router.post("/", upload.single("file"), priceController.createPrice);
// // router.put("/:id", upload.single("file"), priceController.updatePrice);
// // router.delete("/:id", priceController.deletePrice);

// // module.exports = router;
// const express = require("express");
// const router = express.Router();
// const multer = require("multer");
// const upload = multer({ dest: "uploads/" });

// const priceController = require("../controllers/priceController");

// router.get("/", priceController.getPrices); // GET /api/prices
// router.post("/", upload.single("file"), priceController.createPrice); // create (image field name 'file')
// router.put("/:id", upload.single("file"), priceController.updatePrice);
// router.delete("/:id", priceController.deletePrice);

// // CSV import/export
// router.post("/import", upload.single("file"), priceController.importPrices); // CSV import -> field name 'file'
// router.get("/export", priceController.exportPrices); // CSV export

// module.exports = router;
const express = require("express");
const router = express.Router();
const multer = require("multer");

// ✅ Use memory storage (Vercel-safe, no uploads folder)
const storage = multer.memoryStorage();
const upload = multer({ storage });

const priceController = require("../controllers/priceController");

// CRUD Routes
router.get("/", priceController.getPrices);
router.post("/", upload.single("file"), priceController.createPrice);
router.put("/:id", upload.single("file"), priceController.updatePrice);
router.delete("/:id", priceController.deletePrice);

// ✅ CSV import/export
router.post("/import", upload.single("file"), priceController.importPrices);
router.get("/export", priceController.exportPrices);

module.exports = router;
