import React, { useState, useEffect } from 'react';
import { Chat, ViewState, Message } from './types';
import { CURRENT_USER, MOCK_CHATS, ALL_CONTACTS } from './constants';
import Sidebar from './components/Sidebar';
import ChatArea from './components/ChatArea';
import RightPanel from './components/RightPanel';
import Login from './components/Login';
import Register from './components/Register';
import ForgotPassword from './components/ForgotPassword';
import LoginCarousel from './components/LoginCarousel';
import SettingsModal from './components/SettingsModal';
import ContactsModal from './components/ContactsModal';
import CreateGroupModal from './components/CreateGroupModal';
import AddMemberModal from './components/AddMemberModal';
import { motion, AnimatePresence } from 'framer-motion';

const App: React.FC = () => {
  const [viewState, setViewState] = useState<ViewState>('login');
  const [chats, setChats] = useState<Chat[]>(MOCK_CHATS);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isRightPanelOpen, setIsRightPanelOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isNewChatModalOpen, setIsNewChatModalOpen] = useState(false);
  const [isCreateGroupModalOpen, setIsCreateGroupModalOpen] = useState(false);
  const [isAddMemberModalOpen, setIsAddMemberModalOpen] = useState(false);

  // Initialize Theme
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const handleSendMessage = (text: string, type: 'text' | 'voice' | 'image' | 'file') => {
    if (!activeChatId) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      senderId: CURRENT_USER.id,
      content: text,
      type: type,
      timestamp: new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' }),
      isRead: false,
      duration: type === 'voice' ? '0:05' : undefined
    };

    setChats(prevChats => prevChats.map(chat => {
      if (chat.id === activeChatId) {
        return {
          ...chat,
          messages: [...chat.messages, newMessage]
        };
      }
      return chat;
    }));
  };

  const handleStartChatWithUser = (userId: string) => {
    const existingChat = chats.find(c => 
      c.type === 'direct' && c.participants.some(p => p.id === userId)
    );

    if (existingChat) {
      setActiveChatId(existingChat.id);
    } else {
      const targetUser = ALL_CONTACTS.find(u => u.id === userId);
      if (!targetUser) return;

      const newChat: Chat = {
        id: `new_${Date.now()}`,
        type: 'direct',
        name: targetUser.name,
        avatar: targetUser.avatar,
        participants: [targetUser],
        messages: [],
        unreadCount: 0,
        isPinned: false,
        isMuted: false
      };
      
      setChats(prev => [newChat, ...prev]);
      setActiveChatId(newChat.id);
    }
  };

  const handleCreateGroup = (name: string, participantIds: string[], description: string, avatar: string | null) => {
      const participants = ALL_CONTACTS.filter(u => participantIds.includes(u.id));
      
      const newGroupChat: Chat = {
          id: `group_${Date.now()}`,
          type: 'group',
          name: name,
          description: description,
          avatar: avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=0D47A1&color=fff`,
          participants: [CURRENT_USER, ...participants],
          adminIds: [CURRENT_USER.id],
          messages: [],
          unreadCount: 0,
          isPinned: false,
          isMuted: false
      };

      setChats(prev => [newGroupChat, ...prev]);
      setActiveChatId(newGroupChat.id);
      setIsCreateGroupModalOpen(false);
  };

  const handleUpdateGroup = (chatId: string, name: string, description: string, avatar: string | undefined) => {
    setChats(prev => prev.map(c => {
      if (c.id === chatId) {
        return {
          ...c,
          name,
          description,
          avatar: avatar || c.avatar
        };
      }
      return c;
    }));
  };

  // Group Management Actions
  const handleLeaveGroup = (chatId: string) => {
    if (!window.confirm("آیا مطمئن هستید که می‌خواهید از این گروه خارج شوید؟")) return;

    setChats(prev => {
        const chat = prev.find(c => c.id === chatId);
        if (!chat) return prev;

        // Remove current user
        const updatedParticipants = chat.participants.filter(p => p.id !== CURRENT_USER.id);
        
        // If no participants left, remove chat entirely
        if (updatedParticipants.length === 0) {
            return prev.filter(c => c.id !== chatId);
        }

        return prev.map(c => c.id === chatId ? { ...c, participants: updatedParticipants } : c);
    });
    setActiveChatId(null);
    setIsRightPanelOpen(false);
  };

  const handleDeleteGroup = (chatId: string) => {
      if (!window.confirm("هشدار: این گروه و تمام تاریخچه آن برای همه اعضا حذف خواهد شد. آیا مطمئن هستید؟")) return;
      
      setChats(prev => prev.filter(c => c.id !== chatId));
      setActiveChatId(null);
      setIsRightPanelOpen(false);
  };

  const handleRemoveMember = (chatId: string, userId: string) => {
      setChats(prev => prev.map(c => {
          if (c.id === chatId) {
              return {
                  ...c,
                  participants: c.participants.filter(p => p.id !== userId)
              };
          }
          return c;
      }));
  };

  const handleAddMembers = (userIds: string[]) => {
      if (!activeChatId) return;
      
      const newMembers = ALL_CONTACTS.filter(u => userIds.includes(u.id));

      setChats(prev => prev.map(c => {
          if (c.id === activeChatId) {
              return {
                  ...c,
                  participants: [...c.participants, ...newMembers]
              };
          }
          return c;
      }));
  };

  const handleToggleMute = (chatId: string) => {
    setChats(prev => prev.map(c => 
      c.id === chatId ? { ...c, isMuted: !c.isMuted } : c
    ));
  };

  const handleTogglePin = (chatId: string) => {
    setChats(prev => prev.map(c => 
      c.id === chatId ? { ...c, isPinned: !c.isPinned } : c
    ));
  };

  const handleClearHistory = (chatId: string) => {
    if (window.confirm('آیا از حذف تاریخچه گفتگو اطمینان دارید؟ این عملیات غیرقابل بازگشت است.')) {
       setChats(prev => prev.map(c => 
        c.id === chatId ? { ...c, messages: [] } : c
      ));
    }
  };

  const handleBlockUser = (userId: string) => {
     if (window.confirm('آیا از مسدود کردن این کاربر اطمینان دارید؟')) {
       alert('کاربر با موفقیت مسدود شد.');
       setActiveChatId(null); 
       setIsRightPanelOpen(false);
     }
  };

  const activeChat = chats.find(c => c.id === activeChatId);

  const isAuthView = ['login', 'register', 'forgot-password'].includes(viewState);

  if (isAuthView) {
    return (
      <div className="min-h-screen w-full flex bg-white dark:bg-dark-bg">
        <LoginCarousel />
        <div className="w-full lg:w-7/12 relative bg-white dark:bg-dark-bg overflow-hidden">
          <AnimatePresence mode="wait">
            {viewState === 'login' && (
              <motion.div key="login" className="w-full h-full" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <Login onLogin={() => setViewState('chat')} onNavigateToRegister={() => setViewState('register')} onNavigateToForgot={() => setViewState('forgot-password')} />
              </motion.div>
            )}
            {viewState === 'register' && (
              <motion.div key="register" className="w-full h-full" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <Register onBackToLogin={() => setViewState('login')} />
              </motion.div>
            )}
            {viewState === 'forgot-password' && (
              <motion.div key="forgot" className="w-full h-full" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <ForgotPassword onBackToLogin={() => setViewState('login')} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    );
  }

  return (
    <div className={`h-screen flex overflow-hidden transition-colors duration-300 ${isDarkMode ? 'dark bg-dark-bg' : 'bg-gray-50'}`}>
      <div className={`fixed inset-y-0 right-0 w-full md:w-80 md:relative z-20 transition-transform duration-300 transform ${activeChatId ? 'translate-x-full md:translate-x-0' : 'translate-x-0'}`}>
        <Sidebar 
          currentUser={CURRENT_USER}
          chats={chats}
          activeChatId={activeChatId}
          onSelectChat={setActiveChatId}
          onOpenNewChat={() => setIsNewChatModalOpen(true)}
          isDarkMode={isDarkMode}
          toggleTheme={() => setIsDarkMode(!isDarkMode)}
          onLogout={() => setViewState('login')}
          onOpenSettings={() => setIsSettingsOpen(true)}
        />
      </div>

      <div className={`flex-1 flex flex-col h-full min-w-0 bg-white dark:bg-dark-bg transition-all duration-300`}>
         <ChatArea 
           chat={activeChat}
           currentUser={CURRENT_USER}
           onSendMessage={handleSendMessage}
           onBack={() => setActiveChatId(null)}
           onToggleInfo={() => setIsRightPanelOpen(!isRightPanelOpen)}
           onTogglePin={handleTogglePin}
         />
      </div>

      <RightPanel 
        chat={activeChat}
        isOpen={isRightPanelOpen}
        onClose={() => setIsRightPanelOpen(false)}
        onToggleMute={handleToggleMute}
        onClearHistory={handleClearHistory}
        onBlockUser={handleBlockUser}
        currentUser={CURRENT_USER}
        onUpdateGroup={handleUpdateGroup}
        onLeaveGroup={handleLeaveGroup}
        onDeleteGroup={handleDeleteGroup}
        onRemoveMember={handleRemoveMember}
        onOpenAddMember={() => setIsAddMemberModalOpen(true)}
      />

      <AnimatePresence>
        {isSettingsOpen && (
          <SettingsModal 
            isOpen={isSettingsOpen}
            onClose={() => setIsSettingsOpen(false)}
            currentUser={CURRENT_USER}
            isDarkMode={isDarkMode}
            toggleTheme={() => setIsDarkMode(!isDarkMode)}
            onLogout={() => { setIsSettingsOpen(false); setViewState('login'); }}
          />
        )}
      </AnimatePresence>

      <ContactsModal 
        isOpen={isNewChatModalOpen}
        onClose={() => setIsNewChatModalOpen(false)}
        onStartChat={handleStartChatWithUser}
        onOpenCreateGroup={() => setIsCreateGroupModalOpen(true)}
        currentUser={CURRENT_USER}
      />

      <CreateGroupModal 
        isOpen={isCreateGroupModalOpen}
        onClose={() => setIsCreateGroupModalOpen(false)}
        onCreateGroup={handleCreateGroup}
        currentUser={CURRENT_USER}
      />
      
      {activeChat && (
        <AddMemberModal 
            isOpen={isAddMemberModalOpen}
            onClose={() => setIsAddMemberModalOpen(false)}
            currentMembers={activeChat.participants}
            onAddMembers={handleAddMembers}
        />
      )}
    </div>
  );
};

export default App;