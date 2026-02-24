import { RtcTokenBuilder, RtcRole } from "agora-access-token";

class VideoConferencingService {
  private appId: string;
  private appCertificate: string;

  constructor() {
    this.appId = process.env.AGORA_APP_ID!;
    this.appCertificate = process.env.AGORA_APP_CERTIFICATE!;
  }

  /**
   * A meeting = channelName
   */
  async createMeet(channelName: string) {
    return {
      channelName,
      provider: "agora",
    };
  }

  /**
   * Generate token for a user to join a channel
   */
  async createToken(
    channelName: string,
    userId: string,
    role: "host" | "guest",
    expireSeconds = 3600,
  ) {
    const agoraRole = role === "host" ? RtcRole.PUBLISHER : RtcRole.SUBSCRIBER;

    const expirationTimeInSeconds =
      Math.floor(Date.now() / 1000) + expireSeconds;

    const token = RtcTokenBuilder.buildTokenWithUid(
      this.appId,
      this.appCertificate,
      channelName,
      Number(userId),
      agoraRole,
      expirationTimeInSeconds,
    );

    return {
      token,
      channelName,
      uid: userId,
      expiresAt: expirationTimeInSeconds * 2 * 60,
    };
  }
}

export default new VideoConferencingService();
