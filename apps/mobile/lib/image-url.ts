import { API_URL } from "./env";

export function getImageUrl(
  imagePath?: string | null,
) {
  if (!imagePath) {
    return null;
  }

  if (
    imagePath.startsWith("http://") ||
    imagePath.startsWith("https://")
  ) {
    return imagePath;
  }

  const baseUrl = API_URL.replace(
    /\/api\/v1\/?$/,
    "",
  );

  return `${baseUrl}/${imagePath.replace(
    /^\/+/,
    "",
  )}`;
}