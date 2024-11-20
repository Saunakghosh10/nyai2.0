import { Server } from 'ws';
import { parse } from 'url';
import { verify } from '@clerk/backend';

interface WebSocketMessage {
  type: 'ice-candidate' | 'offer' | 'answer' | 'leave';
  sessionId: string;
  userId: string;
  data: any;
}

class WebSocketServer {
  private wss: Server;
  private clients: Map<string, WebSocket> = new Map();

  constructor(server: any) {
    this.wss = new Server({ server });
    this.setupWebSocket();
  }

  private setupWebSocket() {
    this.wss.on('connection', async (ws: WebSocket, req) => {
      try {
        const { query } = parse(req.url!, true);
        const token = query.token as string;
        
        // Verify the user's token
        const { userId } = await verify(token);
        if (!userId) {
          ws.close();
          return;
        }

        this.clients.set(userId, ws);

        ws.on('message', async (message: string) => {
          try {
            const parsedMessage: WebSocketMessage = JSON.parse(message);
            await this.handleMessage(parsedMessage, userId);
          } catch (error) {
            console.error('WebSocket message error:', error);
          }
        });

        ws.on('close', () => {
          this.clients.delete(userId);
        });

      } catch (error) {
        console.error('WebSocket connection error:', error);
        ws.close();
      }
    });
  }

  private async handleMessage(message: WebSocketMessage, senderId: string) {
    const { sessionId, userId, type, data } = message;

    // Find the recipient's WebSocket connection
    const recipientWs = this.clients.get(userId);
    if (!recipientWs) return;

    // Forward the message to the recipient
    recipientWs.send(JSON.stringify({
      type,
      sessionId,
      userId: senderId,
      data,
    }));
  }
}

export default WebSocketServer; 