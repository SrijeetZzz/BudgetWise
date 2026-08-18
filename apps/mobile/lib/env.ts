const API_URL =
  process.env.EXPO_PUBLIC_API_URL;

if (!API_URL) {
  throw new Error(
    "EXPO_PUBLIC_API_URL is not defined",
  );
}

const GOOGLE_WEB_CLIENT_ID =
  process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID;

if (!GOOGLE_WEB_CLIENT_ID) {
  throw new Error(
    "EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID is not defined",
  );
}

export {
  API_URL,
  GOOGLE_WEB_CLIENT_ID,
};