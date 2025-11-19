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

// ===== MIDDLEWARES =====
app.use(express.json());
app.use(cors());

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
// Serves images publicly, e.g. http://localhost:7000/uploads/yourfile.png
app.use("/uploads", express.static(uploadDir));

// ===== ROUTES =====
app.use("/api/admin", adminAuthRoutes);
app.use("/api/user", userAuthRoutes);
app.use("/api/prices", priceRoutes); // ✅ Price CRUD Routes
app.use("/api/categories", categoryRoutes);
app.use("/api/price-report", priceReportRoutes);
app.use("/api/descriptions", require("./routes/descriptionRoutes"));
// ===== HEALTH CHECK ROUTE =====
app.get("/", (req, res) => {
  res.send("🚀 Server running successfully");
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
app.listen(PORT, () =>
  console.log(`🌐 Server running on port ${PORT}...`)
);
