// const Price = require("../models/priceModel");
// const cloudinary = require("../utils/cloudinary");
// const csv = require("fast-csv");
// const schedule = require("node-schedule");

// /* CLOUDINARY UPLOAD */
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

// /* ======================================================
//       MIDNIGHT AUTO LOCK — ONLY AT 12AM
// ====================================================== */
// async function runDailyLock() {
//   const now = new Date();

//   const today =
//     now.getFullYear() +
//     "-" +
//     String(now.getMonth() + 1).padStart(2, "0") +
//     "-" +
//     String(now.getDate()).padStart(2, "0");

//   const items = await Price.find();

//   for (const p of items) {
//     if (p.lastLockDate === today) continue;

//     const created = new Date(p.createdAt);
//     const isSameDay =
//       created.getFullYear() === now.getFullYear() &&
//       created.getMonth() === now.getMonth() &&
//       created.getDate() === now.getDate();

//     if (isSameDay) continue;

//     const oldLock = p.lockedPrice || 0;
//     const sale = p.salePrice || 0;

//     // update lock
//     p.yesterdayLock = oldLock;
//     p.lockedPrice = sale;

//     // ⭐ FINAL TEJI/MADDI
//     p.brokerDisplay = sale - oldLock;

//     p.lastLockDate = today;

//     await p.save();
//   }

//   console.log("🌙 Midnight Lock Updated:", today);
// }

// /* ======================================================
//       GET ALL PRICES (NO AUTO LOCK HERE)
// ====================================================== */
// exports.getPrices = async (req, res) => {
//   try {
//     const data = await Price.find().populate("category", "name");
//     res.json({ success: true, data });
//   } catch (err) {
//     res.status(500).json({ success: false, message: err.message });
//   }
// };

// /* WEBSITE ACTIVE PRODUCTS */
// exports.getWebsitePrices = async (req, res) => {
//   try {
//     const data = await Price.find({ status: "active" }).populate("category", "name");
//     res.json({ success: true, data });
//   } catch (err) {
//     res.status(500).json({ success: false, message: err.message });
//   }
// };

// /* ======================================================
//       CREATE NEW PRODUCT
// ====================================================== */
// exports.createPrice = async (req, res) => {
//   try {
//     let img = "";
//     if (req.file) img = await uploadToCloudinary(req.file.buffer);

//     const base = Number(req.body.basePrice);
//     const pl = Number(req.body.profitLoss);

//     const sale = base + pl;

//     const created = await Price.create({
//       name: req.body.name,
//       category: req.body.category,
//       subcategory: req.body.subcategory || null,

//       basePrice: base,
//       profitLoss: pl,
//       salePrice: sale,

//       lockedPrice: 0,
//       yesterdayLock: 0,
//       brokerDisplay: 0,
//       lastLockDate: "",

//       description: req.body.description || "",
//       status: req.body.status || "inactive",
//       image: img,
//     });

//     res.json({ success: true, data: created });
//   } catch (err) {
//     res.status(500).json({ success: false, message: err.message });
//   }
// };

// /* ======================================================
//       UPDATE PRODUCT (LIVE TEJI/MADDI)
// ====================================================== */
// exports.updatePrice = async (req, res) => {
//   try {
//     let item = await Price.findById(req.params.id);
//     if (!item) return res.status(404).json({ success: false });

//     if (req.file) item.image = await uploadToCloudinary(req.file.buffer);

//     if (req.body.basePrice !== undefined)
//       item.basePrice = Number(req.body.basePrice);

//     if (req.body.profitLoss !== undefined)
//       item.profitLoss = Number(req.body.profitLoss);

//     // sale update
//     item.salePrice = item.basePrice + item.profitLoss;

//     // ⭐ LIVE TEJI/MADDI
//     item.brokerDisplay = item.salePrice - item.lockedPrice;

//     if (req.body.name) item.name = req.body.name;
//     if (req.body.description) item.description = req.body.description;
//     if (req.body.status) item.status = req.body.status;

