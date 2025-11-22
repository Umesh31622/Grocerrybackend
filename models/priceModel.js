
// // const mongoose = require("mongoose");

// // const SubRefSchema = new mongoose.Schema(
// //   {
// //     id: {
// //       type: mongoose.Schema.Types.ObjectId,
// //       default: null,
// //     },
// //     name: {
// //       type: String,
// //       default: "",
// //     },
// //     image: {
// //       type: String,
// //       default: null,
// //     },
// //   },
// //   { _id: false }
// // );

// // const priceSchema = new mongoose.Schema({
// //   name: { type: String, required: true },

// //   category: {
// //     type: mongoose.Schema.Types.ObjectId,
// //     ref: "Category",
// //     required: true,
// //   },

// //   // embedded snapshot of subcategory (not populated via mongoose)
// //   subcategory: {
// //     type: SubRefSchema,
// //     default: null,
// //   },

// //   basePrice: { type: Number, required: true },
// //   difference: { type: Number, default: 0 },
// //   validTill: { type: Date },
// //   description: { type: String },
// //   image: { type: String },

// //   status: {
// //     type: String,
// //     enum: ["active", "inactive"],
// //     default: "active",
// //   },

// //   createdAt: { type: Date, default: Date.now },
// // });

// // module.exports = mongoose.models.Price || mongoose.model("Price", priceSchema);

// const mongoose = require("mongoose");

// const priceSchema = new mongoose.Schema({
//   name: { type: String, required: true },

//   category: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "Category",
//     required: true
//   },

//   subcategory: {
//     id: String,
//     name: String,
//     image: String
//   },

//   basePrice: { type: Number, required: true },
//   difference: { type: Number, default: 0 },
//   validTill: { type: Date },
//   description: { type: String },
//   image: { type: String },

//   status: {
//     type: String,
//     enum: ["active", "inactive"],
//     default: "active"
//   },

//   createdAt: { type: Date, default: Date.now },
// });

// module.exports =
//   mongoose.models.Price || mongoose.model("Price", priceSchema);


// const mongoose = require("mongoose");

// const priceSchema = new mongoose.Schema({
//   name: { type: String, required: true },

//   category: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "Category",
//     required: true
//   },

//   subcategory: {
//     id: String,
//     name: String,
//     image: String
//   },

//   basePrice: { type: Number, required: true },
//   difference: { type: Number, default: 0 },
//   validTill: { type: Date },
//   description: { type: String },
//   image: { type: String },

//   status: {
//     type: String,
//     enum: ["active", "inactive"],
//     default: "active"
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
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category.subcategories",
  },

  basePrice: { type: Number, required: true },

  // ⭐ FINAL PRICE LOGIC
  lastFinalPrice: { type: Number, default: 0 },      // yesterday final
  todayDiff: { type: Number, default: 0 },           // today's diff
  currentFinalPrice: { type: Number, default: 0 },   // lastFinalPrice + todayDiff

  validTill: { type: Date },
  description: String,
  image: String,

  status: {
    type: String,
    enum: ["active", "inactive"],
    default: "inactive",
  },

  createdAt: { type: Date, default: Date.now },
});

module.exports =
  mongoose.models.Price || mongoose.model("Price", priceSchema);
