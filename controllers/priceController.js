

// // // // // const Price = require("../models/priceModel");
// // // // // const Category = require("../models/categoryModel");
// // // // // const cloudinary = require("../utils/cloudinary");
// // // // // const csv = require("fast-csv");
// // // // // const schedule = require("node-schedule");

// // // // // // CLOUDINARY UPLOAD
// // // // // const uploadToCloudinary = (fileBuffer) => {
// // // // //   return new Promise((resolve, reject) => {
// // // // //     cloudinary.uploader
// // // // //       .upload_stream({ folder: "price_images" }, (err, result) => {
// // // // //         if (err) reject(err);
// // // // //         else resolve(result.secure_url);
// // // // //       })
// // // // //       .end(fileBuffer);
// // // // //   });
// // // // // };

// // // // // /* ============================================================
// // // // //    CREATE (DAY 1)
// // // // // ============================================================== */
// // // // // exports.createPrice = async (req, res) => {
// // // // //   try {
// // // // //     const {
// // // // //       name,
// // // // //       category,
// // // // //       subcategory,
// // // // //       basePrice,
// // // // //       difference,
// // // // //       validTill,
// // // // //       description,
// // // // //       status,
// // // // //     } = req.body;

// // // // //     let imageUrl = null;
// // // // //     if (req.file) imageUrl = await uploadToCloudinary(req.file.buffer);

// // // // //     const base = Number(basePrice) || 0;
// // // // //     const diff = Number(difference) || 0;

// // // // //     const price = await Price.create({
// // // // //       name,
// // // // //       category,
// // // // //       subcategory: subcategory || null,
// // // // //       basePrice: base,
// // // // //       todayDiff: diff,
// // // // //       lastFinalPrice: base,
// // // // //       currentFinalPrice: base + diff,
// // // // //       validTill: validTill ? new Date(validTill) : undefined,
// // // // //       description,
// // // // //       status: status || "inactive",
// // // // //       image: imageUrl,
// // // // //     });

// // // // //     const populated = await Price.findById(price._id)
// // // // //       .populate("category", "name")
// // // // //       .lean();

// // // // //     res.status(201).json({ success: true, data: populated });
// // // // //   } catch (err) {
// // // // //     res.status(500).json({ success: false, message: err.message });
// // // // //   }
// // // // // };

// // // // // /* ============================================================
// // // // //    GET ALL
// // // // // ============================================================== */
// // // // // exports.getPrices = async (req, res) => {
// // // // //   try {
// // // // //     const prices = await Price.find()
// // // // //       .populate("category", "name")
// // // // //       .sort({ createdAt: -1 });

// // // // //     res.json({ success: true, data: prices });
// // // // //   } catch (err) {
// // // // //     res.status(500).json({ success: false, message: err.message });
// // // // //   }
// // // // // };

// // // // // /* ============================================================
// // // // //    GET ACTIVE (Website)
// // // // // ============================================================== */
// // // // // exports.getWebsitePrices = async (req, res) => {
// // // // //   try {
// // // // //     const prices = await Price.find({ status: "active" })
// // // // //       .populate("category", "name")
// // // // //       .sort({ createdAt: -1 });

// // // // //     res.json({ success: true, data: prices });
// // // // //   } catch (err) {
// // // // //     res.status(500).json({ success: false, message: err.message });
// // // // //   }
// // // // // };

// // // // // /* ============================================================
// // // // //    UPDATE BASE PRICE (FIXED)
// // // // // ============================================================== */
// // // // // exports.updatePrice = async (req, res) => {
// // // // //   try {
// // // // //     const { id } = req.params;
// // // // //     const data = req.body;

// // // // //     const item = await Price.findById(id);
// // // // //     if (!item)
// // // // //       return res.status(404).json({ success: false, message: "Not found" });

// // // // //     const update = {};

// // // // //     update.name = data.name ?? item.name;
// // // // //     update.category = data.category ?? item.category;
// // // // //     update.subcategory = data.subcategory ?? item.subcategory;
// // // // //     update.description = data.description ?? item.description;
// // // // //     update.validTill = data.validTill ? new Date(data.validTill) : item.validTill;
// // // // //     update.status = data.status ?? item.status;

// // // // //     // IMAGE
// // // // //     if (req.file) update.image = await uploadToCloudinary(req.file.buffer);

// // // // //     // BASE PRICE LOGIC (CORRECTED)
// // // // //     if (data.basePrice !== undefined && data.basePrice !== "") {
// // // // //       const newBase = Number(data.basePrice);
// // // // //       const today = Number(item.todayDiff ?? 0);

// // // // //       const newCurrent = newBase + today;

// // // // //       update.basePrice = newBase;
// // // // //       update.lastFinalPrice = newBase;
// // // // //       update.currentFinalPrice = newCurrent;
// // // // //     }

// // // // //     const updated = await Price.findByIdAndUpdate(id, update, {
// // // // //       new: true,
// // // // //     })
// // // // //       .populate("category", "name")
// // // // //       .lean();

// // // // //     updated.todayDiff = Number(updated.todayDiff ?? 0);
// // // // //     updated.lastFinalPrice = Number(updated.lastFinalPrice ?? updated.basePrice ?? 0);
// // // // //     updated.currentFinalPrice = Number(updated.currentFinalPrice ?? 0);

// // // // //     res.json({ success: true, data: updated });
// // // // //   } catch (err) {
// // // // //     res.status(500).json({ success: false, message: err.message });
// // // // //   }
// // // // // };

// // // // // /* ============================================================
// // // // //    QUICK DIFF (FIXED)
// // // // // ============================================================== */
// // // // // exports.updateDiff = async (req, res) => {
// // // // //   try {
// // // // //     const id = req.params.id;
// // // // //     const diff = Number(req.body.diff || 0);

// // // // //     const item = await Price.findById(id);
// // // // //     if (!item)
// // // // //       return res.status(404).json({ success: false, message: "Not found" });

// // // // //     const last = Number(item.lastFinalPrice ?? item.basePrice ?? 0);
// // // // //     const newFinal = last + diff;

// // // // //     item.todayDiff = diff;
// // // // //     item.currentFinalPrice = newFinal;

// // // // //     await item.save();

// // // // //     const updated = await Price.findById(id)
// // // // //       .populate("category", "name")
// // // // //       .lean();

// // // // //     updated.todayDiff = Number(updated.todayDiff ?? 0);
// // // // //     updated.lastFinalPrice = Number(updated.lastFinalPrice ?? updated.basePrice ?? 0);
// // // // //     updated.currentFinalPrice = Number(updated.currentFinalPrice ?? 0);

// // // // //     res.json({ success: true, data: updated });
// // // // //   } catch (err) {
// // // // //     res.status(500).json({ success: false, message: err.message });
// // // // //   }
// // // // // };

// // // // // /* ============================================================
// // // // //    UPDATE STATUS
// // // // // ============================================================== */
// // // // // exports.updateStatus = async (req, res) => {
// // // // //   try {
// // // // //     const updated = await Price.findByIdAndUpdate(
// // // // //       req.params.id,
// // // // //       { status: req.body.status },
// // // // //       { new: true }
// // // // //     );

// // // // //     res.json({ success: true, data: updated });
// // // // //   } catch (err) {
// // // // //     res.status(500).json({ success: false, message: err.message });
// // // // //   }
// // // // // };

// // // // // /* ============================================================
// // // // //    DELETE
// // // // // ============================================================== */
// // // // // exports.deletePrice = async (req, res) => {
// // // // //   try {
// // // // //     await Price.findByIdAndDelete(req.params.id);
// // // // //     res.json({ success: true });
// // // // //   } catch (err) {
// // // // //     res.status(500).json({ success: false, message: err.message });
// // // // //   }
// // // // // };

