import mongoose from "mongoose";
import dotenv from "dotenv";
import Faq from "./src/model/faq.model.js";
import Admin from "./src/model/admin.model.js";
import bcrypt from "bcryptjs";
dotenv.config();

const MONGO_URL = process.env.MONGO_URL || "mongodb://lokesh:lokesh@mongodb:27017/faq_db?authSource=admin";

const seedDatabase = async () => {
  try {
    await mongoose.connect(MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("Connected to MongoDB");

    // Check if an admin already exists
    const existingAdmin = await Admin.findOne({ email: "lokeshnegi399@gmail.com" });

    if (!existingAdmin) {
        const hashedPassword = await bcrypt.hash("admin123", 10);

      const newAdmin = new Admin({
        email: "lokeshnegi399@gmail.com",
        password: hashedPassword, // Ideally, hash the password before storing
      });
      await newAdmin.save();
      console.log("Admin user created");
    } else {
      console.log("Admin user already exists");
    }
    mongoose.connection.close();
  } catch (error) {
    console.error("Error seeding database:", error);
    mongoose.connection.close();
    process.exit(1);
  }
};

// Run the script
seedDatabase();
