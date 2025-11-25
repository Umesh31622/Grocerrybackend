
// // // // const Price = require("../models/priceModel");
// // // // const Category = require("../models/categoryModel");
// // // // const cloudinary = require("../utils/cloudinary");
// // // // const csv = require("fast-csv");

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

// // // // /* ------------------------------------------------------------------
// // // //    CREATE PRICE (Manual Status)
// // // // ------------------------------------------------------------------- */
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
// // // //       status
// // // //     } = req.body;

// // // //     let imageUrl = null;
// // // //     if (req.file) {
// // // //       imageUrl = await uploadToCloudinary(req.file.buffer);
// // // //     }

// // // //     const price = await Price.create({
// // // //       name,
// // // //       category,
// // // //       subcategory: subcategory || null,
// // // //       basePrice: parseFloat(basePrice),
// // // //       difference: parseFloat(difference) || 0,
// // // //       validTill: validTill ? new Date(validTill) : undefined,
// // // //       description,
// // // //       status: status || "inactive", // 👈 manual status
// // // //       image: imageUrl,
// // // //     });

// // // //     const populated = await Price.findById(price._id)
// // // //       .populate("category", "name")
// // // //       .populate("subcategory", "name");

// // // //     res.status(201).json({ success: true, data: populated });
// // // //   } catch (err) {
// // // //     res.status(500).json({ success: false, message: err.message });
// // // //   }
// // // // };

// // // // /* ------------------------------------------------------------------
// // // //    GET ALL (Admin)
// // // // ------------------------------------------------------------------- */
// // // // exports.getPrices = async (req, res) => {
// // // //   try {
// // // //     const prices = await Price.find()
// // // //       .populate("category", "name")
// // // //       .populate("subcategory", "name")
// // // //       .sort({ createdAt: -1 });

// // // //     const data = prices.map((p) => ({
// // // //       ...p._doc,
// // // //       finalPrice: p.basePrice + (p.difference || 0),
// // // //     }));

// // // //     res.json({ success: true, data });
// // // //   } catch (err) {
// // // //     res.status(500).json({ success: false, message: err.message });
// // // //   }
// // // // };

// // // // /* ------------------------------------------------------------------
// // // //    WEBSITE API (Only Active Products)
// // // // ------------------------------------------------------------------- */
// // // // exports.getWebsitePrices = async (req, res) => {
// // // //   try {
// // // //     const prices = await Price.find({ status: "active" })
// // // //       .populate("category", "name")
// // // //       .populate("subcategory", "name")
// // // //       .sort({ createdAt: -1 });

// // // //     const data = prices.map((p) => ({
// // // //       ...p._doc,
// // // //       finalPrice: p.basePrice + (p.difference || 0),
// // // //     }));

// // // //     res.json({ success: true, data });

// // // //   } catch (err) {
// // // //     res.status(500).json({ success: false, message: err.message });
// // // //   }
// // // // };

// // // // /* ------------------------------------------------------------------
// // // //    UPDATE PRICE (Manual Status)
// // // // ------------------------------------------------------------------- */
// // // // exports.updatePrice = async (req, res) => {
// // // //   try {
// // // //     const { id } = req.params;
// // // //     const {
// // // //       name,
// // // //       category,
// // // //       subcategory,
// // // //       basePrice,
// // // //       difference,
// // // //       validTill,
// // // //       description,
// // // //       status
// // // //     } = req.body;

// // // //     const updateData = {
// // // //       name,
// // // //       category,
// // // //       subcategory: subcategory || null,
// // // //       basePrice: parseFloat(basePrice),
// // // //       difference: parseFloat(difference) || 0,
// // // //       validTill: validTill ? new Date(validTill) : undefined,
// // // //       description,
// // // //       status, // 👈 fixed
// // // //     };

// // // //     if (req.file) {
// // // //       updateData.image = await uploadToCloudinary(req.file.buffer);
// // // //     }

// // // //     const updated = await Price.findByIdAndUpdate(id, updateData, {
// // // //       new: true,
// // // //     })
// // // //       .populate("category", "name")
// // // //       .populate("subcategory", "name");

// // // //     res.json({ success: true, data: updated });
// // // //   } catch (err) {
// // // //     res.status(500).json({ success: false, message: err.message });
// // // //   }
// // // // };

// // // // /* ------------------------------------------------------------------
// // // //    UPDATE STATUS (Toggle Button)
// // // // ------------------------------------------------------------------- */
// // // // exports.updateStatus = async (req, res) => {
// // // //   try {
// // // //     const { id } = req.params;

// // // //     const updated = await Price.findByIdAndUpdate(
// // // //       id,
// // // //       { status: req.body.status },
// // // //       { new: true }
// // // //     )
// // // //       .populate("category", "name")
// // // //       .populate("subcategory", "name");

// // // //     res.json({ success: true, data: updated });
// // // //   } catch (err) {
// // // //     res.status(500).json({ success: false, message: err.message });
// // // //   }
// // // // };

// // // // /* ------------------------------------------------------------------
// // // //  DELETE PRICE
// // // // ------------------------------------------------------------------- */
// // // // exports.deletePrice = async (req, res) => {
// // // //   try {
// // // //     await Price.findByIdAndDelete(req.params.id);
// // // //     res.json({ success: true });
// // // //   } catch (err) {
// // // //     res.status(500).json({ success: false, message: err.message });
// // // //   }
// // // // };

// // // // /* ------------------------------------------------------------------
// // // //  CSV IMPORT
// // // // ------------------------------------------------------------------- */
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
// // // //         const inserted = [];