// // // // // /* ============================================================
// // // // //    CSV IMPORT
// // // // // ============================================================== */
// // // // // exports.importPrices = async (req, res) => {
// // // // //   try {
// // // // //     if (!req.file)
// // // // //       return res.status(400).json({ success: false, message: "CSV required" });

// // // // //     const rows = [];
// // // // //     const csvData = req.file.buffer.toString("utf-8");

// // // // //     csv
// // // // //       .parseString(csvData, { headers: true })
// // // // //       .on("data", (row) => rows.push(row))
// // // // //       .on("end", async () => {
// // // // //         let inserted = 0;

// // // // //         for (const r of rows) {
// // // // //           const catName = r.categoryName?.trim() || "Uncategorized";
// // // // //           const subName = r.subcategoryName?.trim() || null;

// // // // //           let cat = await Category.findOne({ name: catName });
// // // // //           if (!cat) cat = await Category.create({ name: catName });

// // // // //           const base = Number(r.basePrice) || 0;
// // // // //           const diff = Number(r.todayDiff) || 0;

// // // // //           await Price.create({
// // // // //             name: r.name,
// // // // //             category: cat._id,
// // // // //             subcategory: subName ? { name: subName } : null,
// // // // //             basePrice: base,
// // // // //             todayDiff: diff,
// // // // //             lastFinalPrice: base,
// // // // //             currentFinalPrice: base + diff,
// // // // //             validTill: r.validTill ? new Date(r.validTill) : undefined,
// // // // //             status: r.status || "inactive",
// // // // //             description: r.description,
// // // // //             image: r.imageUrl || "",
// // // // //           });

// // // // //           inserted++;
// // // // //         }

// // // // //         res.json({ success: true, inserted });
// // // // //       });
// // // // //   } catch (err) {
// // // // //     res.status(500).json({ success: false, message: err.message });
// // // // //   }
// // // // // };

// // // // // /* ============================================================
// // // // //    CSV EXPORT
// // // // // ============================================================== */
// // // // // exports.exportPrices = async (req, res) => {
// // // // //   try {
// // // // //     const prices = await Price.find().populate("category", "name");

// // // // //     res.setHeader("Content-Disposition", "attachment; filename=prices.csv");
// // // // //     res.setHeader("Content-Type", "text/csv");

// // // // //     const csvStream = csv.format({ headers: true });
// // // // //     csvStream.pipe(res);

// // // // //     for (const p of prices) {
// // // // //       csvStream.write({
// // // // //         name: p.name,
// // // // //         categoryName: p.category?.name || "",
// // // // //         subcategoryName: p.subcategory?.name || "",
// // // // //         basePrice: p.basePrice,
// // // // //         todayDiff: p.todayDiff,
// // // // //         lastFinalPrice: p.lastFinalPrice,
// // // // //         currentFinalPrice: p.currentFinalPrice,
// // // // //         status: p.status,
// // // // //         validTill: p.validTill ? p.validTill.toISOString().split("T")[0] : "",
// // // // //         description: p.description,
// // // // //         imageUrl: p.image || "",
// // // // //       });
// // // // //     }

// // // // //     csvStream.end();
// // // // //   } catch (err) {
// // // // //     res.status(500).json({ success: false, message: err.message });
// // // // //   }
// // // // // };

// // // // // /* ============================================================
// // // // //    BULK UPDATE
// // // // // ============================================================== */
// // // // // exports.bulkUpdatePrices = async (req, res) => {
// // // // //   try {
// // // // //     const { products } = req.body;
// // // // //     const updated = [];

// // // // //     for (const p of products) {
// // // // //       const item = await Price.findById(p.id);
// // // // //       if (!item) continue;

// // // // //       const diff = Number(p.difference) || 0;
// // // // //       const newCurrent = (item.basePrice ?? 0) + diff;

// // // // //       item.name = p.name ?? item.name;
// // // // //       item.basePrice = p.basePrice ?? item.basePrice;
// // // // //       item.todayDiff = diff;
// // // // //       item.currentFinalPrice = newCurrent;
// // // // //       item.validTill = p.validTill ? new Date(p.validTill) : item.validTill;
// // // // //       item.status = p.status ?? item.status;

// // // // //       await item.save();
// // // // //       updated.push(item);
// // // // //     }

// // // // //     res.json({ success: true, updated });
// // // // //   } catch (err) {
// // // // //     res.status(500).json({ success: false, message: err.message });
// // // // //   }
// // // // // };

// // // // // /* ============================================================
// // // // //    COPY PRODUCT
// // // // // ============================================================== */
// // // // // exports.copyPrice = async (req, res) => {
// // // // //   try {
// // // // //     const item = await Price.findById(req.params.id);

// // // // //     const newItem = await Price.create({
// // // // //       name: item.name,
// // // // //       category: item.category,
// // // // //       subcategory: item.subcategory,
// // // // //       basePrice: item.basePrice,
// // // // //       todayDiff: item.todayDiff,
// // // // //       lastFinalPrice: item.lastFinalPrice,
// // // // //       currentFinalPrice: item.currentFinalPrice,
// // // // //       validTill: item.validTill,
// // // // //       description: item.description,
// // // // //       status: item.status,
// // // // //       image: null,
// // // // //     });

// // // // //     res.json({ success: true, data: newItem });
// // // // //   } catch (err) {
// // // // //     res.status(500).json({ success: false, message: err.message });
// // // // //   }
// // // // // };

// // // // // /* ============================================================
// // // // //    MIDNIGHT RESET
// // // // // ============================================================== */
// // // // // schedule.scheduleJob("0 0 * * *", async () => {
// // // // //   const prices = await Price.find();

// // // // //   for (const p of prices) {
// // // // //     p.lastFinalPrice = p.currentFinalPrice;
// // // // //     p.todayDiff = 0;
// // // // //     await p.save();
// // // // //   }

// // // // //   console.log("Midnight reset completed ✔");
// // // // // });

// // // // const Price = require("../models/priceModel");
// // // // const Category = require("../models/categoryModel");
// // // // const cloudinary = require("../utils/cloudinary");
// // // // const csv = require("fast-csv");
// // // // const schedule = require("node-schedule");

// // // // // CLOUDINARY UPLOAD
// // // // const uploadToCloudinary = (fileBuffer) => {
// // // //   return new Promise((resolve, reject) => {
// // // //     cloudinary.uploader
// // // //       .upload_stream({ folder: "price_images" }, (err, result) => {
// // // //         if (err) reject(err);
// // // //         else resolve(result.secure_url);
// // // //       })
// // // //       .end(fileBuffer);
// // // //   });
// // // // };

// // // // /* ============================================================
// // // //    CREATE (DAY 1)
// // // //    - on create: lastFinalPrice = base, todayDiff = diff, currentFinalPrice = base + diff
// // // // ============================================================ */
// // // // exports.createPrice = async (req, res) => {
// // // //   try {
// // // //     const {
// // // //       name,
// // // //       category,
// // // //       subcategory,
// // // //       basePrice,
// // // //       difference,
// // // //       validTill,
// // // //       description,
// // // //       status,
// // // //     } = req.body;

// // // //     let imageUrl = null;
// // // //     if (req.file) imageUrl = await uploadToCloudinary(req.file.buffer);

// // // //     const base = Number(basePrice) || 0;
// // // //     const diff = Number(difference) || 0;

// // // //     const price = await Price.create({
// // // //       name,
// // // //       category,
// // // //       subcategory: subcategory || null,
// // // //       basePrice: base,
// // // //       todayDiff: diff,
// // // //       lastFinalPrice: base, // initial YTD = base
// // // //       currentFinalPrice: base + diff,
// // // //       validTill: validTill ? new Date(validTill) : undefined,
// // // //       description,
// // // //       status: status || "inactive",
// // // //       image: imageUrl,
// // // //     });

