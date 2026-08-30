const dns = require("dns");

dns.setServers([
  "8.8.8.8",
  "1.1.1.1"
]);

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const SuperAdmin = require("./models/SuperAdmin");


// =====================================================
// CREATE SUPER ADMIN
// =====================================================

const createSuperAdmin = async () => {
  try {

    // ================================================
    // CONNECT TO MONGODB
    // ================================================

    await mongoose.connect(process.env.MONGO_URI);

    console.log("=================================");
    console.log("MongoDB connected successfully");
    console.log("=================================");


    // ================================================
    // SUPER ADMIN DETAILS
    // ================================================

    const name = "Super Admin";
    const email = "superadmin@gmail.com";
    const password = "SuperAdmin123";


    // ================================================
    // CLEAN EMAIL
    // ================================================

    const cleanEmail =
      email.toLowerCase().trim();


    // ================================================
    // CHECK EXISTING SUPER ADMIN
    // ================================================

    const existingSuperAdmin =
      await SuperAdmin.findOne({
        email: cleanEmail,
      });


    if (existingSuperAdmin) {

      console.log("=================================");
      console.log("SUPER ADMIN ACCOUNT ALREADY EXISTS");
      console.log("=================================");
      console.log(
        "Name:",
        existingSuperAdmin.name
      );
      console.log(
        "Email:",
        existingSuperAdmin.email
      );
      console.log(
        "ID:",
        existingSuperAdmin._id
      );
      console.log(
        "Active:",
        existingSuperAdmin.isActive
      );
      console.log("=================================");

      await mongoose.connection.close();

      process.exit(0);
    }


    // ================================================
    // HASH PASSWORD
    // ================================================

    const hashedPassword =
      await bcrypt.hash(
        password,
        10
      );


    // ================================================
    // CREATE SUPER ADMIN
    // ================================================

    const superAdmin =
      await SuperAdmin.create({

        name: name,

        email: cleanEmail,

        password: hashedPassword,

        isActive: true,

      });


    // ================================================
    // SUCCESS
    // ================================================

    console.log("=================================");
    console.log("SUPER ADMIN CREATED SUCCESSFULLY");
    console.log("=================================");

    console.log(
      "Name:",
      superAdmin.name
    );

    console.log(
      "Email:",
      superAdmin.email
    );

    console.log(
      "ID:",
      superAdmin._id
    );

    console.log(
      "Active:",
      superAdmin.isActive
    );

    console.log(
      "Password:",
      password
    );

    console.log("=================================");

    console.log(
      "Stored in: superadmins collection"
    );

    console.log("=================================");


    // ================================================
    // CLOSE DATABASE
    // ================================================

    await mongoose.connection.close();

    process.exit(0);

  } catch (error) {

    console.error("=================================");
    console.error("SUPER ADMIN CREATION ERROR");
    console.error("=================================");

    console.error(error);

    try {
      await mongoose.connection.close();
    } catch (closeError) {
      // Ignore connection close errors
    }

    process.exit(1);
  }
};


// =====================================================
// RUN
// =====================================================

createSuperAdmin();