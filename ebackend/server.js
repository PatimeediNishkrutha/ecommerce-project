
const dns = require("dns");

// =====================================================
// DNS
// =====================================================

dns.setServers([
  "8.8.8.8",
  "1.1.1.1",
]);

// =====================================================
// IMPORTS
// =====================================================

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const passport = require("passport");

// =====================================================
// ENV
// =====================================================

dotenv.config();

console.log(
  "JWT_SECRET loaded:",
  !!process.env.JWT_SECRET
);

console.log(
  "MONGO_URI loaded:",
  !!process.env.MONGO_URI
);

// =====================================================
// APP
// =====================================================

const app = express();

// =====================================================
// MIDDLEWARE
// =====================================================

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.use(express.json());

app.use(
  express.urlencoded({
    extended: true,
  })
);

// =====================================================
// PASSPORT
// =====================================================

app.use(passport.initialize());

// =====================================================
// ROUTES
// =====================================================

const authRoutes = require("./routes/authRoutes");

const productRoutes = require("./routes/productRoutes");

const orderRoutes = require("./routes/orderRoutes");
const superAdminRoutes = require("./routes/superAdminRoutes");

// =====================================================
// API ROUTES
// =====================================================

app.use(
  "/api/auth",
  authRoutes
);

app.use(
  "/api/products",
  productRoutes
);

app.use(
  "/api/orders",
  orderRoutes
);
app.use("/api/superadmin", superAdminRoutes);

// =====================================================
// TEST ROUTE
// =====================================================

app.get("/", (req, res) => {
  res.json({
    message: "E-commerce backend is running",
  });
});

// =====================================================
// MONGODB
// =====================================================

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log(
      "MongoDB connected successfully"
    );

    const PORT =
      process.env.PORT || 5000;

    app.listen(
      PORT,
      () => {
        console.log(
          `Server running on http://localhost:${PORT}`
        );
      }
    );
  })
  .catch((error) => {
    console.error(
      "MongoDB connection error:",
      error
    );
  });