// // // //         for (const r of rows) {
// // // //           const catName = r.categoryName?.trim() || "Uncategorized";
// // // //           const subName = r.subcategoryName?.trim() || null;

// // // //           let category = await Category.findOne({ name: catName });
// // // //           if (!category) category = await Category.create({ name: catName });

// // // //           let subcategoryId = null;

// // // //           if (subName) {
// // // //             const sub = category.subcategories.find(
// // // //               (s) => s.name.toLowerCase() === subName.toLowerCase()
// // // //             );
// // // //             if (sub) subcategoryId = sub._id;
// // // //           }

// // // //           const price = await Price.create({
// // // //             name: r.name,
// // // //             category: category._id,
// // // //             subcategory: subcategoryId,
// // // //             basePrice: Number(r.basePrice),
// // // //             difference: Number(r.difference),
// // // //             validTill: r.validTill ? new Date(r.validTill) : undefined,
// // // //             status: r.status || "inactive", // 👈 CSV also controlled
// // // //           });

// // // //           inserted.push(price);
// // // //         }

// // // //         res.json({ success: true, inserted: inserted.length });
// // // //       });
// // // //   } catch (err) {
// // // //     res.status(500).json({ success: false, message: err.message });
// // // //   }
// // // // };

// // // // /* ------------------------------------------------------------------
// // // //  CSV EXPORT
// // // // ------------------------------------------------------------------- */
// // // // exports.exportPrices = async (req, res) => {
// // // //   try {
// // // //     const prices = await Price.find()
// // // //       .populate("category", "name")
// // // //       .populate("subcategory", "name");

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
// // // //         difference: p.difference,
// // // //         finalPrice: p.basePrice + p.difference,
// // // //         status: p.status,
// // // //         validTill: p.validTill
// // // //           ? p.validTill.toISOString().split("T")[0]
// // // //           : "",
// // // //         description: p.description,
// // // //         imageUrl: p.image || "",
// // // //       });
// // // //     }

// // // //     csvStream.end();
// // // //   } catch (err) {
// // // //     res.status(500).json({ success: false, message: err.message });
// // // //   }
// // // // };

// // // // /* ------------------------------------------------------------------
// // // //  BULK UPDATE
// // // // ------------------------------------------------------------------- */
// // // // exports.bulkUpdatePrices = async (req, res) => {
// // // //   try {
// // // //     const { products } = req.body;

// // // //     const updated = [];

// // // //     for (const p of products) {
// // // //       const u = await Price.findByIdAndUpdate(
// // // //         p.id,
// // // //         {
// // // //           name: p.name,
// // // //           basePrice: p.basePrice,
// // // //           difference: p.difference,
// // // //           validTill: p.validTill,
// // // //           status: p.status, // 👈 FIXED
// // // //         },
// // // //         { new: true }
// // // //       );

// // // //       updated.push(u);
// // // //     }

// // // //     res.json({ success: true, updated });
// // // //   } catch (err) {
// // // //     res.status(500).json({ success: false, message: err.message });
// // // //   }
// // // // };

// // // // /* ------------------------------------------------------------------
// // // //  COPY PRODUCT
// // // // ------------------------------------------------------------------- */
// // // // exports.copyPrice = async (req, res) => {
// // // //   try {
// // // //     const item = await Price.findById(req.params.id);

// // // //     const newPrice = await Price.create({
// // // //       name: item.name,
// // // //       category: item.category,
// // // //       subcategory: item.subcategory,
// // // //       basePrice: item.basePrice,
// // // //       difference: item.difference,
// // // //       validTill: item.validTill,
// // // //       description: item.description,
// // // //       status: item.status, // copy same status
// // // //       image: null,
// // // //     });

// // // //     res.json({ success: true, data: newPrice });
// // // //   } catch (err) {
// // // //     res.status(500).json({ success: false, message: err.message });
// // // //   }
// // // // };

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
// // //    CREATE PRICE (Base is fixed, first day final = base + diff)
// // // ============================================================== */
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
// // //       status
// // //     } = req.body;

// // //     let imageUrl = null;
// // //     if (req.file) {
// // //       imageUrl = await uploadToCloudinary(req.file.buffer);
// // //     }

// // //     const base = Number(basePrice);
// // //     const diff = Number(difference) || 0;

// // //     const initialFinal = base + diff;

// // //     const price = await Price.create({
// // //       name,
// // //       category,
// // //       subcategory: subcategory || null,
// // //       basePrice: base,                // FIXED
// // //       todayDiff: diff,
// // //       lastFinalPrice: base,           // First day yesterday final = base
// // //       currentFinalPrice: initialFinal,
// // //       validTill: validTill ? new Date(validTill) : undefined,
// // //       description,
// // //       status: status || "inactive",
// // //       image: imageUrl
// // //     });

// // //     const populated = await Price.findById(price._id)
// // //       .populate("category", "name")
// // //       .populate("subcategory", "name");

// // //     res.status(201).json({ success: true, data: populated });

// // //   } catch (err) {
// // //     res.status(500).json({ success: false, message: err.message });
// // //   }
// // // };

// // // /* ============================================================
// // //     GET ALL PRICES (Admin)
// // // ============================================================== */
// // // exports.getPrices = async (req, res) => {
// // //   try {
// // //     const prices = await Price.find()
// // //       .populate("category", "name")
// // //       .populate("subcategory", "name")
// // //       .sort({ createdAt: -1 });

// // //     res.json({ success: true, data: prices });

