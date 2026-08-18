import * as SecureStore from "expo-secure-store";

const DEVICE_ID_KEY = "budgetwise_device_id";

function generateDeviceId() {
  return `mobile-${Date.now()}-${Math.random()
    .toString(36)
    .substring(2, 15)}`;
}

export async function getDeviceId(): Promise<string> {
  const existing =
    await SecureStore.getItemAsync(
      DEVICE_ID_KEY,
    );

  if (existing) {
    return existing;
  }

  const deviceId = generateDeviceId();

  await SecureStore.setItemAsync(
    DEVICE_ID_KEY,
    deviceId,
  );

  return deviceId;
}