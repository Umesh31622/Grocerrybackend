// const Price = require("../models/priceModel");
// const Category = require("../models/categoryModel");
// const cloudinary = require("../utils/cloudinary");
// const csv = require("fast-csv");
// const mongoose = require("mongoose");

// // CLOUDINARY UPLOAD (unchanged)
// const uploadToCloudinary = (fileBuffer) => {
//   return new Promise((resolve, reject) => {
//     cloudinary.uploader
//       .upload_stream({ folder: "price_images" }, (err, result) => {
//         if (err) reject(err);
//         else resolve(result.secure_url);
//       })
//       .end(fileBuffer);
//   });
// };

// // STATUS LOGIC (same)
// function getStatusByValidTill(validTill) {
//   if (!validTill) return "inactive";

//   const now = new Date();
//   const vt = new Date(validTill);
//   const todayStr = now.toDateString();

//   if (vt < new Date(todayStr)) return "inactive";

//   const hour = now.getHours();
//   return hour >= 8 && hour <= 23 ? "active" : "inactive";
// }

// async function autoExpirePrices() {
//   const prices = await Price.find();
//   for (const p of prices) {
//     const newStatus = getStatusByValidTill(p.validTill);
//     if (p.status !== newStatus) {
//       await Price.findByIdAndUpdate(p._id, { status: newStatus });
//     }
//   }
// }

// /* ----------------- helper: resolve subcategory id -> embedded object ----------------- */
// async function resolveSubcategoryObject(categoryId, subcategoryIdOrName) {
//   if (!categoryId) return null;

//   const category = await Category.findById(categoryId);
//   if (!category) return null;

//   // if subcategoryIdOrName looks like an ObjectId, try by id first
//   if (subcategoryIdOrName) {
//     // by id
//     if (mongoose.Types.ObjectId.isValid(subcategoryIdOrName)) {
//       const sub = category.subcategories.id(subcategoryIdOrName);
//       if (sub) return { id: sub._id, name: sub.name, image: sub.image || null };
//     }

//     // by name fallback
//     const matchByName = category.subcategories.find(
//       (s) => s.name && s.name.toLowerCase() === String(subcategoryIdOrName).toLowerCase()
//     );
//     if (matchByName) {
//       return { id: matchByName._id, name: matchByName.name, image: matchByName.image || null };
//     }
//   }

//   return null;
// }

// /* CREATE PRICE */
// exports.createPrice = async (req, res) => {
//   try {
//     const {
//       name,
//       category,
//       subcategory, // expected as sub id string OR sub name (from frontend)
//       basePrice,
//       difference,
//       validTill,
//       description,
//     } = req.body;

//     let imageUrl = null;
//     if (req.file) imageUrl = await uploadToCloudinary(req.file.buffer);

//     const finalStatus = getStatusByValidTill(validTill);

//     // Resolve subcategory object (if provided)
//     const subObj = await resolveSubcategoryObject(category, subcategory);

//     const price = await Price.create({
//       name,
//       category,
//       subcategory: subObj, // null or {id, name, image}
//       basePrice: parseFloat(basePrice) || 0,
//       difference: parseFloat(difference) || 0,
//       validTill: validTill ? new Date(validTill) : undefined,
//       description,
//       status: finalStatus,
//       image: imageUrl,
//     });

//     // populate category only (subcategory is embedded)
//     const populated = await Price.findById(price._id).populate("category", "name");

//     res.status(201).json({ success: true, data: populated });
//   } catch (err) {
//     console.error("❌ createPrice error:", err);
//     res.status(500).json({ success: false, message: err.message });
//   }
// };

// /* GET ALL (ADMIN) */
// exports.getPrices = async (req, res) => {
//   try {
//     await autoExpirePrices();

//     const prices = await Price.find()
//       .populate("category", "name")
//       .sort({ createdAt: -1 });

//     // ensure finalPrice and consistent subcategory shape
//     const data = prices.map((p) => ({
//       ...p._doc,
//       finalPrice: Number(p.basePrice || 0) + Number(p.difference || 0),
//       // p.subcategory is already embedded or null
//       subcategory: p.subcategory || null,
//     }));

//     res.json({ success: true, data });
//   } catch (err) {
//     console.error("❌ getPrices error:", err);
//     res.status(500).json({ success: false, message: err.message });
//   }
// };

// /* WEBSITE API */
// exports.getWebsitePrices = async (req, res) => {
//   try {
//     const now = new Date();
//     const today = new Date(now.toDateString());
//     const hour = now.getHours();
//     const isTime = hour >= 8 && hour <= 23;

