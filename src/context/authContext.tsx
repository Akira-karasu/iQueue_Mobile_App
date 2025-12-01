import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from 'jwt-decode';
import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';
import usePushNotifications from '../hooks/componentHooks/usePushNotifications.';
import { authService } from '../services/authService';

// ✅ Define the shape of the Auth context
type AuthContextType = {
  token: string | null;
  loading: boolean;
  login: (newToken: string) => void;
  logout: () => void;
  saveToken: (newToken: string | null) => void;
  isTokenExpired: () => Promise<boolean>;
  getUser: () => { id: string | null; email: string | null };
  expoPushToken: string | null;
};

// ✅ Props for the provider
type AuthProviderProps = {
  children: ReactNode;
};

// ✅ Create the context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const { expoPushToken } = usePushNotifications();
  const [token, setTokenState] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Load token from AsyncStorage on mount
  useEffect(() => {
    const loadToken = async () => {
      try {
        const storedToken = await AsyncStorage.getItem('token');
        if (storedToken) {
          setTokenState(storedToken);
        }
      } catch (error) {
        console.error('Error loading token:', error);
      } finally {
        setLoading(false);
      }
    };
    loadToken();
  }, []);

// Save or remove token in AsyncStorage
const saveToken = (newToken: string | null) => {
  const stringToken = typeof newToken === 'string' ? newToken : JSON.stringify(newToken);
  setTokenState(stringToken);
  if (stringToken) {
    AsyncStorage.setItem('token', stringToken).catch(console.error);
  } else {
    AsyncStorage.removeItem('token').catch(console.error);
  }
};

const getUser = () => {
  if (!token) return { id: null, email: null };
  try {
    const decoded: any = jwtDecode(token);
    return {
      id: decoded.id ?? null,
      email: decoded.email ?? null,
    };
  } catch {
    return { id: null, email: null };
  }
};


const login = (newToken: string) => {
  try {
    // ✅ Validate token is a string
    if (typeof newToken !== 'string') {
      console.error('❌ Invalid token type - Expected string, got:', typeof newToken);
      console.error('❌ Token value:', newToken);
      return;
    }

    if (!newToken.trim()) {
      console.error('❌ Token is empty or whitespace');
      return;
    }

    // ✅ Decode token to get user data
    const decoded: any = jwtDecode(newToken);
    
    console.log('✅ Login successful');
    console.log('📋 Full decoded token:', JSON.stringify(decoded, null, 2));
    console.log('Available fields:', Object.keys(decoded));
    
    // Try common field name variations
    const userId = decoded.id ?? decoded.sub ?? decoded.user_id ?? decoded.userId ?? null;
    const userEmail = decoded.email ?? decoded.mail ?? decoded.user_email ?? null;

    authService().storePushToken(userId, expoPushToken || '')

    console.log('User ID:', userId);
    console.log('PushToken:', expoPushToken);
    
  } catch (error) {
    console.error('❌ Error decoding token:', error);
  }
  
  // ✅ Save token after extracting user data
  saveToken(newToken);
};

const logout = async () => {
  try {
    await AsyncStorage.removeItem('token');
    setTokenState(null);
    console.log('AsyncStorage cleared, user logged out.');
  } catch (error) {
    console.error('Error clearing AsyncStorage:', error);
  }
};



  const isTokenExpired = async () => {
    try {
      const storedToken = await AsyncStorage.getItem('token');
      if (storedToken) {
        const decodedToken: any = jwtDecode(storedToken);
        const expirationTime = decodedToken.exp;
        const currentTime = Date.now() / 1000;
        return expirationTime < currentTime;
      }
    } catch (error) {
      console.error('Error checking token expiration:', error);
    }
    return false;
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        loading,
        login,
        logout,
        saveToken,
        isTokenExpired,
        getUser,
        expoPushToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// ✅ Custom hook for easy access
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
