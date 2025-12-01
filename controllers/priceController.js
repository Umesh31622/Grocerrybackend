// // // const Price = require("../models/priceModel");
// // // const cloudinary = require("../utils/cloudinary");
// // // const csv = require("fast-csv");
// // // const schedule = require("node-schedule");

// // // /* CLOUDINARY UPLOAD */
// // // const uploadToCloudinary = (fileBuffer) => {
// // //   return new Promise((resolve, reject) => {
// // //     cloudinary.uploader
// // //       .upload_stream({ folder: "price_images" }, (err, result) => {
// // //         if (err) return reject(err);
// // //         resolve(result.secure_url);
// // //       })
// // //       .end(fileBuffer);
// // //   });
// // // };

// // // /* AUTO MIDNIGHT LOCK — FIXED */
// // // async function runDailyLock() {
// // //   const today = new Date().toISOString().split("T")[0];
// // //   const items = await Price.find();

// // //   for (const p of items) {
// // //     // ❌ If already locked today → skip
// // //     if (p.lastLockDate === today) continue;

// // //     // ❌ If product was created today → DO NOT LOCK
// // //     const createdAt = p.createdAt
// // //       ? new Date(p.createdAt).toISOString().split("T")[0]
// // //       : null;

// // //     if (createdAt === today) continue;

// // //     // ✅ OLD ITEMS → Lock normally
// // //     const prev = p.lockedPrice || 0;
// // //     const sale = p.salePrice || 0;

// // //     p.yesterdayLock = prev;
// // //     p.lockedPrice = sale;
// // //     p.brokerDisplay = prev === 0 ? 0 : sale - prev;
// // //     p.lastLockDate = today;

// // //     await p.save();
// // //   }

// // //   console.log("🔁 Daily Lock Updated:", today);
// // // }

// // // /* ===========================
// // //    GET ALL PRICES
// // //    =========================== */
// // // exports.getPrices = async (req, res) => {
// // //   try {
// // //     await runDailyLock();
// // //     const data = await Price.find().populate("category", "name");
// // //     res.json({ success: true, data });
// // //   } catch (err) {
// // //     res.status(500).json({ success: false, message: err.message });
// // //   }
// // // };

// // // exports.getWebsitePrices = async (req, res) => {
// // //   try {
// // //     await runDailyLock();
// // //     const data = await Price.find({ status: "active" }).populate("category", "name");
// // //     res.json({ success: true, data });
// // //   } catch (err) {
// // //     res.status(500).json({ success: false, message: err.message });
// // //   }
// // // };

// // // /* ===========================
// // //    CREATE PRICE
// // //    =========================== */
// // // exports.createPrice = async (req, res) => {
// // //   try {
// // //     let img = "";
// // //     if (req.file) img = await uploadToCloudinary(req.file.buffer);

// // //     const base = Number(req.body.basePrice) || 0;
// // //     const pl = Number(req.body.profitLoss) || 0;

// // //     const created = await Price.create({
// // //       name: req.body.name,
// // //       category: req.body.category,
// // //       subcategory: req.body.subcategory || null,
// // //       basePrice: base,
// // //       profitLoss: pl,
// // //       salePrice: base + pl,

// // //       // NEW PRODUCT DEFAULT LOCKS
// // //       lockedPrice: 0,
// // //       yesterdayLock: 0,
// // //       brokerDisplay: 0,
// // //       lastLockDate: "",

// // //       description: req.body.description || "",
// // //       status: req.body.status || "inactive",
// // //       image: img,
// // //     });

// // //     res.status(201).json({ success: true, data: created });
// // //   } catch (err) {
// // //     res.status(500).json({ success: false, message: err.message });
// // //   }
// // // };

// // // /* ===========================
// // //    UPDATE PRICE
// // //    =========================== */
// // // exports.updatePrice = async (req, res) => {
// // //   try {
// // //     let item = await Price.findById(req.params.id);
// // //     if (!item) return res.status(404).json({ success: false });

// // //     if (req.file) item.image = await uploadToCloudinary(req.file.buffer);

