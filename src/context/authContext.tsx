import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from 'jwt-decode';
import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';

// ✅ Define the shape of the Auth context
type AuthContextType = {
  token: string | null;
  loading: boolean;
  login: (newToken: string) => void;
  logout: () => void;
  saveToken: (newToken: string | null) => void;
  isTokenExpired: () => Promise<boolean>;
  getUserEmail: () => string | null;
};

// ✅ Props for the provider
type AuthProviderProps = {
  children: ReactNode;
};

// ✅ Create the context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: AuthProviderProps) => {
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

const getUserEmail = () => {
  if (!token) return null;
  try {
    const decoded: any = jwtDecode(token);
    return decoded.email;
  } catch {
    return null;
  }
};

const login = (newToken: string) => {
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
        getUserEmail,
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
