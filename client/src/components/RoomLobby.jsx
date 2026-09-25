import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { LogOut, Pencil, DoorOpen } from 'lucide-react';

const RoomLobby = ({ onJoin }) => {
  const { user, logout } = useAuth();
  const [roomCode, setRoomCode] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [isEditingName, setIsEditingName] = useState(false);

  useEffect(() => {
    // Generate random number between 10 and 99
    const randomNum = Math.floor(Math.random() * 90) + 10;
    setDisplayName(`Unknown User ${randomNum}`);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (roomCode.trim() && displayName.trim()) {
      onJoin(roomCode.trim(), displayName.trim());
    }
  };

  return (
    <div className="min-h-[100dvh] bg-[#111b21] flex flex-col font-sans text-[#e9edef]">
      {/* Top Bar */}
      <header className="flex justify-between items-center p-4 bg-[#202c33] border-b border-[#2a3942]">
        <div className="flex items-center space-x-2">
          <div className="bg-[#00a884] text-[#111b21] px-3 py-1 rounded-full text-sm font-bold shadow-sm">
            {user?.username}
          </div>
        </div>
        <button
          onClick={logout}
          className="flex items-center text-[#8696a0] hover:text-[#e9edef] transition-colors p-2 rounded-lg hover:bg-[#2a3942]"
          title="Log out"
        >
          <LogOut className="w-5 h-5" />
        </button>
      </header>

      {/* Center Content */}
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="bg-[#202c33] p-8 rounded-2xl shadow-2xl w-full max-w-md border border-[#2a3942]">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#111b21] mb-4 shadow-inner">
              <DoorOpen className="w-8 h-8 text-[#00a884]" />
            </div>
            <h2 className="text-2xl font-bold text-white">Join a Room</h2>
            <p className="text-[#8696a0] text-sm mt-1">Enter a room code to start chatting</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-xs font-semibold text-[#8696a0] uppercase tracking-wider mb-2">Room Code</label>
              <input
                type="text"
                required
                value={roomCode}
                onChange={(e) => setRoomCode(e.target.value)}
                className="w-full px-4 py-3 bg-[#2a3942] text-[#d1d7db] border border-transparent rounded-lg focus:outline-none focus:ring-1 focus:ring-[#00a884] focus:bg-[#111b21] transition-all text-center text-lg tracking-widest font-mono"
                placeholder="1234"
                maxLength={10}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#8696a0] uppercase tracking-wider mb-2">Display Name</label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={displayName}
                  readOnly={!isEditingName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  onBlur={() => setIsEditingName(false)}
                  className={`w-full px-4 py-3 bg-[#2a3942] text-[#d1d7db] border border-transparent rounded-lg focus:outline-none focus:ring-1 focus:ring-[#00a884] focus:bg-[#111b21] transition-all pr-12 ${!isEditingName && 'cursor-default opacity-80'}`}
                />
                <button
                  type="button"
                  onClick={() => setIsEditingName(true)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-[#8696a0] hover:text-[#00a884] transition-colors rounded-full hover:bg-[#202c33]"
                  title="Edit name"
                >
                  <Pencil className="w-4 h-4" />
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={!roomCode.trim() || !displayName.trim()}
              className="w-full bg-[#00a884] hover:bg-[#008f6f] text-[#111b21] font-bold py-3 rounded-lg transition-colors flex items-center justify-center shadow-lg shadow-[#00a884]/20 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Enter Room
            </button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default RoomLobby;
