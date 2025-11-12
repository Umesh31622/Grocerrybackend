const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const fs = require("fs");
require("dotenv").config();
const cors = require("cors");

const adminAuthRoutes = require("./routes/adminAuthRoutes");
const userAuthRoutes = require("./routes/userAuthRoutes");
const priceRoutes = require("./routes/priceRoutes");
const brokerRoutes = require("./routes/brokerRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const priceReportRoutes = require("./routes/priceReportRoutes");

const app = express();

/* ==============================
   ✅ UNIVERSAL CORS FIX
   ============================== */
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*"); // Allow all for now
  res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") {
    return res.sendStatus(204); // Preflight handled cleanly
  }
  next();
});

/* 🧠 NOTE:
   Once this works, we can replace "*" with specific origins
   like https://grocerryadminfrontend.vercel.app and https://websitegrocerry.vercel.app
*/

// ===== JSON PARSER =====
app.use(express.json());

// ===== Ensure Upload Folder =====
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

// ===== MongoDB Connect =====
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Error:", err));

// ===== Serve Uploads =====
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
  res.send("🚀 Grocery Backend Working with Universal CORS Enabled!");
});

// ===== 404 Handler =====
app.use("/api/*", (req, res) => {
  res.status(404).json({ success: false, message: "API route not found" });
});

// ===== Global Error Handler =====
app.use((err, req, res, next) => {
  console.error("🔥 Global Error:", err.message);
  res.status(500).json({ success: false, message: err.message });
});

// ===== Start Server =====
const PORT = process.env.PORT || 7000;
app.listen(PORT, () => console.log(`🌐 Server running on port ${PORT}...`));
