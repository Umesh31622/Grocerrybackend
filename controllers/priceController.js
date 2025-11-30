
// const Price = require("../models/priceModel");
// const cloudinary = require("../utils/cloudinary");
// const csv = require("fast-csv");
// const schedule = require("node-schedule");

// /* CLOUDINARY UPLOAD (buffer -> secure_url) */
// const uploadToCloudinary = (fileBuffer) => {
//   return new Promise((resolve, reject) => {
//     cloudinary.uploader
//       .upload_stream({ folder: "price_images" }, (err, result) => {
//         if (err) return reject(err);
//         resolve(result.secure_url);
//       })
//       .end(fileBuffer);
//   });
// };

// /* AUTO-LOCK: runDailyLock()
//    - Only sets lockedPrice once per day (uses lastLockDate)
//    - lockedPrice becomes current salePrice (which reflects latest daytime changes)
//    - yesterdayLock set to previous lockedPrice
//    - brokerDisplay = lockedPrice - yesterdayLock (or 0 when yesterdayLock === 0)
// */
// async function runDailyLock() {
//   const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
//   const items = await Price.find();

//   for (const p of items) {
//     if (p.lastLockDate === today) continue; // already locked today

//     const previousLocked = p.lockedPrice || 0;
//     const todayLock = p.salePrice || 0;

//     p.yesterdayLock = previousLocked;
//     p.lockedPrice = todayLock;
//     p.brokerDisplay = previousLocked === 0 ? 0 : todayLock - previousLocked;
//     p.lastLockDate = today;

//     await p.save();
//   }

//   console.log("🔁 Daily Auto-Lock Updated:", today);
// }

// /* ===========================
//    Exports - controllers
//    =========================== */

// /* GET ALL PRICES (runs lock check first) */
// exports.getPrices = async (req, res) => {
//   try {
//     await runDailyLock();

//     const data = await Price.find()
//       .populate("category", "name")
//       .sort({ createdAt: -1 });

//     res.json({ success: true, data });
//   } catch (err) {
//     res.status(500).json({ success: false, message: err.message });
//   }
// };

// /* GET WEBSITE ACTIVE PRICES */
// exports.getWebsitePrices = async (req, res) => {
//   try {
//     await runDailyLock();

//     const data = await Price.find({ status: "active" })
//       .populate("category", "name")
//       .sort({ createdAt: -1 });

//     res.json({ success: true, data });
//   } catch (err) {
//     res.status(500).json({ success: false, message: err.message });
//   }
// };

// /* CREATE PRICE
//    - lockedPrice stays 0 on creation (so new items don't immediately fill lock)
//    - salePrice = basePrice + profitLoss
// */
// exports.createPrice = async (req, res) => {
//   try {
//     const body = req.body;
//     let imageUrl = null;
//     if (req.file) imageUrl = await uploadToCloudinary(req.file.buffer);

//     const base = Number(body.basePrice || 0);
//     const pl = Number(body.profitLoss || 0);
//     const sale = base + pl;

//     const price = await Price.create({
//       name: body.name,
//       category: body.category,
//       subcategory: body.subcategory || null,
//       basePrice: base,
//       profitLoss: pl,
//       salePrice: sale,
//       // keep locks zero on creation
//       lockedPrice: 0,
//       yesterdayLock: 0,
//       brokerDisplay: 0,
//       lastLockDate: "",

//       description: body.description || "",
//       status: body.status || "inactive",
//       image: imageUrl || "",
//     });

//     const populated = await Price.findById(price._id).populate("category", "name");
//     res.status(201).json({ success: true, data: populated });
//   } catch (err) {
//     res.status(500).json({ success: false, message: err.message });
//   }
// };

// /* UPDATE PRICE (base/profitLoss/name/status/image)
//    - Does NOT touch lockedPrice/yesterdayLock/lastLockDate — lock only at midnight
// */
// exports.updatePrice = async (req, res) => {
//   try {
//     const id = req.params.id;
//     let item = await Price.findById(id);
//     if (!item) return res.status(404).json({ success: false, message: "Not Found" });

//     if (req.file) {
//       item.image = await uploadToCloudinary(req.file.buffer);
//     }