// // //   } catch (err) {
// // //     res.status(500).json({ success: false, message: err.message });
// // //   }
// // // };

// // // /* ============================================================
// // //     WEBSITE API (Only active products)
// // // ============================================================== */
// // // exports.getWebsitePrices = async (req, res) => {
// // //   try {
// // //     const prices = await Price.find({ status: "active" })
// // //       .populate("category", "name")
// // //       .populate("subcategory", "name")
// // //       .sort({ createdAt: -1 });

// // //     res.json({ success: true, data: prices });

// // //   } catch (err) {
// // //     res.status(500).json({ success: false, message: err.message });
// // //   }
// // // };

// // // /* ============================================================
// // //    UPDATE PRICE (Base and fields only)
// // // ============================================================== */
// // // exports.updatePrice = async (req, res) => {
// // //   try {
// // //     const { id } = req.params;
// // //     const {
// // //       name,
// // //       category,
// // //       subcategory,
// // //       basePrice,
// // //       validTill,
// // //       description,
// // //       status
// // //     } = req.body;

// // //     const updateData = {
// // //       name,
// // //       category,
// // //       subcategory: subcategory || null,
// // //       basePrice: Number(basePrice),
// // //       validTill: validTill ? new Date(validTill) : undefined,
// // //       description,
// // //       status,
// // //     };

// // //     if (req.file) {
// // //       updateData.image = await uploadToCloudinary(req.file.buffer);
// // //     }

// // //     const updated = await Price.findByIdAndUpdate(id, updateData, {
// // //       new: true,
// // //     })
// // //       .populate("category", "name")
// // //       .populate("subcategory", "name");

// // //     res.json({ success: true, data: updated });

// // //   } catch (err) {
// // //     res.status(500).json({ success: false, message: err.message });
// // //   }
// // // };

// // // /* ============================================================
// // //    UPDATE DIFF (THE MOST IMPORTANT PART)
// // // ============================================================== */
// // // exports.updateDiff = async (req, res) => {
// // //   try {
// // //     const { id } = req.params;
// // //     const { diff } = req.body;

// // //     const p = await Price.findById(id);
// // //     if (!p) return res.status(404).json({ success: false, message: "Not found" });

// // //     const difference = Number(diff) || 0;

// // //     // ALWAYS use yesterday's final
// // //     const newFinal = p.lastFinalPrice + difference;

// // //     p.todayDiff = difference;           // overwrite same day diff
// // //     p.currentFinalPrice = newFinal;

// // //     await p.save();

// // //     res.json({ success: true, data: p });

// // //   } catch (err) {
// // //     res.status(500).json({ success: false, message: err.message });
// // //   }
// // // };

// // // /* ============================================================
// // //    UPDATE STATUS (Toggle)
// // // ============================================================== */
// // // exports.updateStatus = async (req, res) => {
// // //   try {
// // //     const { id } = req.params;

// // //     const updated = await Price.findByIdAndUpdate(
// // //       id,
// // //       { status: req.body.status },
// // //       { new: true }
// // //     );

// // //     res.json({ success: true, data: updated });

// // //   } catch (err) {
// // //     res.status(500).json({ success: false, message: err.message });
// // //   }
// // // };

// // // /* ============================================================
// // //    DELETE PRICE
// // // ============================================================== */
// // // exports.deletePrice = async (req, res) => {
// // //   try {
// // //     await Price.findByIdAndDelete(req.params.id);
// // //     res.json({ success: true });

// // //   } catch (err) {
// // //     res.status(500).json({ success: false, message: err.message });
// // //   }
// // // };

// // // /* ============================================================
// // //    CSV IMPORT
// // // ============================================================== */
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
// // //         const inserted = [];

// // //         for (const r of rows) {
// // //           const catName = r.categoryName?.trim() || "Uncategorized";
// // //           const subName = r.subcategoryName?.trim() || null;

// // //           let category = await Category.findOne({ name: catName });
// // //           if (!category) category = await Category.create({ name: catName });

// // //           let subcategoryId = null;
// // //           if (subName) {
// // //             const sub = category.subcategories.find(
// // //               (s) => s.name.toLowerCase() === subName.toLowerCase()
// // //             );
// // //             if (sub) subcategoryId = sub._id;
// // //           }

// // //           const base = Number(r.basePrice) || 0;
// // //           const diff = Number(r.difference) || 0;

// // //           const initialFinal = base + diff;

// // //           const price = await Price.create({
// // //             name: r.name,
// // //             category: category._id,
// // //             subcategory: subcategoryId,
// // //             basePrice: base,
// // //             todayDiff: diff,
// // //             lastFinalPrice: base,
// // //             currentFinalPrice: initialFinal,
// // //             validTill: r.validTill ? new Date(r.validTill) : undefined,
// // //             status: r.status || "inactive",
// // //             description: r.description,
// // //             image: r.imageUrl || "",
// // //           });

// // //           inserted.push(price);
// // //         }

// // //         res.json({ success: true, inserted: inserted.length });
// // //       });

// // //   } catch (err) {
// // //     res.status(500).json({ success: false, message: err.message });
// // //   }
// // // };

// // // /* ============================================================
// // //    CSV EXPORT
// // // ============================================================== */
// // // exports.exportPrices = async (req, res) => {
// // //   try {
// // //     const prices = await Price.find()
// // //       .populate("category", "name")
// // //       .populate("subcategory", "name");

// // //     res.setHeader("Content-Disposition", "attachment; filename=prices.csv");
// // //     res.setHeader("Content-Type", "text/csv");

