import {
    Schema,
    model,
    InferSchemaType,
    HydratedDocument,
} from "mongoose";

import { Currency } from "../../../common/enums/currency.enum";
import { Theme } from "../../../common/enums/theme.enum";
import { Language } from "../../../common/enums/language.enum";
import { DateFormat } from "../../../common/enums/date-format.enum";
import { TimeFormat } from "../../../common/enums/time-format.enum";

const userSettingsSchema = new Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
            unique: true,
        },

        currency: {
            type: String,
            enum: Object.values(Currency),
            required: true,
            default: Currency.INR,
        },

        theme: {
            type: String,
            enum: Object.values(Theme),
            required: true,
            default: Theme.SYSTEM,
        },

        language: {
            type: String,
            enum: Object.values(Language),
            default: Language.ENGLISH,
        },

        dateFormat: {
            type: String,
            enum: Object.values(DateFormat),
            default: DateFormat.DD_MM_YYYY,
        },

        timeFormat: {
            type: String,
            enum: Object.values(TimeFormat),
            default: TimeFormat.TWENTY_FOUR_HOUR,
        },

        notificationsEnabled: {
            type: Boolean,
            default: true,
        },

        emailNotifications: {
            type: Boolean,
            default: true,
        },

        pushNotifications: {
            type: Boolean,
            default: true,
        },

        budgetAlerts: {
            type: Boolean,
            default: true,
        },

        expenseReminders: {
            type: Boolean,
            default: true,
        },

        biometricEnabled: {
            type: Boolean,
            default: false,
        },

        pinEnabled: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

userSettingsSchema.index({ userId: 1 });

export type UserSettings = InferSchemaType<typeof userSettingsSchema>;

export type UserSettingsDocument = HydratedDocument<UserSettings>;

const UserSettingsModel = model<UserSettings>(
    "UserSettings",
    userSettingsSchema
);

export default UserSettingsModel;