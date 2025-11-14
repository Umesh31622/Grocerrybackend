// const express = require("express");
// const router = express.Router();
// const {
//   createCategory,
//   getCategories,
//   deleteCategory,
//   updateCategory,
// } = require("../controllers/categoryController");

// // Routes
// router.post("/", createCategory);       // Add
// router.get("/", getCategories);         // List
// router.put("/:id", updateCategory);     // Update
// router.delete("/:id", deleteCategory);  // Delete

// module.exports = router;

// const express = require("express");
// const router = express.Router();
// const {
//   createCategory,
//   getCategories,
//   deleteCategory,
//   updateCategory,
// } = require("../controllers/categoryController");

// // Routes
// router.post("/", createCategory);       // Add
// router.get("/", getCategories);         // List
// router.put("/:id", updateCategory);     // Update
// router.delete("/:id", deleteCategory);  // Delete

// module.exports = router;

const express = require("express");
const router = express.Router();
const multer = require("multer");

const storage = multer.memoryStorage();
const upload = multer({ storage });

const {
  createCategory,
  getCategories,
  deleteCategory,
  updateCategory,
} = require("../controllers/categoryController");

// Create category with image
router.post("/", upload.single("image"), createCategory);

// Get all
router.get("/", getCategories);

// Update category (with optional image replace)
router.put("/:id", upload.single("image"), updateCategory);

// Delete category + image
router.delete("/:id", deleteCategory);

module.exports = router;
