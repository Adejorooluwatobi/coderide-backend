import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AccessToken } from 'livekit-server-sdk';

@Injectable()
export class LiveKitService {
  private readonly logger = new Logger(LiveKitService.name);

  constructor(private configService: ConfigService) {}

  /**
   * Generates a token for a user to join a LiveKit room.
   */
  async generateToken(
    roomName: string,
    participantIdentity: string,
    participantName?: string,
    isAdmin: boolean = false,
  ): Promise<string> {
    const apiKey = this.configService.get('LIVEKIT_API_KEY');
    const apiSecret = this.configService.get('LIVEKIT_API_SECRET');

    if (!apiKey || !apiSecret) {
      this.logger.error('LiveKit API Key or Secret is missing in configuration');
      throw new Error('LiveKit configuration missing');
    }

    const at = new AccessToken(apiKey, apiSecret, {
      identity: participantIdentity,
      name: participantName || participantIdentity,
    });

    at.addGrant({
      roomJoin: true,
      room: roomName,
      canPublish: true,
      canSubscribe: true,
      canPublishData: true,
      // Admins get extra permissions if needed
      roomAdmin: isAdmin,
    });

    return at.toJwt();
  }

  /**
   * Generates a specialized token for an admin to "jump into" an existing call.
   */
  async generateAdminJoinToken(roomName: string, adminId: string, adminName: string): Promise<string> {
    return this.generateToken(roomName, adminId, adminName, true);
  }
}