// // //     const csvStream = csv.format({ headers: true });
// // //     csvStream.pipe(res);

// // //     for (const p of prices) {
// // //       csvStream.write({
// // //         name: p.name,
// // //         categoryName: p.category?.name || "",
// // //         subcategoryName: p.subcategory?.name || "",
// // //         basePrice: p.basePrice,
// // //         todayDiff: p.todayDiff,
// // //         lastFinalPrice: p.lastFinalPrice,
// // //         currentFinalPrice: p.currentFinalPrice,
// // //         status: p.status,
// // //         validTill: p.validTill
// // //           ? p.validTill.toISOString().split("T")[0]
// // //           : "",
// // //         description: p.description,
// // //         imageUrl: p.image || "",
// // //       });
// // //     }

// // //     csvStream.end();

// // //   } catch (err) {
// // //     res.status(500).json({ success: false, message: err.message });
// // //   }
// // // };

// // // /* ============================================================
// // //    BULK UPDATE
// // // ============================================================== */
// // // exports.bulkUpdatePrices = async (req, res) => {
// // //   try {
// // //     const { products } = req.body;

// // //     const updated = [];

// // //     for (const p of products) {
// // //       const item = await Price.findById(p.id);

// // //       const diff = Number(p.difference) || 0;

// // //       // Update formula
// // //       const newFinal = item.lastFinalPrice + diff;

// // //       item.name = p.name;
// // //       item.basePrice = p.basePrice;
// // //       item.todayDiff = diff;
// // //       item.currentFinalPrice = newFinal;
// // //       item.validTill = p.validTill;
// // //       item.status = p.status;

// // //       await item.save();
// // //       updated.push(item);
// // //     }

// // //     res.json({ success: true, updated });

// // //   } catch (err) {
// // //     res.status(500).json({ success: false, message: err.message });
// // //   }
// // // };

// // // /* ============================================================
// // //    COPY PRODUCT
// // // ============================================================== */
// // // exports.copyPrice = async (req, res) => {
// // //   try {
// // //     const item = await Price.findById(req.params.id);

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
// // //    AUTO RESET AT MIDNIGHT (IMPORTANT)
// // // ============================================================== */
// // // schedule.scheduleJob("0 0 * * *", async () => {
// // //   const prices = await Price.find();

// // //   for (const p of prices) {
// // //     p.lastFinalPrice = p.currentFinalPrice;  // move today → yesterday
// // //     p.todayDiff = 0;                         // reset diff
// // //     await p.save();
// // //   }

// // //   console.log("Midnight reset completed ✔");
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
// //    CREATE PRICE (DAY 1 => base + diff)
// // ============================================================== */
// // exports.createPrice = async (req, res) => {
// //   try {
// //     const {
// //       name,
// //       category,
// //       subcategory,
// //       basePrice,
// //       difference,
// //       validTill,
// //       description,
// //       status
// //     } = req.body;

// //     let imageUrl = null;
// //     if (req.file) {
// //       imageUrl = await uploadToCloudinary(req.file.buffer);
// //     }

// //     const base = Number(basePrice) || 0;
// //     const diff = Number(difference) || 0;
// //     const initialFinal = base + diff;

// //     const price = await Price.create({
// //       name,
// //       category,
// //       subcategory: subcategory || null,
// //       basePrice: base,
// //       todayDiff: diff,
// //       lastFinalPrice: base, // day1 yesterday = base
// //       currentFinalPrice: initialFinal,
// //       validTill: validTill ? new Date(validTill) : undefined,
// //       description,
// //       status: status || "inactive",
// //       image: imageUrl
// //     });

// //     const populated = await Price.findById(price._id)
// //       .populate("category", "name");

// //     res.status(201).json({ success: true, data: populated });
// //   } catch (err) {
// //     res.status(500).json({ success: false, message: err.message });
// //   }
// // };

// // /* ============================================================
// //     GET ALL PRICES (Admin)
// // ============================================================== */
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
// //     WEBSITE API (Only active)
// // ============================================================== */
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
// //    UPDATE PRICE (BASE, TEXT FIELDS)
// // ============================================================== */
// // exports.updatePrice = async (req, res) => {
// //   try {
// //     const { id } = req.params;
// //     const {
// //       name,
// //       category,
// //       subcategory,
// //       basePrice,
// //       validTill,
// //       description,
// //       status
// //     } = req.body;

// //     const existing = await Price.findById(id);
// //     if (!existing) {
// //       return res.status(404).json({ success: false, message: "Not found" });
// //     }

// //     const updateData = {
// //       name: name ?? existing.name,
// //       category: category ?? existing.category,
// //       subcategory: subcategory ?? existing.subcategory,
// //       validTill: validTill ? new Date(validTill) : existing.validTill,
// //       description: description ?? existing.description,
// //       status: status ?? existing.status
// //     };

// //     if (req.file) {
// //       updateData.image = await uploadToCloudinary(req.file.buffer);
// //     }

// //     // IF BASE UPDATED ⇒ recalc final price
// //     if (basePrice !== undefined && basePrice !== "") {
// //       const newBase = Number(basePrice);
// //       const todayDiff = existing.todayDiff || 0;

// //       updateData.basePrice = newBase;
// //       updateData.currentFinalPrice = newBase + todayDiff;
// //       updateData.lastFinalPrice = newBase; // same day reset logic
// //     } else {
// //       updateData.basePrice = existing.basePrice;
// //     }

// //     const updated = await Price.findByIdAndUpdate(id, updateData, {
// //       new: true,
// //       runValidators: true
// //     }).populate("category", "name");