//     await item.save();

//     res.json({ success: true, data: item });
//   } catch (err) {
//     res.status(500).json({ success: false, message: err.message });
//   }
// };

// /* ======================================================
//       QUICK PROFIT LOSS UPDATE (Teji LIVE)
// ====================================================== */
// exports.updateDiff = async (req, res) => {
//   try {
//     let item = await Price.findById(req.params.id);
//     if (!item) return res.status(404).json({ success: false });

//     const diff = Number(req.body.diff);

//     item.profitLoss = diff;
//     item.salePrice = item.basePrice + diff;

//     // ⭐ LIVE TEJI/MADDI
//     item.brokerDisplay = item.salePrice - item.lockedPrice;

//     await item.save();

//     res.json({ success: true, data: item });
//   } catch (err) {
//     res.status(500).json({ success: false, message: err.message });
//   }
// };

// /* ======================================================
//       STATUS UPDATE
// ====================================================== */
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

// /* DELETE */
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
//     await Price.deleteMany({ _id: { $in: req.body.ids } });
//     res.json({ success: true });
//   } catch (err) {
//     res.status(500).json({ success: false, message: err.message });
//   }
// };

// /* COPY PRICE */
// exports.copyPrice = async (req, res) => {
//   try {
//     const item = await Price.findById(req.params.id);

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

//       description: item.description,
//       status: item.status,
//       image: item.image,
//     });

//     res.json({ success: true, data: newItem });
//   } catch (err) {
//     res.status(500).json({ success: false, message: err.message });
//   }
// };

// /* ======================================================
//       BULK UPDATE (LIVE TEJI/MADDI)
// ====================================================== */
// exports.bulkUpdatePrices = async (req, res) => {
//   try {
//     const arr = req.body.products;
//     const updated = [];

//     for (const p of arr) {
//       const item = await Price.findById(p.id);
//       if (!item) continue;

//       if (p.basePrice !== undefined) item.basePrice = Number(p.basePrice);
//       if (p.profitLoss !== undefined) item.profitLoss = Number(p.profitLoss);

//       item.salePrice = item.basePrice + item.profitLoss;

//       // live teji
//       item.brokerDisplay = item.salePrice - item.lockedPrice;

//       if (p.status) item.status = p.status;

//       await item.save();
//       updated.push(item);
//     }

//     res.json({ success: true, updated });
//   } catch (err) {
//     res.status(500).json({ success: false, message: err.message });
//   }
// };

// /* ======================================================
//       CSV IMPORT
// ====================================================== */
// exports.importPrices = async (req, res) => {
//   try {
//     if (!req.file)
//       return res.status(400).json({ success: false, message: "CSV required" });

//     const file = req.file.buffer.toString("utf-8");
//     const rows = [];

//     csv.parseString(file, { headers: true })
//       .on("data", (row) => rows.push(row))
//       .on("end", async () => {
//         for (const r of rows) {
//           const base = Number(r.basePrice || 0);
//           const pl = Number(r.profitLoss || 0);

//           await Price.create({
//             name: r.name,
//             category: r.category || null,
//             subcategory: r.subcategory || null,

//             basePrice: base,
//             profitLoss: pl,
//             salePrice: base + pl,

//             lockedPrice: 0,
//             yesterdayLock: 0,
//             brokerDisplay: 0,
//             lastLockDate: "",

//             description: r.description || "",
//             status: r.status || "inactive",
//             image: "",
//           });
//         }

//         res.json({ success: true, imported: rows.length });
//       });
//   } catch (err) {
//     res.status(500).json({ success: false, message: err.message });
//   }
// };

// /* ======================================================
//       CSV EXPORT ALL
// ====================================================== */
// exports.exportPrices = async (req, res) => {
//   try {
//     const data = await Price.find().populate("category", "name");

//     res.setHeader("Content-Disposition", "attachment; filename=prices.csv");
//     res.setHeader("Content-Type", "text/csv");