// // //     if (req.body.basePrice !== undefined)
// // //       item.basePrice = Number(req.body.basePrice);

// // //     if (req.body.profitLoss !== undefined)
// // //       item.profitLoss = Number(req.body.profitLoss);

// // //     item.salePrice = item.basePrice + item.profitLoss;

// // //     if (req.body.name) item.name = req.body.name;
// // //     if (req.body.description) item.description = req.body.description;
// // //     if (req.body.status) item.status = req.body.status;

// // //     await item.save();
// // //     res.json({ success: true, data: item });
// // //   } catch (err) {
// // //     res.status(500).json({ success: false, message: err.message });
// // //   }
// // // };

// // // /* QUICK PROFIT/LOSS UPDATE */
// // // exports.updateDiff = async (req, res) => {
// // //   try {
// // //     let item = await Price.findById(req.params.id);
// // //     if (!item) return res.status(404).json({ success: false });

// // //     const diff = Number(req.body.diff);

// // //     item.profitLoss = diff;
// // //     item.salePrice = item.basePrice + diff;

// // //     await item.save();

// // //     res.json({ success: true, data: item });
// // //   } catch (err) {
// // //     res.status(500).json({ success: false, message: err.message });
// // //   }
// // // };

// // // /* STATUS CHANGE */
// // // exports.updateStatus = async (req, res) => {
// // //   try {
// // //     const updated = await Price.findByIdAndUpdate(
// // //       req.params.id,
// // //       { status: req.body.status },
// // //       { new: true }
// // //     );

// // //     res.json({ success: true, data: updated });
// // //   } catch (err) {
// // //     res.status(500).json({ success: false, message: err.message });
// // //   }
// // // };

// // // /* DELETE SINGLE */
// // // exports.deletePrice = async (req, res) => {
// // //   try {
// // //     await Price.findByIdAndDelete(req.params.id);
// // //     res.json({ success: true });
// // //   } catch (err) {
// // //     res.status(500).json({ success: false, message: err.message });
// // //   }
// // // };

// // // /* DELETE SELECTED */
// // // exports.deleteSelected = async (req, res) => {
// // //   try {
// // //     await Price.deleteMany({ _id: { $in: req.body.ids } });
// // //     res.json({ success: true });
// // //   } catch (err) {
// // //     res.status(500).json({ success: false, message: err.message });
// // //   }
// // // };

// // // /* COPY PRICE */
// // // exports.copyPrice = async (req, res) => {
// // //   try {
// // //     const item = await Price.findById(req.params.id);

// // //     const newItem = await Price.create({
// // //       name: item.name,
// // //       category: item.category,
// // //       subcategory: item.subcategory,
// // //       basePrice: item.basePrice,
// // //       profitLoss: item.profitLoss,
// // //       salePrice: item.salePrice,

// // //       lockedPrice: 0,
// // //       yesterdayLock: 0,
// // //       brokerDisplay: 0,
// // //       lastLockDate: "",

// // //       description: item.description,
// // //       status: item.status,
// // //       image: null,
// // //     });

// // //     res.json({ success: true, data: newItem });
// // //   } catch (err) {
// // //     res.status(500).json({ success: false, message: err.message });
// // //   }
// // // };

// // // /* BULK UPDATE */
// // // exports.bulkUpdatePrices = async (req, res) => {
// // //   try {
// // //     const arr = req.body.products;
// // //     const updated = [];

// // //     for (const p of arr) {
// // //       let item = await Price.findById(p.id);
// // //       if (!item) continue;

// // //       if (p.basePrice !== undefined) item.basePrice = Number(p.basePrice);
// // //       if (p.profitLoss !== undefined) item.profitLoss = Number(p.profitLoss);

// // //       item.salePrice = item.basePrice + item.profitLoss;

// // //       if (p.status) item.status = p.status;

// // //       await item.save();
// // //       updated.push(item);
// // //     }

// // //     res.json({ success: true, updated });
// // //   } catch (err) {
// // //     res.status(500).json({ success: false, message: err.message });
// // //   }
// // // };