// //     res.json({ success: true, data: updated });
// //   } catch (err) {
// //     res.status(500).json({ success: false, message: err.message });
// //   }
// // };

// // /* ============================================================
// //    UPDATE DIFF (MOST IMPORTANT)
// // ============================================================== */
// // exports.updateDiff = async (req, res) => {
// //   try {
// //     const { id } = req.params;
// //     const { diff } = req.body;

// //     const p = await Price.findById(id);
// //     if (!p) return res.status(404).json({ success: false, message: "Not found" });

// //     const difference = Number(diff) || 0;
// //     const newFinal = (Number(p.lastFinalPrice) || 0) + difference;

// //     p.todayDiff = difference;
// //     p.currentFinalPrice = newFinal;

// //     await p.save();

// //     const populated = await Price.findById(id).populate("category", "name");
// //     res.json({ success: true, data: populated });
// //   } catch (err) {
// //     res.status(500).json({ success: false, message: err.message });
// //   }
// // };

// // /* ============================================================
// //    UPDATE STATUS
// // ============================================================== */
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
// //    DELETE
// // ============================================================== */
// // exports.deletePrice = async (req, res) => {
// //   try {
// //     await Price.findByIdAndDelete(req.params.id);
// //     res.json({ success: true });
// //   } catch (err) {
// //     res.status(500).json({ success: false, message: err.message });
// //   }
// // };

// // /* ============================================================
// //    CSV IMPORT
// // ============================================================== */
// // exports.importPrices = async (req, res) => {
// //   try {
// //     if (!req.file)
// //       return res.status(400).json({ success: false, message: "CSV required" });

// //     const rows = [];
// //     const csvData = req.file.buffer.toString("utf-8");

// //     csv
// //       .parseString(csvData, { headers: true })
// //       .on("data", (row) => rows.push(row))
// //       .on("end", async () => {
// //         const inserted = [];

// //         for (const r of rows) {
// //           const catName = r.categoryName?.trim() || "Uncategorized";
// //           const subName = r.subcategoryName?.trim() || null;

// //           let category = await Category.findOne({ name: catName });
// //           if (!category) category = await Category.create({ name: catName });

// //           const base = Number(r.basePrice) || 0;
// //           const diff = Number(r.todayDiff) || 0;
// //           const initialFinal = base + diff;

// //           const price = await Price.create({
// //             name: r.name,
// //             category: category._id,
// //             subcategory: subName ? { name: subName } : null,
// //             basePrice: base,
// //             todayDiff: diff,
// //             lastFinalPrice: base,
// //             currentFinalPrice: initialFinal,
// //             validTill: r.validTill ? new Date(r.validTill) : undefined,
// //             status: r.status || "inactive",
// //             description: r.description,
// //             image: r.imageUrl || ""
// //           });

// //           inserted.push(price);
// //         }

// //         res.json({ success: true, inserted: inserted.length });
// //       });
// //   } catch (err) {
// //     res.status(500).json({ success: false, message: err.message });
// //   }
// // };

// // /* ============================================================
// //    CSV EXPORT
// // ============================================================== */
// // exports.exportPrices = async (req, res) => {
// //   try {
// //     const prices = await Price.find().populate("category", "name");

// //     res.setHeader("Content-Disposition", "attachment; filename=prices.csv");
// //     res.setHeader("Content-Type", "text/csv");

// //     const csvStream = csv.format({ headers: true });
// //     csvStream.pipe(res);

// //     for (const p of prices) {
// //       csvStream.write({
// //         name: p.name,
// //         categoryName: p.category?.name || "",
// //         subcategoryName: p.subcategory?.name || "",
// //         basePrice: p.basePrice,
// //         todayDiff: p.todayDiff,
// //         lastFinalPrice: p.lastFinalPrice,
// //         currentFinalPrice: p.currentFinalPrice,
// //         status: p.status,
// //         validTill: p.validTill ? p.validTill.toISOString().split("T")[0] : "",
// //         description: p.description,
// //         imageUrl: p.image || ""
// //       });
// //     }

// //     csvStream.end();
// //   } catch (err) {
// //     res.status(500).json({ success: false, message: err.message });
// //   }
// // };

// // /* ============================================================
// //    BULK UPDATE
// // ============================================================== */
// // exports.bulkUpdatePrices = async (req, res) => {
// //   try {
// //     const { products } = req.body;
// //     const updated = [];

// //     for (const p of products) {
// //       const item = await Price.findById(p.id);
// //       if (!item) continue;

// //       const diff = Number(p.difference) || 0;
// //       const newFinal = (Number(item.lastFinalPrice) || 0) + diff;

// //       item.name = p.name ?? item.name;
// //       item.basePrice = p.basePrice !== undefined ? Number(p.basePrice) : item.basePrice;
// //       item.todayDiff = diff;
// //       item.currentFinalPrice = newFinal;
// //       item.validTill = p.validTill ? new Date(p.validTill) : item.validTill;
// //       item.status = p.status ?? item.status;

// //       // Base changed? reset lastFinalPrice
// //       if (p.basePrice !== undefined) {
// //         item.lastFinalPrice = Number(p.basePrice);
// //       }

// //       await item.save();
// //       updated.push(item);
// //     }

// //     res.json({ success: true, updated });
// //   } catch (err) {
// //     res.status(500).json({ success: false, message: err.message });
// //   }
// // };

// // /* ============================================================
// //    COPY PRODUCT
// // ============================================================== */
// // exports.copyPrice = async (req, res) => {
// //   try {
// //     const item = await Price.findById(req.params.id);

