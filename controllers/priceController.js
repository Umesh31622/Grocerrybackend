

// const Price = require("../models/priceModel");
// const Category = require("../models/categoryModel");
// const cloudinary = require("../utils/cloudinary");
// const csv = require("fast-csv");
// const schedule = require("node-schedule");

// // CLOUDINARY UPLOAD
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

// /* ============================================================
//    CREATE PRICE
// ============================================================ */
// exports.createPrice = async (req, res) => {
//   try {
//     const {
//       name,
//       category,
//       subcategory,
//       basePrice,
//       profitLoss,
//       description,
//       status,
//     } = req.body;

//     let imageUrl = null;
//     if (req.file) imageUrl = await uploadToCloudinary(req.file.buffer);

//     const base = Number(basePrice);
//     const pl = Number(profitLoss);
//     const sale = base + pl;

//     const price = await Price.create({
//       name,
//       category,
//       subcategory: subcategory || null,
//       basePrice: base,
//       profitLoss: pl,
//       salePrice: sale,

//       lockedPrice: 0,
//       yesterdayLock: 0,
//       brokerDisplay: 0, // Day-1 rule

//       description,
//       status,
//       image: imageUrl,
//     });

//     const populated = await Price.findById(price._id)
//       .populate("category", "name")
//       .lean();

//     res.status(201).json({ success: true, data: populated });
//   } catch (err) {
//     res.status(500).json({ success: false, message: err.message });
//   }
// };

// /* ============================================================
//    GET ALL
// ============================================================ */
// exports.getPrices = async (req, res) => {
//   try {
//     const prices = await Price.find()
//       .populate("category", "name")
//       .sort({ createdAt: -1 });

//     res.json({ success: true, data: prices });
//   } catch (err) {
//     res.status(500).json({ success: false, message: err.message });
//   }
// };

// /* ============================================================
//    WEBSITE ACTIVE API
// ============================================================ */
// exports.getWebsitePrices = async (req, res) => {
//   try {
//     const prices = await Price.find({ status: "active" })
//       .populate("category", "name")
//       .sort({ createdAt: -1 });

//     res.json({ success: true, data: prices });
//   } catch (err) {
//     res.status(500).json({ success: false, message: err.message });
//   }
// };

// /* ============================================================
//    UPDATE (BASE PRICE + PROFIT LOSS)
// ============================================================ */
// exports.updatePrice = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const body = req.body;

//     let item = await Price.findById(id);
//     if (!item)
//       return res.status(404).json({ success: false, message: "Not found" });

//     if (req.file) body.image = await uploadToCloudinary(req.file.buffer);

//     if (body.basePrice !== undefined) item.basePrice = Number(body.basePrice);
//     if (body.profitLoss !== undefined)
//       item.profitLoss = Number(body.profitLoss);

//     // Sale price always updates
//     item.salePrice = item.basePrice + item.profitLoss;

//     if (body.name) item.name = body.name;
//     if (body.description) item.description = body.description;
//     if (body.status) item.status = body.status;

//     // DO NOT TOUCH lockedPrice or brokerDisplay here

//     await item.save();

//     const updated = await Price.findById(id).populate("category", "name");
//     res.json({ success: true, data: updated });
//   } catch (err) {
//     res.status(500).json({ success: false, message: err.message });
//   }
// };

// /* ============================================================
//    QUICK UPDATE PROFIT/LOSS
// ============================================================ */
// exports.updateDiff = async (req, res) => {
//   try {
//     const id = req.params.id;
//     const diff = Number(req.body.diff);

//     let item = await Price.findById(id);
//     if (!item)
//       return res.status(404).json({ success: false, message: "Not found" });

//     item.profitLoss = diff; // overwrite
//     item.salePrice = item.basePrice + item.profitLoss;

//     // DO NOT TOUCH lock info

//     await item.save();

//     const updated = await Price.findById(id).populate("category", "name");
//     res.json({ success: true, data: updated });
//   } catch (err) {
//     res.status(500).json({ success: false, message: err.message });
//   }
// };

// /* ============================================================
//    STATUS CHANGE
// ============================================================ */
// exports.updateStatus = async (req, res) => {
//   try {
//     const updated = await Price.findByIdAndUpdate(
//       req.params.id,
//       { status: req.body.status },
//       { new: true }
//     );

//     res.json({ success: true, data: updated });
//   } catch (err) {
//     res.status(500).json({ success: false, message: err.message });
//   }
// };

// /* ============================================================
//    DELETE SINGLE
// ============================================================ */
// exports.deletePrice = async (req, res) => {
//   try {
//     await Price.findByIdAndDelete(req.params.id);
//     res.json({ success: true });
//   } catch (err) {
//     res.status(500).json({ success: false, message: err.message });
//   }
// };

