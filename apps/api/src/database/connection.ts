//mongDB connection logic

import mongoose from "mongoose";
import { env } from "../config/env";

export const connectDatabase = async (): Promise<void> => {
  try {
    await mongoose.connect(env.mongodb.uri);

    console.log("=================================");
    console.log("🍃 MongoDB Connected Successfully");
    console.log(`📦 Database: ${mongoose.connection.name}`);
    console.log("=================================");
  } catch (error) {
    console.error("❌ MongoDB Connection Failed");
    console.error(error);

    process.exit(1);
  }
};