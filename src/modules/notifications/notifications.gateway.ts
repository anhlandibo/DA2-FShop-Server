/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { MessageBody, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Socket, Server } from "socket.io";

@WebSocketGateway({cors: { origin: '*' }})
export class NotificationGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;

  constructor(private jwtService: JwtService, private configService: ConfigService) {}

  async handleConnection(client: Socket) {
    try {
      // 1. Extract token from query or headers
      const token = client.handshake.auth?.token || client.handshake.headers?.authorization?.split(' ')[1];

      if (!token) {
        console.log("No token provided. Disconnecting...");
        return client.disconnect();
      }

      // 2. Verify token
      const secret = this.configService.get<string>('JWT_SECRET');
      const payload = await this.jwtService.verifyAsync(token, {
        secret,
      });

      // 3. Extract userId from payload
      const userId = payload.userId;
      client.data.userId = userId;

      // 4. Join user room
      client.join(`user_${userId}`);
      console.log(`Authenticated: User ${userId} connected with socket ${client.id}`);
    }
    catch (err) {
      console.log("Token invalid. Disconnecting...");
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    console.log("Client disconnected: " + client.id);

    this.server.emit('user-left', {
      message: `User ${client.id} has left the chat`,
    })
  }

  sendToUser(userId: number, data: any) {
    this.server.to(`user_${userId}`).emit('notification_received', data);
  }
}