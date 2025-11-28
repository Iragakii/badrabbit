import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../src/config/api';

// Configure axios defaults
axios.defaults.baseURL = API_BASE_URL;
axios.defaults.withCredentials = true;

// Add axios interceptor for token handling
axios.interceptors.request.use(config => {
  const token = getCookie('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

interface AuthContextType {
  isLoggedIn: boolean;
  login: (token: string) => Promise<void>;
  logout: () => Promise<void>;
  token: string | null;
  address: string | null;
  fetchAddress: (overrideToken?: string) => Promise<void>;
  avatarUrl: string | null;
  updateAvatar: (url: string) => void;
  username: string | null;
  bio: string | null;
  website: string | null;
  twitter: string | null;
  updateProfile: (username: string, bio: string, website: string) => void;
  updateTwitter: (twitterUsername: string | null) => void;
  isLoading: boolean;
  error: string | null;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Cookie utility functions
const getCookie = (name: string): string | null => {
  const nameEQ = name + "=";
  const ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') c = c.substring(1);
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
};

// JWT decode utility
const decodeJWT = (token: string) => {
  try {
    const payload = token.split('.')[1];
    const decoded = JSON.parse(atob(payload));
    return decoded;
  } catch (e) {
    return null;
  }
};

const deleteCookie = (name: string) => {
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    const token = getCookie('access_token');
    if (token) {
      const decoded = decodeJWT(token);
      return decoded && decoded.exp * 1000 > Date.now();
    }
    return false;
  });
  const [token, setToken] = useState<string | null>(() => getCookie('access_token'));
  const [address, setAddress] = useState<string | null>(() => {
    const token = getCookie('access_token');
    if (token) {
      const decoded = decodeJWT(token);
      return decoded ? decoded.sub : null;
    }
    return localStorage.getItem('wallet_address');
  });
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [bio, setBio] = useState<string | null>(null);
  const [website, setWebsite] = useState<string>('');
  const [twitter, setTwitter] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = () => setError(null);

  const updateAvatar = (url: string) => {
    setAvatarUrl(url);
  };

  const updateProfile = async (username: string, bio: string, website: string) => {
    try {
      const response = await axios.post('/api/user/profile', {
        address,
        username,
        bio,
        website
      });
      
      if (response.data) {
        setUsername(username);
        setBio(bio);
        setWebsite(website);
      }
    } catch (error) {
      console.error('Failed to update profile:', error);
      setError('Failed to update profile');
    }
  };

  const login = async (newToken: string) => {
    try {
      setToken(newToken);
      setIsLoggedIn(true);

      // Store token in cookie if not already done by backend
      if (!getCookie('access_token')) {
        document.cookie = `access_token=${newToken};path=/;max-age=86400`;
      }

      await fetchAddress(newToken);
    } catch (error) {
      console.error('Login error:', error);
      setError('Failed to complete login');
      setIsLoggedIn(false);
      setToken(null);
    }
  };

  const fetchAddress = async (overrideToken?: string) => {
    const authToken = overrideToken ?? token;
    if (!authToken) return;

    setIsLoading(true);
    clearError();

    try {
      const res = await axios.get('/api/auth/me', {
        headers: {
          Authorization: `Bearer ${authToken}`
        }
      });

      const { address: walletAddress, avatarUrl, username, bio, website, twitter } = res.data;

      setAddress(walletAddress);
      setAvatarUrl(avatarUrl);
      setUsername(username);
      setBio(bio);
      setWebsite(website);
      setTwitter(twitter);

      // Store address in localStorage for persistence
      localStorage.setItem('wallet_address', walletAddress);
    } catch (error) {
      console.error('Fetch address error:', error);
      if (axios.isAxiosError(error)) {
        setError(error.response?.data?.error || 'Failed to fetch user data');
        if (error.response?.status === 401) {
          await logout();
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  const updateTwitter = (twitterUsername: string | null) => {
    setTwitter(twitterUsername);
  };

  const logout = async () => {
    try {
      await axios.get('/api/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsLoggedIn(false);
      setToken(null);
      setAddress(null);
      setAvatarUrl(null);
      setUsername(null);
      setBio(null);
      setWebsite('');
      setTwitter(null);
      deleteCookie('access_token');
      localStorage.removeItem('wallet_address');
    }
  };
useEffect(() => {
    const initializeAuth = async () => {
      setIsLoading(true);

      try {
        // Call /api/auth/me without Authorization header, rely on browser sending httpOnly cookie
        const res = await axios.get('/api/auth/me');

        const { address: walletAddress, avatarUrl, username, bio, website, twitter } = res.data;

        setIsLoggedIn(true);
        setAddress(walletAddress);
        setAvatarUrl(avatarUrl);
        setUsername(username);
        setBio(bio);
        setWebsite(website);
        setTwitter(twitter);

        localStorage.setItem('wallet_address', walletAddress);
      } catch (error) {
        const isAxiosError = axios.isAxiosError(error);
        const status = isAxiosError ? error.response?.status : undefined;

        if (status === 401) {
          // Expected when not logged in: quietly reset auth state without noisy logs
          setIsLoggedIn(false);
          setAddress(null);
          setAvatarUrl(null);
          setUsername(null);
          setBio(null);
          setWebsite('');
          setTwitter(null);
          localStorage.removeItem('wallet_address');
        } else {
          console.error('Auth initialization error:', error);
        }
      }

      setIsLoading(false);
    };

    initializeAuth();
  }, []);



  const value = {
    isLoggedIn,
    login,
    logout,
    token,
    address,
    fetchAddress,
    avatarUrl,
    updateAvatar,
    username,
    bio,
    website,
    twitter,
    updateProfile,
    updateTwitter,
    isLoading,
    error,
    clearError
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;