// /* ============================================================
//    DELETE SELECTED
// ============================================================ */
// exports.deleteSelected = async (req, res) => {
//   try {
//     const { ids } = req.body;

//     await Price.deleteMany({ _id: { $in: ids } });

//     res.json({ success: true, deleted: ids.length });
//   } catch (err) {
//     res.status(500).json({ success: false, message: err.message });
//   }
// };

// /* ============================================================
//    COPY PRODUCT
// ============================================================ */
// exports.copyPrice = async (req, res) => {
//   try {
//     const item = await Price.findById(req.params.id);
//     if (!item) return res.json({ success: false });

//     const newItem = await Price.create({
//       name: item.name,
//       category: item.category,
//       subcategory: item.subcategory,
//       basePrice: item.basePrice,
//       profitLoss: item.profitLoss,
//       salePrice: item.salePrice,

//       lockedPrice: 0,
//       yesterdayLock: 0,
//       brokerDisplay: 0,

//       status: item.status,
//       description: item.description,
//       image: null,
//     });

//     res.json({ success: true, data: newItem });
//   } catch (err) {
//     res.status(500).json({ success: false, message: err.message });
//   }
// };

// /* ============================================================
//    BULK UPDATE
// ============================================================ */
// exports.bulkUpdatePrices = async (req, res) => {
//   try {
//     const { products } = req.body;
//     const updated = [];

//     for (const p of products) {
//       let item = await Price.findById(p.id);
//       if (!item) continue;

//       if (p.basePrice !== undefined) item.basePrice = Number(p.basePrice);
//       if (p.profitLoss !== undefined)
//         item.profitLoss = Number(p.profitLoss);

//       item.salePrice = item.basePrice + item.profitLoss;

//       if (p.status) item.status = p.status;

//       // DO NOT TOUCH lock price
//       await item.save();
//       updated.push(item);
//     }

//     res.json({ success: true, updated });
//   } catch (err) {
//     res.status(500).json({ success: false, message: err.message });
//   }
// };

// /* ============================================================
//    CSV IMPORT
// ============================================================ */
// exports.importPrices = async (req, res) => {
//   try {
//     if (!req.file)
//       return res.status(400).json({ success: false, message: "CSV required" });

//     const rows = [];
//     const csvData = req.file.buffer.toString("utf8");

//     csv
//       .parseString(csvData, { headers: true })
//       .on("data", (row) => rows.push(row))
//       .on("end", async () => {
//         for (const r of rows) {
//           let cat = await Category.findOne({ name: r.categoryName });
//           if (!cat) cat = await Category.create({ name: r.categoryName });

//           await Price.create({
//             name: r.name,
//             category: cat._id,
//             basePrice: Number(r.basePrice),
//             profitLoss: Number(r.profitLoss),
//             salePrice: Number(r.basePrice) + Number(r.profitLoss),

//             lockedPrice: 0,
//             brokerDisplay: 0,

//             description: r.description || "",
//             status: r.status || "inactive",
//             image: r.imageUrl || "",
//           });
//         }

//         res.json({ success: true, inserted: rows.length });
//       });
//   } catch (err) {
//     res.status(500).json({ success: false, message: err.message });
//   }
// };

// /* ============================================================
//    CSV EXPORT
// ============================================================ */
// exports.exportPrices = async (req, res) => {
//   try {
//     const prices = await Price.find().populate("category", "name");

//     res.setHeader("Content-Disposition", "attachment; filename=prices.csv");
//     res.setHeader("Content-Type", "text/csv");

//     const csvStream = csv.format({ headers: true });
//     csvStream.pipe(res);

//     for (const p of prices) {
//       csvStream.write({
//         id: p._id,
//         name: p.name,
//         categoryName: p.category?.name || "",
//         basePrice: p.basePrice,
//         profitLoss: p.profitLoss,
//         salePrice: p.salePrice,
//         lockedPrice: p.lockedPrice,
        
//         brokerDisplay: p.brokerDisplay,
//         status: p.status,
//         description: p.description,
//         imageUrl: p.image,
//       });
//     }

//     csvStream.end();
//   } catch (err) {
//     res.status(500).json({ success: false, message: err.message });
//   }
// };

// /* ============================================================
//    MIDNIGHT AUTO LOCK (FIXED)
// ============================================================ */
// schedule.scheduleJob("0 0 * * *", async () => {
//   try {
//     const items = await Price.find();

