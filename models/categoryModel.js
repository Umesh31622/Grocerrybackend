// const mongoose = require("mongoose");

// const categorySchema = new mongoose.Schema(
//   {
//     name: {
//       type: String,
//       required: true,
//       unique: true,
//       trim: true,
//     },
//   },
//   { timestamps: true }
// );

// module.exports = mongoose.model("Category", categorySchema);

// const mongoose = require("mongoose");

// const categorySchema = new mongoose.Schema(
//   {
//     name: {
//       type: String,
//       required: true,
//       unique: true,
//       trim: true,
//     },
//   },
//   { timestamps: true }
// );

// module.exports = mongoose.model("Category", categorySchema);
const mongoose = require("mongoose");

const CategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    image: {
      type: String, // cloudinary URL
      default: null,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Category", CategorySchema);