// // // //     const populated = await Price.findById(price._id)
// // // //       .populate("category", "name")
// // // //       .lean();

// // // //     res.status(201).json({ success: true, data: populated });
// // // //   } catch (err) {
// // // //     res.status(500).json({ success: false, message: err.message });
// // // //   }
// // // // };

// // // // /* ============================================================
// // // //    GET ALL
// // // // ============================================================ */
// // // // exports.getPrices = async (req, res) => {
// // // //   try {
// // // //     const prices = await Price.find()
// // // //       .populate("category", "name")
// // // //       .sort({ createdAt: -1 });

// // // //     // normalize numeric fields
// // // //     const normalized = prices.map((p) => {
// // // //       const o = p.toObject();
// // // //       o.todayDiff = Number(o.todayDiff || 0);
// // // //       o.lastFinalPrice = Number(o.lastFinalPrice ?? o.basePrice ?? 0);
// // // //       o.currentFinalPrice = Number(o.currentFinalPrice ?? 0);
// // // //       return o;
// // // //     });

// // // //     res.json({ success: true, data: normalized });
// // // //   } catch (err) {
// // // //     res.status(500).json({ success: false, message: err.message });
// // // //   }
// // // // };

// // // // /* ============================================================
// // // //    GET ACTIVE (Website)
// // // // ============================================================ */
// // // // exports.getWebsitePrices = async (req, res) => {
// // // //   try {
// // // //     const prices = await Price.find({ status: "active" })
// // // //       .populate("category", "name")
// // // //       .sort({ createdAt: -1 });

// // // //     const normalized = prices.map((p) => {
// // // //       const o = p.toObject();
// // // //       o.todayDiff = Number(o.todayDiff || 0);
// // // //       o.lastFinalPrice = Number(o.lastFinalPrice ?? o.basePrice ?? 0);
// // // //       o.currentFinalPrice = Number(o.currentFinalPrice ?? 0);
// // // //       return o;
// // // //     });

// // // //     res.json({ success: true, data: normalized });
// // // //   } catch (err) {
// // // //     res.status(500).json({ success: false, message: err.message });
// // // //   }
// // // // };

// // // // /* ============================================================
// // // //    UPDATE PRICE
// // // //    Rules:
// // // //    - DO NOT change lastFinalPrice here (YTD stays same until midnight reset)
// // // //    - If basePrice changed but difference NOT provided => todayDiff = lastFinalPrice - newBase
// // // //      -> currentFinalPrice = newBase + todayDiff (=> equals lastFinalPrice)
// // // //    - If difference provided (data.difference) => todayDiff = difference and currentFinalPrice = base + difference
// // // //    - If both provided, apply difference explicitly (so difference overrides computed one)
// // // // ============================================================ */
// // // // exports.updatePrice = async (req, res) => {
// // // //   try {
// // // //     const { id } = req.params;
// // // //     const data = req.body;

// // // //     const item = await Price.findById(id);
// // // //     if (!item)
// // // //       return res.status(404).json({ success: false, message: "Not found" });

// // // //     const update = {};

// // // //     update.name = data.name ?? item.name;
// // // //     update.category = data.category ?? item.category;
// // // //     update.subcategory = data.subcategory ?? item.subcategory;
// // // //     update.description = data.description ?? item.description;
// // // //     update.validTill = data.validTill ? new Date(data.validTill) : item.validTill;
// // // //     update.status = data.status ?? item.status;

// // // //     // IMAGE
// // // //     if (req.file) update.image = await uploadToCloudinary(req.file.buffer);

// // // //     // We will use item's lastFinalPrice (YTD) as source of truth to compute diffs if needed
// // // //     const YTD = Number(item.lastFinalPrice ?? item.basePrice ?? 0);

// // // //     // 1) handle basePrice change (do NOT modify lastFinalPrice)
// // // //     let newBase = item.basePrice;
// // // //     if (data.basePrice !== undefined && data.basePrice !== "") {
// // // //       newBase = Number(data.basePrice);
// // // //       update.basePrice = newBase;
// // // //       // do not touch lastFinalPrice
// // // //     }

// // // //     // 2) decide todayDiff & currentFinalPrice
// // // //     if (data.difference !== undefined && data.difference !== "") {
// // // //       // explicit difference provided by user -> use it
// // // //       const diff = Number(data.difference);
// // // //       update.todayDiff = diff;
// // // //       update.currentFinalPrice = Number(newBase) + diff;
// // // //     } else if (data.basePrice !== undefined && data.basePrice !== "") {
// // // //       // base changed but no explicit diff -> keep YTD unchanged and set diff = YTD - base
// // // //       const computedDiff = YTD - Number(newBase);
// // // //       update.todayDiff = computedDiff;
// // // //       update.currentFinalPrice = Number(newBase) + computedDiff; // effectively equals YTD
// // // //     }
// // // //     // else: neither base nor diff changed -> nothing to do for today/current fields

// // // //     const updated = await Price.findByIdAndUpdate(id, update, {
// // // //       new: true,
// // // //     })
// // // //       .populate("category", "name")
// // // //       .lean();

// // // //     // normalize
// // // //     updated.todayDiff = Number(updated.todayDiff ?? 0);
// // // //     updated.lastFinalPrice = Number(updated.lastFinalPrice ?? updated.basePrice ?? 0);
// // // //     updated.currentFinalPrice = Number(updated.currentFinalPrice ?? 0);

// // // //     res.json({ success: true, data: updated });
// // // //   } catch (err) {
// // // //     res.status(500).json({ success: false, message: err.message });
// // // //   }
// // // // };

// // // // /* ============================================================
// // // //    QUICK DIFF (updateDiff)
// // // //    - Uses lastFinalPrice (YTD) as base
// // // //    - todayDiff = diff
// // // //    - currentFinalPrice = lastFinalPrice + diff
// // // // ============================================================ */
// // // // exports.updateDiff = async (req, res) => {
// // // //   try {
// // // //     const id = req.params.id;
// // // //     const diff = Number(req.body.diff || 0);

// // // //     const item = await Price.findById(id);
// // // //     if (!item)
// // // //       return res.status(404).json({ success: false, message: "Not found" });

// // // //     const last = Number(item.lastFinalPrice ?? item.basePrice ?? 0);
// // // //     const newFinal = last + diff;

// // // //     item.todayDiff = diff;
// // // //     item.currentFinalPrice = newFinal;

// // // //     await item.save();

// // // //     const updated = await Price.findById(id)
// // // //       .populate("category", "name")
// // // //       .lean();

// // // //     updated.todayDiff = Number(updated.todayDiff ?? 0);
// // // //     updated.lastFinalPrice = Number(updated.lastFinalPrice ?? updated.basePrice ?? 0);
// // // //     updated.currentFinalPrice = Number(updated.currentFinalPrice ?? 0);

// // // //     res.json({ success: true, data: updated });
// // // //   } catch (err) {
// // // //     res.status(500).json({ success: false, message: err.message });
// // // //   }
// // // // };

// // // // /* ============================================================
// // // //    UPDATE STATUS
// // // // ============================================================ */
// // // // exports.updateStatus = async (req, res) => {
// // // //   try {
// // // //     const updated = await Price.findByIdAndUpdate(
// // // //       req.params.id,
// // // //       { status: req.body.status },
// // // //       { new: true }
// // // //     );

// // // //     res.json({ success: true, data: updated });
// // // //   } catch (err) {
// // // //     res.status(500).json({ success: false, message: err.message });
// // // //   }
// // // // };

