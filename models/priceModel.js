
// const mongoose = require("mongoose");

// const priceSchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   category: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
//   basePrice: { type: Number, required: true },
//   difference: { type: Number, default: 0 },
//   validTill: { type: Date },
//   description: { type: String },
//   image: { type: String },
//   createdAt: { type: Date, default: Date.now },
// });

// module.exports = mongoose.models.Price || mongoose.model("Price", priceSchema);


// const mongoose = require("mongoose");

// const priceSchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   category: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
//   basePrice: { type: Number, required: true },
//   difference: { type: Number, default: 0 },
//   validTill: { type: Date },
//   description: { type: String },
//   image: { type: String },
//   createdAt: { type: Date, default: Date.now },
// });

// module.exports = mongoose.models.Price || mongoose.model("Price", priceSchema);

const mongoose = require("mongoose");

const priceSchema = new mongoose.Schema({
  name: { type: String, required: true },

  category: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Category", 
    required: true 
  },

  basePrice: { type: Number, required: true },

  difference: { type: Number, default: 0 },

  validTill: { type: Date },

  description: { type: String },

  image: { type: String },

  status: {
    type: String,
    enum: ["active", "inactive"],
    default: "active"
  },

  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.models.Price || mongoose.model("Price", priceSchema);
