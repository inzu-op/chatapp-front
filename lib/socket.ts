import { io, Socket } from 'socket.io-client';

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:5000';

class SocketClient {
  private socket: Socket | null = null;
  private isConnected = false;

  connect(userId: string) {
    if (this.socket && this.isConnected) {
      return this.socket;
    }

    this.socket = io(SOCKET_URL, {
      auth: {
        userId,
      },
      transports: ['websocket'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    this.socket.on('connect', () => {
      console.log('Connected to WebSocket server');
      this.isConnected = true;
    });

    this.socket.on('disconnect', () => {
      console.log('Disconnected from WebSocket server');
      this.isConnected = false;
    });

    this.socket.on('connect_error', (error) => {
      console.error('WebSocket connection error:', error);
      this.isConnected = false;
    });

    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
    }
  }

  getSocket(): Socket | null {
    return this.socket;
  }

  isSocketConnected(): boolean {
    return this.isConnected;
  }

  // Emit events
  joinChat(userId: string) {
    if (this.socket && this.isConnected) {
      this.socket.emit('join-chat', userId);
    }
  }

  leaveChat(userId: string) {
    if (this.socket && this.isConnected) {
      this.socket.emit('leave-chat', userId);
    }
  }

  sendTyping(data: { userId: string; receiverId: string }) {
    if (this.socket && this.isConnected) {
      this.socket.emit('typing', data);
    }
  }

  // Listen to events
  onMessageReceived(callback: (message: any) => void) {
    if (this.socket) {
      this.socket.on('new-message', callback);
    }
  }

  onTyping(callback: (data: { userId: string; receiverId: string }) => void) {
    if (this.socket) {
      this.socket.on('typing', callback);
    }
  }

  onChatUsersUpdated(callback: (data: { userId: string }) => void) {
    if (this.socket) {
      this.socket.on('chat-users-updated', callback);
    }
  }

  onUserStatusChange(callback: (data: { userId: string; isOnline: boolean }) => void) {
    if (this.socket) {
      this.socket.on('user-status-change', callback);
    }
  }

  // Remove event listeners
  off(event: string) {
    if (this.socket) {
      this.socket.off(event);
    }
  }

  offAll() {
    if (this.socket) {
      this.socket.off();
    }
  }
}

// Create and export singleton instance
export const socketClient = new SocketClient(); 