// // // /* IMPORT CSV */
// // // exports.importPrices = async (req, res) => {
// // //   try {
// // //     if (!req.file)
// // //       return res.status(400).json({ success: false, message: "CSV required" });

// // //     const file = req.file.buffer.toString("utf-8");
// // //     const rows = [];

// // //     csv.parseString(file, { headers: true })
// // //       .on("data", (row) => rows.push(row))
// // //       .on("end", async () => {
// // //         for (const r of rows) {
// // //           const base = Number(r.basePrice || 0);
// // //           const pl = Number(r.profitLoss || 0);

// // //           await Price.create({
// // //             name: r.name,
// // //             category: r.category || null,
// // //             subcategory: r.subcategory || null,
// // //             basePrice: base,
// // //             profitLoss: pl,
// // //             salePrice: base + pl,

// // //             lockedPrice: 0,
// // //             yesterdayLock: 0,
// // //             brokerDisplay: 0,
// // //             lastLockDate: "",

// // //             description: r.description || "",
// // //             status: r.status || "inactive",
// // //             image: "",
// // //           });
// // //         }
// // //         res.json({ success: true, imported: rows.length });
// // //       });
// // //   } catch (err) {
// // //     res.status(500).json({ success: false, message: err.message });
// // //   }
// // // };

// // // /* EXPORT SELECTED */
// // // exports.exportSelected = async (req, res) => {
// // //   try {
// // //     const ids = req.body.ids || [];
// // //     const data = await Price.find({ _id: { $in: ids } }).populate(
// // //       "category",
// // //       "name"
// // //     );

// // //     res.setHeader(
// // //       "Content-Disposition",
// // //       "attachment; filename=selected_prices.csv"
// // //     );
// // //     res.setHeader("Content-Type", "text/csv");

// // //     const csvStream = csv.format({ headers: true });
// // //     csvStream.pipe(res);

// // //     data.forEach((p) => {
// // //       csvStream.write({
// // //         id: p._id,
// // //         name: p.name,
// // //         category: p.category?.name || "",
// // //         basePrice: p.basePrice,
// // //         profitLoss: p.profitLoss,
// // //         salePrice: p.salePrice,
// // //         lockedPrice: p.lockedPrice,
// // //         yesterdayLock: p.yesterdayLock,
// // //         brokerDisplay: p.brokerDisplay,
// // //         status: p.status,
// // //       });
// // //     });

// // //     csvStream.end();
// // //   } catch (err) {
// // //     res.status(500).json({ success: false, message: err.message });
// // //   }
// // // };

// // // /* EXPORT ALL */
// // // exports.exportPrices = async (req, res) => {
// // //   try {
// // //     const data = await Price.find().populate("category", "name");

// // //     res.setHeader("Content-Disposition", "attachment; filename=prices.csv");
// // //     res.setHeader("Content-Type", "text/csv");

// // //     const csvStream = csv.format({ headers: true });
// // //     csvStream.pipe(res);

// // //     data.forEach((p) => {
// // //       csvStream.write({
// // //         id: p._id,
// // //         name: p.name,
// // //         category: p.category?.name || "",
// // //         basePrice: p.basePrice,
// // //         profitLoss: p.profitLoss,
// // //         salePrice: p.salePrice,
// // //         lockedPrice: p.lockedPrice,
// // //         yesterdayLock: p.yesterdayLock,
// // //         brokerDisplay: p.brokerDisplay,
// // //         status: p.status,
// // //       });
// // //     });

// // //     csvStream.end();
// // //   } catch (err) {
// // //     res.status(500).json({ success: false, message: err.message });
// // //   }
// // // };

// // // /* MIDNIGHT JOB */
// // // schedule.scheduleJob("0 0 * * *", async () => {
// // //   try {
// // //     await runDailyLock();
// // //     console.log("🌙 Midnight Auto-Lock Executed");
// // //   } catch (err) {
// // //     console.error("Midnight Error:", err.message);
// // //   }
// // // });

// // const Price = require("../models/priceModel");
// // const cloudinary = require("../utils/cloudinary");
// // const csv = require("fast-csv");
// // const schedule = require("node-schedule");

