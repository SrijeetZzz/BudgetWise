import Redis from "ioredis";

import { env } from "../env";

export const redis = new Redis(env.redis.url, {
  maxRetriesPerRequest: 3,
  enableReadyCheck: true,
});

redis.on("connect", () => {
  console.log("🔴 Redis connecting...");
});

redis.on("ready", () => {
  console.log("✅ Redis connected.");
});

redis.on("error", (error) => {
  console.error("❌ Redis error:", error);
});

redis.on("close", () => {
  console.log("⚠️ Redis connection closed.");
});