//     if (req.body.basePrice !== undefined) item.basePrice = Number(req.body.basePrice);
//     if (req.body.profitLoss !== undefined) item.profitLoss = Number(req.body.profitLoss);

//     // always keep salePrice synced with base+profit
//     item.salePrice = (item.basePrice || 0) + (item.profitLoss || 0);

//     if (req.body.name) item.name = req.body.name;
//     if (req.body.description) item.description = req.body.description;
//     if (req.body.status) item.status = req.body.status;

//     await item.save();

//     const updated = await Price.findById(id).populate("category", "name");
//     res.json({ success: true, data: updated });
//   } catch (err) {
//     res.status(500).json({ success: false, message: err.message });
//   }
// };

// /* QUICK PROFIT/LOSS UPDATE (updateDiff) */
// exports.updateDiff = async (req, res) => {
//   try {
//     const id = req.params.id;
//     const diff = Number(req.body.diff);

//     let item = await Price.findById(id);
//     if (!item) return res.status(404).json({ success: false, message: "Not Found" });

//     item.profitLoss = diff;
//     item.salePrice = (item.basePrice || 0) + diff;

//     await item.save();

//     const updated = await Price.findById(id).populate("category", "name");
//     res.json({ success: true, data: updated });
//   } catch (err) {
//     res.status(500).json({ success: false, message: err.message });
//   }
// };

// /* STATUS CHANGE */
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

// /* DELETE SINGLE */
// exports.deletePrice = async (req, res) => {
//   try {
//     await Price.findByIdAndDelete(req.params.id);
//     res.json({ success: true });
//   } catch (err) {
//     res.status(500).json({ success: false, message: err.message });
//   }
// };

// /* DELETE SELECTED */
// exports.deleteSelected = async (req, res) => {
//   try {
//     const ids = req.body.ids || [];
//     await Price.deleteMany({ _id: { $in: ids } });
//     res.json({ success: true, deleted: ids.length });
//   } catch (err) {
//     res.status(500).json({ success: false, message: err.message });
//   }
// };

// /* COPY PRICE */
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
//       lastLockDate: "",
//       status: item.status,
//       description: item.description,
//       image: null,
//     });

//     res.json({ success: true, data: newItem });
//   } catch (err) {
//     res.status(500).json({ success: false, message: err.message });
//   }
// };

// /* BULK UPDATE */
// exports.bulkUpdatePrices = async (req, res) => {
//   try {
//     const products = req.body.products || [];
//     const updated = [];

//     for (const p of products) {
//       let item = await Price.findById(p.id);
//       if (!item) continue;

//       if (p.basePrice !== undefined) item.basePrice = Number(p.basePrice);
//       if (p.profitLoss !== undefined) item.profitLoss = Number(p.profitLoss);

//       item.salePrice = (item.basePrice || 0) + (item.profitLoss || 0);
//       if (p.status) item.status = p.status;

//       await item.save();
//       updated.push(item);
//     }

//     res.json({ success: true, updated });
//   } catch (err) {
//     res.status(500).json({ success: false, message: err.message });
//   }
// };

// /* IMPORT CSV
//    - Expects CSV headers: name, category, basePrice, profitLoss, description, status, image (image can be URL or base64)
//    - On import I set lockedPrice = 0 and yesterdayLock = 0 (to avoid accidental locks on import)
// */
// exports.importPrices = async (req, res) => {
//   try {
//     if (!req.file) return res.status(400).json({ success: false, message: "CSV required" });

//     const file = req.file.buffer.toString("utf-8");
//     const rows = [];

//     csv.parseString(file, { headers: true })
//       .on("data", (row) => rows.push(row))
//       .on("end", async () => {
//         const imported = [];

//         for (const r of rows) {
//           let img = "";
//           // if URL or base64, try upload, else leave empty
//           try {
//             if (r.image && (r.image.startsWith("http") || r.image.startsWith("data:image"))) {
//               const upload = await cloudinary.uploader.upload(r.image, { folder: "price_images" });
//               img = upload.secure_url;
//             }
//           } catch (uploadErr) {
//             console.warn("Image upload failed for row, continuing without image", uploadErr.message);
//           }

//           const base = Number(r.basePrice || 0);
//           const pl = Number(r.profitLoss || 0);

