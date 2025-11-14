// const Price = require("../models/priceModel");
// const Category = require("../models/categoryModel");
// const cloudinary = require("../utils/cloudinary");
// const csv = require("fast-csv");

// // CREATE PRICE
// exports.createPrice = async (req, res) => {
//   try {
//     const { name, category, basePrice, difference, validTill, description } = req.body;
//     let imageUrl = null;

//     if (req.file) {
//       const result = await cloudinary.uploader.upload_stream(
//         { folder: "price_images" },
//         (error, uploadResult) => {
//           if (error) throw error;
//           imageUrl = uploadResult.secure_url;
//         }
//       );
//     }

//     const cat =
//       typeof category === "string" && category.match(/^[0-9a-fA-F]{24}$/)
//         ? category
//         : null;

//     const price = await Price.create({
//       name,
//       category: cat || category,
//       basePrice: parseFloat(basePrice) || 0,
//       difference: parseFloat(difference) || 0,
//       validTill: validTill ? new Date(validTill) : undefined,
//       description,
//       image: imageUrl,
//     });

//     const populated = await Price.findById(price._id).populate("category", "name");
//     res.status(201).json({ success: true, data: populated });
//   } catch (err) {
//     console.error("❌ createPrice error:", err);
//     res.status(500).json({ success: false, message: err.message });
//   }
// };

// // GET ALL PRICES
// exports.getPrices = async (req, res) => {
//   try {
//     const prices = await Price.find().populate("category", "name").sort({ createdAt: -1 });
//     const data = prices.map((p) => ({
//       ...p._doc,
//       finalPrice: p.basePrice + (p.difference || 0),
//     }));
//     res.json({ success: true, data });
//   } catch (err) {
//     console.error("❌ getPrices error:", err);
//     res.status(500).json({ success: false, message: err.message });
//   }
// };

// // UPDATE PRICE
// exports.updatePrice = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { name, category, basePrice, difference, validTill, description } = req.body;
//     const updateData = {
//       name,
//       category,
//       basePrice: parseFloat(basePrice) || 0,
//       difference: parseFloat(difference) || 0,
//       validTill: validTill ? new Date(validTill) : undefined,
//       description,
//     };

//     const updated = await Price.findByIdAndUpdate(id, updateData, {
//       new: true,
//     }).populate("category", "name");

//     res.json({ success: true, data: updated });
//   } catch (err) {
//     console.error("❌ updatePrice error:", err);
//     res.status(500).json({ success: false, message: err.message });
//   }
// };

// // DELETE PRICE
// exports.deletePrice = async (req, res) => {
//   try {
//     const { id } = req.params;
//     await Price.findByIdAndDelete(id);
//     res.json({ success: true, message: "Deleted successfully" });
//   } catch (err) {
//     console.error("❌ deletePrice error:", err);
//     res.status(500).json({ success: false, message: err.message });
//   }
// };

// // 📥 IMPORT CSV (Vercel-safe, memory buffer)
// exports.importPrices = async (req, res) => {
//   try {
//     console.log("📥 Import request received...");

//     if (!req.file || !req.file.buffer) {
//       return res.status(400).json({ success: false, message: "CSV file is required" });
//     }

//     const csvData = req.file.buffer.toString("utf-8");
//     const fileRows = [];

//     const parser = csv.parseString(csvData, {
//       headers: true,
//       ignoreEmpty: true,
//       trim: true,
//     });

//     parser
//       .on("error", (error) => {
//         console.error("❌ CSV parsing error:", error.message);
//         return res.status(500).json({ success: false, message: "Invalid CSV format" });
//       })
//       .on("data", (row) => {
//         fileRows.push(row);
//       })
//       .on("end", async () => {
//         console.log(`✅ Parsed ${fileRows.length} rows`);

//         if (fileRows.length === 0) {
//           return res.status(400).json({ success: false, message: "Empty CSV file" });
//         }

//         const results = [];

//         for (const r of fileRows) {
//           try {
//             const name = r.name || r.product || "";
//             const catName = (r.categoryName || r.category || "Uncategorized").trim();
//             const basePrice = parseFloat(r.basePrice || r.price || 0) || 0;
//             const difference = parseFloat(r.difference || 0) || 0;
//             const validTill = r.validTill ? new Date(r.validTill) : undefined;
//             const description = r.description || r.desc || "";
//             const imageUrl =
//               r.imageUrl && r.imageUrl.startsWith("http") ? r.imageUrl : undefined;

//             let category = await Category.findOne({ name: catName });
//             if (!category) {
//               category = await Category.create({ name: catName });
//               console.log("🆕 Created new category:", catName);
//             }

//             const created = await Price.create({
//               name,
//               category: category._id,
//               basePrice,
//               difference,
//               validTill,
//               description,
//               image: imageUrl,
//             });

