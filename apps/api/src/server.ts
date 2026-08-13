import app from "./app";
import { redis } from "./config/redis";
import { env } from "./config/env";
import { connectDatabase } from "./database/connection";
import { startScheduler } from "./modules/scheduler/scheduler";

const startServer = async () => {
  try {
    await connectDatabase();

    await redis.ping();

    console.log("✅ Redis ping successful.");

    app.listen(env.port, () => {
      console.log("=================================");
      console.log("🚀 BudgetWise API Running");
      console.log(`📍 http://localhost:${env.port}`);
      console.log(`🌍 Environment: ${env.nodeEnv}`);
      console.log("=================================");

      startScheduler();
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();