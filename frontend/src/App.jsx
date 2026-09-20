import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [username, setUsername] = useState(localStorage.getItem('username') || '');

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
      localStorage.setItem('username', username);
    } else {
      localStorage.removeItem('token');
      localStorage.removeItem('username');
    }
  }, [token, username]);

  const handleLogout = () => {
    setToken('');
    setUsername('');
  };

  return (
    <Router>
      <div className="min-h-screen bg-[#d1d7db] flex flex-col font-sans">
        {/* WhatsApp Web style green background bar */}
        <div className="absolute top-0 w-full h-32 bg-[#00a884] z-0"></div>
        
        <div className="flex-1 flex items-center justify-center relative z-10 w-full">
          <Routes>
            {/* Unauthenticated Routes */}
            <Route 
              path="/login" 
              element={!token ? <Login setToken={setToken} setUsername={setUsername} /> : <Navigate to="/" />} 
            />
            <Route 
              path="/register" 
              element={!token ? <Register setToken={setToken} setUsername={setUsername} /> : <Navigate to="/" />} 
            />

            {/* Authenticated Routes */}
            <Route 
              path="/*" 
              element={token ? <Dashboard username={username} handleLogout={handleLogout} /> : <Navigate to="/login" />} 
            />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