// // /* CLOUDINARY UPLOAD */
// // const uploadToCloudinary = (fileBuffer) => {
// //   return new Promise((resolve, reject) => {
// //     cloudinary.uploader
// //       .upload_stream({ folder: "price_images" }, (err, result) => {
// //         if (err) return reject(err);
// //         resolve(result.secure_url);
// //       })
// //       .end(fileBuffer);
// //   });
// // };

// // /* AUTO MIDNIGHT LOCK — FIXED WITH TEJI/MADDI */
// // async function runDailyLock() {
// //   const today = new Date().toISOString().split("T")[0];
// //   const items = await Price.find();

// //   for (const p of items) {
// //     if (p.lastLockDate === today) continue;

// //     const createdAt = p.createdAt
// //       ? new Date(p.createdAt).toISOString().split("T")[0]
// //       : null;

// //     // NEW PRODUCTS SHOULD NOT LOCK ON SAME DAY
// //     if (createdAt === today) continue;

// //     const prev = p.lockedPrice || 0;
// //     const sale = p.salePrice || 0;

// //     // UPDATE DAILY LOCK VALUES
// //     p.yesterdayLock = prev;
// //     p.lockedPrice = sale;

// //     // ⭐ FINAL TEJI/MADDI FORMULA:
// //     // teji/maddi = salePrice – lockedPrice
// //     p.brokerDisplay = sale - prev;

// //     p.lastLockDate = today;

// //     await p.save();
// //   }

// //   console.log("🔁 Daily Lock Updated:", today);
// // }

// // /* ===========================
// //    GET ALL PRICES
// //    =========================== */
// // exports.getPrices = async (req, res) => {
// //   try {
// //     await runDailyLock();
// //     const data = await Price.find().populate("category", "name");
// //     res.json({ success: true, data });
// //   } catch (err) {
// //     res.status(500).json({ success: false, message: err.message });
// //   }
// // };

// // exports.getWebsitePrices = async (req, res) => {
// //   try {
// //     await runDailyLock();
// //     const data = await Price.find({ status: "active" }).populate("category", "name");
// //     res.json({ success: true, data });
// //   } catch (err) {
// //     res.status(500).json({ success: false, message: err.message });
// //   }
// // };

// // /* ===========================
// //    CREATE PRICE
// //    =========================== */
// // exports.createPrice = async (req, res) => {
// //   try {
// //     let img = "";
// //     if (req.file) img = await uploadToCloudinary(req.file.buffer);

// //     const base = Number(req.body.basePrice) || 0;
// //     const pl = Number(req.body.profitLoss) || 0;

// //     const created = await Price.create({
// //       name: req.body.name,
// //       category: req.body.category,
// //       subcategory: req.body.subcategory || null,
// //       basePrice: base,
// //       profitLoss: pl,
// //       salePrice: base + pl,

// //       lockedPrice: 0,
// //       yesterdayLock: 0,
// //       brokerDisplay: 0,
// //       lastLockDate: "",

// //       description: req.body.description || "",
// //       status: req.body.status || "inactive",
// //       image: img,
// //     });

// //     res.status(201).json({ success: true, data: created });
// //   } catch (err) {
// //     res.status(500).json({ success: false, message: err.message });
// //   }
// // };

// // /* ===========================
// //    UPDATE PRICE
// //    =========================== */
// // exports.updatePrice = async (req, res) => {
// //   try {
// //     let item = await Price.findById(req.params.id);
// //     if (!item) return res.status(404).json({ success: false });

// //     if (req.file) item.image = await uploadToCloudinary(req.file.buffer);

// //     if (req.body.basePrice !== undefined)
// //       item.basePrice = Number(req.body.basePrice);

// //     if (req.body.profitLoss !== undefined)
// //       item.profitLoss = Number(req.body.profitLoss);

// //     item.salePrice = item.basePrice + item.profitLoss;

// //     if (req.body.name) item.name = req.body.name;
// //     if (req.body.description) item.description = req.body.description;
// //     if (req.body.status) item.status = req.body.status;