//           const price = await Price.create({
//             name: r.name,
//             category: r.category || null,
//             subcategory: r.subcategory || null,
//             basePrice: base,
//             profitLoss: pl,
//             salePrice: base + pl,
//             // imports should NOT auto-fill lock (keep zero) so the midnight job will lock properly
//             lockedPrice: 0,
//             yesterdayLock: 0,
//             brokerDisplay: 0,
//             lastLockDate: "",
//             description: r.description || "",
//             status: r.status || "inactive",
//             image: img,
//           });

//           imported.push(price);
//         }

//         res.json({ success: true, imported: imported.length });
//       });
//   } catch (err) {
//     res.status(500).json({ success: false, message: err.message });
//   }
// };

// /* EXPORT SELECTED */
// exports.exportSelected = async (req, res) => {
//   try {
//     const ids = req.body.ids || [];
//     const prices = await Price.find({ _id: { $in: ids } }).populate("category", "name");

//     res.setHeader("Content-Disposition", "attachment; filename=selected_prices.csv");
//     res.setHeader("Content-Type", "text/csv");

//     const csvStream = csv.format({ headers: true });
//     csvStream.pipe(res);

//     for (const p of prices) {
//       csvStream.write({
//         id: p._id,
//         name: p.name,
//         category: p.category?.name || "",
//         basePrice: p.basePrice,
//         profitLoss: p.profitLoss,
//         salePrice: p.salePrice,
//         lockedPrice: p.lockedPrice,
//         yesterdayLock: p.yesterdayLock,
//         brokerDisplay: p.brokerDisplay,
//         status: p.status,
//         image: p.image,
//       });
//     }

//     csvStream.end();
//   } catch (err) {
//     res.status(500).json({ success: false, message: err.message });
//   }
// };

// /* EXPORT ALL */
// exports.exportPrices = async (req, res) => {
//   try {
//     const prices = await Price.find().populate("category", "name");

//     res.setHeader("Content-Disposition", "attachment; filename=prices.csv");
//     res.setHeader("Content-Type", "text/csv");

//     const csvStream = csv.format({ headers: true });
//     csvStream.pipe(res);

//     prices.forEach((p) => {
//       csvStream.write({
//         id: p._id,
//         name: p.name,
//         category: p.category?.name || "",
//         basePrice: p.basePrice,
//         profitLoss: p.profitLoss,
//         salePrice: p.salePrice,
//         lockedPrice: p.lockedPrice,
//         yesterdayLock: p.yesterdayLock,
//         brokerDisplay: p.brokerDisplay,
//         status: p.status,
//         image: p.image,
//       });
//     });

//     csvStream.end();
//   } catch (err) {
//     res.status(500).json({ success: false, message: err.message });
//   }
// };

// /* schedule: run at midnight server time (0 0 * * *) */
// schedule.scheduleJob("0 0 * * *", async () => {
//   try {
//     await runDailyLock();
//     console.log("🌙 Midnight Auto-Lock Executed");
//   } catch (err) {
//     console.error("Midnight Error:", err.message);
//   }
// });
const Price = require("../models/priceModel");
const cloudinary = require("../utils/cloudinary");
const csv = require("fast-csv");
const schedule = require("node-schedule");

/* Upload to Cloudinary */
const uploadToCloudinary = (fileBuffer) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream({ folder: "price_images" }, (err, result) => {
        if (err) return reject(err);
        resolve(result.secure_url);
      })
      .end(fileBuffer);
  });
};

/* MIDNIGHT AUTO LOCK */
async function runDailyLock() {
  const today = new Date().toISOString().split("T")[0];
  const items = await Price.find();

  for (const p of items) {
    if (p.lastLockDate === today) continue;

    const prev = p.lockedPrice || 0;
    const sale = p.salePrice || 0;

    p.yesterdayLock = prev;
    p.lockedPrice = sale;
    p.brokerDisplay = prev === 0 ? 0 : sale - prev;
    p.lastLockDate = today;

    await p.save();
  }

  console.log("🔁 Daily Lock Updated:", today);
}