//     for (const p of items) {
//       const yesterday = p.lockedPrice;
//       const todayLock = p.salePrice;

//       p.yesterdayLock = yesterday;
//       p.lockedPrice = todayLock;

//       // FIXED LOGIC
//       if (yesterday === 0) {
//         p.brokerDisplay = 0;
//       } else {
//         p.brokerDisplay = todayLock - yesterday;
//       }

//       await p.save();
//     }

//     console.log("🔁 Midnight Lock Update Completed");
//   } catch (err) {
//     console.error("Midnight Error:", err);
//   }
// });



    const Price = require("../models/priceModel");
const cloudinary = require("../utils/cloudinary");
const csv = require("fast-csv");
const schedule = require("node-schedule");

/* CLOUDINARY UPLOAD */
const uploadToCloudinary = async (fileBuffer) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream({ folder: "price_images" }, (err, result) => {
        if (err) reject(err);
        else resolve(result.secure_url);
      })
      .end(fileBuffer);
  });
};

/* AUTO-LOCK LOGIC */
async function runDailyLock() {
  const today = new Date().toISOString().split("T")[0];
  const items = await Price.find();

  for (const p of items) {
    if (p.lastLockDate === today) continue;

    const yesterday = p.lockedPrice;
    const todayLock = p.salePrice;

    p.yesterdayLock = yesterday;
    p.lockedPrice = todayLock;
    p.brokerDisplay = yesterday === 0 ? 0 : todayLock - yesterday;
    p.lastLockDate = today;

    await p.save();
  }

  console.log("🔁 Daily Auto-Lock Updated");
}

