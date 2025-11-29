
// // // // const mongoose = require("mongoose");

// // // // const priceSchema = new mongoose.Schema({
// // // //   name: { type: String, required: true },

// // // //   category: {
// // // //     type: mongoose.Schema.Types.ObjectId,
// // // //     ref: "Category",
// // // //     required: true,
// // // //   },

// // // //   subcategory: {
// // // //     id: { type: String, default: null },
// // // //     name: { type: String, default: null },
// // // //     image: { type: String, default: null },
// // // //   },

// // // //   basePrice: { type: Number, required: true },

// // // //   lastFinalPrice: { type: Number, default: 0 },
// // // //   todayDiff: { type: Number, default: 0 },
// // // //   currentFinalPrice: { type: Number, default: 0 },

// // // //   validTill: { type: Date },
// // // //   description: { type: String },
// // // //   image: { type: String },

// // // //   status: {
// // // //     type: String,
// // // //     enum: ["active", "inactive"],
// // // //     default: "inactive",
// // // //   },

// // // //   createdAt: { type: Date, default: Date.now },
// // // // });

// // // // module.exports =
// // // //   mongoose.models.Price || mongoose.model("Price", priceSchema);

// // // const mongoose = require("mongoose");

// // // const priceSchema = new mongoose.Schema({
// // //   name: { type: String, required: true },

// // //   category: {
// // //     type: mongoose.Schema.Types.ObjectId,
// // //     ref: "Category",
// // //     required: true,
// // //   },

// // //   subcategory: {
// // //     id: { type: String, default: null },
// // //     name: { type: String, default: null },
// // //     image: { type: String, default: null },
// // //   },

// // //   basePrice: { type: Number, required: true },

// // //   // lastFinalPrice = YTD (snapshot at midnight of previous day)
// // //   lastFinalPrice: { type: Number, default: 0 },

// // //   // today's difference (can be negative/positive)
// // //   todayDiff: { type: Number, default: 0 },

// // //   // current final price (computed as basePrice + todayDiff OR lastFinalPrice + diff depending on flows)
// // //   currentFinalPrice: { type: Number, default: 0 },

// // //   validTill: { type: Date },
// // //   description: { type: String },
// // //   image: { type: String },

// // //   status: {
// // //     type: String,
// // //     enum: ["active", "inactive"],
// // //     default: "inactive",
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
// //     required: true,
// //   },

// //   subcategory: {
// //     id: { type: String, default: null },
// //     name: { type: String, default: null },
// //     image: { type: String, default: null },
// //   },

// //   basePrice: { type: Number, required: true },

// //   // DAY-1 → null , next day midnight → updated
// //   lastFinalPrice: { type: Number, default: null },

// //   todayDiff: { type: Number, default: 0 },

// //   currentFinalPrice: { type: Number, default: 0 },

// //   validTill: { type: Date },

// //   description: { type: String },

// //   image: { type: String },

// //   status: {
// //     type: String,
// //     enum: ["active", "inactive"],
// //     default: "inactive",
// //   },

// //   createdAt: { type: Date, default: Date.now },
// // });

// // module.exports =
// //   mongoose.models.Price || mongoose.model("Price", priceSchema);

// const mongoose = require("mongoose");

// const priceSchema = new mongoose.Schema({
//   name: { type: String, required: true },

//   category: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "Category",
//     required: true,
//   },

//   subcategory: {
//     id: String,
//     name: String,
//     image: String,
//   },

//   // BASE PRICE / PURCHASE PRICE
//   basePrice: { type: Number, required: true },

//   // MY PROFIT / LOSS
//   profitLoss: { type: Number, default: 0 },

//   // SALE PRICE = BASE + PROFITLOSS
//   salePrice: { type: Number, default: 0 },

//   // Aaj raat 12 baje lock hoga
//   lockedPrice: { type: Number, default: 0 },

//   // Kal ka locked price
//   yesterdayLock: { type: Number, default: 0 },

//   // Tejji / Maddi = lockedPriceToday - lockedPriceYesterday
//   brokerDisplay: { type: Number, default: 0 },

//   validTill: Date,
//   description: String,
//   image: String,

//   status: {
//     type: String,
//     enum: ["active", "inactive"],
//     default: "inactive",
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
    id: String,
    name: String,
    image: String,
  },

  basePrice: { type: Number, required: true },
  profitLoss: { type: Number, default: 0 },
  salePrice: { type: Number, default: 0 },

  lockedPrice: { type: Number, default: 0 },
  yesterdayLock: { type: Number, default: 0 },
  brokerDisplay: { type: Number, default: 0 },

  validTill: Date,
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
