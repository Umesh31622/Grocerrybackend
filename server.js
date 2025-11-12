const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const path = require("path");
const fs = require("fs");
require("dotenv").config();

// ===== ROUTES IMPORTS =====
const adminAuthRoutes = require("./routes/adminAuthRoutes");
const userAuthRoutes = require("./routes/userAuthRoutes");
const priceRoutes = require("./routes/priceRoutes");
const brokerRoutes = require("./routes/brokerRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const priceReportRoutes = require("./routes/priceReportRoutes");

// ===== APP INIT =====
const app = express();

// ===== FRONTEND ORIGINS =====
const allowedOrigins = [
  "http://localhost:3000", // Local Dev
  "https://grocerryadminfrontend.vercel.app", // Admin Frontend
  "https://websitegrocerry.vercel.app", // User Website
];

// ===== CORS FIX (Handles Preflight + Secure Origins) =====
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.header("Access-Control-Allow-Origin", origin);
  }
  // ✅ Allow these methods & headers
  res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");

  // ✅ Handle preflight requests directly (no crash)
  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }
  next();
});

// ===== BODY PARSER =====
app.use(express.json());

// ===== Ensure Uploads Folder Exists =====
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
  console.log("📁 Created missing uploads folder");
}

// ===== MONGODB CONNECTION =====
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.log("❌ MongoDB Error:", err));

// ===== STATIC UPLOADS FOLDER =====
// Serves images publicly e.g. http://localhost:7000/uploads/yourfile.png
app.use("/uploads", express.static(uploadDir));

// ===== ROUTES =====
app.use("/api/admin", adminAuthRoutes);
app.use("/api/user", userAuthRoutes);
app.use("/api/prices", priceRoutes);
app.use("/api/brokers", brokerRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/price-report", priceReportRoutes);

// ===== HEALTH CHECK =====
app.get("/", (req, res) => {
  res.send("🚀 Grocery Backend Running Successfully with CORS Enabled!");
});

// ===== 404 HANDLER =====
app.use("/api/*", (req, res) => {
  res.status(404).json({ success: false, error: "API route not found" });
});

// ===== GLOBAL ERROR HANDLER =====
app.use((err, req, res, next) => {
  console.error("🔥 Global Error:", err.message);
  res.status(500).json({ success: false, message: err.message });
});

// ===== SERVER START =====
const PORT = process.env.PORT || 7000;
app.listen(PORT, () => console.log(`🌐 Server running on port ${PORT}...`));
