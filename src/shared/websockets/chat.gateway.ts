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
import { ChatService } from 'src/domain/services/chat.service';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
  namespace: '/chat',
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(ChatGateway.name);
  private connectedUsers = new Map<string, { userId: string; isAdmin: boolean }>(); // socketId -> info
  private userSockets = new Map<string, string>(); // userId -> socketId

  constructor(
    private jwtService: JwtService,
    private chatService: ChatService,
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
      const isAdmin = payload.role === 'ADMIN';

      this.connectedUsers.set(client.id, { userId, isAdmin });
      this.userSockets.set(userId, client.id);
      
      client.join(`user:${userId}`);
      if (isAdmin) {
        client.join('admins');
      }
      
      this.logger.log(`${isAdmin ? 'Admin' : 'User'} ${userId} connected with socket ${client.id}`);
    } catch (error) {
      this.logger.error(`WebSocket connection error for client ${client.id}:`, error.message);
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    const info = this.connectedUsers.get(client.id);
    if (info) {
      this.connectedUsers.delete(client.id);
      this.userSockets.delete(info.userId);
      this.logger.log(`User ${info.userId} disconnected`);
    }
  }

  @SubscribeMessage('join-chat')
  async handleJoinChat(
    @MessageBody() data: { chatId: string },
    @ConnectedSocket() client: Socket,
  ) {
    const info = this.connectedUsers.get(client.id);
    if (!info) return;

    client.join(`chat:${data.chatId}`);
    this.logger.log(`User ${info.userId} joined chat ${data.chatId}`);
  }

  @SubscribeMessage('send-message')
  async handleSendMessage(
    @MessageBody() data: { chatId: string; message: string },
    @ConnectedSocket() client: Socket,
  ) {
    const info = this.connectedUsers.get(client.id);
    if (!info) return;

    try {
      const message = await this.chatService.sendMessage(
        data.chatId,
        info.userId,
        data.message,
        info.isAdmin,
      );

      // Broadcast to room
      this.server.to(`chat:${data.chatId}`).emit('new-message', message);
      
      // Also notify admins if they aren't in the room
      this.server.to('admins').emit('admin-log-message', {
          chatId: data.chatId,
          message: message
      });

    } catch (error) {
      this.logger.error('Error sending message:', error);
    }
  }
}
