// const express = require("express");
// const cors = require("cors");
// const mongoose = require("mongoose");
// const path = require("path");
// const fs = require("fs");
// require("dotenv").config();
      
// // ===== ROUTES IMPORTS =====
// const adminAuthRoutes = require("./routes/adminAuthRoutes");
// const userAuthRoutes = require("./routes/userAuthRoutes");
// const priceRoutes = require("./routes/priceRoutes");
// const brokerRoutes = require("./routes/brokerRoutes");
// const categoryRoutes = require("./routes/categoryRoutes");
// const priceReportRoutes = require("./routes/priceReportRoutes");


// // ===== APP INIT =====
// const app = express();

// // ===== MIDDLEWARES =====
// app.use(express.json());
// app.use(cors());

// // ===== Ensure Uploads Folder Exists =====
// const uploadDir = path.join(__dirname, "uploads");
// if (!fs.existsSync(uploadDir)) {
//   fs.mkdirSync(uploadDir);
//   console.log("📁 Created missing uploads folder");
// }

// // ===== MONGODB CONNECTION =====
// mongoose
//   .connect(process.env.MONGODB_URI, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   })
//   .then(() => console.log("✅ MongoDB Connected"))
//   .catch((err) => console.log("❌ MongoDB Error:", err));

// // ===== STATIC UPLOADS FOLDER =====
// // Serves images publicly, e.g. http://localhost:7000/uploads/yourfile.png
// app.use("/uploads", express.static(uploadDir));

// // ===== ROUTES =====
// app.use("/api/admin", adminAuthRoutes);
// app.use("/api/user", userAuthRoutes);
// app.use("/api/prices", priceRoutes); // ✅ Price CRUD Routes
// app.use("/api/categories", categoryRoutes);
// app.use("/api/price-report", priceReportRoutes);

// // ===== HEALTH CHECK ROUTE =====
// app.get("/", (req, res) => {
//   res.send("🚀 Server running successfully");
// });

// // ===== 404 HANDLER =====
// app.use("/api/*", (req, res) => {
//   res.status(404).json({ success: false, error: "API route not found" });
// });

// // ===== GLOBAL ERROR HANDLER =====
// app.use((err, req, res, next) => {
//   console.error("🔥 Global Error:", err.message);
//   res.status(500).json({ success: false, message: err.message });
// });

// // ===== SERVER START =====
// const PORT = process.env.PORT || 7000;
// app.listen(PORT, () =>
//   console.log(`🌐 Server running on port ${PORT}...`)
// );
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const fs = require("fs");
require("dotenv").config();
const cors = require("cors");

// ===== ROUTES =====
const adminAuthRoutes = require("./routes/adminAuthRoutes");
const userAuthRoutes = require("./routes/userAuthRoutes");
const priceRoutes = require("./routes/priceRoutes");
const brokerRoutes = require("./routes/brokerRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const priceReportRoutes = require("./routes/priceReportRoutes");

const app = express();

// =======================
// 🧠 UNIVERSAL CORS FIX
// =======================
const allowedOrigins = [
  "http://localhost:3000",
  "https://grocerryadminfrontend.vercel.app",
  "https://websitegrocerry.vercel.app",
];

// ✅ Use cors() with dynamic origin
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true); // allow non-browser tools like Postman
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        console.log("❌ Blocked by CORS:", origin);
        return callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// ✅ Explicit preflight handler
app.options("*", (req, res) => {
  res.header("Access-Control-Allow-Origin", req.headers.origin || "*");
  res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.sendStatus(204);
});

// ✅ Ensure JSON parsing
app.use(express.json());

// ===== Ensure Uploads Folder Exists =====
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
  console.log("📁 Created missing uploads folder");
}

// ===== MongoDB Connection =====
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Error:", err));

// ===== Static Uploads =====
app.use("/uploads", express.static(uploadDir));

// ===== Routes =====
app.use("/api/admin", adminAuthRoutes);
app.use("/api/user", userAuthRoutes);
app.use("/api/prices", priceRoutes);
app.use("/api/brokers", brokerRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/price-report", priceReportRoutes);

// ===== Health Check =====
app.get("/", (req, res) => {
  res.send("🚀 Grocery Backend Working — CORS Fully Enabled");
});

// ===== 404 =====
app.use("/api/*", (req, res) => {
  res.status(404).json({ success: false, message: "API route not found" });
});

// ===== Global Error Handler =====
app.use((err, req, res, next) => {
  console.error("🔥 Global Error:", err.message);
  res.status(500).json({ success: false, message: err.message });
});

// ===== Server =====
const PORT = process.env.PORT || 7000;
app.listen(PORT, () => console.log(`🌐 Server running on port ${PORT}...`));
