import { z } from "zod";

import { Currency } from "../../../common/enums/currency.enum";
import { Theme } from "../../../common/enums/theme.enum";
import { Language } from "../../../common/enums/language.enum";
import { DateFormat } from "../../../common/enums/date-format.enum";
import { TimeFormat } from "../../../common/enums/time-format.enum";

export const updateSettingsSchema = z.object({
  currency: z.nativeEnum(Currency).optional(),
  theme: z.nativeEnum(Theme).optional(),
  language: z.nativeEnum(Language).optional(),
  dateFormat: z.nativeEnum(DateFormat).optional(),
  timeFormat: z.nativeEnum(TimeFormat).optional(),

  notificationsEnabled: z.boolean().optional(),
  emailNotifications: z.boolean().optional(),
  pushNotifications: z.boolean().optional(),
  budgetAlerts: z.boolean().optional(),
  expenseReminders: z.boolean().optional(),

  biometricEnabled: z.boolean().optional(),
  pinEnabled: z.boolean().optional(),
});

export type UpdateSettingsInput = z.infer<
  typeof updateSettingsSchema
>;