// // // // /* ============================================================
// // // //    DELETE
// // // // ============================================================ */
// // // // exports.deletePrice = async (req, res) => {
// // // //   try {
// // // //     await Price.findByIdAndDelete(req.params.id);
// // // //     res.json({ success: true });
// // // //   } catch (err) {
// // // //     res.status(500).json({ success: false, message: err.message });
// // // //   }
// // // // };

// // // // /* ============================================================
// // // //    CSV IMPORT
// // // //    - creates categories if needed
// // // //    - sets lastFinalPrice = base, currentFinalPrice = base + diff
// // // // ============================================================ */
// // // // exports.importPrices = async (req, res) => {
// // // //   try {
// // // //     if (!req.file)
// // // //       return res.status(400).json({ success: false, message: "CSV required" });

// // // //     const rows = [];
// // // //     const csvData = req.file.buffer.toString("utf-8");

// // // //     csv
// // // //       .parseString(csvData, { headers: true })
// // // //       .on("data", (row) => rows.push(row))
// // // //       .on("end", async () => {
// // // //         let inserted = 0;

// // // //         for (const r of rows) {
// // // //           const catName = r.categoryName?.trim() || "Uncategorized";
// // // //           const subName = r.subcategoryName?.trim() || null;

// // // //           let cat = await Category.findOne({ name: catName });
// // // //           if (!cat) cat = await Category.create({ name: catName });

// // // //           const base = Number(r.basePrice) || 0;
// // // //           const diff = Number(r.todayDiff) || 0;

// // // //           await Price.create({
// // // //             name: r.name,
// // // //             category: cat._id,
// // // //             subcategory: subName ? { name: subName } : null,
// // // //             basePrice: base,
// // // //             todayDiff: diff,
// // // //             lastFinalPrice: base,
// // // //             currentFinalPrice: base + diff,
// // // //             validTill: r.validTill ? new Date(r.validTill) : undefined,
// // // //             status: r.status || "inactive",
// // // //             description: r.description,
// // // //             image: r.imageUrl || "",
// // // //           });

// // // //           inserted++;
// // // //         }

// // // //         res.json({ success: true, inserted });
// // // //       });
// // // //   } catch (err) {
// // // //     res.status(500).json({ success: false, message: err.message });
// // // //   }
// // // // };

// // // // /* ============================================================
// // // //    CSV EXPORT
// // // // ============================================================ */
// // // // exports.exportPrices = async (req, res) => {
// // // //   try {
// // // //     const prices = await Price.find().populate("category", "name");

// // // //     res.setHeader("Content-Disposition", "attachment; filename=prices.csv");
// // // //     res.setHeader("Content-Type", "text/csv");

// // // //     const csvStream = csv.format({ headers: true });
// // // //     csvStream.pipe(res);

// // // //     for (const p of prices) {
// // // //       csvStream.write({
// // // //         name: p.name,
// // // //         categoryName: p.category?.name || "",
// // // //         subcategoryName: p.subcategory?.name || "",
// // // //         basePrice: p.basePrice,
// // // //         todayDiff: p.todayDiff,
// // // //         lastFinalPrice: p.lastFinalPrice,
// // // //         currentFinalPrice: p.currentFinalPrice,
// // // //         status: p.status,
// // // //         validTill: p.validTill ? p.validTill.toISOString().split("T")[0] : "",
// // // //         description: p.description,
// // // //         imageUrl: p.image || "",
// // // //       });
// // // //     }

// // // //     csvStream.end();
// // // //   } catch (err) {
// // // //     res.status(500).json({ success: false, message: err.message });
// // // //   }
// // // // };

// // // // /* ============================================================
// // // //    BULK UPDATE
// // // //    - For each product:
// // // //      * if difference provided -> apply diff and set currentFinal = base + diff
// // // //      * else if base changed -> compute diff = YTD - base and keep YTD unchanged (currentFinal = YTD)
// // // //      * else if only status/validTill/name -> update accordingly
// // // // ============================================================ */
// // // // exports.bulkUpdatePrices = async (req, res) => {
// // // //   try {
// // // //     const { products } = req.body;
// // // //     const updated = [];

// // // //     for (const p of products) {
// // // //       const item = await Price.findById(p.id);
// // // //       if (!item) continue;

// // // //       const YTD = Number(item.lastFinalPrice ?? item.basePrice ?? 0);

// // // //       // update fields
// // // //       if (p.name !== undefined) item.name = p.name;
// // // //       if (p.basePrice !== undefined && p.basePrice !== null) {
// // // //         const newBase = Number(p.basePrice);
// // // //         item.basePrice = newBase;
// // // //         // if p.difference provided later it'll override; otherwise compute diff so currentFinal = YTD
// // // //         if (p.difference === undefined || p.difference === null) {
// // // //           const computedDiff = YTD - newBase;
// // // //           item.todayDiff = computedDiff;
// // // //           item.currentFinalPrice = newBase + computedDiff; // => YTD
// // // //         }
// // // //       }

// // // //       if (p.difference !== undefined && p.difference !== null) {
// // // //         const diff = Number(p.difference) || 0;
// // // //         item.todayDiff = diff;
// // // //         item.currentFinalPrice = Number(item.basePrice ?? 0) + diff;
// // // //       }

// // // //       if (p.validTill) item.validTill = new Date(p.validTill);
// // // //       if (p.status) item.status = p.status;

// // // //       await item.save();
// // // //       updated.push(item);
// // // //     }

// // // //     res.json({ success: true, updated });
// // // //   } catch (err) {
// // // //     res.status(500).json({ success: false, message: err.message });
// // // //   }
// // // // };

// // // // /* ============================================================
// // // //    COPY PRODUCT
// // // // ============================================================ */
// // // // exports.copyPrice = async (req, res) => {
// // // //   try {
// // // //     const item = await Price.findById(req.params.id);

// // // //     const newItem = await Price.create({
// // // //       name: item.name,
// // // //       category: item.category,
// // // //       subcategory: item.subcategory,
// // // //       basePrice: item.basePrice,
// // // //       todayDiff: item.todayDiff,
// // // //       lastFinalPrice: item.lastFinalPrice,
// // // //       currentFinalPrice: item.currentFinalPrice,
// // // //       validTill: item.validTill,
// // // //       description: item.description,
// // // //       status: item.status,
// // // //       image: null,
// // // //     });

// // // //     res.json({ success: true, data: newItem });
// // // //   } catch (err) {
// // // //     res.status(500).json({ success: false, message: err.message });
// // // //   }
// // // // };

// // // // /* ============================================================
// // // //    MIDNIGHT RESET
// // // //    - Runs at 00:00 server time
// // // //    - lastFinalPrice = currentFinalPrice
// // // //    - todayDiff = 0
// // // // ============================================================ */
// // // // schedule.scheduleJob("0 0 * * *", async () => {
// // // //   try {
// // // //     const prices = await Price.find();

// // // //     for (const p of prices) {
// // // //       p.lastFinalPrice = p.currentFinalPrice;
// // // //       p.todayDiff = 0;
// // // //       await p.save();
// // // //     }

// // // //     console.log("Midnight reset completed ✔");
// // // //   } catch (err) {
// // // //     console.error("Midnight reset error:", err);
// // // //   }
// // // // });

// // // const Price = require("../models/priceModel");
// // // const Category = require("../models/categoryModel");
// // // const cloudinary = require("../utils/cloudinary");
// // // const csv = require("fast-csv");
// // // const schedule = require("node-schedule");

// // // // CLOUDINARY UPLOAD
// // // const uploadToCloudinary = (fileBuffer) => {
// // //   return new Promise((resolve, reject) => {
// // //     cloudinary.uploader
// // //       .upload_stream({ folder: "price_images" }, (err, result) => {
// // //         if (err) reject(err);
// // //         else resolve(result.secure_url);
// // //       })
// // //       .end(fileBuffer);
// // //   });
// // // };

