import * as SecureStore from "expo-secure-store";

const ACCESS_TOKEN_KEY = "budgetwise_access_token";
const REFRESH_TOKEN_KEY = "budgetwise_refresh_token";

export const authToken = {
  async get(): Promise<string | null> {
    return SecureStore.getItemAsync(ACCESS_TOKEN_KEY);
  },

  async set(token: string): Promise<void> {
    await SecureStore.setItemAsync(
      ACCESS_TOKEN_KEY,
      token,
    );
  },

  async clear(): Promise<void> {
    await SecureStore.deleteItemAsync(
      ACCESS_TOKEN_KEY,
    );
  },
};

export const refreshToken = {
  async get(): Promise<string | null> {
    return SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
  },

  async set(token: string): Promise<void> {
    await SecureStore.setItemAsync(
      REFRESH_TOKEN_KEY,
      token,
    );
  },

  async clear(): Promise<void> {
    await SecureStore.deleteItemAsync(
      REFRESH_TOKEN_KEY,
    );
  },
};

export async function clearAuthTokens() {
  await Promise.all([
    authToken.clear(),
    refreshToken.clear(),
  ]);
}