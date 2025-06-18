# Frontend - Chat App

This is the Next.js frontend for the Chat App that connects to the Express.js backend.

## Features

- **Authentication**: Login/Signup with JWT tokens
- **Real-time Chat**: Socket.io integration for instant messaging
- **User Management**: Add/remove chat users, search users
- **Modern UI**: Built with Tailwind CSS and shadcn/ui components
- **TypeScript**: Full type safety throughout the application

## API Connection

The frontend connects to the backend through:

### 1. REST API (`/lib/api.ts`)
- **Base URL**: `http://localhost:5000/api` (configurable via `NEXT_PUBLIC_API_URL`)
- **Authentication**: JWT tokens stored in cookies
- **Endpoints**:
  - `/auth/login` - User login
  - `/auth/signup` - User registration
  - `/auth/logout` - User logout
  - `/users/*` - User management
  - `/messages/*` - Message operations

### 2. WebSocket Connection (`/lib/socket.ts`)
- **Socket URL**: `http://localhost:5000` (configurable via `NEXT_PUBLIC_SOCKET_URL`)
- **Real-time Features**:
  - Instant message delivery
  - User online/offline status
  - Typing indicators
  - Room-based messaging

## Environment Variables

Create a `.env.local` file in the frontend directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_SOCKET_URL=http://localhost:5000
```

## Authentication Flow

1. **Login/Signup**: User credentials sent to backend
2. **JWT Token**: Backend returns JWT token stored in cookies
3. **API Requests**: Token automatically included in subsequent requests
4. **Socket Connection**: User ID used for socket authentication

## Key Components

### AuthContext (`/contexts/AuthContext.tsx`)
- Manages user authentication state
- Provides login/logout functions
- Handles token storage and API calls

### API Client (`/lib/api.ts`)
- Centralized API communication
- Type-safe request/response handling
- Error handling and retry logic

### Socket Client (`/lib/socket.ts`)
- WebSocket connection management
- Event handling for real-time features
- Automatic reconnection

## Usage Examples

### Making API Calls
```typescript
import { apiClient } from '@/lib/api'

// Get chat users
const chatUsers = await apiClient.getChatUsers(userId)

// Send a message
const message = await apiClient.sendMessage(text, receiverId, senderId)
```

### Using Socket Connection
```typescript
import { socketClient } from '@/lib/socket'

// Connect to socket
const socket = socketClient.connect(userId)

// Send real-time message
socketClient.sendMessage({
  text: "Hello!",
  receiverId: "user123",
  senderId: "currentUser"
})

// Listen for incoming messages
socketClient.onMessageReceived((message) => {
  console.log('New message:', message)
})
```

### Using Authentication
```typescript
import { useAuth } from '@/contexts/AuthContext'

function MyComponent() {
  const { user, login, logout } = useAuth()
  
  const handleLogin = async () => {
    const result = await login(email, password)
    if (result.success) {
      // Redirect to dashboard
    }
  }
}
```

## Development

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start development server**:
   ```bash
   npm run dev
   ```

3. **Build for production**:
   ```bash
   npm run build
   ```

## Backend Requirements

Make sure the backend server is running on `http://localhost:5000` with:
- Express.js server with CORS enabled
- Socket.io server for real-time communication
- MongoDB database connection
- JWT authentication middleware

## File Structure

```
frontend/
├── app/                    # Next.js app directory
│   ├── dashboard/         # Dashboard page
│   ├── login/            # Login page
│   ├── signup/           # Signup page
│   └── layout.tsx        # Root layout with providers
├── components/           # UI components
├── contexts/            # React contexts
│   └── AuthContext.tsx  # Authentication context
├── lib/                 # Utility libraries
│   ├── api.ts          # API client
│   └── socket.ts       # Socket client
└── .env.local          # Environment variables
```

## Troubleshooting

### CORS Issues
- Ensure backend has CORS configured for `http://localhost:3000`
- Check that `NEXT_PUBLIC_API_URL` is correct

### Socket Connection Issues
- Verify backend socket server is running
- Check `NEXT_PUBLIC_SOCKET_URL` environment variable
- Ensure user is authenticated before connecting

### Authentication Issues
- Clear browser cookies and localStorage
- Check JWT token expiration
- Verify backend authentication middleware 