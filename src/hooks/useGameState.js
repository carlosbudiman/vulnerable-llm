import { useState } from 'react';
import { api } from '../services/api';

export function useGameState() {
  const [currentLevel, setCurrentLevel] = useState(null);
  const [highestUnlockedLevel, setHighestUnlockedLevel] = useState(1);
  const [levelProgress, setLevelProgress] = useState({});
  const [messages, setMessages] = useState([]);
  const [levelInfo, setLevelInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  
  // Password Discovery State
  const [passwordFound, setPasswordFound] = useState(false);
  const [discoveredPassword, setDiscoveredPassword] = useState(null);

  // Actions
  const fetchLevelInfo = async (level) => {
    try {
      const data = await api.getLevel(level);
      setLevelInfo(data);
      setMessages([{
        type: 'ai',
        text: `Welcome to Level ${level}! ${data.description}`
      }]);
    } catch (error) {
      setMessages([{
        type: 'ai',
        text: 'Error loading level. Make sure the server is running.'
      }]);
    }
  };

  const selectLevel = (level) => {
    if (level > highestUnlockedLevel) {
      return { error: `Level ${level} is locked. Conquer level ${highestUnlockedLevel} first.` };
    }

    setCurrentLevel(level);
    setPasswordFound(false);
    setMessages([]);
    setDiscoveredPassword(null);
    
    fetchLevelInfo(level);
    return { success: true };
  };

  const sendMessage = async (text) => {
    if (!text.trim() || !currentLevel) return;

    // Optimistic update: User message
    setMessages(prev => [...prev, { type: 'user', text }]);
    // Placeholder for AI response
    setMessages(prev => [...prev, { type: 'ai', text: '', isLoading: true }]);
    setIsLoading(true);

    try {
      // Stream the response
      let fullText = '';
      
      for await (const chunk of api.sendChatStream(currentLevel, text)) {
        if (chunk.type === 'chunk') {
          fullText += chunk.text;
          
          setMessages(prev => {
            const newMessages = [...prev];
            const lastMsg = newMessages[newMessages.length - 1];
            
            // Update the last AI message content
            if (lastMsg.type === 'ai') {
              lastMsg.text = fullText;
              lastMsg.isLoading = true; // Keep loading while streaming
            }
            return newMessages;
          });
        } else if (chunk.type === 'retry') {
            setMessages(prev => {
                const newMessages = [...prev];
                const lastMsg = newMessages[newMessages.length - 1];
                if (lastMsg.type === 'ai') {
                    lastMsg.text = `Retrying (Attempt ${chunk.attempt}/${chunk.max_retries})...`;
                    lastMsg.isRetrying = true;
                    lastMsg.isLoading = true;
                }
                return newMessages;
            });
        } else if (chunk.type === 'result') {
            setMessages(prev => {
                const newMessages = [...prev];
                const lastMsg = newMessages[newMessages.length - 1];
                if (lastMsg.type === 'ai') {
                    lastMsg.isLoading = false; 
                    lastMsg.isRetrying = false;
                }
                return newMessages;
            });

            if (chunk.password_found) {
                handlePasswordFound(chunk.password, 'chat');
            }
        } else if (chunk.type === 'error') {
            throw new Error(chunk.text);
        }
      }

    } catch (error) {
      console.error(error);
      setMessages(prev => {
        const filtered = prev.filter(msg => !msg.isLoading); 
        return [...filtered, { 
          type: 'ai', 
          text: 'Error: Could not connect to server or stream interrupted.',
          isLoading: false,
          isRetrying: false
        }];
      });
    } finally {
      setIsLoading(false);
    }
  };

  const verifyPassword = async (password) => {
    if (!currentLevel) return { error: 'Select a level first.' };

    try {
      const data = await api.verifyPassword(currentLevel, password);
      
      if (data.correct) {
        handlePasswordFound(data.password || password, 'manual');
        return { success: true, message: data.message };
      } else {
        return { error: data.message };
      }
    } catch (error) {
      return { error: 'Verification failed. Server might be offline.' };
    }
  };

  const handlePasswordFound = (password, method) => {
    setPasswordFound(true);
    setDiscoveredPassword(password);
    
    setLevelProgress(prev => ({
      ...prev,
      [currentLevel]: { completed: true, method }
    }));
    
    setHighestUnlockedLevel(prev => Math.min(5, Math.max(prev, currentLevel + 1)));
  };

  return {
    currentLevel,
    highestUnlockedLevel,
    levelProgress,
    messages,
    levelInfo,
    isLoading,
    passwordFound,
    discoveredPassword,
    selectLevel,
    sendMessage,
    verifyPassword
  };
}