//     const csvStream = csv.format({ headers: true });
//     csvStream.pipe(res);

//     data.forEach((p) => {
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
//       });
//     });

//     csvStream.end();
//   } catch (err) {
//     res.status(500).json({ success: false, message: err.message });
//   }
// };

// /* ======================================================
//       CSV EXPORT SELECTED
// ====================================================== */
// exports.exportSelected = async (req, res) => {
//   try {
//     const ids = req.body.ids || [];
//     const data = await Price.find({ _id: { $in: ids } }).populate(
//       "category",
//       "name"
//     );

//     res.setHeader(
//       "Content-Disposition",
//       "attachment; filename=selected_prices.csv"
//     );
//     res.setHeader("Content-Type", "text/csv");

//     const csvStream = csv.format({ headers: true });
//     csvStream.pipe(res);

//     data.forEach((p) => {
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
//       });
//     });

//     csvStream.end();
//   } catch (err) {
//     res.status(500).json({ success: false, message: err.message });
//   }
// };

// /* ======================================================
//       MIDNIGHT JOB ONLY
// ====================================================== */
// // schedule.scheduleJob("0 0 * * *", async () => {
// //   try {
// //     await runDailyLock();
// //     console.log("🌙 Midnight Auto-Lock Completed");
// //   } catch (err) {
// //     console.error("Midnight Error:", err.message);
// //   }
// // });

// setInterval(() => {
//   const now = new Date();
//   const hr = now.getHours();
//   const min = now.getMinutes();

//   if (hr === 11 && min === 15) {
//     console.log("⏰ Running Midnight Lock...");
//     runDailyLock();
//   }
// }, 60 * 1000);


const Price = require("../models/priceModel");
const cloudinary = require("../utils/cloudinary");
const csv = require("fast-csv");

/* ======================================================
      CLOUDINARY UPLOAD
====================================================== */
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

/* ======================================================
      MIDNIGHT AUTO LOCK LOGIC
====================================================== */
async function runDailyLock() {
  const now = new Date();

  const today =
    now.getFullYear() +
    "-" +
    String(now.getMonth() + 1).padStart(2, "0") +
    "-" +
    String(now.getDate()).padStart(2, "0");

  const items = await Price.find();

  for (const p of items) {
    if (p.lastLockDate === today) continue; // already locked today

    const created = new Date(p.createdAt);
    const createdToday =
      created.getFullYear() === now.getFullYear() &&
      created.getMonth() === now.getMonth() &&
      created.getDate() === now.getDate();

    if (createdToday) continue;

    const oldLock = p.lockedPrice || 0;
    const sale = p.salePrice || 0;

    p.yesterdayLock = oldLock;
    p.lockedPrice = sale;
    p.brokerDisplay = sale - oldLock;
    p.lastLockDate = today;

    await p.save();
  }

  console.log("🌙 Auto Lock Done:", today);
}

/* ======================================================
      SAFE AUTO-LOCK CHECK ON EVERY GET /prices
====================================================== */
async function checkAutoLock() {
  const now = new Date();
  const today =
    now.getFullYear() +
    "-" +
    String(now.getMonth() + 1).padStart(2, "0") +
    "-" +
    String(now.getDate()).padStart(2, "0");

  const any = await Price.findOne();
  if (any && any.lastLockDate !== today) {
    console.log("🔥 Auto-lock triggered via API call");
    await runDailyLock();
  }
}

