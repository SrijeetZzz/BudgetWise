import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import { notFoundHandler } from "./middleware/notFound.middleware";
import { errorMiddleware } from "./middleware/error.middleware";
import authModule from "./modules/auth";
import sessionModule from "./modules/session";
import { profileRoutes } from "./modules/profile";
import categoryRoutes from "./modules/category/routes/category.routes";
import transactionRoutes from "./modules/transaction/routes/transaction.routes";
import path from "path";
import budgetRoutes from "./modules/budget/routes/budget.routes";
import dashboardRoutes from "./modules/dashboard/routes/dashboard.routes";
import notificationRoutes from "./modules/notification/routes/notification.routes";

const app = express();

// Security
app.use(
  helmet({
    crossOriginResourcePolicy: {
      policy: "cross-origin",
    },
  }),
);

// Compression
app.use(compression());

// CORS
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

// Body Parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Logger
app.use(morgan("dev"));

// Health Check
app.get("/health", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "BudgetWise API is running 🚀",
  });
});

app.use(
  "/uploads",
  express.static(path.join(process.cwd(), "uploads"))
);


app.use("/api/v1/auth", authModule);

app.use("/api/v1/session", sessionModule);

app.use("/api/v1/profile", profileRoutes);

app.use("/api/v1/categories", categoryRoutes);

app.use("/api/v1/transactions", transactionRoutes);

app.use("/api/v1/budgets", budgetRoutes);

app.use("/api/v1/dashboard", dashboardRoutes);

app.use("/api/v1/notifications", notificationRoutes);

// 404
app.use(notFoundHandler);

// Global Error Handler
app.use(errorMiddleware);

export default app;