// // // /* ============================================================
// // //    CREATE PRICE (DAY 1)
// // //    lastFinalPrice = null (UI → "-")
// // // ============================================================ */
// // // exports.createPrice = async (req, res) => {
// // //   try {
// // //     const {
// // //       name,
// // //       category,
// // //       subcategory,
// // //       basePrice,
// // //       difference,
// // //       validTill,
// // //       description,
// // //       status,
// // //     } = req.body;

// // //     let imageUrl = null;
// // //     if (req.file) imageUrl = await uploadToCloudinary(req.file.buffer);

// // //     const base = Number(basePrice) || 0;
// // //     const diff = Number(difference) || 0;

// // //     const price = await Price.create({
// // //       name,
// // //       category,
// // //       subcategory: subcategory || null,
// // //       basePrice: base,
// // //       todayDiff: diff,
// // //       lastFinalPrice: null, // DAY 1 → "-"
// // //       currentFinalPrice: base + diff,
// // //       validTill: validTill ? new Date(validTill) : undefined,
// // //       description,
// // //       status: status || "inactive",
// // //       image: imageUrl,
// // //     });

// // //     const populated = await Price.findById(price._id)
// // //       .populate("category", "name")
// // //       .lean();

// // //     res.status(201).json({ success: true, data: populated });
// // //   } catch (err) {
// // //     res.status(500).json({ success: false, message: err.message });
// // //   }
// // // };

// // // /* ============================================================
// // //    GET ALL
// // // ============================================================ */
// // // exports.getPrices = async (req, res) => {
// // //   try {
// // //     const prices = await Price.find()
// // //       .populate("category", "name")
// // //       .sort({ createdAt: -1 });

// // //     const normalized = prices.map((p) => {
// // //       const o = p.toObject();
// // //       o.todayDiff = Number(o.todayDiff || 0);
// // //       o.lastFinalPrice =
// // //         o.lastFinalPrice === null ? null : Number(o.lastFinalPrice);
// // //       o.currentFinalPrice = Number(o.currentFinalPrice || 0);
// // //       return o;
// // //     });

// // //     res.json({ success: true, data: normalized });
// // //   } catch (err) {
// // //     res.status(500).json({ success: false, message: err.message });
// // //   }
// // // };

// // // /* ============================================================
// // //    WEBSITE ACTIVE
// // // ============================================================ */
// // // exports.getWebsitePrices = async (req, res) => {
// // //   try {
// // //     const prices = await Price.find({ status: "active" })
// // //       .populate("category", "name")
// // //       .sort({ createdAt: -1 });

// // //     const normalized = prices.map((p) => {
// // //       const o = p.toObject();
// // //       o.todayDiff = Number(o.todayDiff || 0);
// // //       o.lastFinalPrice =
// // //         o.lastFinalPrice === null ? null : Number(o.lastFinalPrice);
// // //       o.currentFinalPrice = Number(o.currentFinalPrice || 0);
// // //       return o;
// // //     });

// // //     res.json({ success: true, data: normalized });
// // //   } catch (err) {
// // //     res.status(500).json({ success: false, message: err.message });
// // //   }
// // // };

// // // /* ============================================================
// // //    UPDATE PRICE
// // // ============================================================ */
// // // exports.updatePrice = async (req, res) => {
// // //   try {
// // //     const { id } = req.params;
// // //     const data = req.body;

// // //     const item = await Price.findById(id);
// // //     if (!item)
// // //       return res.status(404).json({ success: false, message: "Not found" });

// // //     const update = {};

// // //     update.name = data.name ?? item.name;
// // //     update.category = data.category ?? item.category;
// // //     update.subcategory = data.subcategory ?? item.subcategory;
// // //     update.description = data.description ?? item.description;
// // //     update.validTill =
// // //       data.validTill ? new Date(data.validTill) : item.validTill;
// // //     update.status = data.status ?? item.status;

// // //     if (req.file) update.image = await uploadToCloudinary(req.file.buffer);

// // //     const YTD =
// // //       item.lastFinalPrice === null
// // //         ? item.currentFinalPrice
// // //         : Number(item.lastFinalPrice);

// // //     let newBase = item.basePrice;

// // //     if (data.basePrice !== undefined && data.basePrice !== "") {
// // //       newBase = Number(data.basePrice);
// // //       update.basePrice = newBase;
// // //     }

// // //     if (data.difference !== undefined && data.difference !== "") {
// // //       const diff = Number(data.difference);
// // //       update.todayDiff = diff;
// // //       update.currentFinalPrice = newBase + diff;
// // //     } else if (data.basePrice !== undefined && data.basePrice !== "") {
// // //       const computedDiff = YTD - newBase;
// // //       update.todayDiff = computedDiff;
// // //       update.currentFinalPrice = newBase + computedDiff;
// // //     }

// // //     const updated = await Price.findByIdAndUpdate(id, update, {
// // //       new: true,
// // //     })
// // //       .populate("category", "name")
// // //       .lean();

// // //     updated.todayDiff = Number(updated.todayDiff || 0);
// // //     updated.currentFinalPrice = Number(updated.currentFinalPrice || 0);

// // //     res.json({ success: true, data: updated });
// // //   } catch (err) {
// // //     res.status(500).json({ success: false, message: err.message });
// // //   }
// // // };

// // // /* ============================================================
// // //    QUICK DIFF
// // // ============================================================ */
// // // exports.updateDiff = async (req, res) => {
// // //   try {
// // //     const id = req.params.id;
// // //     const diff = Number(req.body.diff || 0);

// // //     const item = await Price.findById(id);
// // //     if (!item)
// // //       return res.status(404).json({ success: false, message: "Not found" });

// // //     const last =
// // //       item.lastFinalPrice === null
// // //         ? item.currentFinalPrice
// // //         : Number(item.lastFinalPrice);

// // //     const newFinal = last + diff;

// // //     item.todayDiff = diff;
// // //     item.currentFinalPrice = newFinal;

// // //     await item.save();

// // //     const updated = await Price.findById(id)
// // //       .populate("category", "name")
// // //       .lean();

// // //     res.json({ success: true, data: updated });
// // //   } catch (err) {
// // //     res.status(500).json({ success: false, message: err.message });
// // //   }
// // // };

// // // /* ============================================================
// // //    STATUS
// // // ============================================================ */
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

// // // /* ============================================================
// // //    DELETE ONE
// // // ============================================================ */
// // // exports.deletePrice = async (req, res) => {
// // //   try {
// // //     await Price.findByIdAndDelete(req.params.id);
// // //     res.json({ success: true });
// // //   } catch (err) {
// // //     res.status(500).json({ success: false, message: err.message });
// // //   }
// // // };

// // // /* ============================================================
// // //    DELETE SELECTED
// // // ============================================================ */
// // // exports.deleteSelected = async (req, res) => {
// // //   try {
// // //     const { ids } = req.body;

// // //     if (!ids || !Array.isArray(ids) || ids.length === 0)
// // //       return res
// // //         .status(400)
// // //         .json({ success: false, message: "No IDs provided" });

// // //     await Price.deleteMany({ _id: { $in: ids } });

// // //     res.json({ success: true, deleted: ids.length });
// // //   } catch (err) {
// // //     res.status(500).json({ success: false, message: err.message });
// // //   }
// // // };

// // // /* ============================================================
// // //    COPY PRODUCT
// // // ============================================================ */
// // // exports.copyPrice = async (req, res) => {
// // //   try {
// // //     const item = await Price.findById(req.params.id);
// // //     if (!item) return res.json({ success: false });