/* GET ALL PRICES + TRIGGER LOCK */
exports.getPrices = async (req, res) => {
  try {
    await runDailyLock();

    const data = await Price.find()
      .populate("category", "name")
      .sort({ createdAt: -1 });

    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* GET WEBSITE ACTIVE PRICES */
exports.getWebsitePrices = async (req, res) => {
  try {
    await runDailyLock();

    const data = await Price.find({ status: "active" })
      .populate("category", "name")
      .sort({ createdAt: -1 });

    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* CREATE PRICE */
exports.createPrice = async (req, res) => {
  try {
    const body = req.body;

    let imageUrl = null;
    if (req.file) imageUrl = await uploadToCloudinary(req.file.buffer);

    const base = Number(body.basePrice);
    const pl = Number(body.profitLoss);
    const sale = base + pl;

    const price = await Price.create({
      name: body.name,
      category: body.category,
      subcategory: body.subcategory || null,

      basePrice: base,
      profitLoss: pl,
      salePrice: sale,

      lockedPrice: 0,
      yesterdayLock: 0,
      brokerDisplay: 0,
      lastLockDate: "",

      description: body.description,
      status: body.status || "inactive",
      image: imageUrl,
    });

    const populated = await Price.findById(price._id).populate("category", "name");

    res.status(201).json({ success: true, data: populated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* UPDATE PRICE */
exports.updatePrice = async (req, res) => {
  try {
    const id = req.params.id;

    let item = await Price.findById(id);
    if (!item) return res.status(404).json({ success: false, message: "Not Found" });

    if (req.file) item.image = await uploadToCloudinary(req.file.buffer);

    if (req.body.basePrice !== undefined)
      item.basePrice = Number(req.body.basePrice);

    if (req.body.profitLoss !== undefined)
      item.profitLoss = Number(req.body.profitLoss);

    item.salePrice = item.basePrice + item.profitLoss;

    if (req.body.name) item.name = req.body.name;
    if (req.body.description) item.description = req.body.description;
    if (req.body.status) item.status = req.body.status;

    await item.save();

    const updated = await Price.findById(id).populate("category", "name");

    res.json({ success: true, data: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* QUICK PROFIT/LOSS UPDATE */
exports.updateDiff = async (req, res) => {
  try {
    const id = req.params.id;
    const diff = Number(req.body.diff);

    let item = await Price.findById(id);
    if (!item) return res.status(404).json({ success: false });

    item.profitLoss = diff;
    item.salePrice = item.basePrice + diff;

    await item.save();

    const updated = await Price.findById(id).populate("category", "name");

    res.json({ success: true, data: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* STATUS CHANGE */
exports.updateStatus = async (req, res) => {
  try {
    const updated = await Price.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );

    res.json({ success: true, data: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* DELETE SINGLE */
exports.deletePrice = async (req, res) => {
  try {
    await Price.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* DELETE SELECTED */
exports.deleteSelected = async (req, res) => {
  try {
    await Price.deleteMany({ _id: { $in: req.body.ids } });
    res.json({ success: true, deleted: req.body.ids.length });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* COPY PRICE */
exports.copyPrice = async (req, res) => {
  try {
    const item = await Price.findById(req.params.id);
    if (!item) return res.json({ success: false });

    const newItem = await Price.create({
      name: item.name,
      category: item.category,
      subcategory: item.subcategory,
      basePrice: item.basePrice,
      profitLoss: item.profitLoss,
      salePrice: item.salePrice,
      lockedPrice: 0,
      yesterdayLock: 0,
      brokerDisplay: 0,
      lastLockDate: "",
      status: item.status,
      description: item.description,
      image: null,
    });

    res.json({ success: true, data: newItem });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* BULK UPDATE */
exports.bulkUpdatePrices = async (req, res) => {
  try {
    const updated = [];

    for (const p of req.body.products) {
      let item = await Price.findById(p.id);
      if (!item) continue;

      if (p.basePrice !== undefined)
        item.basePrice = Number(p.basePrice);

      if (p.profitLoss !== undefined)
        item.profitLoss = Number(p.profitLoss);

      item.salePrice = item.basePrice + item.profitLoss;
      if (p.status) item.status = p.status;

      await item.save();
      updated.push(item);
    }

    res.json({ success: true, updated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* IMPORT CSV (WITH IMAGE SUPPORT) */
exports.importPrices = async (req, res) => {
  try {
    if (!req.file)
      return res.status(400).json({ success: false, message: "CSV required" });

    const file = req.file.buffer.toString("utf-8");
    const rows = [];

    csv.parseString(file, { headers: true })
      .on("data", (row) => rows.push(row))
      .on("end", async () => {
        let imported = [];

        for (const r of rows) {
          let img = "";

          if (r.image && r.image.startsWith("http")) {
            const upload = await cloudinary.uploader.upload(r.image, {
              folder: "price_images",
            });
            img = upload.secure_url;
          }

          if (r.image && r.image.startsWith("data:image")) {
            const upload = await cloudinary.uploader.upload(r.image, {
              folder: "price_images",
            });
            img = upload.secure_url;
          }

          const base = Number(r.basePrice || 0);
          const pl = Number(r.profitLoss || 0);
          const sale = base + pl;

          const price = await Price.create({
            name: r.name,
            category: r.category,
            subcategory: r.subcategory || null,
            basePrice: base,
            profitLoss: pl,
            salePrice: sale,
            lockedPrice: sale,
            yesterdayLock: sale,
            brokerDisplay: 0,
            description: r.description || "",
            status: r.status || "inactive",
            image: img,
          });

          imported.push(price);
        }

        res.json({ success: true, imported: imported.length, items: imported });
      });

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* EXPORT SELECTED */
exports.exportSelected = async (req, res) => {
  try {
    const prices = await Price.find({ _id: { $in: req.body.ids } }).populate(
      "category",
      "name"
    );

    res.setHeader("Content-Disposition", "attachment; filename=selected_prices.csv");
    res.setHeader("Content-Type", "text/csv");

    const csvStream = csv.format({ headers: true });
    csvStream.pipe(res);

    prices.forEach((p) => {
      csvStream.write({
        id: p._id,
        name: p.name,
        category: p.category?.name || "",
        basePrice: p.basePrice,
        profitLoss: p.profitLoss,
        salePrice: p.salePrice,
        lockedPrice: p.lockedPrice,
        yesterdayLock: p.yesterdayLock,
        brokerDisplay: p.brokerDisplay,
        status: p.status,
        image: p.image,
      });
    });

    csvStream.end();
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* EXPORT ALL */
exports.exportPrices = async (req, res) => {
  try {
    const prices = await Price.find().populate("category", "name");

    res.setHeader("Content-Disposition", "attachment; filename=prices.csv");
    res.setHeader("Content-Type", "text/csv");

    const csvStream = csv.format({ headers: true });
    csvStream.pipe(res);

    prices.forEach((p) => {
      csvStream.write({
        id: p._id,
        name: p.name,
        category: p.category?.name || "",
        basePrice: p.basePrice,
        profitLoss: p.profitLoss,
        salePrice: p.salePrice,
        lockedPrice: p.lockedPrice,
        yesterdayLock: p.yesterdayLock,
        brokerDisplay: p.brokerDisplay,
        status: p.status,
        image: p.image,
      });
    });

    csvStream.end();
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* MIDNIGHT AUTO LOCK */
schedule.scheduleJob("0 0 * * *", async () => {
  try {
    await runDailyLock();
    console.log("🌙 Midnight Auto-Lock Executed");
  } catch (err) {
    console.log("Midnight Error:", err.message);
  }
});
