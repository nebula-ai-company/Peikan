import { Chat, User } from './types';

export const CURRENT_USER: User = {
  id: 'me',
  name: 'امیر رضایی',
  avatar: 'https://picsum.photos/id/1005/200/200',
  status: 'online',
  bio: 'مدیر محصول در پیکان'
};

export const USERS: User[] = [
  {
    id: 'u1',
    name: 'سارا محمدی',
    avatar: 'https://picsum.photos/id/1011/200/200',
    status: 'online',
    bio: 'طراح رابط کاربری',
    lastSeen: 'همین الان'
  },
  {
    id: 'u2',
    name: 'تیم فنی',
    avatar: 'https://picsum.photos/id/1012/200/200', // Group avatar
    status: 'online',
    bio: 'گروه توسعه‌دهندگان فرانت‌اند و بک‌اند'
  },
  {
    id: 'u3',
    name: 'رضا کمالی',
    avatar: 'https://picsum.photos/id/1025/200/200',
    status: 'away',
    bio: 'مدیر پروژه',
    lastSeen: '۱ ساعت پیش'
  },
  {
    id: 'u4',
    name: 'زهرا احمدی',
    avatar: 'https://picsum.photos/id/1027/200/200',
    status: 'offline',
    bio: 'کارشناس مارکتینگ',
    lastSeen: 'دیروز'
  }
];

export const ALL_CONTACTS: User[] = [
  ...USERS,
  {
    id: 'u5',
    name: 'محسن چاوشی',
    avatar: 'https://picsum.photos/id/338/200/200',
    status: 'online',
    bio: 'مدیر هنری',
    lastSeen: 'همین الان'
  },
  {
    id: 'u6',
    name: 'همایون شجریان',
    avatar: 'https://picsum.photos/id/334/200/200',
    status: 'offline',
    bio: 'موسیقی سنتی',
    lastSeen: '۲ ساعت پیش'
  },
  {
    id: 'u7',
    name: 'پشتیبانی فنی',
    avatar: 'https://picsum.photos/id/447/200/200',
    status: 'busy',
    bio: 'پاسخگویی ۲۴ ساعته'
  },
  {
    id: 'u8',
    name: 'علی کریمی',
    avatar: 'https://picsum.photos/id/433/200/200',
    status: 'online',
    bio: 'بازیکن فوتبال'
  },
  {
    id: 'u9',
    name: 'مهتاب کرامتی',
    avatar: 'https://picsum.photos/id/325/200/200',
    status: 'away',
    bio: 'سفیر یونیسف',
    lastSeen: '۵ دقیقه پیش'
  },
   {
    id: 'u10',
    name: 'امید نعمتی',
    avatar: 'https://picsum.photos/id/238/200/200',
    status: 'offline',
    bio: 'گروه پالت',
    lastSeen: '۳ روز پیش'
  }
];