// //     const newItem = await Price.create({
// //       name: item.name,
// //       category: item.category,
// //       subcategory: item.subcategory,
// //       basePrice: item.basePrice,
// //       todayDiff: item.todayDiff,
// //       lastFinalPrice: item.lastFinalPrice,
// //       currentFinalPrice: item.currentFinalPrice,
// //       validTill: item.validTill,
// //       description: item.description,
// //       status: item.status,
// //       image: null,
// //     });

// //     res.json({ success: true, data: newItem });
// //   } catch (err) {
// //     res.status(500).json({ success: false, message: err.message });
// //   }
// // };

// // /* ============================================================
// //    AUTO MIDNIGHT RESET
// // ============================================================== */
// // schedule.scheduleJob("0 0 * * *", async () => {
// //   const prices = await Price.find();

// //   for (const p of prices) {
// //     p.lastFinalPrice = p.currentFinalPrice;
// //     p.todayDiff = 0;
// //     await p.save();
// //   }

// //   console.log("Midnight reset completed ✔");
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
//    CREATE (DAY 1 LOGIC = base + diff)
// ============================================================== */
// exports.createPrice = async (req, res) => {
//   try {
//     const {
//       name,
//       category,
//       subcategory,
//       basePrice,
//       difference,
//       validTill,
//       description,
//       status
//     } = req.body;

//     let imageUrl = null;
//     if (req.file) {
//       imageUrl = await uploadToCloudinary(req.file.buffer);
//     }

//     const base = Number(basePrice) || 0;
//     const diff = Number(difference) || 0;

//     const price = await Price.create({
//       name,
//       category,
//       subcategory: subcategory || null,
//       basePrice: base,
//       todayDiff: diff,
//       lastFinalPrice: base,
//       currentFinalPrice: base + diff,
//       validTill: validTill ? new Date(validTill) : undefined,
//       description,
//       status: status || "inactive",
//       image: imageUrl
//     });

//     const populated = await Price.findById(price._id)
//       .populate("category", "name");

//     res.status(201).json({ success: true, data: populated });

//   } catch (err) {
//     res.status(500).json({ success: false, message: err.message });
//   }
// };


// /* ============================================================
//    GET ALL (Admin)
// ============================================================== */
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
//    GET ACTIVE (Website)
// ============================================================== */
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
//    UPDATE PRICE (Base Logic)
// ============================================================== */
// exports.updatePrice = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const {
//       name,
//       category,
//       subcategory,
//       basePrice,
//       validTill,
//       description,
//       status
//     } = req.body;

//     const item = await Price.findById(id);
//     if (!item)
//       return res.status(404).json({ success: false, message: "Not found" });

//     const update = {};

//     update.name = name ?? item.name;
//     update.category = category ?? item.category;
//     update.subcategory = subcategory ?? item.subcategory;
//     update.validTill = validTill ? new Date(validTill) : item.validTill;
//     update.description = description ?? item.description;
//     update.status = status ?? item.status;

//     // IMAGE
//     if (req.file) {
//       update.image = await uploadToCloudinary(req.file.buffer);
//     }

//     // BASE PRICE LOGIC
//     if (basePrice !== undefined && basePrice !== "") {
//       const newBase = Number(basePrice);

//       const newTodayDiff = (item.lastFinalPrice ?? 0) - newBase;
//       const newCurrent = newBase + newTodayDiff;

//       update.basePrice = newBase;
//       update.todayDiff = newTodayDiff;
//       update.currentFinalPrice = newCurrent;
//     }

//     const updated = await Price.findByIdAndUpdate(id, update, {
//       new: true,
//     })
//       .populate("category", "name")
//       .populate("subcategory", "name");

//     res.json({ success: true, data: updated });

//   } catch (err) {
//     res.status(500).json({ success: false, message: err.message });
//   }
// };


// /* ============================================================
//    QUICK DIFF (base + diff)
// ============================================================== */
// exports.updateDiff = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const diff = Number(req.body.diff) || 0;

//     const item = await Price.findById(id);
//     if (!item)
//       return res.status(404).json({ success: false, message: "Not found" });

//     // MAIN QUICK DIFF LOGIC
//     item.todayDiff = diff;
//     item.currentFinalPrice = (item.basePrice ?? 0) + diff;

//     await item.save();

//     const populated = await Price.findById(id)
//       .populate("category", "name")
//       .populate("subcategory", "name");

//     res.json({ success: true, data: populated });

//   } catch (err) {
//     res.status(500).json({ success: false, message: err.message });
//   }
// };


// /* ============================================================
//    UPDATE STATUS
// ============================================================== */
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
//    DELETE
// ============================================================== */
// exports.deletePrice = async (req, res) => {
//   try {
//     await Price.findByIdAndDelete(req.params.id);
//     res.json({ success: true });

//   } catch (err) {
//     res.status(500).json({ success: false, message: err.message });
//   }
// };


// /* ============================================================
//    CSV IMPORT
// ============================================================== */
// exports.importPrices = async (req, res) => {
//   try {
//     if (!req.file)
//       return res.status(400).json({ success: false, message: "CSV required" });

//     const rows = [];
//     const csvData = req.file.buffer.toString("utf-8");

//     csv
//       .parseString(csvData, { headers: true })
//       .on("data", (row) => rows.push(row))
//       .on("end", async () => {
//         const inserted = [];

//         for (const r of rows) {
//           const catName = r.categoryName?.trim() || "Uncategorized";
//           const subName = r.subcategoryName?.trim() || null;

