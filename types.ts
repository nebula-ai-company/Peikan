export interface User {
  id: string;
  name: string;
  avatar: string;
  status: 'online' | 'offline' | 'away' | 'busy';
  bio?: string;
  lastSeen?: string;
}

export interface Message {
  id: string;
  senderId: string;
  content: string; // text content or caption
  type: 'text' | 'image' | 'voice' | 'file';
  timestamp: string;
  isRead: boolean;
  mediaUrl?: string; // for images/voice/files
  fileName?: string; // for files
  duration?: string; // for voice
  fileSize?: string;
  replyToId?: string;
  reactions?: { emoji: string; count: number; users: string[] }[];
}

export interface Chat {
  id: string;
  type: 'direct' | 'group';
  name: string; // User name or Group name
  avatar: string;
  participants: User[];
  messages: Message[];
  unreadCount: number;
  isPinned: boolean;
  isMuted: boolean;
  lastMessage?: Message;
  draft?: string;
}

export type ViewState = 'login' | 'chat' | 'register' | 'forgot-password';
export type Theme = 'light' | 'dark';