// //     await item.save();
// //     res.json({ success: true, data: item });
// //   } catch (err) {
// //     res.status(500).json({ success: false, message: err.message });
// //   }
// // };

// // /* QUICK PROFIT/LOSS UPDATE */
// // exports.updateDiff = async (req, res) => {
// //   try {
// //     let item = await Price.findById(req.params.id);
// //     if (!item) return res.status(404).json({ success: false });

// //     const diff = Number(req.body.diff);

// //     item.profitLoss = diff;
// //     item.salePrice = item.basePrice + diff;

// //     await item.save();

// //     res.json({ success: true, data: item });
// //   } catch (err) {
// //     res.status(500).json({ success: false, message: err.message });
// //   }
// // };

// // /* STATUS CHANGE */
// // exports.updateStatus = async (req, res) => {
// //   try {
// //     const updated = await Price.findByIdAndUpdate(
// //       req.params.id,
// //       { status: req.body.status },
// //       { new: true }
// //     );

// //     res.json({ success: true, data: updated });
// //   } catch (err) {
// //     res.status(500).json({ success: false, message: err.message });
// //   }
// // };

// // /* DELETE SINGLE */
// // exports.deletePrice = async (req, res) => {
// //   try {
// //     await Price.findByIdAndDelete(req.params.id);
// //     res.json({ success: true });
// //   } catch (err) {
// //     res.status(500).json({ success: false, message: err.message });
// //   }
// // };

// // /* DELETE SELECTED */
// // exports.deleteSelected = async (req, res) => {
// //   try {
// //     await Price.deleteMany({ _id: { $in: req.body.ids } });
// //     res.json({ success: true });
// //   } catch (err) {
// //     res.status(500).json({ success: false, message: err.message });
// //   }
// // };

// // /* COPY PRICE */
// // exports.copyPrice = async (req, res) => {
// //   try {
// //     const item = await Price.findById(req.params.id);

// //     const newItem = await Price.create({
// //       name: item.name,
// //       category: item.category,
// //       subcategory: item.subcategory,
// //       basePrice: item.basePrice,
// //       profitLoss: item.profitLoss,
// //       salePrice: item.salePrice,

// //       lockedPrice: 0,
// //       yesterdayLock: 0,
// //       brokerDisplay: 0,
// //       lastLockDate: "",

// //       description: item.description,
// //       status: item.status,
// //       image: null,
// //     });

// //     res.json({ success: true, data: newItem });
// //   } catch (err) {
// //     res.status(500).json({ success: false, message: err.message });
// //   }
// // };

// // /* BULK UPDATE */
// // exports.bulkUpdatePrices = async (req, res) => {
// //   try {
// //     const arr = req.body.products;
// //     const updated = [];

// //     for (const p of arr) {
// //       let item = await Price.findById(p.id);
// //       if (!item) continue;

// //       if (p.basePrice !== undefined) item.basePrice = Number(p.basePrice);
// //       if (p.profitLoss !== undefined) item.profitLoss = Number(p.profitLoss);

// //       item.salePrice = item.basePrice + item.profitLoss;

// //       if (p.status) item.status = p.status;

// //       await item.save();
// //       updated.push(item);
// //     }

// //     res.json({ success: true, updated });
// //   } catch (err) {
// //     res.status(500).json({ success: false, message: err.message });
// //   }
// // };

// // /* IMPORT CSV */
// // exports.importPrices = async (req, res) => {
// //   try {
// //     if (!req.file)
// //       return res.status(400).json({ success: false, message: "CSV required" });

// //     const file = req.file.buffer.toString("utf-8");
// //     const rows = [];

// //     csv.parseString(file, { headers: true })
// //       .on("data", (row) => rows.push(row))
// //       .on("end", async () => {
// //         for (const r of rows) {
// //           const base = Number(r.basePrice || 0);
// //           const pl = Number(r.profitLoss || 0);

// //           await Price.create({
// //             name: r.name,
// //             category: r.category || null,
// //             subcategory: r.subcategory || null,
// //             basePrice: base,
// //             profitLoss: pl,
// //             salePrice: base + pl,

