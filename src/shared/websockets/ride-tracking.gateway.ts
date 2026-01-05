import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { RideTrackingService } from 'src/domain/services/ride-tracking.service';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
  namespace: '/ride-tracking',
})
export class RideTrackingGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(RideTrackingGateway.name);
  private connectedUsers = new Map<string, string>(); // socketId -> userId
  private userSockets = new Map<string, string>(); // userId -> socketId

  constructor(
    private jwtService: JwtService,
    private rideTrackingService: RideTrackingService,
  ) {}

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

      this.connectedUsers.set(client.id, userId);
      this.userSockets.set(userId, client.id);

      client.join(`user:${userId}`);
      
      this.logger.log(`User ${userId} connected with socket ${client.id}`);
    } catch (error) {
      this.logger.error(`WebSocket connection error for client ${client.id}:`, error.message);
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    const userId = this.connectedUsers.get(client.id);
    if (userId) {
      this.connectedUsers.delete(client.id);
      this.userSockets.delete(userId);
      this.logger.log(`User ${userId} disconnected`);
    }
  }

  @SubscribeMessage('join-ride')
  async handleJoinRide(
    @MessageBody() data: { rideId: string },
    @ConnectedSocket() client: Socket,
  ) {
    const userId = this.connectedUsers.get(client.id);
    if (!userId) return;

    client.join(`ride:${data.rideId}`);
    this.logger.log(`User ${userId} joined ride ${data.rideId}`);
  }

  @SubscribeMessage('leave-ride')
  async handleLeaveRide(
    @MessageBody() data: { rideId: string },
    @ConnectedSocket() client: Socket,
  ) {
    const userId = this.connectedUsers.get(client.id);
    if (!userId) return;

    client.leave(`ride:${data.rideId}`);
    this.logger.log(`User ${userId} left ride ${data.rideId}`);
  }

  @SubscribeMessage('location-update')
  async handleLocationUpdate(
    @MessageBody() data: {
      rideId: string;
      latitude: number;
      longitude: number;
      speed?: number;
      heading?: number;
    },
    @ConnectedSocket() client: Socket,
  ) {
    const userId = this.connectedUsers.get(client.id);
    if (!userId) return;

    try {
      // Save tracking point to database
      await this.rideTrackingService.create({
        rideId: data.rideId,
        latitude: data.latitude,
        longitude: data.longitude,
        speed: data.speed,
        heading: data.heading,
        timestamp: new Date(),
      });

      // Broadcast to all users in the ride
      this.server.to(`ride:${data.rideId}`).emit('location-updated', {
        rideId: data.rideId,
        latitude: data.latitude,
        longitude: data.longitude,
        speed: data.speed,
        heading: data.heading,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      this.logger.error('Location update error:', error);
    }
  }

  // Emit ride status updates
  emitRideStatusUpdate(rideId: string, status: string, data?: any) {
    this.server.to(`ride:${rideId}`).emit('ride-status-updated', {
      rideId,
      status,
      data,
      timestamp: new Date().toISOString(),
    });
  }

  // Emit notifications to specific user
  emitNotificationToUser(userId: string, notification: any) {
    const socketId = this.userSockets.get(userId);
    if (socketId) {
      this.server.to(socketId).emit('notification', notification);
    }
  }
}