//           let cat = await Category.findOne({ name: catName });
//           if (!cat) cat = await Category.create({ name: catName });

//           const base = Number(r.basePrice) || 0;
//           const diff = Number(r.todayDiff) || 0;

//           const price = await Price.create({
//             name: r.name,
//             category: cat._id,
//             subcategory: subName ? { name: subName } : null,
//             basePrice: base,
//             todayDiff: diff,
//             lastFinalPrice: base,
//             currentFinalPrice: base + diff,
//             validTill: r.validTill ? new Date(r.validTill) : undefined,
//             status: r.status || "inactive",
//             description: r.description,
//             image: r.imageUrl || ""
//           });

//           inserted.push(price);
//         }

//         res.json({ success: true, inserted: inserted.length });
//       });

//   } catch (err) {
//     res.status(500).json({ success: false, message: err.message });
//   }
// };


// /* ============================================================
//    CSV EXPORT
// ============================================================== */
// exports.exportPrices = async (req, res) => {
//   try {
//     const prices = await Price.find().populate("category", "name");

//     res.setHeader("Content-Disposition", "attachment; filename=prices.csv");
//     res.setHeader("Content-Type", "text/csv");

//     const csvStream = csv.format({ headers: true });
//     csvStream.pipe(res);

//     for (const p of prices) {
//       csvStream.write({
//         name: p.name,
//         categoryName: p.category?.name || "",
//         subcategoryName: p.subcategory?.name || "",
//         basePrice: p.basePrice,
//         todayDiff: p.todayDiff,
//         lastFinalPrice: p.lastFinalPrice,
//         currentFinalPrice: p.currentFinalPrice,
//         status: p.status,
//         validTill: p.validTill ? p.validTill.toISOString().split("T")[0] : "",
//         description: p.description,
//         imageUrl: p.image || ""
//       });
//     }

//     csvStream.end();

//   } catch (err) {
//     res.status(500).json({ success: false, message: err.message });
//   }
// };


// /* ============================================================
//    BULK UPDATE (base independent)
// ============================================================== */
// exports.bulkUpdatePrices = async (req, res) => {
//   try {
//     const { products } = req.body;
//     const updated = [];

//     for (const p of products) {
//       const item = await Price.findById(p.id);
//       if (!item) continue;

//       const diff = Number(p.difference) || 0;
//       const newCurrent = (item.basePrice ?? 0) + diff;

//       item.name = p.name ?? item.name;
//       item.basePrice = p.basePrice ?? item.basePrice;
//       item.todayDiff = diff;
//       item.currentFinalPrice = newCurrent;
//       item.validTill = p.validTill ? new Date(p.validTill) : item.validTill;
//       item.status = p.status ?? item.status;

//       await item.save();
//       updated.push(item);
//     }

//     res.json({ success: true, updated });

//   } catch (err) {
//     res.status(500).json({ success: false, message: err.message });
//   }
// };


// /* ============================================================
//    COPY PRODUCT
// ============================================================== */
// exports.copyPrice = async (req, res) => {
//   try {
//     const item = await Price.findById(req.params.id);

//     const newItem = await Price.create({
//       name: item.name,
//       category: item.category,
//       subcategory: item.subcategory,
//       basePrice: item.basePrice,
//       todayDiff: item.todayDiff,
//       lastFinalPrice: item.lastFinalPrice,
//       currentFinalPrice: item.currentFinalPrice,
//       validTill: item.validTill,
//       description: item.description,
//       status: item.status,
//       image: null,
//     });

//     res.json({ success: true, data: newItem });

//   } catch (err) {
//     res.status(500).json({ success: false, message: err.message });
//   }
// };


// /* ============================================================
//    MIDNIGHT RESET
// ============================================================== */
// schedule.scheduleJob("0 0 * * *", async () => {
//   const prices = await Price.find();

//   for (const p of prices) {
//     p.lastFinalPrice = p.currentFinalPrice;
//     p.todayDiff = 0;
//     await p.save();
//   }

//   console.log("Midnight reset completed ✔");
// });

const Price = require("../models/priceModel");
const Category = require("../models/categoryModel");
const cloudinary = require("../utils/cloudinary");
const csv = require("fast-csv");
const schedule = require("node-schedule");

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