// //             lockedPrice: 0,
// //             yesterdayLock: 0,
// //             brokerDisplay: 0,
// //             lastLockDate: "",

// //             description: r.description || "",
// //             status: r.status || "inactive",
// //             image: "",
// //           });
// //         }
// //         res.json({ success: true, imported: rows.length });
// //       });
// //   } catch (err) {
// //     res.status(500).json({ success: false, message: err.message });
// //   }
// // };

// // /* EXPORT SELECTED */
// // exports.exportSelected = async (req, res) => {
// //   try {
// //     const ids = req.body.ids || [];
// //     const data = await Price.find({ _id: { $in: ids } }).populate(
// //       "category",
// //       "name"
// //     );

// //     res.setHeader(
// //       "Content-Disposition",
// //       "attachment; filename=selected_prices.csv"
// //     );
// //     res.setHeader("Content-Type", "text/csv");

// //     const csvStream = csv.format({ headers: true });
// //     csvStream.pipe(res);

// //     data.forEach((p) => {
// //       csvStream.write({
// //         id: p._id,
// //         name: p.name,
// //         category: p.category?.name || "",
// //         basePrice: p.basePrice,
// //         profitLoss: p.profitLoss,
// //         salePrice: p.salePrice,
// //         lockedPrice: p.lockedPrice,
// //         yesterdayLock: p.yesterdayLock,
// //         brokerDisplay: p.brokerDisplay,
// //         status: p.status,
// //       });
// //     });

// //     csvStream.end();
// //   } catch (err) {
// //     res.status(500).json({ success: false, message: err.message });
// //   }
// // };

// // /* EXPORT ALL */
// // exports.exportPrices = async (req, res) => {
// //   try {
// //     const data = await Price.find().populate("category", "name");

// //     res.setHeader("Content-Disposition", "attachment; filename=prices.csv");
// //     res.setHeader("Content-Type", "text/csv");

// //     const csvStream = csv.format({ headers: true });
// //     csvStream.pipe(res);

// //     data.forEach((p) => {
// //       csvStream.write({
// //         id: p._id,
// //         name: p.name,
// //         category: p.category?.name || "",
// //         basePrice: p.basePrice,
// //         profitLoss: p.profitLoss,
// //         salePrice: p.salePrice,
// //         lockedPrice: p.lockedPrice,
// //         yesterdayLock: p.yesterdayLock,
// //         brokerDisplay: p.brokerDisplay,
// //         status: p.status,
// //       });
// //     });

// //     csvStream.end();
// //   } catch (err) {
// //     res.status(500).json({ success: false, message: err.message });
// //   }
// // };

// // /* MIDNIGHT JOB */
// // schedule.scheduleJob("0 0 * * *", async () => {
// //   try {
// //     await runDailyLock();
// //     console.log("🌙 Midnight Auto-Lock Executed");
// //   } catch (err) {
// //     console.error("Midnight Error:", err.message);
// //   }
// // });

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

// /* -----------------------------------------
//    AUTO MIDNIGHT LOCK (TEJI/MADDI FIXED)
// ------------------------------------------ */
// async function runDailyLock() {
//   const today = new Date().toISOString().split("T")[0];
//   const items = await Price.find();

//   for (const p of items) {
//     if (p.lastLockDate === today) continue;

//     const createdAt = p.createdAt
//       ? new Date(p.createdAt).toISOString().split("T")[0]
//       : null;

//     // New product — skip lock on same day
//     if (createdAt === today) continue;

//     const prev = p.lockedPrice || 0;
//     const sale = p.salePrice || 0;

//     p.yesterdayLock = prev;
//     p.lockedPrice = sale;

//     // ⭐ FINAL TEJI/MADDI FORMULA
//     p.brokerDisplay = sale - prev;

//     p.lastLockDate = today;

//     await p.save();
//   }

//   console.log("🔁 Daily Lock Updated:", today);
// }

// /* GET ALL PRICES */
// exports.getPrices = async (req, res) => {
//   try {
//     await runDailyLock();
//     const data = await Price.find().populate("category", "name");
//     res.json({ success: true, data });
//   } catch (err) {
//     res.status(500).json({ success: false, message: err.message });
//   }
// };