//             results.push(created);
//           } catch (err) {
//             console.error("❌ Row import failed:", err.message);
//           }
//         }

//         const populated = await Price.find({
//           _id: { $in: results.map((x) => x._id) },
//         }).populate("category", "name");

//         console.log(`✅ Successfully imported ${populated.length} prices`);
//         res.json({
//           success: true,
//           inserted: populated.length,
//           data: populated,
//         });
//       });
//   } catch (err) {
//     console.error("🔥 importPrices error:", err);
//     res.status(500).json({ success: false, message: err.message });
//   }
// };

// // 📤 EXPORT CSV
// exports.exportPrices = async (req, res) => {
//   try {
//     const prices = await Price.find().populate("category", "name").sort({ createdAt: -1 });

//     res.setHeader("Content-Disposition", `attachment; filename="prices_${Date.now()}.csv"`);
//     res.setHeader("Content-Type", "text/csv");

//     const csvStream = csv.format({ headers: true });
//     csvStream.pipe(res);

//     for (const p of prices) {
//       csvStream.write({
//         name: p.name,
//         categoryName: p.category?.name || "",
//         basePrice: p.basePrice,
//         difference: p.difference,
//         validTill: p.validTill ? p.validTill.toISOString().split("T")[0] : "",
//         description: p.description || "",
//         imageUrl: p.image || "",
//       });
//     }

//     csvStream.end();
//   } catch (err) {
//     console.error("❌ exportPrices error:", err);
//     res.status(500).json({ success: false, message: err.message });
//   }
// };


const Price = require("../models/priceModel");
const Category = require("../models/categoryModel");
const cloudinary = require("../utils/cloudinary");
const csv = require("fast-csv");

// Cloudinary upload helper
const uploadToCloudinary = (fileBuffer) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream({ folder: "price_images" }, (err, result) => {
        if (err) reject(err);
        else resolve(result.secure_url);
      })
      .end(fileBuffer);
  });
};

/* =====================================================
   AUTO EXPIRE FUNCTION
===================================================== */
async function autoExpirePrices() {
  const now = new Date();
  await Price.updateMany(
    { validTill: { $lte: now }, status: "active" },
    { $set: { status: "inactive" } }
  );
}

