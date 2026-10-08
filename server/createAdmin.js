import "dotenv/config";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "./models/User.js";

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    console.log("MongoDB connected");

    const email = "admin@holybasil.com";
    const password = "Admin@12345";

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      existingUser.role = "admin";
      existingUser.password = await bcrypt.hash(password, 12);

      await existingUser.save();

      console.log("Existing user updated to admin");
    } else {
      await User.create({
        name: "Holy Basil Admin",
        email,
        password: await bcrypt.hash(password, 12),
        role: "admin",
      });

      console.log("Admin user created successfully");
    }

    console.log(`Admin email: ${email}`);
    console.log(`Admin password: ${password}`);

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error("Failed to create admin:", error.message);

    await mongoose.disconnect();
    process.exit(1);
  }
};

createAdmin();