/* ============================================================
   CREATE (DAY 1)
============================================================== */
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
      status,
    } = req.body;

    let imageUrl = null;
    if (req.file) imageUrl = await uploadToCloudinary(req.file.buffer);

    const base = Number(basePrice) || 0;
    const diff = Number(difference) || 0;

    const price = await Price.create({
      name,
      category,
      subcategory: subcategory || null,
      basePrice: base,
      todayDiff: diff,
      lastFinalPrice: base,
      currentFinalPrice: base + diff,
      validTill: validTill ? new Date(validTill) : undefined,
      description,
      status: status || "inactive",
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
   GET ALL
============================================================== */
exports.getPrices = async (req, res) => {
  try {
    const prices = await Price.find()
      .populate("category", "name")
      .sort({ createdAt: -1 });

    res.json({ success: true, data: prices });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* ============================================================
   GET ACTIVE (Website)
============================================================== */
exports.getWebsitePrices = async (req, res) => {
  try {
    const prices = await Price.find({ status: "active" })
      .populate("category", "name")
      .sort({ createdAt: -1 });

    res.json({ success: true, data: prices });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* ============================================================
   UPDATE BASE PRICE (FIXED)
============================================================== */
exports.updatePrice = async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;

    const item = await Price.findById(id);
    if (!item)
      return res.status(404).json({ success: false, message: "Not found" });

    const update = {};

    update.name = data.name ?? item.name;
    update.category = data.category ?? item.category;
    update.subcategory = data.subcategory ?? item.subcategory;
    update.description = data.description ?? item.description;
    update.validTill = data.validTill ? new Date(data.validTill) : item.validTill;
    update.status = data.status ?? item.status;

    // IMAGE
    if (req.file) update.image = await uploadToCloudinary(req.file.buffer);

    // BASE PRICE LOGIC (CORRECTED)
    if (data.basePrice !== undefined && data.basePrice !== "") {
      const newBase = Number(data.basePrice);
      const today = Number(item.todayDiff ?? 0);

      const newCurrent = newBase + today;

      update.basePrice = newBase;
      update.lastFinalPrice = newBase;
      update.currentFinalPrice = newCurrent;
    }

    const updated = await Price.findByIdAndUpdate(id, update, {
      new: true,
    })
      .populate("category", "name")
      .lean();

    updated.todayDiff = Number(updated.todayDiff ?? 0);
    updated.lastFinalPrice = Number(updated.lastFinalPrice ?? updated.basePrice ?? 0);
    updated.currentFinalPrice = Number(updated.currentFinalPrice ?? 0);

    res.json({ success: true, data: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* ============================================================
   QUICK DIFF (FIXED)
============================================================== */
exports.updateDiff = async (req, res) => {
  try {
    const id = req.params.id;
    const diff = Number(req.body.diff || 0);

    const item = await Price.findById(id);
    if (!item)
      return res.status(404).json({ success: false, message: "Not found" });

    const last = Number(item.lastFinalPrice ?? item.basePrice ?? 0);
    const newFinal = last + diff;

    item.todayDiff = diff;
    item.currentFinalPrice = newFinal;

    await item.save();

    const updated = await Price.findById(id)
      .populate("category", "name")
      .lean();

    updated.todayDiff = Number(updated.todayDiff ?? 0);
    updated.lastFinalPrice = Number(updated.lastFinalPrice ?? updated.basePrice ?? 0);
    updated.currentFinalPrice = Number(updated.currentFinalPrice ?? 0);

    res.json({ success: true, data: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* ============================================================
   UPDATE STATUS
============================================================== */
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
   DELETE
============================================================== */
exports.deletePrice = async (req, res) => {
  try {
    await Price.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* ============================================================
   CSV IMPORT
============================================================== */
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
        let inserted = 0;

        for (const r of rows) {
          const catName = r.categoryName?.trim() || "Uncategorized";
          const subName = r.subcategoryName?.trim() || null;

          let cat = await Category.findOne({ name: catName });
          if (!cat) cat = await Category.create({ name: catName });

          const base = Number(r.basePrice) || 0;
          const diff = Number(r.todayDiff) || 0;

          await Price.create({
            name: r.name,
            category: cat._id,
            subcategory: subName ? { name: subName } : null,
            basePrice: base,
            todayDiff: diff,
            lastFinalPrice: base,
            currentFinalPrice: base + diff,
            validTill: r.validTill ? new Date(r.validTill) : undefined,
            status: r.status || "inactive",
            description: r.description,
            image: r.imageUrl || "",
          });

          inserted++;
        }

        res.json({ success: true, inserted });
      });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* ============================================================
   CSV EXPORT
============================================================== */
exports.exportPrices = async (req, res) => {
  try {
    const prices = await Price.find().populate("category", "name");

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
        todayDiff: p.todayDiff,
        lastFinalPrice: p.lastFinalPrice,
        currentFinalPrice: p.currentFinalPrice,
        status: p.status,
        validTill: p.validTill ? p.validTill.toISOString().split("T")[0] : "",
        description: p.description,
        imageUrl: p.image || "",
      });
    }

    csvStream.end();
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* ============================================================
   BULK UPDATE
============================================================== */
exports.bulkUpdatePrices = async (req, res) => {
  try {
    const { products } = req.body;
    const updated = [];

    for (const p of products) {
      const item = await Price.findById(p.id);
      if (!item) continue;

      const diff = Number(p.difference) || 0;
      const newCurrent = (item.basePrice ?? 0) + diff;

      item.name = p.name ?? item.name;
      item.basePrice = p.basePrice ?? item.basePrice;
      item.todayDiff = diff;
      item.currentFinalPrice = newCurrent;
      item.validTill = p.validTill ? new Date(p.validTill) : item.validTill;
      item.status = p.status ?? item.status;

      await item.save();
      updated.push(item);
    }

    res.json({ success: true, updated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* ============================================================
   COPY PRODUCT
============================================================== */
exports.copyPrice = async (req, res) => {
  try {
    const item = await Price.findById(req.params.id);

    const newItem = await Price.create({
      name: item.name,
      category: item.category,
      subcategory: item.subcategory,
      basePrice: item.basePrice,
      todayDiff: item.todayDiff,
      lastFinalPrice: item.lastFinalPrice,
      currentFinalPrice: item.currentFinalPrice,
      validTill: item.validTill,
      description: item.description,
      status: item.status,
      image: null,
    });

    res.json({ success: true, data: newItem });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* ============================================================
   MIDNIGHT RESET
============================================================== */
schedule.scheduleJob("0 0 * * *", async () => {
  const prices = await Price.find();

  for (const p of prices) {
    p.lastFinalPrice = p.currentFinalPrice;
    p.todayDiff = 0;
    await p.save();
  }

  console.log("Midnight reset completed ✔");
});