/* =====================================================
   CREATE PRICE
===================================================== */
exports.createPrice = async (req, res) => {
  try {
    const {
      name,
      category,
      basePrice,
      difference,
      validTill,
      description,
      status,
    } = req.body;

    let imageUrl = null;
    if (req.file) {
      imageUrl = await uploadToCloudinary(req.file.buffer);
    }

    const cat =
      typeof category === "string" && category.match(/^[0-9a-fA-F]{24}$/)
        ? category
        : null;

    let finalStatus = status || "active";

    // Auto Activate / Inactivate
    if (validTill) {
      const vt = new Date(validTill);
      if (vt > new Date()) finalStatus = "active";
      else finalStatus = "inactive";
    }

    const price = await Price.create({
      name,
      category: cat || category,
      basePrice: parseFloat(basePrice) || 0,
      difference: parseFloat(difference) || 0,
      validTill: validTill ? new Date(validTill) : undefined,
      description,
      status: finalStatus,
      image: imageUrl,
    });

    const populated = await Price.findById(price._id).populate(
      "category",
      "name"
    );

    res.status(201).json({ success: true, data: populated });
  } catch (err) {
    console.error("❌ createPrice error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

/* =====================================================
   GET ALL PRICES
===================================================== */
exports.getPrices = async (req, res) => {
  try {
    await autoExpirePrices();

    const prices = await Price.find()
      .populate("category", "name")
      .sort({ createdAt: -1 });

    const data = prices.map((p) => ({
      ...p._doc,
      finalPrice: p.basePrice + (p.difference || 0),
    }));

    res.json({ success: true, data });
  } catch (err) {
    console.error("❌ getPrices error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

/* =====================================================
   UPDATE PRICE
===================================================== */
exports.updatePrice = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      category,
      basePrice,
      difference,
      validTill,
      description,
      status,
    } = req.body;

    const existing = await Price.findById(id);

    let updateData = {
      name,
      category,
      basePrice: parseFloat(basePrice) || 0,
      difference: parseFloat(difference) || 0,
      validTill: validTill ? new Date(validTill) : existing.validTill,
      description,
    };

    if (status) updateData.status = status;

    if (req.file) {
      updateData.image = await uploadToCloudinary(req.file.buffer);
    }

    const now = new Date();
    const newValidTill = new Date(updateData.validTill);

    if (existing.status === "inactive" && newValidTill > now && !status) {
      updateData.status = "active";
    }

    const updated = await Price.findByIdAndUpdate(id, updateData, {
      new: true,
    }).populate("category", "name");

    res.json({ success: true, data: updated });
  } catch (err) {
    console.error("❌ updatePrice error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

/* =====================================================
   UPDATE STATUS ONLY
===================================================== */
exports.updateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["active", "inactive"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status value",
      });
    }

    const updated = await Price.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    ).populate("category", "name");

    res.json({ success: true, data: updated });
  } catch (err) {
    console.error("❌ updateStatus error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

/* =====================================================
   DELETE PRICE
===================================================== */
exports.deletePrice = async (req, res) => {
  try {
    await Price.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Deleted successfully" });
  } catch (err) {
    console.error("❌ deletePrice error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

/* =====================================================
   IMPORT CSV
===================================================== */
exports.importPrices = async (req, res) => {
  try {
    if (!req.file || !req.file.buffer) {
      return res
        .status(400)
        .json({ success: false, message: "CSV file is required" });
    }

    const csvData = req.file.buffer.toString("utf-8");
    const fileRows = [];

    csv
      .parseString(csvData, { headers: true, ignoreEmpty: true, trim: true })
      .on("data", (row) => fileRows.push(row))
      .on("end", async () => {
        const results = [];

        for (const r of fileRows) {
          try {
            const name = r.name || "";
            const catName =
              (r.categoryName || r.category || "Uncategorized").trim();
            const basePrice = parseFloat(r.basePrice || 0) || 0;
            const difference = parseFloat(r.difference || 0) || 0;
            const validTill = r.validTill ? new Date(r.validTill) : undefined;
            const description = r.description || "";
            const status = r.status === "inactive" ? "inactive" : "active";
            const imageUrl =
              r.imageUrl?.startsWith("http") ? r.imageUrl : undefined;

            let category = await Category.findOne({ name: catName });
            if (!category) category = await Category.create({ name: catName });

            const created = await Price.create({
              name,
              category: category._id,
              basePrice,
              difference,
              validTill,
              description,
              status,
              image: imageUrl,
            });

            results.push(created);
          } catch (err) {
            console.error("❌ CSV row error:", err.message);
          }
        }

        const populated = await Price.find({
          _id: { $in: results.map((x) => x._id) },
        }).populate("category", "name");

        res.json({ success: true, inserted: populated.length, data: populated });
      });
  } catch (err) {
    console.error("🔥 importPrices error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

/* =====================================================
   EXPORT CSV
===================================================== */
exports.exportPrices = async (req, res) => {
  try {
    const prices = await Price.find()
      .populate("category", "name")
      .sort({ createdAt: -1 });

    res.setHeader(
      "Content-Disposition",
      `attachment; filename="prices_${Date.now()}.csv"`
    );
    res.setHeader("Content-Type", "text/csv");

    const csvStream = csv.format({ headers: true });
    csvStream.pipe(res);

    for (const p of prices) {
      csvStream.write({
        name: p.name,
        categoryName: p.category?.name || "",
        basePrice: p.basePrice,
        difference: p.difference,
        status: p.status,
        validTill: p.validTill
          ? p.validTill.toISOString().split("T")[0]
          : "",
        description: p.description || "",
        imageUrl: p.image || "",
      });
    }

    csvStream.end();
  } catch (err) {
    console.error("❌ exportPrices error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

/* =====================================================
   ⭐ BULK UPDATE PRICES (Name + BasePrice + Difference)
===================================================== */
exports.bulkUpdatePrices = async (req, res) => {
  try {
    const { products } = req.body;

    if (!Array.isArray(products) || products.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Products array is required",
      });
    }

    const results = [];

    for (const item of products) {
      try {
        const { id, name, basePrice, difference, validTill, status } = item;

        const existing = await Price.findById(id);
        if (!existing) continue;

        let updateData = {};

        if (name !== undefined) updateData.name = name;
        if (basePrice !== undefined)
          updateData.basePrice = parseFloat(basePrice) || 0;
        if (difference !== undefined)
          updateData.difference = parseFloat(difference) || 0;

        if (validTill !== undefined) {
          updateData.validTill = new Date(validTill);

          // Auto activate/inactivate
          if (new Date(validTill) > new Date()) {
            updateData.status = "active";
          } else {
            updateData.status = "inactive";
          }
        }

        if (status !== undefined) updateData.status = status;

        const updated = await Price.findByIdAndUpdate(id, updateData, {
          new: true,
        }).populate("category", "name");

        results.push(updated);
      } catch (err) {
        console.error("❌ bulk item update error:", err.message);
      }
    }

    res.json({
      success: true,
      updatedCount: results.length,
      data: results,
    });
  } catch (err) {
    console.error("🔥 bulkUpdatePrices error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};
