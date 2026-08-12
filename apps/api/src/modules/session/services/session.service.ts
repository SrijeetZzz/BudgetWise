import { verifyRefreshToken } from "../../../config/jwt/jwt.service";
import { AppError } from "../../../common/exceptions/AppError";

import sessionRepository from "../repositories/session.repository";
import { SessionDocument } from "../schemas/session.schema";

interface CreateSessionDto {
  userId: string;
  refreshToken: string;
  deviceId: string;
  browser?: string | null;
  ipAddress?: string |null;
  expiresAt: Date;
}

class SessionService {
  async createSession(
    dto: CreateSessionDto,
  ): Promise<SessionDocument> {
    return sessionRepository.createSession({
      ...dto,
      revokedAt: null,
    });
  }

  async validateRefreshToken(
    refreshToken: string,
  ): Promise<{
    payload: ReturnType<typeof verifyRefreshToken>;
    session: SessionDocument;
  }> {
    const payload = verifyRefreshToken(refreshToken);

    const session =
      await sessionRepository.findByRefreshToken(
        refreshToken,
      );

    if (!session) {
      throw new AppError(401, "Session not found");
    }

    if (session.revokedAt) {
      throw new AppError(401, "Session has been revoked");
    }

    if (session.expiresAt < new Date()) {
      throw new AppError(401, "Session has expired");
    }

    return {
      payload,
      session,
    };
  }

  async revokeSession(
    sessionId: string,
  ): Promise<void> {
    await sessionRepository.revokeSession(sessionId);
  }

  async revokeSessionByRefreshToken(
    refreshToken: string,
  ): Promise<void> {
    await sessionRepository.revokeByRefreshToken(
      refreshToken,
    );
  }

  async revokeAllSessions(
    userId: string,
  ): Promise<void> {
    await sessionRepository.revokeAllSessions(userId);
  }

  async cleanupExpiredSessions(): Promise<void> {
    await sessionRepository.deleteExpiredSessions();
  }
}

export default new SessionService();