const Price = require("../models/priceModel");
const Category = require("../models/categoryModel");
const cloudinary = require("../utils/cloudinary"); // your existing cloudinary util
const fs = require("fs");
const csv = require("fast-csv");
const path = require("path");

// CREATE
exports.createPrice = async (req, res) => {
  try {
    const { name, category, basePrice, difference, validTill, description } = req.body;
    // category is expected to be category id (string)
    let imageUrl = null;

    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, { folder: "price_images" });
      imageUrl = result.secure_url;
      fs.unlinkSync(req.file.path);
    }

    // If category was sent as name, try to find by id first; fallback will be handled by frontend using IDs
    const cat = typeof category === "string" && category.match(/^[0-9a-fA-F]{24}$/)
      ? category
      : null;

    const price = await Price.create({
      name,
      category: cat || category, // if frontend sends id, good; else backend import handles creation separately
      basePrice: parseFloat(basePrice) || 0,
      difference: parseFloat(difference) || 0,
      validTill: validTill ? new Date(validTill) : undefined,
      description,
      image: imageUrl,
    });

    // populate category
    const populated = await Price.findById(price._id).populate("category", "name");
    res.status(201).json({ success: true, data: populated });
  } catch (err) {
    console.error("createPrice error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET ALL
exports.getPrices = async (req, res) => {
  try {
    const prices = await Price.find().populate("category", "name").sort({ createdAt: -1 });
    const data = prices.map(p => ({ ...p._doc, finalPrice: p.basePrice + (p.difference || 0) }));
    res.json({ success: true, data });
  } catch (err) {
    console.error("getPrices error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// UPDATE
exports.updatePrice = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, category, basePrice, difference, validTill, description } = req.body;
    let updateData = {
      name,
      category,
      basePrice: parseFloat(basePrice) || 0,
      difference: parseFloat(difference) || 0,
      validTill: validTill ? new Date(validTill) : undefined,
      description,
    };

    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, { folder: "price_images" });
      updateData.image = result.secure_url;
      fs.unlinkSync(req.file.path);
    }

    const updated = await Price.findByIdAndUpdate(id, updateData, { new: true }).populate("category", "name");
    res.json({ success: true, data: updated });
  } catch (err) {
    console.error("updatePrice error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// DELETE
exports.deletePrice = async (req, res) => {
  try {
    const { id } = req.params;
    await Price.findByIdAndDelete(id);
    res.json({ success: true, message: "Deleted successfully" });
  } catch (err) {
    console.error("deletePrice error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * IMPORT CSV
 * Accepts a CSV file (multipart/form-data, field name 'file').
 * CSV expected headers:
 * name,categoryName,basePrice,difference,validTill,description,imageUrl
 *
 * For each row:
 * - ensure category exists (create if missing)
 * - create Price document
 */
exports.importPrices = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: "CSV file is required" });

    const results = [];
    const fileRows = [];
    const stream = fs.createReadStream(req.file.path);

    const parser = csv.parse({ headers: true, ignoreEmpty: true, trim: true });

    stream.pipe(parser)
      .on("error", error => {
        console.error("CSV parse error:", error);
        fs.unlinkSync(req.file.path);
        return res.status(500).json({ success: false, message: error.message });
      })
      .on("data", row => {
        fileRows.push(row);
      })
      .on("end", async () => {
        // process rows sequentially (safe)
        for (const r of fileRows) {
          const name = r.name || r.product || "";
          const catName = (r.categoryName || r.category || "Uncategorized").trim();
          const basePrice = parseFloat(r.basePrice || r.price || 0) || 0;
          const difference = parseFloat(r.difference || 0) || 0;
          const validTill = r.validTill ? new Date(r.validTill) : undefined;
          const description = r.description || r.desc || "";

          // get or create category
          let category = await Category.findOne({ name: catName });
          if (!category) {
            category = await Category.create({ name: catName });
          }

          const created = await Price.create({
            name,
            category: category._id,
            basePrice,
            difference,
            validTill,
            description,
            image: r.imageUrl || undefined,
          });

          results.push(created);
        }

        fs.unlinkSync(req.file.path);
        // populate categories
        const populated = await Price.find({ _id: { $in: results.map(x => x._id) } }).populate("category", "name");
        res.json({ success: true, inserted: populated.length, data: populated });
      });
  } catch (err) {
    console.error("importPrices error:", err);
    if (req.file && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * EXPORT CSV
 * Sends a CSV file of all prices to the client
 */
exports.exportPrices = async (req, res) => {
  try {
    const prices = await Price.find().populate("category", "name").sort({ createdAt: -1 });

    res.setHeader("Content-Disposition", `attachment; filename="prices_${Date.now()}.csv"`);
    res.setHeader("Content-Type", "text/csv");

    const csvStream = csv.format({ headers: true });
    csvStream.pipe(res);

    for (const p of prices) {
      csvStream.write({
        name: p.name,
        categoryName: p.category?.name || "",
        basePrice: p.basePrice,
        difference: p.difference,
        validTill: p.validTill ? p.validTill.toISOString().split("T")[0] : "",
        description: p.description || "",
        imageUrl: p.image || "",
      });
    }

    csvStream.end();
  } catch (err) {
    console.error("exportPrices error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};
