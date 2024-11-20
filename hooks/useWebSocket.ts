import { useEffect, useRef, useCallback } from 'react';
import { useAuth } from '@clerk/nextjs';

interface WebSocketMessage {
  type: string;
  sessionId: string;
  userId: string;
  data: any;
}

export function useWebSocket(sessionId: string, onMessage: (message: WebSocketMessage) => void) {
  const { getToken } = useAuth();
  const wsRef = useRef<WebSocket | null>(null);

  const connect = useCallback(async () => {
    const token = await getToken();
    if (!token) return;

    const ws = new WebSocket(`${process.env.NEXT_PUBLIC_WS_URL}?token=${token}`);
    wsRef.current = ws;

    ws.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        onMessage(message);
      } catch (error) {
        console.error('WebSocket message parsing error:', error);
      }
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    ws.onclose = () => {
      // Attempt to reconnect after a delay
      setTimeout(connect, 5000);
    };
  }, [getToken, onMessage]);

  const sendMessage = useCallback((type: string, userId: string, data: any) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({
        type,
        sessionId,
        userId,
        data,
      }));
    }
  }, [sessionId]);

  useEffect(() => {
    connect();

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [connect]);

  return { sendMessage };
} 