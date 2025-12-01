// // const mongoose = require("mongoose");

// // const priceSchema = new mongoose.Schema({
// //   name: { type: String, required: true },

// //   category: {
// //     type: mongoose.Schema.Types.ObjectId,
// //     ref: "Category",
// //     required: true,
// //   },

// //   subcategory: {
// //     id: String,
// //     name: String,
// //     image: String,
// //   },

// //   basePrice: { type: Number, required: true },
// //   profitLoss: { type: Number, default: 0 },
// //   salePrice: { type: Number, default: 0 },

// //   lockedPrice: { type: Number, default: 0 },
// //   yesterdayLock: { type: Number, default: 0 },
// //   brokerDisplay: { type: Number, default: 0 },

// //   lastLockDate: { type: String, default: "" },

// //   validTill: Date,
// //   description: String,
// //   image: String,

// //   status: {
// //     type: String,
// //     enum: ["active", "inactive"],
// //     default: "inactive",
// //   },

// //   createdAt: { type: Date, default: Date.now },
// // });

// // module.exports = mongoose.model("Price", priceSchema);

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

//   basePrice: { type: Number, required: true },
//   profitLoss: { type: Number, default: 0 },
//   salePrice: { type: Number, default: 0 },

//   lockedPrice: { type: Number, default: 0 },
//   yesterdayLock: { type: Number, default: 0 },

//   // ⭐ teji/maddi always = salePrice – lockedPrice
//   brokerDisplay: { type: Number, default: 0 },

//   lastLockDate: { type: String, default: "" },

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

// module.exports = mongoose.model("Price", priceSchema);

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

  // ⭐ Teji/Maddi Value
  brokerDisplay: { type: Number, default: 0 },

  lastLockDate: { type: String, default: "" },

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

module.exports = mongoose.model("Price", priceSchema);
