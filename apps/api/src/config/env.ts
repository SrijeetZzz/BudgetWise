// import dotenv from "dotenv";

// dotenv.config();

// const requiredEnvVars = [
//   "PORT",
//   "NODE_ENV",
//   "MONGODB_URI",
//   "JWT_ACCESS_SECRET",
//   "JWT_REFRESH_SECRET",
//   "JWT_ACCESS_EXPIRES_IN",
//   "JWT_REFRESH_EXPIRES_IN",
//   "GOOGLE_CLIENT_ID",
// ] as const;

// for (const key of requiredEnvVars) {
//   if (!process.env[key]) {
//     throw new Error(`Missing required environment variable: ${key}`);
//   }
// }

// export const env = {
//   port: Number(process.env.PORT),
//   nodeEnv: process.env.NODE_ENV!,

//   mongodb: {
//     uri: process.env.MONGODB_URI!,
//   },

//   jwt: {
//     accessSecret: process.env.JWT_ACCESS_SECRET!,
//     refreshSecret: process.env.JWT_REFRESH_SECRET!,
//     accessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN!,
//     refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN!,
//   },
//    google: {
//     clientId: process.env.GOOGLE_CLIENT_ID!,
//   },
// } as const;


import dotenv from "dotenv";

dotenv.config();

const requiredEnvVars = [
  // Application
  "PORT",
  "NODE_ENV",

  // Database
  "MONGODB_URI",

  // JWT
  "JWT_ACCESS_SECRET",
  "JWT_REFRESH_SECRET",
  "JWT_ACCESS_EXPIRES_IN",
  "JWT_REFRESH_EXPIRES_IN",

  // Google OAuth
  "GOOGLE_CLIENT_ID",

  // Mail
  "MAIL_HOST",
  "MAIL_PORT",
  "MAIL_SECURE",
  "MAIL_USER",
  "MAIL_PASSWORD",
  "MAIL_FROM_NAME",
  "MAIL_FROM_EMAIL",

  //Redis
  "REDIS_URL",
] as const;

for (const key of requiredEnvVars) {
  if (!process.env[key]) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
}

export const env = {
  port: Number(process.env.PORT),
  nodeEnv: process.env.NODE_ENV!,

  mongodb: {
    uri: process.env.MONGODB_URI!,
  },

  jwt: {
    accessSecret: process.env.JWT_ACCESS_SECRET!,
    refreshSecret: process.env.JWT_REFRESH_SECRET!,
    accessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN!,
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN!,
  },

  google: {
    clientId: process.env.GOOGLE_CLIENT_ID!,
  },

   redis: {
    url: process.env.REDIS_URL!,
  },

  mail: {
    host: process.env.MAIL_HOST!,
    port: Number(process.env.MAIL_PORT),
    secure: process.env.MAIL_SECURE === "true",
    user: process.env.MAIL_USER!,
    password: process.env.MAIL_PASSWORD!,
    from: {
      name: process.env.MAIL_FROM_NAME!,
      email: process.env.MAIL_FROM_EMAIL!,
    },
  },
} as const;