/* GET ALL PRICES */
exports.getPrices = async (req, res) => {
  try {
    await runDailyLock();
    const data = await Price.find().populate("category", "name");
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* GET ACTIVE WEBSITE PRICES */
exports.getWebsitePrices = async (req, res) => {
  try {
    await runDailyLock();
    const data = await Price.find({ status: "active" }).populate("category", "name");
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* CREATE PRICE */
exports.createPrice = async (req, res) => {
  try {
    let imageUrl = "";
    if (req.file) imageUrl = await uploadToCloudinary(req.file.buffer);

    const base = Number(req.body.basePrice) || 0;
    const pl = Number(req.body.profitLoss) || 0;
    const sale = base + pl;

    const price = await Price.create({
      name: req.body.name,
      category: req.body.category,
      subcategory: req.body.subcategory || null,

      basePrice: base,
      profitLoss: pl,
      salePrice: sale,

      lockedPrice: 0,
      yesterdayLock: 0,
      brokerDisplay: 0,
      lastLockDate: "",

      description: req.body.description || "",
      status: req.body.status || "inactive",
      image: imageUrl
    });

    res.status(201).json({ success: true, data: price });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* UPDATE PRICE */
exports.updatePrice = async (req, res) => {
  try {
    let item = await Price.findById(req.params.id);
    if (!item) return res.status(404).json({ success: false });

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
    res.json({ success: true, data: item });

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* QUICK PROFIT/LOSS UPDATE */
exports.updateDiff = async (req, res) => {
  try {
    let item = await Price.findById(req.params.id);
    const diff = Number(req.body.diff);

    item.profitLoss = diff;
    item.salePrice = item.basePrice + diff;

    await item.save();
    res.json({ success: true, data: item });

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
    res.json({ success: true });

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* COPY PRICE */
exports.copyPrice = async (req, res) => {
  try {
    const item = await Price.findById(req.params.id);

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

      description: item.description,
      status: item.status,
      image: null
    });

    res.json({ success: true, data: newItem });

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* BULK UPDATE */
exports.bulkUpdatePrices = async (req, res) => {
  try {
    const products = req.body.products;
    const updated = [];

    for (const p of products) {
      let item = await Price.findById(p.id);
      if (!item) continue;

      if (p.basePrice !== undefined) item.basePrice = Number(p.basePrice);
      if (p.profitLoss !== undefined) item.profitLoss = Number(p.profitLoss);

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

/* IMPORT CSV */
exports.importPrices = async (req, res) => {
  try {
    if (!req.file)
      return res.status(400).json({ success: false, message: "CSV required" });

    const file = req.file.buffer.toString("utf-8");
    const rows = [];

    csv.parseString(file, { headers: true })
      .on("data", (row) => rows.push(row))
      .on("end", async () => {
        const imported = [];

        for (const r of rows) {
          let img = "";

          if (r.image && (r.image.startsWith("http") || r.image.startsWith("data:image"))) {
            try {
              const upload = await cloudinary.uploader.upload(r.image, { folder: "price_images" });
              img = upload.secure_url;
            } catch { img = ""; }
          }

          const base = Number(r.basePrice || 0);
          const pl = Number(r.profitLoss || 0);

          const price = await Price.create({
            name: r.name,
            category: r.category || null,
            subcategory: r.subcategory || null,
            basePrice: base,
            profitLoss: pl,
            salePrice: base + pl,

            lockedPrice: 0,
            yesterdayLock: 0,
            brokerDisplay: 0,
            lastLockDate: "",

            description: r.description || "",
            status: r.status || "inactive",
            image: img
          });

          imported.push(price);
        }

        res.json({ success: true, imported: imported.length });
      });

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* EXPORT SELECTED */
exports.exportSelected = async (req, res) => {
  try {
    const ids = req.body.ids || [];
    const prices = await Price.find({ _id: { $in: ids } }).populate("category", "name");

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
        image: p.image
      });
    });

    csvStream.end();

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* EXPORT ALL PRICES */
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
        image: p.image
      });
    });

    csvStream.end();

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* MIDNIGHT SCHEDULER */
schedule.scheduleJob("0 0 * * *", async () => {
  try {
    await runDailyLock();
    console.log("🌙 Midnight Auto-Lock Executed");
  } catch (err) {
    console.error("Midnight Error:", err.message);
  }
});
