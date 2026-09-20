import { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/auth';

function Register({ setToken, setUsername }) {
  const [usernameInput, setUsernameInput] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API_URL}/register`, { username: usernameInput, password });
      setToken(res.data.token);
      setUsername(res.data.username);
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed');
    }
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full z-10 mx-4">
      <div className="flex justify-center mb-6">
        <div className="w-16 h-16 bg-[#00a884] rounded-full flex items-center justify-center">
          <svg viewBox="0 0 24 24" width="32" height="32" fill="white"><path d="M12.005 20.005c-1.465 0-2.883-.377-4.135-1.092l-.296-.169-3.076.806.82-2.997-.186-.297a7.95 7.95 0 01-1.127-4.25c0-4.411 3.592-8.002 8.005-8.002s8.005 3.591 8.005 8.002-3.592 8.001-8.01 8.001zm0-17.502C6.764 2.503 2.5 6.768 2.5 12.003c0 1.674.44 3.308 1.275 4.746L2 23l6.417-1.683a9.458 9.458 0 003.588.71h.005c5.239 0 9.495-4.266 9.495-9.502 0-2.54-1.025-4.945-2.862-6.79-1.838-1.847-4.288-2.83-6.838-2.83z"></path></svg>
        </div>
      </div>
      <h2 className="text-2xl font-normal text-center text-gray-800 mb-8">Register for WhatsApp Web</h2>
      {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}
      <form onSubmit={handleRegister} className="flex flex-col gap-5">
        <input 
          type="text" 
          placeholder="Username (min 3 chars)" 
          className="border-b-2 border-gray-300 p-2 focus:outline-none focus:border-[#00a884] transition-colors text-gray-800"
          value={usernameInput}
          onChange={(e) => setUsernameInput(e.target.value)}
          required
          minLength={3}
        />
        <input 
          type="password" 
          placeholder="Password (min 6 chars)" 
          className="border-b-2 border-gray-300 p-2 focus:outline-none focus:border-[#00a884] transition-colors text-gray-800"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={6}
        />
        <button 
          type="submit" 
          className="bg-[#00a884] text-white p-3 rounded-full mt-4 font-semibold hover:bg-[#008f6f] shadow-md transition-colors"
        >
          REGISTER
        </button>
      </form>
      <p className="mt-8 text-sm text-center text-gray-500">
        Already have an account? <Link to="/login" className="text-[#00a884] font-semibold hover:underline">Log in</Link>
      </p>
    </div>
  );
}

export default Register;
