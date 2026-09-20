import { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { Send, UserCircle2, MessageSquare, MoreVertical, Search, Lock } from 'lucide-react';

const SOCKET_URL = 'http://localhost:5000';

function Dashboard({ username, handleLogout }) {
  const [roomCode, setRoomCode] = useState('');
  const [activeRoom, setActiveRoom] = useState(null);
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const newSocket = io(SOCKET_URL);
    setSocket(newSocket);

    newSocket.on('message_history', (history) => {
      setMessages(history);
    });

    newSocket.on('receive_message', (message) => {
      setMessages((prev) => [...prev, message]);
    });

    return () => {
      newSocket.disconnect();
    };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const joinRoom = (e) => {
    e.preventDefault();
    if (roomCode.length === 5 && socket) {
      setActiveRoom(roomCode);
      socket.emit('join_room', roomCode);
      setRoomCode('');
    }
  };

  const sendMessage = (e) => {
    e.preventDefault();
    if (inputMessage.trim() && socket && activeRoom) {
      socket.emit('send_message', {
        roomCode: activeRoom,
        sender: username,
        content: inputMessage.trim()
      });
      setInputMessage('');
    }
  };

  return (
    <div className="flex h-screen w-full bg-[#d1d7db] p-0 sm:p-4 md:p-8">
      <div className="flex w-full h-full bg-white shadow-2xl rounded-none sm:rounded-lg overflow-hidden max-w-[1600px] mx-auto">
        
        {/* LEFT SIDEBAR */}
        <div className="w-full sm:w-[30%] md:w-[350px] lg:w-[400px] flex flex-col border-r border-gray-200 bg-white">
          {/* Sidebar Header */}
          <div className="bg-[#f0f2f5] h-16 px-4 flex items-center justify-between border-b border-gray-200 shrink-0">
            <div className="flex items-center gap-3">
              <UserCircle2 size={40} className="text-gray-400" />
              <span className="font-semibold text-gray-800">{username}</span>
            </div>
            <div className="flex items-center gap-4 text-gray-500">
              <MessageSquare size={20} className="cursor-pointer" />
              <div className="relative group">
                <MoreVertical size={20} className="cursor-pointer" />
                <div className="absolute right-0 mt-2 w-32 bg-white rounded shadow-lg hidden group-hover:block z-50">
                  <button onClick={handleLogout} className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm">Logout</button>
                </div>
              </div>
            </div>
          </div>

          {/* Search / Join Room */}
          <div className="p-2 border-b border-gray-200 bg-white">
            <form onSubmit={joinRoom} className="flex bg-[#f0f2f5] rounded-lg items-center px-3 py-1">
              <Search size={18} className="text-gray-500 mr-2" />
              <input 
                type="text" 
                placeholder="Enter 5-digit code to chat" 
                className="bg-transparent border-none focus:outline-none w-full text-sm py-1"
                value={roomCode}
                onChange={(e) => {
                  const val = e.target.value.replace(/[^0-9]/g, '');
                  if (val.length <= 5) setRoomCode(val);
                }}
              />
              {roomCode.length === 5 && (
                <button type="submit" className="text-[#00a884] font-semibold text-sm ml-2">Join</button>
              )}
            </form>
          </div>

          {/* Active Chat List (Mocked to just show current room) */}
          <div className="flex-1 overflow-y-auto bg-white">
            {activeRoom ? (
              <div className="flex items-center px-3 py-3 hover:bg-[#f5f6f6] cursor-pointer bg-[#ebebeb] border-b border-gray-100">
                <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mr-3 shrink-0">
                  <Lock size={24} className="text-gray-500" />
                </div>
                <div className="flex-1 border-b border-transparent">
                  <div className="flex justify-between items-center">
                    <h3 className="text-md font-normal text-gray-900">Room: {activeRoom}</h3>
                  </div>
                  <p className="text-sm text-gray-500 truncate">Active incognito session</p>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-gray-400 p-4 text-center">
                <Lock size={48} className="mb-4 opacity-50" />
                <p className="text-sm">Enter a 5-digit code above to start an incognito chat.</p>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT CHAT AREA */}
        <div className="hidden sm:flex flex-1 flex-col bg-[#efeae2] relative">
          {activeRoom ? (
            <>
              {/* Chat Header */}
              <div className="bg-[#f0f2f5] h-16 px-4 flex items-center justify-between border-b border-gray-200 shrink-0 z-10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center shrink-0">
                    <Lock size={20} className="text-gray-500" />
                  </div>
                  <div>
                    <h2 className="text-md font-normal text-gray-800">Room: {activeRoom}</h2>
                    <p className="text-xs text-gray-500">Messages auto-delete after 24 hours</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-gray-500">
                  <Search size={20} className="cursor-pointer" />
                  <MoreVertical size={20} className="cursor-pointer" />
                </div>
              </div>

              {/* Chat Messages */}
              <div 
                className="flex-1 overflow-y-auto p-4 md:p-12 flex flex-col gap-1 z-0" 
                style={{ backgroundImage: "url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')", backgroundRepeat: 'repeat', opacity: 0.95 }}
              >
                {/* Incognito Warning Bubble */}
                <div className="flex justify-center mb-4">
                  <div className="bg-[#ffeecd] text-gray-600 text-xs px-4 py-2 rounded-lg shadow-sm text-center max-w-sm flex items-center gap-2">
                    <Lock size={14} />
                    Messages are end-to-end simulated and disappear after 24 hours.
                  </div>
                </div>

                {messages.map((msg, index) => {
                  const isMe = msg.sender === username;
                  const isConsecutive = index > 0 && messages[index-1].sender === msg.sender;

                  return (
                    <div key={index} className={`flex ${isMe ? 'justify-end' : 'justify-start'} ${isConsecutive ? 'mt-0' : 'mt-2'}`}>
                      <div className={`max-w-[85%] md:max-w-[65%] rounded-lg p-2 px-3 shadow-sm relative ${isMe ? 'bg-[#d9fdd3]' : 'bg-white'} ${!isConsecutive && isMe ? 'rounded-tr-none' : ''} ${!isConsecutive && !isMe ? 'rounded-tl-none' : ''}`}>
                        {!isMe && !isConsecutive && <p className="text-xs font-semibold text-pink-600 mb-1">{msg.sender}</p>}
                        <p className="text-gray-900 text-[14px] leading-snug break-words pr-12">
                          {msg.content}
                        </p>
                        <p className="text-[10px] text-gray-500 text-right absolute bottom-1 right-2">
                          {new Date(msg.createdAt || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* Chat Input */}
              <div className="bg-[#f0f2f5] min-h-[62px] px-4 py-2 flex items-center gap-3 shrink-0 z-10">
                <form onSubmit={sendMessage} className="flex-1 flex gap-2 items-center">
                  <input 
                    type="text" 
                    placeholder="Type a message" 
                    className="flex-1 rounded-lg py-2.5 px-4 border-none focus:outline-none text-[15px] bg-white shadow-sm"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                  />
                  <button 
                    type="submit" 
                    disabled={!inputMessage.trim()}
                    className="text-gray-500 p-2 hover:text-[#00a884] disabled:opacity-50 transition-colors flex items-center justify-center"
                  >
                    <Send size={24} />
                  </button>
                </form>
              </div>
            </>
          ) : (
            /* Empty State */
            <div className="flex-1 flex flex-col items-center justify-center bg-[#f0f2f5] border-b-[6px] border-[#00a884]">
              <div className="max-w-md text-center">
                <img src="https://whatsapp-clone-web.netlify.app/static/media/chat-bg.f851d7bf.png" alt="WhatsApp Web" className="w-64 h-64 object-contain mx-auto mb-8 opacity-70 rounded-full" onError={(e) => e.target.style.display = 'none'} />
                <h1 className="text-3xl font-light text-gray-700 mb-4">WhatsApp Web for Incognito</h1>
                <p className="text-gray-500 text-sm leading-relaxed mb-8">
                  Enter a 5-digit room code on the left to start messaging.<br/>
                  All messages are strictly deleted after 24 hours to ensure your privacy.
                </p>
                <div className="flex items-center justify-center gap-2 text-gray-400 text-xs">
                  <Lock size={12} />
                  <span>End-to-end anonymity</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