// exports.getWebsitePrices = async (req, res) => {
//   try {
//     await runDailyLock();
//     const data = await Price.find({ status: "active" }).populate("category", "name");
//     res.json({ success: true, data });
//   } catch (err) {
//     res.status(500).json({ success: false, message: err.message });
//   }
// };

// /* CREATE PRICE */
// exports.createPrice = async (req, res) => {
//   try {
//     let img = "";
//     if (req.file) img = await uploadToCloudinary(req.file.buffer);

//     const base = Number(req.body.basePrice) || 0;
//     const pl = Number(req.body.profitLoss) || 0;

//     const created = await Price.create({
//       name: req.body.name,
//       category: req.body.category,
//       subcategory: req.body.subcategory || null,

//       basePrice: base,
//       profitLoss: pl,
//       salePrice: base + pl,

//       lockedPrice: 0,
//       yesterdayLock: 0,
//       brokerDisplay: 0,
//       lastLockDate: "",

//       description: req.body.description || "",
//       status: req.body.status || "inactive",
//       image: img,
//     });

//     res.status(201).json({ success: true, data: created });
//   } catch (err) {
//     res.status(500).json({ success: false, message: err.message });
//   }
// };

// /* UPDATE PRICE */
// exports.updatePrice = async (req, res) => {
//   try {
//     let item = await Price.findById(req.params.id);
//     if (!item) return res.status(404).json({ success: false });

//     if (req.file) item.image = await uploadToCloudinary(req.file.buffer);

//     if (req.body.basePrice !== undefined)
//       item.basePrice = Number(req.body.basePrice);

//     if (req.body.profitLoss !== undefined)
//       item.profitLoss = Number(req.body.profitLoss);

//     item.salePrice = item.basePrice + item.profitLoss;

//     if (req.body.name) item.name = req.body.name;
//     if (req.body.description) item.description = req.body.description;
//     if (req.body.status) item.status = req.body.status;

//     await item.save();
//     res.json({ success: true, data: item });
//   } catch (err) {
//     res.status(500).json({ success: false, message: err.message });
//   }
// };

// /* QUICK PROFIT/LOSS UPDATE */
// exports.updateDiff = async (req, res) => {
//   try {
//     let item = await Price.findById(req.params.id);
//     if (!item) return res.status(404).json({ success: false });

//     const diff = Number(req.body.diff);

//     item.profitLoss = diff;
//     item.salePrice = item.basePrice + diff;

//     await item.save();

//     res.json({ success: true, data: item });
//   } catch (err) {
//     res.status(500).json({ success: false, message: err.message });
//   }
// };

// /* STATUS UPDATE */
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
//     const arr = req.body.products;
//     const updated = [];

//     for (const p of arr) {
//       let item = await Price.findById(p.id);
//       if (!item) continue;

//       if (p.basePrice !== undefined) item.basePrice = Number(p.basePrice);
//       if (p.profitLoss !== undefined) item.profitLoss = Number(p.profitLoss);

//       item.salePrice = item.basePrice + item.profitLoss;

//       if (p.status) item.status = p.status;

//       await item.save();
//       updated.push(item);
//     }

//     res.json({ success: true, updated });
//   } catch (err) {
//     res.status(500).json({ success: false, message: err.message });
//   }
// };

// /* IMPORT CSV */
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

// /* EXPORT SELECTED */
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

//     data.forEach((p) =>
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
//       })
//     );

//     csvStream.end();
//   } catch (err) {
//     res.status(500).json({ success: false, message: err.message });
//   }
// };

// /* EXPORT ALL */
// exports.exportPrices = async (req, res) => {
//   try {
//     const data = await Price.find().populate("category", "name");

//     res.setHeader("Content-Disposition", "attachment; filename=prices.csv");
//     res.setHeader("Content-Type", "text/csv");

//     const csvStream = csv.format({ headers: true });
//     csvStream.pipe(res);

//     data.forEach((p) =>
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
//       })
//     );