export const MOCK_CHATS: Chat[] = [
  // --- CHANNELS ---
  {
    id: 'ch1',
    type: 'channel',
    name: '🚨 اخبار اضطراری',
    description: 'کانال رسمی اطلاع‌رسانی اخبار فوری و بحران.',
    avatar: 'https://ui-avatars.com/api/?name=Alert&background=ef4444&color=fff&size=200',
    participants: ALL_CONTACTS, // All members
    unreadCount: 5,
    isPinned: true,
    isMuted: false,
    messages: [
      {
        id: 'msg_ch1_1',
        senderId: 'admin',
        content: 'وضعیت قرمز در منطقه ۳ اعلام شده است. لطفا از تردد غیرضروری خودداری کنید.',
        type: 'text',
        timestamp: '10:00',
        isRead: true
      }
    ]
  },
  {
    id: 'ch2',
    type: 'channel',
    name: '☁️ وضعیت آب و هوا',
    description: 'گزارش لحظه‌ای وضعیت جوی و هشدارهای هواشناسی.',
    avatar: 'https://ui-avatars.com/api/?name=Weather&background=0ea5e9&color=fff&size=200',
    participants: ALL_CONTACTS,
    unreadCount: 1,
    isPinned: true,
    isMuted: true,
    messages: [
        {
        id: 'msg_ch2_1',
        senderId: 'admin',
        content: 'پیش‌بینی بارش شدید در ۴۸ ساعت آینده.',
        type: 'text',
        timestamp: '08:30',
        isRead: true
      }
    ]
  },
  {
    id: 'ch3',
    type: 'channel',
    name: '📢 تالار عمومی اعضا',
    description: 'فضای گفتگوی آزاد برای تمام اعضای سازمان.',
    avatar: 'https://ui-avatars.com/api/?name=General&background=8b5cf6&color=fff&size=200',
    participants: ALL_CONTACTS,
    unreadCount: 0,
    isPinned: false,
    isMuted: false,
    messages: [
       {
        id: 'msg_ch3_1',
        senderId: 'u5',
        content: 'سلام به همه همکاران، کسی از وضعیت جاده‌ها خبر داره؟',
        type: 'text',
        timestamp: '09:45',
        isRead: true
      }
    ]
  },
  // --- DIRECT & GROUPS ---
  {
    id: 'c1',
    type: 'direct',
    name: 'سارا محمدی',
    avatar: 'https://picsum.photos/id/1011/200/200',
    participants: [USERS[0]],
    unreadCount: 2,
    isPinned: true,
    isMuted: false,
    messages: [
      {
        id: 'm1',
        senderId: 'me',
        content: 'سلام سارا، فایل‌های پروژه آماده شد؟',
        type: 'text',
        timestamp: '10:30',
        isRead: true
      },
      {
        id: 'm2',
        senderId: 'u1',
        content: 'سلام امیر جان، بله تقریباً تمومه.',
        type: 'text',
        timestamp: '10:32',
        isRead: true
      },
      {
        id: 'm3',
        senderId: 'u1',
        content: 'اینم طرح نهایی صفحه لاگین 👇',
        type: 'text',
        timestamp: '10:33',
        isRead: true
      },
      {
        id: 'm4',
        senderId: 'u1',
        content: 'Login_Mockup_v2.png',
        type: 'image',
        mediaUrl: 'https://picsum.photos/id/3/800/600',
        timestamp: '10:33',
        isRead: false
      },
      {
        id: 'm5',
        senderId: 'u1',
        content: 'نظرت چیه؟',
        type: 'voice',
        duration: '0:15',
        timestamp: '10:34',
        isRead: false
      }
    ]
  },
  {
    id: 'c2',
    type: 'group',
    name: 'تیم فنی پیکان',
    avatar: 'https://picsum.photos/id/20/200/200',
    participants: [USERS[0], USERS[2]],
    unreadCount: 0,
    isPinned: false,
    isMuted: true,
    messages: [
      {
        id: 'gm1',
        senderId: 'u3',
        content: 'بچه‌ها جلسه دیلی ساعت ۱۱ برگزار میشه.',
        type: 'text',
        timestamp: '09:00',
        isRead: true
      },
      {
        id: 'gm2',
        senderId: 'me',
        content: 'من کمی با تاخیر می‌رسم.',
        type: 'text',
        timestamp: '09:15',
        isRead: true
      }
    ]
  },
  {
    id: 'c3',
    type: 'direct',
    name: 'رضا کمالی',
    avatar: 'https://picsum.photos/id/1025/200/200',
    participants: [USERS[2]],
    unreadCount: 0,
    isPinned: false,
    isMuted: false,
    messages: [
      {
        id: 'rm1',
        senderId: 'me',
        content: 'گزارش ماهانه رو فرستادم برات.',
        type: 'file',
        fileName: 'Monthly_Report_Oct.pdf',
        fileSize: '2.4 MB',
        timestamp: 'Yesterday',
        isRead: true
      }
    ]
  }
];