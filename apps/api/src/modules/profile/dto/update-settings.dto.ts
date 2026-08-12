import { Currency } from "../../../common/enums/currency.enum";
import { Theme } from "../../../common/enums/theme.enum";
import { Language } from "../../../common/enums/language.enum";
import { DateFormat } from "../../../common/enums/date-format.enum";
import { TimeFormat } from "../../../common/enums/time-format.enum";

export interface UpdateSettingsDto {
  currency?: Currency;
  theme?: Theme;
  language?: Language;
  dateFormat?: DateFormat;
  timeFormat?: TimeFormat;

  notificationsEnabled?: boolean;
  emailNotifications?: boolean;
  pushNotifications?: boolean;
  budgetAlerts?: boolean;
  expenseReminders?: boolean;

  biometricEnabled?: boolean;
  pinEnabled?: boolean;
}