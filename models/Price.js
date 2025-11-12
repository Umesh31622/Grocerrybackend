
const mongoose = require("mongoose");

const priceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  price: { type: Number, required: true },
  date: { type: Date, default: Date.now },
});

// ✅ Prevent OverwriteModelError
module.exports = mongoose.models.Price || mongoose.model("Price", priceSchema);