/* ======================================================
      GET ALL PRICES
====================================================== */
exports.getPrices = async (req, res) => {
  try {
    await checkAutoLock(); // auto-check trigger

    const data = await Price.find().populate("category", "name");
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* WEBSITE ACTIVE */
exports.getWebsitePrices = async (req, res) => {
  try {
    await checkAutoLock();

    const data = await Price.find({ status: "active" }).populate("category", "name");
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* ======================================================
      CREATE PRODUCT
====================================================== */
exports.createPrice = async (req, res) => {
  try {
    let img = "";
    if (req.file) img = await uploadToCloudinary(req.file.buffer);

    const base = Number(req.body.basePrice);
    const pl = Number(req.body.profitLoss);

    const created = await Price.create({
      name: req.body.name,
      category: req.body.category,
      subcategory: req.body.subcategory || null,

      basePrice: base,
      profitLoss: pl,
      salePrice: base + pl,

      lockedPrice: 0,
      yesterdayLock: 0,
      brokerDisplay: 0,
      lastLockDate: "",

      description: req.body.description || "",
      status: req.body.status || "inactive",
      image: img,
    });

    res.json({ success: true, data: created });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* ======================================================
      UPDATE PRODUCT
====================================================== */
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
    item.brokerDisplay = item.salePrice - item.lockedPrice;

    if (req.body.name) item.name = req.body.name;
    if (req.body.description) item.description = req.body.description;
    if (req.body.status) item.status = req.body.status;

    await item.save();

    res.json({ success: true, data: item });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* ======================================================
      QUICK DIFF UPDATE
====================================================== */
exports.updateDiff = async (req, res) => {
  try {
    let item = await Price.findById(req.params.id);
    if (!item) return res.status(404).json({ success: false });

    const diff = Number(req.body.diff);

    item.profitLoss = diff;
    item.salePrice = item.basePrice + diff;
    item.brokerDisplay = item.salePrice - item.lockedPrice;

    await item.save();

    res.json({ success: true, data: item });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* ======================================================
      STATUS UPDATE
====================================================== */
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

/* DELETE PRODUCT */
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

/* COPY PRODUCT */
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
      image: item.image,
    });

    res.json({ success: true, data: newItem });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* ======================================================
      BULK UPDATE
====================================================== */
exports.bulkUpdatePrices = async (req, res) => {
  try {
    const arr = req.body.products;
    const updated = [];

    for (const p of arr) {
      const item = await Price.findById(p.id);
      if (!item) continue;

      if (p.basePrice !== undefined) item.basePrice = Number(p.basePrice);
      if (p.profitLoss !== undefined) item.profitLoss = Number(p.profitLoss);

      item.salePrice = item.basePrice + item.profitLoss;
      item.brokerDisplay = item.salePrice - item.lockedPrice;

      if (p.status) item.status = p.status;

      await item.save();
      updated.push(item);
    }

    res.json({ success: true, updated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* ======================================================
      CSV IMPORT
====================================================== */
exports.importPrices = async (req, res) => {
  try {
    if (!req.file)
      return res.status(400).json({ success: false, message: "CSV required" });

    const file = req.file.buffer.toString("utf-8");
    const rows = [];

    csv.parseString(file, { headers: true })
      .on("data", (row) => rows.push(row))
      .on("end", async () => {
        for (const r of rows) {
          const base = Number(r.basePrice || 0);
          const pl = Number(r.profitLoss || 0);

          await Price.create({
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
            image: "",
          });
        }

        res.json({ success: true, imported: rows.length });
      });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* ======================================================
      EXPORT ALL CSV
====================================================== */
exports.exportPrices = async (req, res) => {
  try {
    const data = await Price.find().populate("category", "name");

    res.setHeader("Content-Disposition", "attachment; filename=prices.csv");
    res.setHeader("Content-Type", "text/csv");

    const csvStream = csv.format({ headers: true });
    csvStream.pipe(res);

    data.forEach((p) => {
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
      });
    });

    csvStream.end();
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* ======================================================
      EXPORT SELECTED
====================================================== */
exports.exportSelected = async (req, res) => {
  try {
    const ids = req.body.ids || [];
    const data = await Price.find({ _id: { $in: ids } }).populate("category", "name");

    res.setHeader("Content-Disposition", "attachment; filename=selected_prices.csv");
    res.setHeader("Content-Type", "text/csv");

    const csvStream = csv.format({ headers: true });
    csvStream.pipe(res);

    data.forEach((p) => {
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
      });
    });

    csvStream.end();
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