// // //     const newItem = await Price.create({
// // //       name: item.name,
// // //       category: item.category,
// // //       subcategory: item.subcategory,
// // //       basePrice: item.basePrice,
// // //       todayDiff: item.todayDiff,
// // //       lastFinalPrice: item.lastFinalPrice,
// // //       currentFinalPrice: item.currentFinalPrice,
// // //       validTill: item.validTill,
// // //       description: item.description,
// // //       status: item.status,
// // //       image: null,
// // //     });

// // //     res.json({ success: true, data: newItem });
// // //   } catch (err) {
// // //     res.status(500).json({ success: false, message: err.message });
// // //   }
// // // };

// // // /* ============================================================
// // //    BULK UPDATE
// // // ============================================================ */
// // // exports.bulkUpdatePrices = async (req, res) => {
// // //   try {
// // //     const { products } = req.body;
// // //     const updated = [];

// // //     for (const p of products) {
// // //       const item = await Price.findById(p.id);
// // //       if (!item) continue;

// // //       const YTD =
// // //         item.lastFinalPrice === null
// // //           ? item.currentFinalPrice
// // //           : Number(item.lastFinalPrice);

// // //       if (p.name !== undefined) item.name = p.name;

// // //       if (p.basePrice !== undefined) {
// // //         const newBase = Number(p.basePrice);
// // //         item.basePrice = newBase;

// // //         if (p.difference === undefined) {
// // //           const diff = YTD - newBase;
// // //           item.todayDiff = diff;
// // //           item.currentFinalPrice = newBase + diff;
// // //         }
// // //       }

// // //       if (p.difference !== undefined) {
// // //         const diff = Number(p.difference);
// // //         item.todayDiff = diff;
// // //         item.currentFinalPrice = Number(item.basePrice) + diff;
// // //       }

// // //       if (p.validTill) item.validTill = new Date(p.validTill);
// // //       if (p.status) item.status = p.status;

// // //       await item.save();
// // //       updated.push(item);
// // //     }

// // //     res.json({ success: true, updated });
// // //   } catch (err) {
// // //     res.status(500).json({ success: false, message: err.message });
// // //   }
// // // };

// // // /* ============================================================
// // //    CSV IMPORT (Supports DAY-1 rules)
// // // ============================================================ */
// // // exports.importPrices = async (req, res) => {
// // //   try {
// // //     if (!req.file)
// // //       return res.status(400).json({ success: false, message: "CSV required" });

// // //     const rows = [];
// // //     const csvData = req.file.buffer.toString("utf-8");

// // //     csv
// // //       .parseString(csvData, { headers: true })
// // //       .on("data", (row) => rows.push(row))
// // //       .on("end", async () => {
// // //         let inserted = 0;

// // //         for (const r of rows) {
// // //           const catName = r.categoryName?.trim() || "Uncategorized";
// // //           const subName = r.subcategoryName?.trim() || null;

// // //           let cat = await Category.findOne({ name: catName });
// // //           if (!cat) cat = await Category.create({ name: catName });

// // //           const base = Number(r.basePrice) || 0;
// // //           const diff = Number(r.todayDiff) || 0;

// // //           const lastFinal =
// // //             r.lastFinalPrice && String(r.lastFinalPrice).trim() !== ""
// // //               ? Number(r.lastFinalPrice)
// // //               : null;

// // //           const current =
// // //             r.currentFinalPrice && String(r.currentFinalPrice).trim() !== ""
// // //               ? Number(r.currentFinalPrice)
// // //               : base + diff;

// // //           await Price.create({
// // //             name: r.name,
// // //             category: cat._id,
// // //             subcategory: subName ? { name: subName } : null,
// // //             basePrice: base,
// // //             todayDiff: diff,
// // //             lastFinalPrice: lastFinal,
// // //             currentFinalPrice: current,
// // //             validTill: r.validTill ? new Date(r.validTill) : undefined,
// // //             status: r.status || "inactive",
// // //             description: r.description || "",
// // //             image: r.imageUrl || "",
// // //           });

// // //           inserted++;
// // //         }

// // //         res.json({ success: true, inserted });
// // //       });
// // //   } catch (err) {
// // //     res.status(500).json({ success: false, message: err.message });
// // //   }
// // // };

// // // /* ============================================================
// // //    CSV EXPORT (Full)
// // // ============================================================ */
// // // exports.exportPrices = async (req, res) => {
// // //   try {
// // //     const prices = await Price.find().populate("category", "name");

// // //     res.setHeader("Content-Disposition", "attachment; filename=prices.csv");
// // //     res.setHeader("Content-Type", "text/csv");

// // //     const csvStream = csv.format({ headers: true });
// // //     csvStream.pipe(res);

// // //     for (const p of prices) {
// // //       csvStream.write({
// // //         id: p._id,
// // //         name: p.name,
// // //         categoryName: p.category?.name || "",
// // //         subcategoryName: p.subcategory?.name || "",
// // //         basePrice: p.basePrice,
// // //         todayDiff: p.todayDiff,
// // //         lastFinalPrice: p.lastFinalPrice === null ? "" : p.lastFinalPrice,
// // //         currentFinalPrice: p.currentFinalPrice,
// // //         status: p.status,
// // //         validTill: p.validTill
// // //           ? p.validTill.toISOString().split("T")[0]
// // //           : "",
// // //         description: p.description || "",
// // //         imageUrl: p.image || "",
// // //       });
// // //     }

// // //     csvStream.end();
// // //   } catch (err) {
// // //     res.status(500).json({ success: false, message: err.message });
// // //   }
// // // };

// // // /* ============================================================
// // //    EXPORT SELECTED
// // // ============================================================ */
// // // exports.exportSelected = async (req, res) => {
// // //   try {
// // //     const { ids } = req.body;

// // //     const prices = await Price.find({ _id: { $in: ids } }).populate(
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

// // //     for (const p of prices) {
// // //       csvStream.write({
// // //         id: p._id,
// // //         name: p.name,
// // //         categoryName: p.category?.name || "",
// // //         subcategoryName: p.subcategory?.name || "",
// // //         basePrice: p.basePrice,
// // //         todayDiff: p.todayDiff,
// // //         lastFinalPrice: p.lastFinalPrice === null ? "" : p.lastFinalPrice,
// // //         currentFinalPrice: p.currentFinalPrice,
// // //         status: p.status,
// // //         validTill: p.validTill
// // //           ? p.validTill.toISOString().split("T")[0]
// // //           : "",
// // //         description: p.description || "",
// // //         imageUrl: p.image || "",
// // //       });
// // //     }

// // //     csvStream.end();
// // //   } catch (err) {
// // //     res.status(500).json({ success: false, message: err.message });
// // //   }
// // // };

// // // /* ============================================================
// // //    IMPORT SELECTED CSV
// // // ============================================================ */
// // // exports.importSelected = async (req, res) => {
// // //   try {
// // //     if (!req.file)
// // //       return res.status(400).json({ success: false, message: "CSV required" });

// // //     const rows = [];
// // //     const csvData = req.file.buffer.toString("utf-8");

// // //     csv
// // //       .parseString(csvData, { headers: true })
// // //       .on("data", (row) => rows.push(row))
// // //       .on("end", async () => {
// // //         let updated = 0;

// // //         for (const r of rows) {
// // //           if (!r.id) continue;

// // //           const item = await Price.findById(r.id);
// // //           if (!item) continue;

// // //           const base = Number(r.basePrice) || 0;
// // //           const diff = Number(r.todayDiff) || 0;

// // //           item.basePrice = base;
// // //           item.todayDiff = diff;

