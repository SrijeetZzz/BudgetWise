import cron from "node-cron";

import { schedulerService } from "./services/scheduler.service";

export const startScheduler = () => {
  // Everyday at 12:00 AM
  cron.schedule("0 0 * * *", async () => {
    await schedulerService.processRecurringTransactions();
  });

  console.log(
    "⏰ Recurring transaction scheduler started — every Sunday at 12:00 AM.",
  );
};