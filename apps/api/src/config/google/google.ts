import { OAuth2Client } from "google-auth-library";
import { env } from "../env";
import { AppError } from "../../common/exceptions/AppError";

const client = new OAuth2Client(env.google.clientId);

export interface GoogleUserPayload {
  googleId: string;
  email: string;
  name: string;
  picture?: string;
  emailVerified: boolean;
}

export const verifyGoogleToken = async (
  idToken: string,
): Promise<GoogleUserPayload> => {
  try {
    const ticket = await client.verifyIdToken({
      idToken,
      audience: env.google.clientId,
    });

    const payload = ticket.getPayload();

    if (!payload) {
      throw new AppError(401, "Invalid Google token");
    }

    if (!payload.email) {
      throw new AppError(401, "Google account has no email");
    }

    return {
      googleId: payload.sub,
      email: payload.email,
      name: payload.name ?? "",
      picture: payload.picture,
      emailVerified: payload.email_verified ?? false,
    };
  } catch (error) {
    throw new AppError(401, "Invalid or expired Google token");
  }
};