// // //           item.lastFinalPrice =
// // //             r.lastFinalPrice && r.lastFinalPrice.trim() !== ""
// // //               ? Number(r.lastFinalPrice)
// // //               : item.lastFinalPrice;

// // //           item.currentFinalPrice =
// // //             r.currentFinalPrice && r.currentFinalPrice.trim() !== ""
// // //               ? Number(r.currentFinalPrice)
// // //               : base + diff;

// // //           item.status = r.status || item.status;

// // //           item.validTill = r.validTill ? new Date(r.validTill) : item.validTill;

// // //           item.description = r.description || item.description;

// // //           await item.save();
// // //           updated++;
// // //         }

// // //         res.json({ success: true, updated });
// // //       });
// // //   } catch (err) {
// // //     res.status(500).json({ success: false, message: err.message });
// // //   }
// // // };

// // // /* ============================================================
// // //    MIDNIGHT RESET — EVERY DAY 00:00
// // // ============================================================ */
// // // schedule.scheduleJob("0 0 * * *", async () => {
// // //   try {
// // //     const prices = await Price.find();

// // //     for (const p of prices) {
// // //       p.lastFinalPrice = p.currentFinalPrice;
// // //       p.todayDiff = 0;
// // //       await p.save();
// // //     }

// // //     console.log("Midnight reset completed ✔");
// // //   } catch (err) {
// // //     console.error("Midnight reset error:", err);
// // //   }
// // // });

// // const Price = require("../models/priceModel");
// // const Category = require("../models/categoryModel");
// // const cloudinary = require("../utils/cloudinary");
// // const csv = require("fast-csv");
// // const schedule = require("node-schedule");

// // // CLOUDINARY UPLOAD
// // const uploadToCloudinary = (fileBuffer) => {
// //   return new Promise((resolve, reject) => {
// //     cloudinary.uploader
// //       .upload_stream({ folder: "price_images" }, (err, result) => {
// //         if (err) reject(err);
// //         else resolve(result.secure_url);
// //       })
// //       .end(fileBuffer);
// //   });
// // };

// // /* ============================================================
// //    CREATE PRICE
// // ============================================================ */
// // exports.createPrice = async (req, res) => {
// //   try {
// //     const {
// //       name,
// //       category,
// //       subcategory,
// //       basePrice,
// //       profitLoss,
// //       description,
// //       status,
// //     } = req.body;

// //     let imageUrl = null;
// //     if (req.file) imageUrl = await uploadToCloudinary(req.file.buffer);

// //     const base = Number(basePrice);
// //     const pl = Number(profitLoss);

// //     // SALE = BASE + PROFIT/LOSS
// //     const sale = base + pl;

// //     const price = await Price.create({
// //       name,
// //       category,
// //       subcategory: subcategory || null,
// //       basePrice: base,
// //       profitLoss: pl,
// //       salePrice: sale,

// //       // DAY 1 RULE
// //       lockedPrice: 0,
// //       yesterdayLock: 0,
// //       brokerDisplay: 0,

// //       description,
// //       status,
// //       image: imageUrl,
// //     });

// //     const populated = await Price.findById(price._id)
// //       .populate("category", "name")
// //       .lean();

// //     res.status(201).json({ success: true, data: populated });
// //   } catch (err) {
// //     res.status(500).json({ success: false, message: err.message });
// //   }
// // };

// // /* ============================================================
// //    GET ALL
// // ============================================================ */
// // exports.getPrices = async (req, res) => {
// //   try {
// //     const prices = await Price.find()
// //       .populate("category", "name")
// //       .sort({ createdAt: -1 });

// //     res.json({ success: true, data: prices });
// //   } catch (err) {
// //     res.status(500).json({ success: false, message: err.message });
// //   }
// // };

// // /* ============================================================
// //    WEBSITE ACTIVE API
// // ============================================================ */
// // exports.getWebsitePrices = async (req, res) => {
// //   try {
// //     const prices = await Price.find({ status: "active" })
// //       .populate("category", "name")
// //       .sort({ createdAt: -1 });

// //     res.json({ success: true, data: prices });
// //   } catch (err) {
// //     res.status(500).json({ success: false, message: err.message });
// //   }
// // };

// // /* ============================================================
// //    UPDATE (BASE PRICE + PROFIT LOSS SUPPORT)
// // ============================================================ */
// // exports.updatePrice = async (req, res) => {
// //   try {
// //     const { id } = req.params;
// //     const body = req.body;

// //     let item = await Price.findById(id);
// //     if (!item)
// //       return res.status(404).json({ success: false, message: "Not found" });

// //     if (req.file) body.image = await uploadToCloudinary(req.file.buffer);

// //     if (body.basePrice !== undefined)
// //       item.basePrice = Number(body.basePrice);

// //     if (body.profitLoss !== undefined)
// //       item.profitLoss = Number(body.profitLoss);

// //     // SALE PRICE ALWAYS RECALCULATE
// //     item.salePrice = Number(item.basePrice) + Number(item.profitLoss);

// //     if (body.name) item.name = body.name;
// //     if (body.description) item.description = body.description;
// //     if (body.status) item.status = body.status;

// //     await item.save();

// //     const updated = await Price.findById(id).populate("category", "name");

// //     res.json({ success: true, data: updated });

// //   } catch (err) {
// //     res.status(500).json({ success: false, message: err.message });
// //   }
// // };

// // /* ============================================================
// //    QUICK DIFF (ADDITIONAL PROFIT/LOSS)
// // ============================================================ */
// // exports.updateDiff = async (req, res) => {
// //   try {
// //     const id = req.params.id;
// //     const diff = Number(req.body.diff);

// //     let item = await Price.findById(id);
// //     if (!item)
// //       return res.status(404).json({ success: false, message: "Not found" });

    
// //     item.profitLoss = diff; 
// //     item.salePrice = item.basePrice + item.profitLoss;

// //     await item.save();

// //     const updated = await Price.findById(id).populate("category", "name");

// //     res.json({ success: true, data: updated });
// //   } catch (err) {
// //     res.status(500).json({ success: false, message: err.message });
// //   }
// // };

// // /* ============================================================
// //    STATUS CHANGE
// // ============================================================ */
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

// // /* ============================================================
// //    DELETE SINGLE
// // ============================================================ */
// // exports.deletePrice = async (req, res) => {
// //   try {
// //     await Price.findByIdAndDelete(req.params.id);
// //     res.json({ success: true });
// //   } catch (err) {
// //     res.status(500).json({ success: false, message: err.message });
// //   }
// // };

// // /* ============================================================
// //    DELETE SELECTED
// // ============================================================ */
// // exports.deleteSelected = async (req, res) => {
// //   try {
// //     const { ids } = req.body;

// //     await Price.deleteMany({ _id: { $in: ids } });

// //     res.json({ success: true, deleted: ids.length });
// //   } catch (err) {
// //     res.status(500).json({ success: false, message: err.message });
// //   }
// // };

// // /* ============================================================
// //    COPY PRODUCT
// // ============================================================ */
// // exports.copyPrice = async (req, res) => {
// //   try {
// //     const item = await Price.findById(req.params.id);
// //     if (!item) return res.json({ success: false });

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
// //       status: item.status,
// //       description: item.description,
// //       image: null,
// //     });

// //     res.json({ success: true, data: newItem });
// //   } catch (err) {
// //     res.status(500).json({ success: false, message: err.message });
// //   }
// // };

// // /* ============================================================
// //    BULK UPDATE
// // ============================================================ */
// // exports.bulkUpdatePrices = async (req, res) => {
// //   try {
// //     const { products } = req.body;
// //     const updated = [];

// //     for (const p of products) {
// //       let item = await Price.findById(p.id);
// //       if (!item) continue;

