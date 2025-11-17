
// // // // // const mongoose = require("mongoose");

// // // // // const priceSchema = new mongoose.Schema({
// // // // //   name: { type: String, required: true },
// // // // //   category: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
// // // // //   basePrice: { type: Number, required: true },
// // // // //   difference: { type: Number, default: 0 },
// // // // //   validTill: { type: Date },
// // // // //   description: { type: String },
// // // // //   image: { type: String },
// // // // //   createdAt: { type: Date, default: Date.now },
// // // // // });

// // // // // module.exports = mongoose.models.Price || mongoose.model("Price", priceSchema);


// // // // // const mongoose = require("mongoose");

// // // // // const priceSchema = new mongoose.Schema({
// // // // //   name: { type: String, required: true },
// // // // //   category: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
// // // // //   basePrice: { type: Number, required: true },
// // // // //   difference: { type: Number, default: 0 },
// // // // //   validTill: { type: Date },
// // // // //   description: { type: String },
// // // // //   image: { type: String },
// // // // //   createdAt: { type: Date, default: Date.now },
// // // // // });

// // // // // module.exports = mongoose.models.Price || mongoose.model("Price", priceSchema);

// // // // const mongoose = require("mongoose");

// // // // const priceSchema = new mongoose.Schema({
// // // //   name: { type: String, required: true },

// // // //   category: { 
// // // //     type: mongoose.Schema.Types.ObjectId, 
// // // //     ref: "Category", 
// // // //     required: true 
// // // //   },

// // // //   basePrice: { type: Number, required: true },

// // // //   difference: { type: Number, default: 0 },

// // // //   validTill: { type: Date },

// // // //   description: { type: String },

// // // //   image: { type: String },

// // // //   status: {
// // // //     type: String,
// // // //     enum: ["active", "inactive"],
// // // //     default: "active"
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

// // // module.exports = mongoose.models.Price || mongoose.model("Price", priceSchema);

// // const mongoose = require("mongoose");

// // const priceSchema = new mongoose.Schema({
// //   name: { type: String, required: true },

// //   category: {
// //     type: mongoose.Schema.Types.ObjectId,
// //     ref: "Category",
// //     required: true
// //   },

// //   subcategory: {
// //     type: mongoose.Schema.Types.ObjectId,
// //     ref: "Subcategory",
// //     default: null
// //   },

// //   basePrice: { type: Number, required: true },
// //   difference: { type: Number, default: 0 },
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

// models/priceModel.js
const mongoose = require("mongoose");

const SubRefSchema = new mongoose.Schema(
  {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
    },
    name: {
      type: String,
      default: "",
    },
    image: {
      type: String,
      default: null,
    },
  },
  { _id: false }
);

const priceSchema = new mongoose.Schema({
  name: { type: String, required: true },

  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },

  // embedded snapshot of subcategory (not populated via mongoose)
  subcategory: {
    type: SubRefSchema,
    default: null,
  },

  basePrice: { type: Number, required: true },
  difference: { type: Number, default: 0 },
  validTill: { type: Date },
  description: { type: String },
  image: { type: String },

  status: {
    type: String,
    enum: ["active", "inactive"],
    default: "active",
  },

  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.models.Price || mongoose.model("Price", priceSchema);