//     csvStream.end();
//   } catch (err) {
//     res.status(500).json({ success: false, message: err.message });
//   }
// };

// /* MIDNIGHT JOB */
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

/* CLOUDINARY UPLOAD */
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
   AUTO MIDNIGHT LOCK — FIXED (INDIAN DATE CHECK)
====================================================== */
async function runDailyLock() {
  const now = new Date();
  const items = await Price.find();

  for (const p of items) {
    const lastLock = p.lastLockDate;

    // Format today's date in yyyy-mm-dd
    const today = `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`;

    // If already locked today → skip
    if (lastLock === today) continue;

    // CreatedAt REAL date compare
    const createdAt = new Date(p.createdAt);
    const isSameDay =
      createdAt.getFullYear() === now.getFullYear() &&
      createdAt.getMonth() === now.getMonth() &&
      createdAt.getDate() === now.getDate();

    // New products should NOT lock same day
    if (isSameDay) continue;

    const sale = p.salePrice || 0;
    const prev = p.lockedPrice || 0;

    // UPDATE LOCK VALUES
    p.yesterdayLock = prev;
    p.lockedPrice = sale;

    // ⭐ FINAL AND CORRECT TEJI/MADDI FORMULA
    p.brokerDisplay = sale - prev;

    // Save today's lock date
    p.lastLockDate = today;

    await p.save();
  }

  console.log("🔁 Daily Lock Updated for:", now.toDateString());
}

/* ======================================================
   GET ALL PRICES
====================================================== */
exports.getPrices = async (req, res) => {
  try {
    await runDailyLock(); // Auto update on fetch
    const data = await Price.find().populate("category", "name");
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getWebsitePrices = async (req, res) => {
  try {
    await runDailyLock();
    const data = await Price.find({ status: "active" }).populate("category", "name");
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* ======================================================
   CREATE PRICE
====================================================== */
exports.createPrice = async (req, res) => {
  try {
    let img = "";
    if (req.file) img = await uploadToCloudinary(req.file.buffer);

    const base = Number(req.body.basePrice) || 0;
    const pl = Number(req.body.profitLoss) || 0;

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

    res.status(201).json({ success: true, data: created });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* ======================================================
   UPDATE PRICE
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
   QUICK PROFIT/LOSS UPDATE
====================================================== */
exports.updateDiff = async (req, res) => {
  try {
    let item = await Price.findById(req.params.id);
    if (!item) return res.status(404).json({ success: false });

    const diff = Number(req.body.diff);

    item.profitLoss = diff;
    item.salePrice = item.basePrice + diff;

    await item.save();

    res.json({ success: true, data: item });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* ======================================================
   STATUS CHANGE
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

/* ======================================================
   DELETE SINGLE
====================================================== */
exports.deletePrice = async (req, res) => {
  try {
    await Price.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* ======================================================
   DELETE SELECTED
====================================================== */
exports.deleteSelected = async (req, res) => {
  try {
    await Price.deleteMany({ _id: { $in: req.body.ids } });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* ======================================================
   COPY PRICE
====================================================== */
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
      image: null,
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

/* ======================================================
   IMPORT CSV
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
   EXPORT SELECTED
====================================================== */
exports.exportSelected = async (req, res) => {
  try {
    const ids = req.body.ids || [];
    const data = await Price.find({ _id: { $in: ids } }).populate(
      "category",
      "name"
    );

    res.setHeader(
      "Content-Disposition",
      "attachment; filename=selected_prices.csv"
    );
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
   EXPORT ALL
====================================================== */
exports.exportPrices = async (req, res) => {
  try {
    const data = await Price.find().populate("category", "name");

    res.setHeader("Content-Disposition", "attachment; filename=prices.csv");
    res.setHeader("Content-Type", "text/ccsv");

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
   MIDNIGHT JOB
====================================================== */
schedule.scheduleJob("0 0 * * *", async () => {
  try {
    await runDailyLock();
    console.log("🌙 Midnight Auto-Lock Executed");
  } catch (err) {
    console.error("Midnight Error:", err.message);
  }
});
