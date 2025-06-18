export interface User {
  _id: string;
  name: string;
  email: string;
  lastMessage?: string;
  pinned?: boolean;
  addedAt?: Date;
}

