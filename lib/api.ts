// API Configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// API Response types
export interface ApiResponse<T = any> {
  success?: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// User types
export interface User {
  id: string;
  name: string;
  email: string;
  token?: string;
}

export interface ChatUser {
  id: string;
  name: string;
  email: string;
  addedAt: string;
  pinned?: boolean;
}

// Message types
export interface Message {
  _id: string;
  sender: User;
  receiver: User;
  text: string;
  timestamp: string;
  read: boolean;
}

// API Client class
class ApiClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  // Generic request method
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      credentials: 'include', // Include cookies
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Authentication methods
  async login(email: string, password: string): Promise<User> {
    const response = await this.request<User>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    return response.data!;
  }

  async signup(name: string, email: string, password: string): Promise<User> {
    const response = await this.request<User>('/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    });
    return response.data!;
  }

  async logout(): Promise<void> {
    await this.request('/auth/logout', {
      method: 'POST',
    });
  }

  // User methods
  async getCurrentUser(): Promise<ChatUser[]> {
    const response = await this.request<ChatUser[]>('/users');
    return response.data!;
  }

  async getAllUsers(): Promise<User[]> {
    const response = await this.request<User[]>('/users/all');
    return response.data!;
  }

  async getUserById(id: string): Promise<User> {
    const response = await this.request<User>(`/users/${id}`);
    return response.data!;
  }

  async getChatUsers(userId: string): Promise<ChatUser[]> {
    const response = await this.request<ChatUser[]>(`/users/chat-users?userId=${userId}`);
    return response.data!;
  }

  async addChatUser(userId: string, targetUserId: string): Promise<ChatUser[]> {
    const response = await this.request<ChatUser[]>('/users/add-chat', {
      method: 'POST',
      body: JSON.stringify({ userId, targetUserId }),
    });
    return response.data!;
  }

  async removeChatUser(userId: string, targetUserId: string): Promise<{ success: boolean; chatUsers: ChatUser[] }> {
    const response = await this.request<{ success: boolean; chatUsers: ChatUser[] }>('/users/remove-chat', {
      method: 'POST',
      body: JSON.stringify({ userId, targetUserId }),
    });
    return response.data!;
  }

  async searchUsers(query: string): Promise<User[]> {
    const response = await this.request<User[]>(`/users/search?query=${encodeURIComponent(query)}`);
    return response.data!;
  }

  // Message methods
  async getMessages(userId: string, currentUserId: string): Promise<Message[]> {
    const response = await this.request<Message[]>(`/messages?userId=${userId}&currentUserId=${currentUserId}`);
    return response.data!;
  }

  async sendMessage(text: string, receiverId: string, senderId: string): Promise<Message> {
    const response = await this.request<Message>('/messages', {
      method: 'POST',
      body: JSON.stringify({ text, receiverId, senderId }),
    });
    return response.data!;
  }

  async clearMessages(userId: string, targetUserId: string): Promise<{ success: boolean }> {
    const response = await this.request<{ success: boolean }>('/messages/clear', {
      method: 'POST',
      body: JSON.stringify({ userId, targetUserId }),
    });
    return response.data!;
  }
}

// Create and export API client instance
export const apiClient = new ApiClient(API_BASE_URL);

// Export types
export type { User, ChatUser, Message, ApiResponse }; 