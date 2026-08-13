import cron from "node-cron";

import { schedulerService } from "./services/scheduler.service";

export const startScheduler = () => {
  // Every day at 12:00 AM
  cron.schedule("0 0 * * *", async () => {
    await schedulerService.processScheduledTasks();
  });

  console.log(
    "⏰ Scheduler started — recurring transactions and budgets will be processed daily at 12:00 AM.",
  );
};
