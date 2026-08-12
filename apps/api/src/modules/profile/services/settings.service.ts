import { AppError } from "../../../common/exceptions/AppError";

import { UpdateSettingsDto } from "../dto/update-settings.dto";
import { settingsRepository } from "../repositories/settings.repository";

class SettingsService {
  async getSettings(userId: string) {
    const settings = await settingsRepository.findByUserId(userId);

    if (!settings) {
      throw new AppError(404, "Settings not found");
    }

    return settings;
  }

  async updateSettings(
    userId: string,
    dto: UpdateSettingsDto,
  ) {
    const settings = await settingsRepository.updateByUserId(
      userId,
      dto,
    );

    if (!settings) {
      throw new AppError(404, "Settings not found");
    }

    return settings;
  }

  async updateTheme(
    userId: string,
    theme: UpdateSettingsDto["theme"],
  ) {
    const settings = await settingsRepository.updateByUserId(userId, {
      theme,
    });

    if (!settings) {
      throw new AppError(404, "Settings not found");
    }

    return settings;
  }

  async updateCurrency(
    userId: string,
    currency: UpdateSettingsDto["currency"],
  ) {
    const settings = await settingsRepository.updateByUserId(userId, {
      currency,
    });

    if (!settings) {
      throw new AppError(404, "Settings not found");
    }

    return settings;
  }

  async updateLanguage(
    userId: string,
    language: UpdateSettingsDto["language"],
  ) {
    const settings = await settingsRepository.updateByUserId(userId, {
      language,
    });

    if (!settings) {
      throw new AppError(404, "Settings not found");
    }

    return settings;
  }

  async updateNotificationSettings(
    userId: string,
    dto: Pick<
      UpdateSettingsDto,
      | "notificationsEnabled"
      | "emailNotifications"
      | "pushNotifications"
      | "budgetAlerts"
      | "expenseReminders"
    >,
  ) {
    const settings = await settingsRepository.updateByUserId(
      userId,
      dto,
    );

    if (!settings) {
      throw new AppError(404, "Settings not found");
    }

    return settings;
  }

  async updateDateTimeFormat(
    userId: string,
    dto: Pick<
      UpdateSettingsDto,
      "dateFormat" | "timeFormat"
    >,
  ) {
    const settings = await settingsRepository.updateByUserId(
      userId,
      dto,
    );

    if (!settings) {
      throw new AppError(404, "Settings not found");
    }

    return settings;
  }
}

export default new SettingsService();