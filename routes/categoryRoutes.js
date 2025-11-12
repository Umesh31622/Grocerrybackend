const express = require("express");
const router = express.Router();
const {
  createCategory,
  getCategories,
  deleteCategory,
  updateCategory,
} = require("../controllers/categoryController");

// Routes
router.post("/", createCategory);       // Add
router.get("/", getCategories);         // List
router.put("/:id", updateCategory);     // Update
router.delete("/:id", deleteCategory);  // Delete

module.exports = router;