//     const prices = await Price.find({ validTill: { $gte: today } })
//       .populate("category", "name")
//       .sort({ createdAt: -1 });

//     const data = prices.map((p) => {
//       const finalAmt = Number(p.basePrice || 0) + Number(p.difference || 0);
//       return {
//         ...p._doc,
//         finalPrice: isTime ? finalAmt : null,
//         status: isTime ? "active" : "inactive",
//       };
//     });

//     res.json({ success: true, data });
//   } catch (err) {
//     console.error("❌ getWebsitePrices error:", err);
//     res.status(500).json({ success: false, message: err.message });
//   }
// };

// /* UPDATE PRICE */
// exports.updatePrice = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const {
//       name,
//       category,
//       subcategory, // id or name
//       basePrice,
//       difference,
//       validTill,
//       description,
//     } = req.body;

//     const updateData = {
//       name,
//       category,
//       basePrice: parseFloat(basePrice) || 0,
//       difference: parseFloat(difference) || 0,
//       validTill: validTill ? new Date(validTill) : undefined,
//       description,
//       status: getStatusByValidTill(validTill),
//     };

//     // resolve subcategory if given (else keep null)
//     const subObj = await resolveSubcategoryObject(category, subcategory);
//     updateData.subcategory = subObj || null;

//     if (req.file) {
//       updateData.image = await uploadToCloudinary(req.file.buffer);
//     }

//     const updated = await Price.findByIdAndUpdate(id, updateData, { new: true }).populate(
//       "category",
//       "name"
//     );

//     res.json({ success: true, data: updated });
//   } catch (err) {
//     console.error("❌ updatePrice error:", err);
//     res.status(500).json({ success: false, message: err.message });
//   }
// };

// /* UPDATE STATUS */
// exports.updateStatus = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const updated = await Price.findByIdAndUpdate(id, { status: req.body.status }, { new: true }).populate(
//       "category",
//       "name"
//     );
//     res.json({ success: true, data: updated });
//   } catch (err) {
//     console.error("❌ updateStatus error:", err);
//     res.status(500).json({ success: false, message: err.message });
//   }
// };

// /* DELETE */
// exports.deletePrice = async (req, res) => {
//   try {
//     await Price.findByIdAndDelete(req.params.id);
//     res.json({ success: true });
//   } catch (err) {
//     console.error("❌ deletePrice error:", err);
//     res.status(500).json({ success: false, message: err.message });
//   }
// };

// /* CSV IMPORT */
// exports.importPrices = async (req, res) => {
//   try {
//     if (!req.file) return res.status(400).json({ success: false, message: "CSV required" });

//     const rows = [];
//     const csvData = req.file.buffer.toString("utf-8");

//     csv
//       .parseString(csvData, { headers: true })
//       .on("data", (row) => rows.push(row))
//       .on("end", async () => {
//         const inserted = [];
//         for (const r of rows) {
//           const catName = (r.categoryName || r.category || "Uncategorized").trim();
//           const subName = r.subcategoryName?.trim() || null;

//           let category = await Category.findOne({ name: catName });
//           if (!category) category = await Category.create({ name: catName });

//           let subObj = null;
//           if (subName) {
//             const sub = category.subcategories.find(
//               (s) => s.name && s.name.toLowerCase() === subName.toLowerCase()
//             );
//             if (sub) subObj = { id: sub._id, name: sub.name, image: sub.image || null };
//           }

//           const price = await Price.create({
//             name: r.name,
//             category: category._id,
//             subcategory: subObj,
//             basePrice: Number(r.basePrice) || 0,
//             difference: Number(r.difference) || 0,
//             validTill: r.validTill ? new Date(r.validTill) : undefined,
//             status: getStatusByValidTill(r.validTill),
//           });

//           inserted.push(price);
//         }

//         res.json({ success: true, inserted: inserted.length });
//       });
//   } catch (err) {
//     console.error("❌ importPrices error:", err);
//     res.status(500).json({ success: false, message: err.message });
//   }
// };

// /* CSV EXPORT (ALL) */
// exports.exportPrices = async (req, res) => {
//   try {
//     const prices = await Price.find().populate("category", "name");

//     res.setHeader("Content-Disposition", `attachment; filename=prices_${Date.now()}.csv`);
//     res.setHeader("Content-Type", "text/csv");

//     const csvStream = csv.format({ headers: true });
//     csvStream.pipe(res);

//     for (const p of prices) {
//       csvStream.write({
//         name: p.name,
//         categoryName: p.category?.name || "",
//         subcategoryName: p.subcategory?.name || "",
//         basePrice: p.basePrice,
//         difference: p.difference,
//         finalPrice: (Number(p.basePrice || 0) + Number(p.difference || 0)).toFixed(2),
//         status: p.status,
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

