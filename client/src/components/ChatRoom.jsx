import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Pencil, Check, Clock, Trash2, Send, Smile } from 'lucide-react';
import { io } from 'socket.io-client';
import { useAuth } from '../context/AuthContext';
import EmojiPicker from 'emoji-picker-react';

const ChatRoom = ({ roomCode, initialDisplayName, onLeave }) => {
  const { user, token } = useAuth();
  const [displayName, setDisplayName] = useState(initialDisplayName);
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState(initialDisplayName);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [socket, setSocket] = useState(null);
  const messagesEndRef = useRef(null);

  const baseUrl = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '' : 'http://localhost:5000');
  const API_URL = `${baseUrl}/api`;

  // Auto-scroll
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Setup Socket and Fetch initial messages
  useEffect(() => {
    const socketUrl = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? undefined : 'http://localhost:5000');
    const newSocket = io(socketUrl);
    setSocket(newSocket);

    newSocket.emit('join_room', roomCode);

    newSocket.on('receive_message', (message) => {
      setMessages((prev) => [...prev, message]);
    });

    newSocket.on('messages_cleared', () => {
      setMessages([]);
    });

    // Fetch existing messages
    const fetchMessages = async () => {
      try {
        const res = await fetch(`${API_URL}/messages/${roomCode}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        if (res.ok) {
          const data = await res.json();
          setMessages(data);
        }
      } catch (err) {
        console.error('Failed to fetch messages', err);
      }
    };
    fetchMessages();

    return () => {
      newSocket.emit('leave_room', roomCode);
      newSocket.disconnect();
    };
  }, [roomCode, token]);

  const handleSaveName = () => {
    if (tempName.trim()) {
      setDisplayName(tempName.trim());
    } else {
      setTempName(displayName);
    }
    setIsEditingName(false);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !socket) return;

    socket.emit('send_message', {
      roomId: roomCode,
      senderId: user._id,
      senderDisplayName: displayName,
      content: newMessage.trim()
    });

    setNewMessage('');
  };

  const handleClearChat = async () => {
    if (!window.confirm('Are you sure you want to clear all messages for everyone?')) return;
    
    try {
      await fetch(`${API_URL}/messages/${roomCode}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
    } catch (err) {
      console.error('Failed to clear messages', err);
    }
  };

  const formatTime = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="flex flex-col h-[100dvh] bg-[#0b141a] font-sans text-[#e9edef] overflow-hidden">
      {/* Header */}
      <header className="flex items-center justify-between p-3 bg-[#202c33] border-b border-[#2a3942] sticky top-0 z-10 shadow-sm">
        <div className="flex items-center space-x-4">
          <button
            onClick={onLeave}
            className="p-2 text-[#aebac1] hover:text-[#e9edef] rounded-full hover:bg-[#2a3942] transition-colors"
            title="Leave Room"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          
          <div className="flex flex-col">
            <h1 className="text-[#e9edef] font-semibold text-lg leading-tight">
              Room #{roomCode}
            </h1>
            
            <div className="flex items-center text-xs text-[#8696a0] mt-0.5">
              <span className="mr-1">As:</span>
              {isEditingName ? (
                <div className="flex items-center bg-[#2a3942] rounded px-1">
                  <input
                    type="text"
                    value={tempName}
                    onChange={(e) => setTempName(e.target.value)}
                    className="bg-transparent border-none text-[#d1d7db] text-xs focus:outline-none w-24 px-1 py-0.5"
                    autoFocus
                    onKeyDown={(e) => e.key === 'Enter' && handleSaveName()}
                  />
                  <button onClick={handleSaveName} className="text-[#00a884] p-1">
                    <Check className="w-3 h-3" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center group cursor-pointer" onClick={() => setIsEditingName(true)}>
                  <span className="font-medium text-[#d1d7db] group-hover:text-[#00a884] transition-colors max-w-[120px] truncate">{displayName}</span>
                  <Pencil className="w-3 h-3 ml-1.5 opacity-0 group-hover:opacity-100 text-[#00a884] transition-opacity" />
                </div>
              )}
            </div>
          </div>
        </div>

        <button
          onClick={handleClearChat}
          className="p-2 text-[#aebac1] hover:text-red-400 rounded-full hover:bg-[#2a3942] transition-colors"
          title="Clear Chat"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </header>

      {/* Chat Body Area */}
      <main className="flex-1 overflow-y-auto p-4 relative flex flex-col" style={{ backgroundColor: '#0b141a', backgroundImage: 'radial-gradient(#202c33 1px, transparent 1px)', backgroundSize: '20px 20px', backgroundPosition: '-10px -10px' }}>
        
        {/* System Message */}
        <div className="flex justify-center mt-2 mb-6">
          <div className="bg-[#182229] border border-[#2a3942] text-[#8696a0] px-4 py-2 rounded-lg text-xs flex items-center shadow-md max-w-sm text-center">
            <Clock className="w-4 h-4 mr-2 flex-shrink-0 text-[#00a884]" />
            <span>
              Joined <strong>Room #{roomCode}</strong>. Messages self-destruct after 24 hours.
            </span>
          </div>
        </div>

        {/* Message Bubbles */}
        <div className="flex-1 flex flex-col space-y-2">
          {messages.map((msg, index) => {
            const isMine = msg.senderId === user._id;
            return (
              <div key={msg._id || index} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[75%] rounded-lg px-3 py-2 flex flex-col relative ${isMine ? 'bg-[#005c4b] text-[#e9edef] rounded-tr-sm' : 'bg-[#202c33] text-[#e9edef] rounded-tl-sm'}`}>
                  
                  {!isMine && (
                    <span className="text-[13px] font-semibold text-[#53bdeb] mb-0.5">
                      {msg.senderDisplayName}
                    </span>
                  )}
                  
                  <div className="flex flex-wrap items-end gap-2">
                    <span className="text-sm whitespace-pre-wrap break-words">{msg.content}</span>
                    <span className="text-[10px] text-[#8696a0] ml-auto pb-0.5 whitespace-nowrap">
                      {formatTime(msg.createdAt)}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>
      </main>

      {/* Input Area */}
      <footer className="p-3 bg-[#202c33] relative">
        {showEmojiPicker && (
          <div className="absolute bottom-16 left-2 z-50 shadow-2xl">
            <EmojiPicker 
              onEmojiClick={(emojiData) => setNewMessage((prev) => prev + emojiData.emoji)} 
              theme="dark" 
              autoFocusSearch={false}
              emojiStyle="native"
            />
          </div>
        )}
        <form onSubmit={handleSendMessage} className="flex items-center space-x-2">
          <button
            type="button"
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            className={`p-2 rounded-full transition-colors ${showEmojiPicker ? 'bg-[#2a3942] text-[#00a884]' : 'text-[#8696a0] hover:text-[#e9edef] hover:bg-[#2a3942]'}`}
          >
            <Smile className="w-6 h-6" />
          </button>
          <input
            type="text"
            value={newMessage}
            onFocus={() => setShowEmojiPicker(false)}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 bg-[#2a3942] text-[#d1d7db] rounded-lg h-[44px] px-4 focus:outline-none focus:ring-1 focus:ring-[#00a884] placeholder-[#8696a0]"
          />
          <button
            type="submit"
            disabled={!newMessage.trim()}
            className="w-[44px] h-[44px] bg-[#00a884] hover:bg-[#008f6f] rounded-full flex items-center justify-center text-[#111b21] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
          >
            <Send className="w-5 h-5 ml-1" />
          </button>
        </form>
      </footer>
    </div>
  );
};

export default ChatRoom;
