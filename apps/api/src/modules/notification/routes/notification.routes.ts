import { Router } from "express";
import { authenticate } from "../../../middleware/auth.middleware";
import notificationController from "../controllers/notification.controller";

const router = Router();

router.use(authenticate);

// Notifications
router.get(
  "/",
  notificationController.getNotifications,
);

router.put(
  "/read-all",
  notificationController.markAllAsRead,
);

router.get(
  "/:id",
  notificationController.getNotificationById,
);

router.put(
  "/:id/read",
  notificationController.markAsRead,
);

router.delete(
  "/:id",
  notificationController.deleteNotification,
);

export default router;