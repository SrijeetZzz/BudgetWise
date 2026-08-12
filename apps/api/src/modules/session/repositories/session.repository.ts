import { SessionDocument } from "../schemas/session.schema";
import SessionModel from "../schemas/session.schema";

interface CreateSessionData {
  userId: string;
  refreshToken: string;
  deviceId: string;
  browser?: string | null;
  ipAddress?: string | null;
  expiresAt: Date;
  revokedAt?: Date | null;
}

class SessionRepository {
  async createSession(
    data: CreateSessionData,
  ): Promise<SessionDocument> {
    return SessionModel.create(data);
  }

  async findByRefreshToken(
    refreshToken: string,
  ): Promise<SessionDocument | null> {
    return SessionModel.findOne({
      refreshToken,
    });
  }

  async findById(
    sessionId: string,
  ): Promise<SessionDocument | null> {
    return SessionModel.findById(sessionId);
  }

  async findUserSessions(
    userId: string,
  ): Promise<SessionDocument[]> {
    return SessionModel.find({
      userId,
      revokedAt: null,
    });
  }

  async revokeSession(
    sessionId: string,
  ): Promise<void> {
    await SessionModel.findByIdAndUpdate(sessionId, {
      revokedAt: new Date(),
    });
  }

  async revokeByRefreshToken(
    refreshToken: string,
  ): Promise<void> {
    await SessionModel.findOneAndUpdate(
      { refreshToken },
      {
        revokedAt: new Date(),
      },
    );
  }

  async revokeAllSessions(
    userId: string,
  ): Promise<void> {
    await SessionModel.updateMany(
      {
        userId,
        revokedAt: null,
      },
      {
        revokedAt: new Date(),
      },
    );
  }

  async deleteExpiredSessions(): Promise<void> {
    await SessionModel.deleteMany({
      expiresAt: {
        $lt: new Date(),
      },
    });
  }
}

export default new SessionRepository();