// //       if (p.basePrice !== undefined)
// //         item.basePrice = Number(p.basePrice);

// //       if (p.profitLoss !== undefined)
// //         item.profitLoss = Number(p.profitLoss);

// //       // Always recalc sale
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

// // /* ============================================================
// //    CSV IMPORT
// // ============================================================ */
// // exports.importPrices = async (req, res) => {
// //   try {
// //     if (!req.file)
// //       return res.status(400).json({ success: false, message: "CSV required" });

// //     const rows = [];
// //     const csvData = req.file.buffer.toString("utf8");

// //     csv
// //       .parseString(csvData, { headers: true })
// //       .on("data", (row) => rows.push(row))
// //       .on("end", async () => {
// //         for (const r of rows) {
// //           let cat = await Category.findOne({ name: r.categoryName });
// //           if (!cat) cat = await Category.create({ name: r.categoryName });

// //           await Price.create({
// //             name: r.name,
// //             category: cat._id,
// //             basePrice: Number(r.basePrice),
// //             profitLoss: Number(r.profitLoss),
// //             salePrice: Number(r.basePrice) + Number(r.profitLoss),
// //             lockedPrice: 0,
// //             yesterdayLock: 0,
// //             brokerDisplay: 0,
// //             description: r.description || "",
// //             status: r.status || "inactive",
// //             image: r.imageUrl || "",
// //           });
// //         }

// //         res.json({ success: true, inserted: rows.length });
// //       });
// //   } catch (err) {
// //     res.status(500).json({ success: false, message: err.message });
// //   }
// // };

// // /* ============================================================
// //    CSV EXPORT
// // ============================================================ */
// // exports.exportPrices = async (req, res) => {
// //   try {
// //     const prices = await Price.find().populate("category", "name");

// //     res.setHeader("Content-Disposition", "attachment; filename=prices.csv");
// //     res.setHeader("Content-Type", "text/csv");

// //     const csvStream = csv.format({ headers: true });
// //     csvStream.pipe(res);

// //     for (const p of prices) {
// //       csvStream.write({
// //         id: p._id,
// //         name: p.name,
// //         categoryName: p.category?.name || "",
// //         basePrice: p.basePrice,
// //         profitLoss: p.profitLoss,
// //         salePrice: p.salePrice,
// //         lockedPrice: p.lockedPrice,
// //         yesterdayLock: p.yesterdayLock,
// //         brokerDisplay: p.brokerDisplay,
// //         status: p.status,
// //         description: p.description,
// //         imageUrl: p.image,
// //       });
// //     }

// //     csvStream.end();
// //   } catch (err) {
// //     res.status(500).json({ success: false, message: err.message });
// //   }
// // };

// // /* ============================================================
// //    MIDNIGHT AUTO LOCK LOGIC
// // ============================================================ */
// // schedule.scheduleJob("0 0 * * *", async () => {
// //   try {
// //     const items = await Price.find();

// //     for (const p of items) {
// //       const yesterday = p.lockedPrice;

// //       const todayLock = p.salePrice;

// //       p.yesterdayLock = yesterday;
// //       p.lockedPrice = todayLock;
// //       p.brokerDisplay = todayLock - yesterday;

// //       await p.save();
// //     }

// //     console.log("🔁 Midnight Lock Update Completed");
// //   } catch (err) {
// //     console.error("Midnight Error:", err);
// //   }
// // });


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
const Category = require("../models/categoryModel");
const cloudinary = require("../utils/cloudinary");
const csv = require("fast-csv");
const schedule = require("node-schedule");

/* ============================================================
   CLOUDINARY UPLOAD
============================================================ */
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

/* ============================================================
   AUTO LOCK FUNCTION (FOR VERCEL)
============================================================ */
async function runDailyLock() {
  const items = await Price.find();

  for (const p of items) {
    const yesterday = p.lockedPrice;
    const todayLock = p.salePrice;

    p.yesterdayLock = yesterday;
    p.lockedPrice = todayLock;

    if (yesterday === 0) {
      p.brokerDisplay = 0;
    } else {
      p.brokerDisplay = todayLock - yesterday;
    }

    await p.save();
  }

  console.log("🔁 Auto Lock Executed (Vercel Safe Mode)");
}

/* ============================================================
   GET ALL (AUTO-LOCK INCLUDED)
============================================================ */
exports.getPrices = async (req, res) => {
  try {
    await runDailyLock(); // Vercel safe auto-lock

    const prices = await Price.find()
      .populate("category", "name")
      .sort({ createdAt: -1 });

    res.json({ success: true, data: prices });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* ============================================================
   CREATE PRICE
============================================================ */
exports.createPrice = async (req, res) => {
  try {
    const {
      name, category, subcategory,
      basePrice, profitLoss, description, status
    } = req.body;

    let imageUrl = null;
    if (req.file) imageUrl = await uploadToCloudinary(req.file.buffer);

    const base = Number(basePrice);
    const pl = Number(profitLoss);
    const sale = base + pl;

    const price = await Price.create({
      name, category,
      subcategory: subcategory || null,
      basePrice: base,
      profitLoss: pl,
      salePrice: sale,

      lockedPrice: 0,
      yesterdayLock: 0,
      brokerDisplay: 0,

      description,
      status,
      image: imageUrl,
    });

    const populated = await Price.findById(price._id)
      .populate("category", "name")
      .lean();

    res.status(201).json({ success: true, data: populated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* ============================================================
   WEBSITE ACTIVE API
============================================================ */
exports.getWebsitePrices = async (req, res) => {
  try {
    await runDailyLock();

    const prices = await Price.find({ status: "active" })
      .populate("category", "name")
      .sort({ createdAt: -1 });

    res.json({ success: true, data: prices });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* ============================================================
   UPDATE PRICE
============================================================ */
exports.updatePrice = async (req, res) => {
  try {
    const { id } = req.params;
    const body = req.body;

    let item = await Price.findById(id);
    if (!item) return res.status(404).json({ success: false, message: "Not found" });

    if (req.file) item.image = await uploadToCloudinary(req.file.buffer);

    if (body.basePrice !== undefined) item.basePrice = Number(body.basePrice);
    if (body.profitLoss !== undefined) item.profitLoss = Number(body.profitLoss);

    item.salePrice = item.basePrice + item.profitLoss;

    if (body.name) item.name = body.name;
    if (body.description) item.description = body.description;
    if (body.status) item.status = body.status;

    await item.save();

    const updated = await Price.findById(id).populate("category", "name");
    res.json({ success: true, data: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* ============================================================
   QUICK PROFIT/LOSS UPDATE
============================================================ */
exports.updateDiff = async (req, res) => {
  try {
    const id = req.params.id;
    const diff = Number(req.body.diff);

    let item = await Price.findById(id);
    if (!item)
      return res.status(404).json({ success: false, message: "Not found" });

    item.profitLoss = diff;
    item.salePrice = item.basePrice + diff;

    await item.save();

    const updated = await Price.findById(id).populate("category", "name");
    res.json({ success: true, data: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* ============================================================
   STATUS UPDATE
============================================================ */
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

/* ============================================================
   DELETE PRICE
============================================================ */
exports.deletePrice = async (req, res) => {
  try {
    await Price.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* ============================================================
   BULK UPDATE
============================================================ */
exports.bulkUpdatePrices = async (req, res) => {
  try {
    const { products } = req.body;
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

/* ============================================================
   MIDNIGHT SERVER LOCK (FOR LOCAL SERVER ONLY)
============================================================ */
schedule.scheduleJob("0 0 * * *", async () => {
  try {
    await runDailyLock();
    console.log("🌙 Midnight Lock Executed (Server Mode)");
  } catch (err) {
    console.error("Midnight Error:", err);
  }
});

