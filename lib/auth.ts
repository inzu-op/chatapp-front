interface Session {
  userId: string;
  name: string;
  email: string;
  token: string;
}

export async function getSession(): Promise<Session | null> {
  // Check if we're on the client side
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    const userData = localStorage.getItem('user');
    if (!userData) {
      return null;
    }

    const user = JSON.parse(userData);
    return {
      userId: user.id,
      name: user.name,
      email: user.email,
      token: user.token
    };
  } catch (error) {
    console.error('Error parsing session:', error);
    return null;
  }
}

export function clearSession(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('user');
  }
} 