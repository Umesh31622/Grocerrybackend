// const Category = require("../models/categoryModel");

// // ✅ Add new category
// exports.createCategory = async (req, res) => {
//   try {
//     const { name } = req.body;
//     if (!name) {
//       return res.status(400).json({ success: false, message: "Category name is required" });
//     }

//     const existing = await Category.findOne({ name: name.trim() });
//     if (existing) {
//       return res.status(400).json({ success: false, message: "Category already exists" });
//     }

//     const category = await Category.create({ name: name.trim() });
//     res.status(201).json({ success: true, message: "Category created successfully", category });
//   } catch (error) {
//     res.status(500).json({ success: false, message: "Server Error", error: error.message });
//   }
// };

// // ✅ Get all categories
// exports.getCategories = async (req, res) => {
//   try {
//     const categories = await Category.find().sort({ createdAt: -1 });
//     res.status(200).json({ success: true, categories });
//   } catch (error) {
//     res.status(500).json({ success: false, message: "Server Error", error: error.message });
//   }
// };

// // ✅ Update category
// exports.updateCategory = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { name } = req.body;

//     if (!name) {
//       return res.status(400).json({ success: false, message: "Category name is required" });
//     }

//     const category = await Category.findByIdAndUpdate(
//       id,
//       { name: name.trim() },
//       { new: true, runValidators: true }
//     );

//     if (!category) {
//       return res.status(404).json({ success: false, message: "Category not found" });
//     }

//     res.status(200).json({ success: true, message: "Category updated successfully", category });
//   } catch (error) {
//     res.status(500).json({ success: false, message: "Server Error", error: error.message });
//   }
// };

// // ✅ Delete category
// exports.deleteCategory = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const deleted = await Category.findByIdAndDelete(id);
//     if (!deleted) {
//       return res.status(404).json({ success: false, message: "Category not found" });
//     }
//     res.status(200).json({ success: true, message: "Category deleted successfully" });
//   } catch (error) {
//     res.status(500).json({ success: false, message: "Server Error", error: error.message });
//   }
// };


const Category = require("../models/categoryModel");
const cloudinary = require("../utils/cloudinary");

// 📌 Upload buffer to cloudinary
const uploadToCloudinary = (fileBuffer) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream({ folder: "category_images" }, (err, result) => {
        if (err) reject(err);
        else resolve(result.secure_url);
      })
      .end(fileBuffer);
  });
};

/* ============================================================
   CREATE CATEGORY WITH IMAGE
============================================================ */
exports.createCategory = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res
        .status(400)
        .json({ success: false, message: "Category name is required" });
    }

    const existing = await Category.findOne({ name: name.trim() });
    if (existing) {
      return res
        .status(400)
        .json({ success: false, message: "Category already exists" });
    }

    let imageUrl = null;
    if (req.file) {
      imageUrl = await uploadToCloudinary(req.file.buffer);
    }

    const category = await Category.create({
      name: name.trim(),
      image: imageUrl,
    });

    res.status(201).json({
      success: true,
      message: "Category created successfully",
      category,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

/* ============================================================
   GET ALL CATEGORIES
============================================================ */
exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ createdAt: -1 });

    res.status(200).json({ success: true, categories });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

/* ============================================================
   UPDATE CATEGORY NAME + IMAGE
============================================================ */
exports.updateCategory = async (req, res) => {
  try {
    const { name } = req.body;
    const { id } = req.params;

    const category = await Category.findById(id);

    if (!category) {
      return res
        .status(404)
        .json({ success: false, message: "Category not found" });
    }

    // Update name
    if (name) category.name = name.trim();

    // Update image if new image uploaded
    if (req.file) {
      const newImage = await uploadToCloudinary(req.file.buffer);

      // Delete old image from Cloudinary (Optional)
      if (category.image) {
        const publicId = category.image.split("/").pop().split(".")[0];
        cloudinary.uploader.destroy(`category_images/${publicId}`);
      }

      category.image = newImage;
    }

    await category.save();

    res.json({
      success: true,
      message: "Category updated successfully",
      category,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

/* ============================================================
   DELETE CATEGORY + DELETE IMAGE FROM CLOUDINARY
============================================================ */
exports.deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const category = await Category.findById(id);
    if (!category) {
      return res
        .status(404)
        .json({ success: false, message: "Category not found" });
    }

    // Delete image from cloudinary
    if (category.image) {
      const publicId = category.image.split("/").pop().split(".")[0];
      cloudinary.uploader.destroy(`category_images/${publicId}`);
    }

    await Category.findByIdAndDelete(id);

    res.json({
      success: true,
      message: "Category deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};
