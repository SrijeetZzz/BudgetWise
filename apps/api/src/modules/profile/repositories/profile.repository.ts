import { FilterQuery, UpdateQuery } from "mongoose";
import UserProfileModel, {
    UserProfile,
    UserProfileDocument,
} from "../schemas/user-profile.model";

class ProfileRepository {
    async create(data: Partial<UserProfile>): Promise<UserProfileDocument> {
        return UserProfileModel.create(data);
    }

    async findByUserId(userId: string): Promise<UserProfileDocument | null> {
        return UserProfileModel.findOne({ userId });
    }

    async exists(userId: string): Promise<boolean> {
        const profile = await UserProfileModel.exists({ userId });
        return !!profile;
    }

    async updateByUserId(
        userId: string,
        data: UpdateQuery<UserProfile>
    ): Promise<UserProfileDocument | null> {
        return UserProfileModel.findOneAndUpdate(
            { userId },
            data,
            {
                new: true,
                runValidators: true,
            }
        );
    }

    async deleteByUserId(userId: string): Promise<UserProfileDocument | null> {
        return UserProfileModel.findOneAndDelete({ userId });
    }
}

export const profileRepository = new ProfileRepository();