
export interface User {
  id: string;
  name: string;
  email?: string;
  avatar: string;
  status: 'online' | 'offline' | 'away' | 'busy';
  bio?: string;
  lastSeen?: string;
  companyId?: string; // Link user to a company
  role?: 'admin' | 'user';
}

export type MessageEffect = 
  | 'slam' 
  | 'loud' 
  | 'gentle' 
  | 'invisible' 
  | 'echo' 
  | 'spotlight' 
  | 'balloons' 
  | 'confetti' 
  | 'love' 
  | 'lasers' 
  | 'fireworks';

export interface Message {
  id: string;
  senderId: string;
  content: string; // text content or caption. For location: "lat,lng"
  type: 'text' | 'image' | 'voice' | 'file' | 'sticker' | 'gif' | 'location';
  timestamp: string;
  isRead: boolean;
  mediaUrl?: string; // for images/voice/files/stickers/gifs
  fileName?: string; // for files
  duration?: string; // for voice
  fileSize?: string;
  replyToId?: string;
  reactions?: { emoji: string; count: number; users: string[] }[];
  effect?: MessageEffect;
}

export interface Chat {
  id: string;
  type: 'direct' | 'group' | 'channel';
  name: string; // User name or Group name
  description?: string; // Group description
  avatar: string;
  participants: User[];
  adminIds?: string[]; // IDs of users who are admins
  messages: Message[];
  unreadCount: number;
  isPinned: boolean;
  isMuted: boolean;
  lastMessage?: Message;
  draft?: string;
}

export interface Company {
  id: string;
  name: string;
  logo: string;
  employeeCount: number;
  status: 'active' | 'inactive';
  plan: 'basic' | 'enterprise';
  registeredAt: string;
}

export interface RegistrationRequest {
  id: string;
  name: string;
  email: string;
  phone: string;
  companyName: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  date: string;
}

export type ViewState = 'login' | 'chat' | 'register' | 'forgot-password' | 'admin';
export type Theme = 'light' | 'dark';