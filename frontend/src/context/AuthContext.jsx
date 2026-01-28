import { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from './ToastContext.jsx';

const AuthContext = createContext();
const API_BASE = process.env.REACT_APP_API_URL || 'https://ro-website-production.up.railway.app';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('auth:token') || '');
  const [loading, setLoading] = useState(!!token);
  const navigate = useNavigate();
  const { showToast } = useToast();

  useEffect(() => {
    if (token) {
      localStorage.setItem('auth:token', token); //token stored in the local storage
      // try to fetch profile
      (async () => {
        try {
          const res = await fetch(`${API_BASE}/api/auth/me`, { headers: { Authorization: `Bearer ${token}` } });
          if (!res.ok) throw new Error('not ok');
          const data = await res.json();
          setUser(data.user);
        } catch (e) {
          setUser(null);
          setToken('');
          localStorage.removeItem('auth:token');
        } finally {
          setLoading(false);
        }
      })();
    } else {
      localStorage.removeItem('auth:token');
      setLoading(false);
    }
  }, [token]);

  const loginWithToken = (jwt, user) => {//use that token to login
    setToken(jwt);
    setUser(user || null);
  };

  const syncUser = (nextUser) => {
    setUser(nextUser || null);
  };

  const refreshUser = async () => {
    if (!token) return null;
    try {
      const res = await fetch(`${API_BASE}/api/auth/me`, { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed');
      setUser(data.user);
      return data.user;
    } catch (e) {
      return null;
    }
  };

  const logout = () => {
    setUser(null);
    setToken('');
    localStorage.removeItem('auth:token');
    // show a small confirmation toast then navigate client-side
    try {
      showToast('Logged out', { type: 'success', duration: 900 });
    } catch (e) {
      // ignore if toast fails
    }
    setTimeout(() => {
      try {
        navigate('/');
      } catch (err) {
        window.location.assign('/');
      }
    }, 600);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, loginWithToken, logout, syncUser, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
