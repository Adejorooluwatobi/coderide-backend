import { 
  WebSocketGateway, 
  WebSocketServer, 
  SubscribeMessage, 
  OnGatewayConnection,
  OnGatewayDisconnect
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { DriverService } from 'src/domain/services/driver.service';

@WebSocketGateway({ cors: true }) // Enable CORS for frontend access
export class RideGateway implements OnGatewayConnection, OnGatewayDisconnect {
  
  @WebSocketServer()
  server: Server;

  private userSockets = new Map<string, string>(); // userId -> socketId

  constructor(private driverService: DriverService) {}

  // 1. When a driver comes online, save their socket ID
  handleConnection(client: Socket) {
    const driverId = client.handshake.query.driverId as string;
    const userId = client.handshake.query.userId as string; // Support passing userId for easier mapping
    const isAdmin = client.handshake.query.isAdmin === 'true';
    
    if (driverId || userId) {
      const id = userId || driverId;
      this.userSockets.set(id, client.id);
      console.log(`User/Driver ${id} connected with socket ${client.id}`);
      
      if (isAdmin) {
          client.join('admins');
          console.log(`User ${id} joined admins room`);
      }
    }
  }

  handleDisconnect(client: Socket) {
    // Find and remove from map
    for (const [userId, socketId] of this.userSockets.entries()) {
      if (socketId === client.id) {
        this.userSockets.delete(userId);
        console.log(`User ${userId} disconnected`);
        break;
      }
    }
  }

  // 2. Listen for Driver Location Updates (Driver App sends this every 5s)
  @SubscribeMessage('updateDriverLocation')
  async handleLocationUpdate(client: Socket, payload: { driverId: string, lat: number, lng: number }) {
    // Update DB with new coordinates
    // await this.driverService.updateLocation(payload.driverId, payload.lat, payload.lng);
  }

  // 3. Method to notify a specific driver (We call this from our Controller/Service)
  notifyDriverOfRideRequest(driverSocketId: string, rideDetails: any) {
    this.server.to(driverSocketId).emit('newRideRequest', rideDetails);
  }

  // Add this to support notifying by userId
  emitNotificationToUser(userId: string, notification: any) {
    const socketId = this.userSockets.get(userId);
    if (socketId) {
      this.server.to(socketId).emit('notification', notification);
    } else {
      // Fallback: system could queue this for when they connect
      console.warn(`No active socket found for user ${userId}`);
    }
  }

  // Add this to support notifying all connected admins
  emitToAdmins(event: string, payload: any) {
    this.server.to('admins').emit(event, payload);
  }
}