// /* BULK UPDATE */
// exports.bulkUpdatePrices = async (req, res) => {
//   try {
//     const { products } = req.body;
//     const updated = [];
//     for (const p of products) {
//       const u = await Price.findByIdAndUpdate(
//         p.id,
//         {
//           name: p.name,
//           basePrice: p.basePrice,
//           difference: p.difference,
//           validTill: p.validTill,
//           status: getStatusByValidTill(p.validTill),
//         },
//         { new: true }
//       );
//       updated.push(u);
//     }
//     res.json({ success: true, updated });
//   } catch (err) {
//     console.error("❌ bulkUpdatePrices error:", err);
//     res.status(500).json({ success: false, message: err.message });
//   }
// };

// /* COPY PRODUCT */
// exports.copyPrice = async (req, res) => {
//   try {
//     const item = await Price.findById(req.params.id);
//     if (!item) return res.status(404).json({ success: false, message: "Not found" });

//     const newPrice = await Price.create({
//       name: item.name,
//       category: item.category,
//       subcategory: item.subcategory || null, // copy embedded object
//       basePrice: item.basePrice,
//       difference: item.difference,
//       validTill: item.validTill,
//       description: item.description,
//       status: item.status,
//       image: null,
//     });

//     res.json({ success: true, data: newPrice });
//   } catch (err) {
//     console.error("❌ copyPrice error:", err);
//     res.status(500).json({ success: false, message: err.message });
//   }
// };

const Price = require("../models/priceModel");
const Category = require("../models/categoryModel");
const cloudinary = require("../utils/cloudinary");
const csv = require("fast-csv");

// CLOUDINARY UPLOAD
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

// STATUS LOGIC
function getStatusByValidTill(validTill) {
  if (!validTill) return "inactive";

  const now = new Date();
  const vt = new Date(validTill);
  const todayStr = now.toDateString();

  if (vt < new Date(todayStr)) return "inactive";

  const hour = now.getHours();
  return hour >= 8 && hour <= 23 ? "active" : "inactive";
}

// AUTO EXPIRE
async function autoExpirePrices() {
  const prices = await Price.find();

  for (const p of prices) {
    const newStatus = getStatusByValidTill(p.validTill);
    if (p.status !== newStatus) {
      await Price.findByIdAndUpdate(p._id, { status: newStatus });
    }
  }
}

