import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { MessageCircle, Loader2 } from 'lucide-react';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [emailOrUsername, setEmailOrUsername] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { login, register } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      let result;
      if (isLogin) {
        result = await login(emailOrUsername, password);
      } else {
        result = await register(username, email, password);
      }

      if (!result.success) {
        setError(result.message);
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[100dvh] bg-[#111b21] flex items-center justify-center p-4 font-sans text-[#e9edef]">
      <div className="bg-[#202c33] rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-[#2a3942]">
        
        {/* Header */}
        <div className="pt-8 pb-6 px-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#111b21] mb-4">
            <MessageCircle className="w-8 h-8 text-[#00a884]" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Ephemeral Chat</h1>
          <p className="text-[#8696a0] text-sm">
            {isLogin ? 'Welcome back. Sign in to continue.' : 'Join the conversation today.'}
          </p>
        </div>
        
        {/* Form Container */}
        <div className="px-8 pb-8">
          {error && (
            <div className="bg-[#3b2a2a] border-l-4 border-red-500 text-[#f1a4a4] p-3 mb-6 rounded text-sm flex items-center">
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label className="block text-xs font-semibold text-[#8696a0] uppercase tracking-wider mb-2">Username</label>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-4 py-3 bg-[#2a3942] text-[#d1d7db] border border-transparent rounded-lg focus:outline-none focus:ring-1 focus:ring-[#00a884] focus:bg-[#111b21] transition-all"
                  placeholder="johndoe"
                />
              </div>
            )}
            
            {!isLogin ? (
              <div>
                <label className="block text-xs font-semibold text-[#8696a0] uppercase tracking-wider mb-2">Email</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-[#2a3942] text-[#d1d7db] border border-transparent rounded-lg focus:outline-none focus:ring-1 focus:ring-[#00a884] focus:bg-[#111b21] transition-all"
                  placeholder="john@example.com"
                />
              </div>
            ) : (
              <div>
                <label className="block text-xs font-semibold text-[#8696a0] uppercase tracking-wider mb-2">Email or Username</label>
                <input
                  type="text"
                  required
                  value={emailOrUsername}
                  onChange={(e) => setEmailOrUsername(e.target.value)}
                  className="w-full px-4 py-3 bg-[#2a3942] text-[#d1d7db] border border-transparent rounded-lg focus:outline-none focus:ring-1 focus:ring-[#00a884] focus:bg-[#111b21] transition-all"
                  placeholder="john@example.com or johndoe"
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-[#8696a0] uppercase tracking-wider mb-2">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-[#2a3942] text-[#d1d7db] border border-transparent rounded-lg focus:outline-none focus:ring-1 focus:ring-[#00a884] focus:bg-[#111b21] transition-all"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#00a884] hover:bg-[#008f6f] text-[#111b21] font-bold py-3 mt-4 rounded-lg transition-colors flex items-center justify-center shadow-lg shadow-[#00a884]/20"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                isLogin ? 'Log In' : 'Sign Up'
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-[#2a3942] text-center text-sm text-[#8696a0]">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button
              type="button"
              onClick={() => {
                setIsLogin(!isLogin);
                setError('');
              }}
              className="text-[#00a884] font-semibold hover:text-[#00c59a] hover:underline focus:outline-none transition-colors"
            >
              {isLogin ? 'Create one' : 'Log in here'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
