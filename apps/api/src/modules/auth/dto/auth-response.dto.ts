export interface AuthResponseDto {
  user: {
    id: string;
    email: string;
    phone: string;
  };
  accessToken: string;
  refreshToken: string;
}