/* ------------------------------------------------------------------
   CREATE PRICE
------------------------------------------------------------------- */
exports.createPrice = async (req, res) => {
  try {
    const {
      name,
      category,
      subcategory,
      basePrice,
      difference,
      validTill,
      description,
    } = req.body;

    let imageUrl = null;
    if (req.file) {
      imageUrl = await uploadToCloudinary(req.file.buffer);
    }

    const finalStatus = getStatusByValidTill(validTill);

    const price = await Price.create({
      name,
      category,
      subcategory: subcategory || null,
      basePrice: parseFloat(basePrice),
      difference: parseFloat(difference) || 0,
      validTill: validTill ? new Date(validTill) : undefined,
      description,
      status: finalStatus,
      image: imageUrl,
    });

    const populated = await Price.findById(price._id)
      .populate("category", "name")
      .populate("subcategory", "name");

    res.status(201).json({ success: true, data: populated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* ------------------------------------------------------------------
   GET ALL (ADMIN)
------------------------------------------------------------------- */
exports.getPrices = async (req, res) => {
  try {
    await autoExpirePrices();

    const prices = await Price.find()
      .populate("category", "name")
      .populate("subcategory", "name")
      .sort({ createdAt: -1 });

    const data = prices.map((p) => ({
      ...p._doc,
      finalPrice: p.basePrice + (p.difference || 0),
    }));

    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* ------------------------------------------------------------------
   WEBSITE API
------------------------------------------------------------------- */
exports.getWebsitePrices = async (req, res) => {
  try {
    const now = new Date();
    const today = new Date(now.toDateString());
    const hour = now.getHours();
    const isTime = hour >= 8 && hour <= 23;

    const prices = await Price.find({
      validTill: { $gte: today }
    })
      .populate("category", "name")
      .populate("subcategory", "name")
      .sort({ createdAt: -1 });

    const data = prices.map((p) => {
      const finalAmt = p.basePrice + (p.difference || 0);
      return {
        ...p._doc,
        finalPrice: isTime ? finalAmt : null,
        status: isTime ? "active" : "inactive",
      };
    });

    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* ------------------------------------------------------------------
   UPDATE PRICE
------------------------------------------------------------------- */
exports.updatePrice = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      category,
      subcategory,
      basePrice,
      difference,
      validTill,
      description,
    } = req.body;

    const updateData = {
      name,
      category,
      subcategory: subcategory || null,
      basePrice: parseFloat(basePrice),
      difference: parseFloat(difference) || 0,
      validTill: validTill ? new Date(validTill) : undefined,
      description,
      status: getStatusByValidTill(validTill),
    };

    if (req.file) {
      updateData.image = await uploadToCloudinary(req.file.buffer);
    }

    const updated = await Price.findByIdAndUpdate(id, updateData, {
      new: true,
    })
      .populate("category", "name")
      .populate("subcategory", "name");

    res.json({ success: true, data: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* ------------------------------------------------------------------
   UPDATE STATUS
------------------------------------------------------------------- */
exports.updateStatus = async (req, res) => {
  try {
    const { id } = req.params;

    const updated = await Price.findByIdAndUpdate(
      id,
      { status: req.body.status },
      { new: true }
    )
      .populate("category", "name")
      .populate("subcategory", "name");

    res.json({ success: true, data: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* ------------------------------------------------------------------
   DELETE PRICE
------------------------------------------------------------------- */
exports.deletePrice = async (req, res) => {
  try {
    await Price.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* ------------------------------------------------------------------
   CSV IMPORT
------------------------------------------------------------------- */
exports.importPrices = async (req, res) => {
  try {
    if (!req.file)
      return res.status(400).json({ success: false, message: "CSV required" });

    const rows = [];
    const csvData = req.file.buffer.toString("utf-8");

    csv
      .parseString(csvData, { headers: true })
      .on("data", (row) => rows.push(row))
      .on("end", async () => {
        const inserted = [];

        for (const r of rows) {
          const catName = r.categoryName?.trim() || "Uncategorized";
          const subName = r.subcategoryName?.trim() || null;

          let category = await Category.findOne({ name: catName });
          if (!category) category = await Category.create({ name: catName });

          let subcategoryId = null;

          // find subcategory if exists
          if (subName) {
            const sub = category.subcategories.find(
              (s) => s.name.toLowerCase() === subName.toLowerCase()
            );
            if (sub) subcategoryId = sub._id;
          }

          const price = await Price.create({
            name: r.name,
            category: category._id,
            subcategory: subcategoryId,
            basePrice: Number(r.basePrice),
            difference: Number(r.difference),
            validTill: r.validTill ? new Date(r.validTill) : undefined,
            status: getStatusByValidTill(r.validTill),
          });

          inserted.push(price);
        }

        res.json({ success: true, inserted: inserted.length });
      });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* ------------------------------------------------------------------
   CSV EXPORT (ALL)
------------------------------------------------------------------- */
exports.exportPrices = async (req, res) => {
  try {
    const prices = await Price.find()
      .populate("category", "name")
      .populate("subcategory", "name");

    res.setHeader("Content-Disposition", "attachment; filename=prices.csv");
    res.setHeader("Content-Type", "text/csv");

    const csvStream = csv.format({ headers: true });
    csvStream.pipe(res);

    for (const p of prices) {
      csvStream.write({
        name: p.name,
        categoryName: p.category?.name || "",
        subcategoryName: p.subcategory?.name || "",
        basePrice: p.basePrice,
        difference: p.difference,
        finalPrice: p.basePrice + p.difference,
        status: p.status,
        validTill: p.validTill
          ? p.validTill.toISOString().split("T")[0]
          : "",
        description: p.description,
        imageUrl: p.image || "",
      });
    }

    csvStream.end();
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* ------------------------------------------------------------------
   BULK UPDATE (FIXED)
------------------------------------------------------------------- */
exports.bulkUpdatePrices = async (req, res) => {
  try {
    const { products } = req.body;

    const updated = [];

    for (const p of products) {
      const u = await Price.findByIdAndUpdate(
        p.id,
        {
          name: p.name,
          basePrice: p.basePrice,
          difference: p.difference,
          validTill: p.validTill,
          status: getStatusByValidTill(p.validTill),
        },
        { new: true }
      );

      updated.push(u);
    }

    res.json({ success: true, updated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* ------------------------------------------------------------------
   COPY PRODUCT
------------------------------------------------------------------- */
exports.copyPrice = async (req, res) => {
  try {
    const item = await Price.findById(req.params.id);

    const newPrice = await Price.create({
      name: item.name,
      category: item.category,
      subcategory: item.subcategory,
      basePrice: item.basePrice,
      difference: item.difference,
      validTill: item.validTill,
      description: item.description,
      status: item.status,
      image: null,
    });

    res.json({ success: true, data: newPrice });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

