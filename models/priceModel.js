// // // // const mongoose = require("mongoose");

// // // // const SubRefSchema = new mongoose.Schema(
// // // //   {
// // // //     id: {
// // // //       type: mongoose.Schema.Types.ObjectId,
// // // //       default: null,
// // // //     },
// // // //     name: {
// // // //       type: String,
// // // //       default: "",
// // // //     },
// // // //     image: {
// // // //       type: String,
// // // //       default: null,
// // // //     },
// // // //   },
// // // //   { _id: false }
// // // // );

// // // // const priceSchema = new mongoose.Schema({
// // // //   name: { type: String, required: true },

// // // //   category: {
// // // //     type: mongoose.Schema.Types.ObjectId,
// // // //     ref: "Category",
// // // //     required: true,
// // // //   },

// // // //   // embedded snapshot of subcategory (not populated via mongoose)
// // // //   subcategory: {
// // // //     type: SubRefSchema,
// // // //     default: null,
// // // //   },

// // // //   basePrice: { type: Number, required: true },
// // // //   difference: { type: Number, default: 0 },
// // // //   validTill: { type: Date },
// // // //   description: { type: String },
// // // //   image: { type: String },

// // // //   status: {
// // // //     type: String,
// // // //     enum: ["active", "inactive"],
// // // //     default: "active",
// // // //   },

// // // //   createdAt: { type: Date, default: Date.now },
// // // // });

// // // // module.exports = mongoose.models.Price || mongoose.model("Price", priceSchema);

// // // const mongoose = require("mongoose");

// // // const priceSchema = new mongoose.Schema({
// // //   name: { type: String, required: true },

// // //   category: {
// // //     type: mongoose.Schema.Types.ObjectId,
// // //     ref: "Category",
// // //     required: true
// // //   },

// // //   subcategory: {
// // //     id: String,
// // //     name: String,
// // //     image: String
// // //   },

// // //   basePrice: { type: Number, required: true },
// // //   difference: { type: Number, default: 0 },
// // //   validTill: { type: Date },
// // //   description: { type: String },
// // //   image: { type: String },

// // //   status: {
// // //     type: String,
// // //     enum: ["active", "inactive"],
// // //     default: "active"
// // //   },

// // //   createdAt: { type: Date, default: Date.now },
// // // });

// // // module.exports =
// // //   mongoose.models.Price || mongoose.model("Price", priceSchema);

// // const mongoose = require("mongoose");

// // const priceSchema = new mongoose.Schema({
// //   name: { type: String, required: true },

// //   category: {
// //     type: mongoose.Schema.Types.ObjectId,
// //     ref: "Category",
// //     required: true
// //   },

// //   subcategory: {
// //     id: String,
// //     name: String,
// //     image: String
// //   },

// //   basePrice: { type: Number, required: true },

// //   // 🔥 Your logic Requires These:
// //   lastFinalPrice: { type: Number, default: 0 },
// //   todayDiff: { type: Number, default: 0 },
// //   currentFinalPrice: { type: Number, default: 0 },

// //   validTill: { type: Date },
// //   description: { type: String },
// //   image: { type: String },

// //   status: {
// //     type: String,
// //     enum: ["active", "inactive"],
// //     default: "active"
// //   },

// //   createdAt: { type: Date, default: Date.now },
// // });

// // module.exports =
// //   mongoose.models.Price || mongoose.model("Price", priceSchema);

// // const mongoose = require("mongoose");

// // const priceSchema = new mongoose.Schema({
// //   name: { type: String, required: true },

// //   // CATEGORY IS REF → populate allowed
// //   category: {
// //     type: mongoose.Schema.Types.ObjectId,
// //     ref: "Category",
// //     required: true
// //   },

// //   // SUBCATEGORY AS EMBEDDED OBJECT (NO populate)
// //   subcategory: {
// //     id: { type: String, default: null },
// //     name: { type: String, default: null },
// //     image: { type: String, default: null }
// //   },

// //   // BASE PRICE (editable)
// //   basePrice: { type: Number, required: true },

// //   // LOGIC FIELDS
// //   lastFinalPrice: { type: Number, default: 0 },
// //   todayDiff: { type: Number, default: 0 },
// //   currentFinalPrice: { type: Number, default: 0 },

// //   validTill: { type: Date },
// //   description: { type: String },
// //   image: { type: String },

// //   status: {
// //     type: String,
// //     enum: ["active", "inactive"],
// //     default: "inactive"
// //   },

// //   createdAt: { type: Date, default: Date.now },
// // });

// // module.exports =
// //   mongoose.models.Price || mongoose.model("Price", priceSchema);
// const mongoose = require("mongoose");

// const priceSchema = new mongoose.Schema({
//   name: { type: String, required: true },

//   // CATEGORY REF
//   category: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "Category",
//     required: true
//   },

//   // SUBCATEGORY OBJECT (frontend-friendly)
//   subcategory: {
//     id: { type: String, default: null },
//     name: { type: String, default: null },
//     image: { type: String, default: null }
//   },

//   // BASE PRICE
//   basePrice: { type: Number, required: true },

//   // LOGIC FIELDS
//   lastFinalPrice: { type: Number, default: 0 },    // yesterday
//   todayDiff: { type: Number, default: 0 },         // today difference
//   currentFinalPrice: { type: Number, default: 0 }, // base + diff

//   validTill: { type: Date },
//   description: { type: String },
//   image: { type: String },

//   status: {
//     type: String,
//     enum: ["active", "inactive"],
//     default: "inactive"
//   },

//   createdAt: { type: Date, default: Date.now },
// });

// module.exports =
//   mongoose.models.Price || mongoose.model("Price", priceSchema);

const mongoose = require("mongoose");

const priceSchema = new mongoose.Schema({
  name: { type: String, required: true },

  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },

  subcategory: {
    id: { type: String, default: null },
    name: { type: String, default: null },
    image: { type: String, default: null },
  },

  basePrice: { type: Number, required: true },

  lastFinalPrice: { type: Number, default: 0 },
  todayDiff: { type: Number, default: 0 },
  currentFinalPrice: { type: Number, default: 0 },

  validTill: { type: Date },
  description: { type: String },
  image: { type: String },

  status: {
    type: String,
    enum: ["active", "inactive"],
    default: "inactive",
  },

  createdAt: { type: Date, default: Date.now },
});

module.exports =
  mongoose.models.Price || mongoose.model("Price", priceSchema);
