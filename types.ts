export interface User {
  id: string;
  name: string;
  avatar: string;
  status: 'online' | 'offline' | 'away' | 'busy';
  bio?: string;
  lastSeen?: string;
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

export type ViewState = 'login' | 'chat' | 'register' | 'forgot-password';
export type Theme = 'light' | 'dark';