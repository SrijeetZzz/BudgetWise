export interface ProfileResponseDto {
  displayName: string | null;
  email: string;
  phone: string;
  profileImage: string | null;

  monthlyIncome: number | null;
  occupation: string | null;
  country: string | null;
  timezone: string | null;

  isEmailVerified: boolean;
  isPhoneVerified: boolean;
}