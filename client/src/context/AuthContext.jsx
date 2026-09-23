import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);
  const API_URL = `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api`;

  useEffect(() => {
    const verifyUser = async () => {
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const res = await fetch(`${API_URL}/auth/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (res.ok) {
          const data = await res.json();
          setUser(data);
        } else {
          logout();
        }
      } catch (error) {
        console.error('Error verifying user:', error);
        logout();
      } finally {
        setLoading(false);
      }
    };
    verifyUser();
  }, [token]);

  const login = async (emailOrUsername, password) => {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ emailOrUsername, password }),
    });
    const data = await res.json();
    if (res.ok) {
      setUser({ _id: data._id, username: data.username, email: data.email });
      setToken(data.token);
      localStorage.setItem('token', data.token);
      return { success: true };
    }
    return { success: false, message: data.message || 'Login failed' };
  };

  const register = async (username, email, password) => {
    const res = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password }),
    });
    const data = await res.json();
    if (res.ok) {
      setUser({ _id: data._id, username: data.username, email: data.email });
      setToken(data.token);
      localStorage.setItem('token', data.token);
      return { success: true };
    }
    return { success: false, message: data.message || 'Registration failed' };
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
