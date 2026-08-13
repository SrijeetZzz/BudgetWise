// import { redis } from "../../config/redis";

// class CacheService {
//   async get<T>(key: string): Promise<T | null> {
//     try {
//       const cached = await redis.get(key);

//       if (!cached) {
//         return null;
//       }

//       return JSON.parse(cached) as T;
//     } catch (error) {
//       console.error(`Redis GET failed for key "${key}":`, error);
//       return null;
//     }
//   }

//   async set<T>(
//     key: string,
//     value: T,
//     ttlSeconds: number,
//   ): Promise<void> {
//     try {
//       await redis.set(
//         key,
//         JSON.stringify(value),
//         "EX",
//         ttlSeconds,
//       );
//     } catch (error) {
//       console.error(`Redis SET failed for key "${key}":`, error);
//     }
//   }

//   async delete(key: string): Promise<void> {
//     try {
//       await redis.del(key);
//     } catch (error) {
//       console.error(`Redis DELETE failed for key "${key}":`, error);
//     }
//   }

//   async deleteMany(keys: string[]): Promise<void> {
//     if (keys.length === 0) {
//       return;
//     }

//     try {
//       await redis.del(...keys);
//     } catch (error) {
//       console.error("Redis DELETE MANY failed:", error);
//     }
//   }

//   async exists(key: string): Promise<boolean> {
//     try {
//       const result = await redis.exists(key);

//       return result === 1;
//     } catch (error) {
//       console.error(`Redis EXISTS failed for key "${key}":`, error);
//       return false;
//     }
//   }
// }

// export const cacheService = new CacheService();

import { redis } from "../../config/redis";

class CacheService {
  async get<T>(key: string): Promise<T | null> {
    try {
      const cached = await redis.get(key);

      if (!cached) {
        console.log(`❌ Redis CACHE MISS: ${key}`);
        return null;
      }

      console.log(`✅ Redis CACHE HIT: ${key}`);

      return JSON.parse(cached) as T;
    } catch (error) {
      console.error(`Redis GET failed for key "${key}":`, error);
      return null;
    }
  }

  async set<T>(
    key: string,
    value: T,
    ttlSeconds: number,
  ): Promise<void> {
    try {
      await redis.set(
        key,
        JSON.stringify(value),
        "EX",
        ttlSeconds,
      );

      console.log(
        `💾 Redis CACHE SET: ${key} | TTL: ${ttlSeconds}s`,
      );
    } catch (error) {
      console.error(`Redis SET failed for key "${key}":`, error);
    }
  }

  async delete(key: string): Promise<void> {
    try {
      await redis.del(key);

      console.log(`🗑️ Redis CACHE DELETE: ${key}`);
    } catch (error) {
      console.error(`Redis DELETE failed for key "${key}":`, error);
    }
  }

  async deleteMany(keys: string[]): Promise<void> {
    if (keys.length === 0) {
      return;
    }

    try {
      await redis.del(...keys);

      console.log(
        `🗑️ Redis CACHE DELETE MANY: ${keys.length} keys`,
      );
    } catch (error) {
      console.error("Redis DELETE MANY failed:", error);
    }
  }

  async exists(key: string): Promise<boolean> {
    try {
      const result = await redis.exists(key);

      return result === 1;
    } catch (error) {
      console.error(`Redis EXISTS failed for key "${key}":`, error);
      return false;
    }
  }
}

export const cacheService = new CacheService();