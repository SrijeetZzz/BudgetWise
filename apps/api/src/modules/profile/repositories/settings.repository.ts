import { UpdateQuery } from "mongoose";
import UserSettingsModel, {
    UserSettings,
    UserSettingsDocument,
} from "../schemas/user-settings.model";

class SettingsRepository {
    async create(data: Partial<UserSettings>): Promise<UserSettingsDocument> {
        return UserSettingsModel.create(data);
    }

    async findByUserId(userId: string): Promise<UserSettingsDocument | null> {
        return UserSettingsModel.findOne({ userId });
    }

    async exists(userId: string): Promise<boolean> {
        const settings = await UserSettingsModel.exists({ userId });
        return !!settings;
    }

    async updateByUserId(
        userId: string,
        data: UpdateQuery<UserSettings>
    ): Promise<UserSettingsDocument | null> {
        return UserSettingsModel.findOneAndUpdate(
            { userId },
            data,
            {
                new: true,
                runValidators: true,
            }
        );
    }

    async deleteByUserId(userId: string): Promise<UserSettingsDocument | null> {
        return UserSettingsModel.findOneAndDelete({ userId });
    }
}

export const settingsRepository = new SettingsRepository();