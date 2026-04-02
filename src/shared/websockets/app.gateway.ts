import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger, UseGuards } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class AppGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(AppGateway.name);
  
  // Maps userId -> socketId(s)
  private userSockets = new Map<string, Set<string>>();
  // Detailed mapping socketId -> { userId, role, isBusy }
  private connectedClients = new Map<string, { userId: string; role: string; isBusy: boolean }>();

  constructor(private jwtService: JwtService) {}

  async handleConnection(client: Socket) {
    try {
      const token = client.handshake.auth.token || client.handshake.headers.authorization?.split(' ')[1];
      
      if (!token) {
        this.logger.warn(`Client ${client.id} attempted to connect without token`);
        client.disconnect();
        return;
      }

      const payload = this.jwtService.verify(token);
      const userId = payload.sub;
      const role = payload.role;

      // Track connection
      if (!this.userSockets.has(userId)) {
        this.userSockets.set(userId, new Set());
      }
      this.userSockets.get(userId)?.add(client.id);
      
      this.connectedClients.set(client.id, { userId, role, isBusy: false });

      // Join personal room for targeted messaging
      client.join(`user:${userId}`);
      if (role === 'ADMIN') {
        client.join('admins');
      }

      this.logger.log(`User ${userId} [${role}] connected with socket ${client.id}`);
      
      // Notify other modules if needed
      this.server.emit('user-online', { userId });
      
    } catch (error) {
      this.logger.error(`WebSocket authentication failed for client ${client.id}:`, error.message);
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    const clientInfo = this.connectedClients.get(client.id);
    if (clientInfo) {
      const { userId } = clientInfo;
      const sockets = this.userSockets.get(userId);
      if (sockets) {
        sockets.delete(client.id);
        if (sockets.size === 0) {
          this.userSockets.delete(userId);
          this.server.emit('user-offline', { userId });
        }
      }
      this.connectedClients.delete(client.id);
      this.logger.log(`User ${userId} disconnected from socket ${client.id}`);
    }
  }

  /**
   * Sends a real-time message to a specific user.
   */
  sendToUser(userId: string, event: string, data: any): boolean {
    const sockets = this.userSockets.get(userId);
    if (sockets && sockets.size > 0) {
      this.server.to(`user:${userId}`).emit(event, data);
      return true;
    }
    return false;
  }

  /**
   * Broadcasts to all connected admins.
   */
  broadcastToAdmins(event: string, data: any) {
    this.server.to('admins').emit(event, data);
  }

  /**
   * Sets the busy status for a user (on a call).
   */
  setUserBusyStatus(userId: string, isBusy: boolean) {
    const sockets = this.userSockets.get(userId);
    if (sockets) {
      sockets.forEach(socketId => {
        const info = this.connectedClients.get(socketId);
        if (info) {
          info.isBusy = isBusy;
        }
      });
    }
  }

  /**
   * Checks if a user is currently busy.
   */
  isUserBusy(userId: string): boolean {
    const sockets = this.userSockets.get(userId);
    if (!sockets) return false;
    
    // Check if any of the user's sockets are marked as busy
    for (const socketId of sockets) {
      if (this.connectedClients.get(socketId)?.isBusy) {
        return true;
      }
    }
    return false;
  }

  /**
   * Checks if a user is online.
   */
  isUserOnline(userId: string): boolean {
    return this.userSockets.has(userId);
  }
}