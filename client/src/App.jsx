import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Auth from './components/Auth';
import RoomLobby from './components/RoomLobby';
import ChatRoom from './components/ChatRoom';

const MainContent = () => {
  const { user, loading } = useAuth();
  const [currentRoom, setCurrentRoom] = useState(null);
  const [displayName, setDisplayName] = useState('');

  if (loading) {
    return (
      <div className="min-h-[100dvh] bg-[#111b21] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#00a884]"></div>
      </div>
    );
  }

  if (!user) {
    return <Auth />;
  }

  if (currentRoom === null) {
    return (
      <RoomLobby
        onJoin={(roomCode, name) => {
          setCurrentRoom(roomCode);
          setDisplayName(name);
        }}
      />
    );
  }

  return (
    <ChatRoom
      roomCode={currentRoom}
      initialDisplayName={displayName}
      onLeave={() => setCurrentRoom(null)}
    />
  );
};

function App() {
  return (
    <AuthProvider>
      <MainContent />
    </AuthProvider>
  );
}

export default App;
