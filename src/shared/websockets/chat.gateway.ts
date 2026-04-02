import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger, UseGuards, Inject, forwardRef } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ChatService } from 'src/domain/services/chat.service';
import { AppGateway } from './app.gateway';

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

  constructor(
    private jwtService: JwtService,
    @Inject(forwardRef(() => ChatService))
    private chatService: ChatService,
    @Inject(forwardRef(() => AppGateway))
    private appGateway: AppGateway,
  ) {}

  async handleConnection(client: Socket) {
    // Connection is primarily handled by AppGateway, 
    // but we can add namespace-specific logic here if needed.
    this.logger.log(`Client ${client.id} connected to /chat namespace`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client ${client.id} disconnected from /chat namespace`);
  }

  @SubscribeMessage('send-message')
  async handleSendMessage(
    @MessageBody() data: { chatId: string; message: string; type?: any; attachments?: any[] },
    @ConnectedSocket() client: Socket,
  ) {
    const token = client.handshake.auth.token || client.handshake.headers.authorization?.split(' ')[1];
    if (!token) return;

    try {
      const payload = this.jwtService.verify(token);
      const userId = payload.sub;
      const isAdmin = payload.role === 'ADMIN';

      const message = await this.chatService.sendMessage(data.chatId, {
        chatId: data.chatId,
        message: data.message,
        type: data.type,
        senderUserId: isAdmin ? undefined : userId,
        senderAdminId: isAdmin ? userId : undefined,
        senderId: userId,
      });

      // Get chat participants to notify
      const chat = await this.chatService.findById(data.chatId);
      if (!chat) return;

      const recipientId = chat.riderId === userId ? chat.driverId : chat.riderId;

      // Real-time delivery via AppGateway
      if (recipientId) {
        this.appGateway.sendToUser(recipientId, 'new-message', message);
      }

      // Confirmation to sender
      client.emit('message-sent', message);

      // Notify admins
      this.appGateway.broadcastToAdmins('admin-log-message', {
        chatId: data.chatId,
        message: message,
      });

    } catch (error) {
      this.logger.error('Error sending message:', error);
      client.emit('error', { message: 'Failed to send message' });
    }
  }

  @SubscribeMessage('offer-call')
  async handleOfferCall(
    @MessageBody() data: { chatId: string; callType: 'VOICE' | 'VIDEO' },
    @ConnectedSocket() client: Socket,
  ) {
    const token = client.handshake.auth.token || client.handshake.headers.authorization?.split(' ')[1];
    if (!token) return;

    try {
      const payload = this.jwtService.verify(token);
      const callerId = payload.sub;
      
      const chat = await this.chatService.findById(data.chatId);
      if (!chat) return;

      const calleeId = chat.riderId === callerId ? chat.driverId : chat.riderId;
      if (!calleeId) return;

      // Check Busy Status
      if (this.appGateway.isUserBusy(calleeId)) {
        client.emit('call-busy', { userId: calleeId, message: 'User is on another call' });
        return;
      }

      // Mark caller as busy
      this.appGateway.setUserBusyStatus(callerId, true);

      // Forward offer to callee
      this.appGateway.sendToUser(calleeId, 'incoming-call', {
        chatId: data.chatId,
        callerId,
        callerName: payload.name || 'User',
        callType: data.callType,
      });

      this.logger.log(`Call offered from ${callerId} to ${calleeId}`);
    } catch (error) {
      this.logger.error('Error offering call:', error);
    }
  }

  @SubscribeMessage('accept-call')
  async handleAcceptCall(
    @MessageBody() data: { chatId: string; callerId: string },
    @ConnectedSocket() client: Socket,
  ) {
    const token = client.handshake.auth.token || client.handshake.headers.authorization?.split(' ')[1];
    if (!token) return;

    try {
      const payload = this.jwtService.verify(token);
      const calleeId = payload.sub;

      // Mark callee as busy
      this.appGateway.setUserBusyStatus(calleeId, true);

      // Generate LiveKit tokens (actual implementation would call LiveKitService)
      // For signaling, we just notify the caller
      this.appGateway.sendToUser(data.callerId, 'call-accepted', {
        chatId: data.chatId,
        calleeId,
      });

      this.logger.log(`Call accepted by ${calleeId} from ${data.callerId}`);
    } catch (error) {
      this.logger.error('Error accepting call:', error);
    }
  }

  @SubscribeMessage('reject-call')
  async handleRejectCall(
    @MessageBody() data: { chatId: string; callerId: string },
    @ConnectedSocket() client: Socket,
  ) {
    const token = client.handshake.auth.token || client.handshake.headers.authorization?.split(' ')[1];
    if (!token) return;

    try {
      const payload = this.jwtService.verify(token);
      const calleeId = payload.sub;

      // Notify caller
      this.appGateway.sendToUser(data.callerId, 'call-rejected', {
        chatId: data.chatId,
        calleeId,
      });

      // Clear caller busy status
      this.appGateway.setUserBusyStatus(data.callerId, false);

      this.logger.log(`Call rejected by ${calleeId} from ${data.callerId}`);
    } catch (error) {
      this.logger.error('Error rejecting call:', error);
    }
  }

  @SubscribeMessage('hangup-call')
  async handleHangupCall(
    @MessageBody() data: { chatId: string; otherId: string },
    @ConnectedSocket() client: Socket,
  ) {
    const token = client.handshake.auth.token || client.handshake.headers.authorization?.split(' ')[1];
    if (!token) return;

    try {
      const payload = this.jwtService.verify(token);
      const userId = payload.sub;

      // Clear busy status for both
      this.appGateway.setUserBusyStatus(userId, false);
      this.appGateway.setUserBusyStatus(data.otherId, false);

      // Notify other party
      this.appGateway.sendToUser(data.otherId, 'call-ended', {
        chatId: data.chatId,
        endedBy: userId,
      });

      this.logger.log(`Call hung up by ${userId} in chat ${data.chatId}`);
    } catch (error) {
      this.logger.error('Error hanging up call:', error);
    }
  }
}
