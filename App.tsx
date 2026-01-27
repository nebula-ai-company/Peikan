import React, { useState, useEffect } from 'react';
import { Chat, ViewState, Message } from './types';
import { CURRENT_USER, MOCK_CHATS, USERS } from './constants';
import Sidebar from './components/Sidebar';
import ChatArea from './components/ChatArea';
import RightPanel from './components/RightPanel';
import Login from './components/Login';
import Register from './components/Register';
import ForgotPassword from './components/ForgotPassword';
import LoginCarousel from './components/LoginCarousel';
import SettingsModal from './components/SettingsModal';
import { motion, AnimatePresence } from 'framer-motion';

const App: React.FC = () => {
  const [viewState, setViewState] = useState<ViewState>('login');
  const [chats, setChats] = useState<Chat[]>(MOCK_CHATS);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isRightPanelOpen, setIsRightPanelOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

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

  const activeChat = chats.find(c => c.id === activeChatId);

  // Auth Flow Layout & Animation
  // We check if the current viewState is one of the auth states
  const isAuthView = ['login', 'register', 'forgot-password'].includes(viewState);

  if (isAuthView) {
    return (
      <div className="min-h-screen w-full flex bg-white dark:bg-dark-bg">
        {/* Left Panel (Static Carousel) */}
        <LoginCarousel />

        {/* Right Panel (Animated Form Container) */}
        <div className="w-full lg:w-7/12 relative bg-white dark:bg-dark-bg overflow-hidden">
          <AnimatePresence mode="wait">
            {viewState === 'login' && (
              <motion.div
                key="login"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="w-full h-full"
              >
                <Login 
                  onLogin={() => setViewState('chat')} 
                  onNavigateToRegister={() => setViewState('register')}
                  onNavigateToForgot={() => setViewState('forgot-password')}
                />
              </motion.div>
            )}
            
            {viewState === 'register' && (
              <motion.div
                key="register"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="w-full h-full"
              >
                <Register onBackToLogin={() => setViewState('login')} />
              </motion.div>
            )}

            {viewState === 'forgot-password' && (
              <motion.div
                key="forgot"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="w-full h-full"
              >
                <ForgotPassword onBackToLogin={() => setViewState('login')} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    );
  }

  // Main Chat App View
  return (
    <div className={`h-screen flex overflow-hidden transition-colors duration-300 ${isDarkMode ? 'dark bg-dark-bg' : 'bg-gray-50'}`}>
      
      {/* Left Sidebar (Chat List) - Hidden on mobile if chat is active */}
      <div className={`
        fixed inset-y-0 right-0 w-full md:w-80 md:relative z-20 
        transition-transform duration-300 transform 
        ${activeChatId ? 'translate-x-full md:translate-x-0' : 'translate-x-0'}
      `}>
        <Sidebar 
          currentUser={CURRENT_USER}
          chats={chats}
          activeChatId={activeChatId}
          onSelectChat={(id) => {
            setActiveChatId(id);
            // On mobile, this will "push" the sidebar away visually by moving ChatArea in
          }}
          isDarkMode={isDarkMode}
          toggleTheme={() => setIsDarkMode(!isDarkMode)}
          onLogout={() => setViewState('login')}
          onOpenSettings={() => setIsSettingsOpen(true)}
        />
      </div>

      {/* Main Chat Area */}
      <div className={`flex-1 flex flex-col h-full min-w-0 bg-white dark:bg-dark-bg transition-all duration-300`}>
         <ChatArea 
           chat={activeChat}
           currentUser={CURRENT_USER}
           onSendMessage={handleSendMessage}
           onBack={() => setActiveChatId(null)}
           onToggleInfo={() => setIsRightPanelOpen(!isRightPanelOpen)}
         />
      </div>

      {/* Right Sidebar (Info) */}
      <RightPanel 
        chat={activeChat}
        isOpen={isRightPanelOpen}
        onClose={() => setIsRightPanelOpen(false)}
      />

      {/* Settings Modal */}
      <AnimatePresence>
        {isSettingsOpen && (
          <SettingsModal 
            isOpen={isSettingsOpen}
            onClose={() => setIsSettingsOpen(false)}
            currentUser={CURRENT_USER}
            isDarkMode={isDarkMode}
            toggleTheme={() => setIsDarkMode(!isDarkMode)}
            onLogout={() => {
              setIsSettingsOpen(false);
              setViewState('login');
            }}
          />
        )}
      </AnimatePresence>

    </div>
  );
};

export default App;